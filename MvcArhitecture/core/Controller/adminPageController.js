const fs = require('fs');
const user = require('../Model/user.js');
const recipe = require('../Model/recipe.js');
const settings = require('../Model/settings.js');
const formidable = require('formidable');

const userModel = new user();
const recipeModel = new recipe();
const settingsModel = new settings();

module.exports = class adminPageController {
    static async GET(request, response) {
        //Daca cookie-ul este setat, si este corect, atunci permitem userului ca acceseze pagina
        //                         , si este gresit, atunci redirectionam userul userul spre /sign-in-sign-up.html
        //Daca cookie-ul nu este setat, atunci redirectionam userul userul spre /sign-in-sign-up.html
        let cookie = request.headers.cookie;

        if(cookie != undefined) {
            let username = cookie.substr(0,cookie.search("="));
            let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
            let connected = await userModel.validateUserCredentials(username,SESSION_ID);
            let userType = await userModel.getUserTypeByUsername(username);
            if(connected === true && userType === 'admin') {
                //obtinem primele 25 de pagini din baza de date si le trimitem userului
                let info = await recipeModel.getNamePhotoCategoryFromAllRecipes(0,25);
                let existsNext = await recipeModel.getNamePhotoCategoryFromAllRecipes(25,1);
                let cards = '';
                for(let i = 0; i < info.recipeName.length; i++) {
                    let recipeUrl = '/recipe/' + info.recipeName[i].replaceAll('%20', ' ') + '.html';
                    cards = cards + `<div class="card" id="card` + i + `" > 
                                        <img src="/deleteButton.png" id="delete` + i + `" alt="delete" class="deleteButton" onclick="deleteRecipe(this)">
                                        <img src="/settingsButton.png" alt="settings" class="settingsButton" onclick="changeLocation('` + recipeUrl + `')""></img>`;
                    cards = cards + '<img src="/' + info.recipePhoto[i] + `" alt="recipePhoto" class="imageCard">
                                                                            <div class="container">`;
                    cards = cards + '<h4><b id="recipe' + i + '" >' + info.recipeName[i].replaceAll('%20', ' ') + '</b></h4>';
                    cards = cards + '<p>' + info.categorie[i] + `</p>
                                                            </div>
                                                        </div> `;                                                  
                }

                if(info.recipeName.length < 15) 
                    for(let j = info.recipeName.length; j <= 10; j++) {
                    cards = cards + `<div class="card" style="visibility: hidden;"> 
                    <img src="/deleteButton.png" alt="delete" class="deleteButton" onclick="deleteRecipe(this)">
                    <img src="/settingsButton.png" alt="settings" class="settingsButton" onclick="alert('EDITING ITEM')"></img>`;
                    cards = cards + '<img src="/' + info.recipePhoto[0] + `" alt="recipePhoto" class="imageCard">
                                                                        <div class="container">`;
                    cards = cards + '<h4><b>' + info.recipeName[0].replace('%20', ' ') + '</b></h4>';
                    cards = cards + '<p>' + info.categorie[0] + `</p>
                                                        </div>
                                                    </div> `;   
                    }
                if(existsNext !== null)
                    cards = cards +
                    `<div class="pagination">
                        <div class = "split-previous" style="visibility: hidden;"> 
                            <div class = "previous">
                                <button class = "default-buttons" onclick="updateMinusPageRecipe()"> &laquo; Previous </button>
                            </div> 
                        </div>

                        <div class = "split-next"> 
                            <div class = "next">
                                <button class = "default-buttons" onclick="updatePlusPageRecipe()"> Next  &raquo; </button>
                            </div>
                        </div>
                    </div>`;
                //------------------------------------------------------------------------------- AICI AI RAMAS
                 let infouser = await userModel.getNamePhotoTypeFromAllUsers(0,25);
                 let existsNextUser = await userModel.getNamePhotoTypeFromAllUsers(25,1);
                //------------------------------------------------------------------------------- AICI AI RAMAS
                let usersCards = '';
                for(let i = 0; i < infouser.usernames.length; i++) {
                    usersCards = usersCards +    
                    `<div class="card" id="carduser` + i + `">
                            <img "deleteusr` + i + `" src="/deleteButtonUser.png" alt="delete" class="deleteButton" onclick="deleteUser(this)">
                            <img src="/settingsButtonUser.png" alt="settings" class="settingsButton" onclick="changeLocation('/` + infouser.usernames[i].replaceAll('%20', ' ')  + `.tfl')">
                            <img src="`+ (infouser.userPhotos[i] == null ? '/user.png' : infouser.userPhotos[i]) + `" alt="Avatar">
                            <div class="container">
                                <h4><b  id="user` + i + `" >` + infouser.usernames[i] + `</b></h4>
                                <p>` + infouser.userTypes[i] +  `</p>
                            </div>
                    </div> `;   
                }    

                if(existsNextUser !== null)
                usersCards = usersCards +
                `<div class="pagination">
                    <div class = "split-previous" style="visibility: hidden;"> 
                        <div class = "previous">
                            <button class = "default-buttons" onclick="updateMinusPageUser()"> &laquo; Previous </button>
                        </div> 
                    </div>

                    <div class = "split-next"> 
                        <div class = "next">
                            <button class = "default-buttons" onclick="updatePlusPageUser()"> Next  &raquo; </button>
                        </div>
                    </div>
                </div>`;

                let ingrediente = '';
                let instructiuni = '';

                ingrediente = await settingsModel.getNrIngrediente();
                instructiuni = await settingsModel.getNrInstructiuni();

                fs.readFile('core/View/adminPage.html', (err, buffer) => {
                    const username = cookie.substr(0,cookie.search("="));
                    let data = eval(buffer.toString());
                    response.writeHead(200,{'Content-type': 'text/html'});
                    response.write(data);
                    response.end();
                });
            } 
            else {
                response.writeHead(403, { 'Content-Type' : 'text/plain'});
                response.write('Forbidden! You are not allowed to access this page!');
                response.end();
            }
        } 
        else {
            response.writeHead(404, { 'Content-Type' : 'text/plain'});
            response.write('Page not found!');
            response.end();
        }
    }

    static async GET_USER_SETTINGS(request, response) {
            //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        if(cookie != undefined) {
            let username = cookie.substr(0,cookie.search("="));
            let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
            let connected = await userModel.validateUserCredentials(username,SESSION_ID);
            let userType = await userModel.getUserTypeByUsername(username);
            if(connected === true && userType === 'admin') {
                //obtinem numele userului
                fs.readFile('core/View/userPage.html', async (err, buffer) => {
                    let username = request.url.substr(1, request.url.length-5).replaceAll('%20', ' ');
                    let password = await userModel.getPassword(username);
                    let userPhoto = await userModel.getUserPhoto(username);
                    if(userPhoto != null)
                      userPhoto = userPhoto.substr(4,userPhoto.length);
                    console.log('*********************************************');
                    console.log(userPhoto);
                    console.log('*********************************************');
                    if(userPhoto == null)
                        userPhoto = '/user.png';
                    let status = await userModel.getUserStatus(username);
                    if(password != null && status != null) {
                        let data = eval(buffer.toString());
                        response.writeHead(200,{'Content-type': 'text/html'});
                        response.write(data);
                        response.end();
                    }
                    else {
                        response.statusCode = 400;
                        response.end();
                        return ;
                    }
                });
            } 
            if(connected === true && userType !== 'admin') {
                response.statusCode = 403;
                response.end();
                return ;
            }
            if(connected === false) {
                response.statusCode = 404;
                response.end();
                return ;
            }
        }
        else {
            response.statusCode = 404;
            response.end();
            return ;
        }
    }

    static async GET_RECIPES(request, response) {
        var body = '';
        request.on('data', chunk => {
            body += chunk;
        }); 
        request.on('end', async () => { 
            var skip = parseInt(JSON.parse(body).skip);
            var count = parseInt(JSON.parse(body).count);
            var direction = JSON.parse(body).direction;
        
            var answer = await recipeModel.getNamePhotoCategoryFromAllRecipes(skip,count);
            var verify;
            if(direction == 'up')
                verify = await recipeModel.getNamePhotoCategoryFromAllRecipes(skip+25,count);
            else if(skip == 0)
                verify = null;
            if(answer === null) {
                response.statusCode = 404;
                response.end('Internal Server Error! Please try again and if problem persists, contact the administrator!');
                return ;
            }

            let responseString = '';
            for(let i = 0; i < answer.recipeName.length; i++) {
                let recipeUrl = '/recipe/' + answer.recipeName[i].replaceAll('%20', ' ') + '.html';
                responseString = responseString + `<div class="card"  id="card` + i + `">
                                    <img src="/deleteButton.png" id="delete` + i + `" alt="delete" class="deleteButton" onclick="deleteRecipe(this)">
                                    <img src="/settingsButton.png" alt="settings" class="settingsButton" onclick="changeLocation('` + recipeUrl + `')"></img>`;
                responseString = responseString + '<img src="/' + answer.recipePhoto[i] + `" alt="recipePhoto" class="imageCard">
                                                                        <div class="container">`;
                responseString = responseString + '<h4><b id="recipe' + i +  '" >' + answer.recipeName[i].replaceAll('%20', ' ') + '</b></h4>';
                responseString = responseString + '<p>' + answer.categorie[i] + `</p>
                                                        </div>
                                                    </div> `;     
            }
            if(answer.recipeName.length < 15) 
               for(let j = answer.recipeName.length; j <= 15; j++) {
                responseString = responseString + `<div class="card" style="visibility: hidden;"> 
                <img src="/deleteButton.png" alt="delete" class="deleteButton" onclick="deleteRecipe(this)">
                <img src="/settingsButton.png" alt="settings" class="settingsButton" onclick="alert('_____')"></img>`;
                responseString = responseString + '<img src="/' + answer.recipePhoto[0] + `" alt="recipePhoto" class="imageCard">
                                                                    <div class="container">`;
                responseString = responseString + '<h4><b>' + answer.recipeName[0].replace('%20', ' ') + '</b></h4>';
                responseString = responseString + '<p>' + answer.categorie[0] + `</p>
                                                    </div>
                                                </div> `;   
               }
            if(verify != null && skip != 0)
            responseString += `
                <div class="pagination">
                    <div class = "split-previous"> 
                        <div class = "previous">
                            <button class = "default-buttons" onclick="updateMinusPageRecipe()"> &laquo; Previous </button>
                        </div> 
                    </div>  
                    <div class = "split-next"> 
                            <div class = "next">
                                <button class = "default-buttons" onclick="updatePlusPageRecipe()"> Next  &raquo; </button>
                            </div>
                    </div>
                </div>`; 
            else if(direction == 'up')
                responseString += `
                <div class="pagination">
                    <div class = "split-previous"> 
                        <div class = "previous">
                            <button class = "default-buttons" onclick="updateMinusPageRecipe()"> &laquo; Previous </button>
                        </div> 
                    </div>  
                    <div class = "split-next" style="visibility: hidden;"> 
                            <div class = "next">
                                <button class = "default-buttons" onclick="updatePlusPageRecipe()"> Next  &raquo; </button>
                            </div>
                    </div>
                </div>`;   
     
            else  
                responseString += `  
                <div class="pagination">
                    <div class = "split-previous"> 
                        <div class = "previous" style="visibility: hidden;">
                            <button class = "default-buttons" onclick="updateMinusPageRecipe()"> &laquo; Previous </button>
                        </div> 
                    </div>  
                    <div class = "split-next"> 
                            <div class = "next">
                                <button class = "default-buttons" onclick="updatePlusPageRecipe()"> Next  &raquo; </button>
                            </div>
                    </div>
                </div>`;        
            response.statusCode = 200;
            response.setHeader('Content-Type','text/html');
            response.write(responseString);
            response.end();
        });
    }


    static async GET_USERS(request, response) {
        var body = '';
        request.on('data', chunk => {
            body += chunk;
        }); 
        request.on('end', async () => { 
            var skip = parseInt(JSON.parse(body).skip);
            var count = parseInt(JSON.parse(body).count);
            var direction = JSON.parse(body).direction;
        
            var answer = await userModel.getNamePhotoTypeFromAllUsers(skip,count);
            var verify;
            if(direction == 'up')
                verify = await userModel.getNamePhotoTypeFromAllUsers(skip+25,count);
            else if(skip == 0)
                verify = null;
            if(answer === null) {
                response.statusCode = 404;
                response.end('Internal Server Error! Please try again and if problem persists, contact the administrator!');
                return ;
            }

            let responseString = '';
            for(let i = 0; i < answer.usernames.length; i++) {
                responseString = responseString +    
                `<div class="card"  id="carduser` + i + `">
                        <img id="deleteusr` + i + `" src="/deleteButtonUser.png" alt="delete" class="deleteButton" onclick="deleteUser(this)">
                        <img src="/settingsButtonUser.png" alt="settings" class="settingsButton" onclick="changeLocation('/` + answer.usernames[i].replaceAll('%20', ' ')  + `.tfl')">
                        <img src="`+ (answer.userPhotos[i] == null ? '/user.png' : answer.userPhotos[i]) + `" alt="Avatar">
                        <div class="container">
                            <h4><b  id="user` + i + `">` + answer.usernames[i] + `</b></h4>
                            <p>` + answer.userTypes[i] +  `</p>
                        </div>
                </div> `;        
            }
            if(answer.usernames.length < 15) 
               for(let j = answer.usernames.length; j <= 15; j++) {
                responseString = responseString +    
                `<div class="card" style="visibility: hidden;">
                        <img src="/deleteButtonUser.png" alt="delete" class="deleteButton" onclick="alert('DELETING ITEM')">
                        <img src="/settingsButtonUser.png" alt="settings" class="settingsButton" onclick="alert('EDITING ITEM')">
                        <img src="`+ (answer.userPhotos[0] == null ? '/user.png' : answer.userPhotos[0]) + `" alt="Avatar">
                        <div class="container">
                            <h4><b id="user` + j + `" >` + answer.usernames[0] + `</b></h4>
                            <p>` + answer.userTypes[0] +  `</p>
                        </div>
                </div> `;     
               }
            if(verify != null && skip != 0)
            responseString += `
                <div class="pagination">
                    <div class = "split-previous"> 
                        <div class = "previous">
                            <button class = "default-buttons" onclick="updateMinusPageUser()"> &laquo; Previous </button>
                        </div> 
                    </div>  
                    <div class = "split-next"> 
                            <div class = "next">
                                <button class = "default-buttons" onclick="updatePlusPageUser()"> Next  &raquo; </button>
                            </div>
                    </div>
                </div>`; 
            else if(direction == 'up')
                responseString += `
                <div class="pagination">
                    <div class = "split-previous"> 
                        <div class = "previous">
                            <button class = "default-buttons" onclick="updateMinusPageUser()"> &laquo; Previous </button>
                        </div> 
                    </div>  
                    <div class = "split-next" style="visibility: hidden;"> 
                            <div class = "next">
                                <button class = "default-buttons" onclick="updatePlusPageUser()"> Next  &raquo; </button>
                            </div>
                    </div>
                </div>`;   
     
            else  
                responseString += `  
                <div class="pagination">
                    <div class = "split-previous"> 
                        <div class = "previous" style="visibility: hidden;">
                            <button class = "default-buttons" onclick="updateMinusPageUser()"> &laquo; Previous </button>
                        </div> 
                    </div>  
                    <div class = "split-next"> 
                            <div class = "next">
                                <button class = "default-buttons" onclick="updatePlusPageUser()"> Next  &raquo; </button>
                            </div>
                    </div>
                </div>`;        
            response.statusCode = 200;
            response.setHeader('Content-Type','text/html');
            response.write(responseString);
            response.end();
        });
    }


    
    static async DELETE_RECIPE(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        let userType = await userModel.getUserTypeByUsername(username);
        if(connected === true && userType === 'admin') {
            //obtinem numele retetei de la user

            var body = '';
            await request.on('data', chunk => {
                body += chunk;
            }); 
            await request.on('end', async () => { 
                var recipeName = JSON.parse(body).recipeName;
                //stergem reteta din baza de date si folderul corespunzator ei
                var recipeId = await recipeModel.getRecipeIdByName(recipeName);
                var answer = await recipeModel.deleteRecipe(recipeName, recipeId);
                if(answer == true) {
                    response.statusCode = 202;
                    response.end();
                    return ;
                }
                response.statusCode = 500;
                response.end();
                return ;
            });
        }
        if(connected === true && userType !== 'admin') {
            response.statusCode = 403;
            response.end();
            return ;
        }
        if(connected === false) {
            response.statusCode = 404;
            response.end();
            return ;
        }
    }

    static async DELETE_USER(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        let userType = await userModel.getUserTypeByUsername(username);
        if(connected === true && userType === 'admin') {
            //obtinem numele userului

            var body = '';
            await request.on('data', chunk => {
                body += chunk;
            }); 
            await request.on('end', async () => { 
                var username = JSON.parse(body).username;
                //stergem reteta din baza de date si folderul corespunzator ei
                console.log('#########################################################');
                console.log(username);
                console.log('#########################################################');
                var userId = await userModel.getUserIdByUsername(username);
                if(userId != null) {
                    var answer = await userModel.deleteUser(username, userId);
                    if(answer == true) {
                        response.statusCode = 202;
                        response.end();
                        return ;
                    }
                }
                response.statusCode = 500;
                response.end();
                return ;
            });
        }
        if(connected === true && userType !== 'admin') {
            response.statusCode = 403;
            response.end();
            return ;
        }
        if(connected === false) {
            response.statusCode = 404;
            response.end();
            return ;
        }
    }

    static async DELETE_SESSION_USER(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        let userType = await userModel.getUserTypeByUsername(username);
        if(connected === true && userType === 'admin') {
            //obtinem numele userului

            var body = '';
            await request.on('data', chunk => {
                body += chunk;
            }); 
            await request.on('end', async () => { 
                var answer = await settingsModel.deleteSessions();
                if(answer != null) {
                    response.statusCode = 202;
                    response.end();
                    return ;
                }
                response.statusCode = 500;
                response.end();
                return ;
            });
        }
        if(connected === true && userType !== 'admin') {
            response.statusCode = 403;
            response.end();
            return ;
        }
        if(connected === false) {
            response.statusCode = 404;
            response.end();
            return ;
        }
    }

    static async DELETE_INGREDIENT(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        let userType = await userModel.getUserTypeByUsername(username);
        if(connected === true && userType === 'admin') {
            //obtinem numele retetei de la user
            var body = '';
            await request.on('data', chunk => {
                body += chunk;
            }); 
            await request.on('end', async () => { 
                var recipeName = JSON.parse(body).recipeName;
                var ingredientText = JSON.parse(body).instructionText;
                var recipeId = await recipeModel.getRecipeIdByName(recipeName);
                var answer = await recipeModel.deleteIngredient(recipeId, ingredientText);
                var nr = await recipeModel.getNumberIngredients(recipeName);
                var answer2 = await recipeModel.updateNumberIngredients(recipeName,nr - 1);
                if(answer === true && answer2 === true) {
                    response.statusCode = 202;
                    response.end('ingredient:' + (nr - 1));
                    return ;
                }
                response.statusCode = 500;
                response.end();
                return ;
            });
        }
        if(connected === true && userType !== 'admin') {
            response.statusCode = 403;
            response.end();
            return ;
        }
        if(connected === false) {
            response.statusCode = 404;
            response.end();
            return ;
        }
    }

    static async PATCH_RECIPE_NAME(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        let userType = await userModel.getUserTypeByUsername(username);
        if(connected === true && userType === 'admin') {
            //obtinem numele retetei de la user

            var body = '';
            await request.on('data', chunk => {
                body += chunk;
            }); 
            await request.on('end', async () => { 
                var recipeName = JSON.parse(body).recipeName;
                var newRecipeName = JSON.parse(body).newRecipeName;
                //modificam numele retetei
                let answer = await recipeModel.modifyRecipeNameByName(recipeName, newRecipeName); 
                let answer1 = await recipeModel.modifyRecipePhotoByName(newRecipeName,'data/recipes/' + newRecipeName + "/recipePhoto.jpg");
                if(answer1 === true && answer === true) {
                        response.statusCode = 202;
                        response.end('recipeName:' + newRecipeName);
                        return ;
                }
                response.statusCode = 406;
                response.end();
                return ;
            });
        }
        if(connected === true && userType !== 'admin') {
            response.statusCode = 403;
            response.end();
            return ;
        }
        if(connected === false) {
            response.statusCode = 404;
            response.end();
            return ;
        }
    }

    static async PATCH_USERNAME(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        let userType = await userModel.getUserTypeByUsername(username);
        if(connected === true && userType === 'admin') {
            //obtinem numele retetei de la user

            var body = '';
            await request.on('data', chunk => {
                body += chunk;
            }); 
            await request.on('end', async () => { 
                var username = JSON.parse(body).username;
                var newUsername = JSON.parse(body).newUsername;
                //modificam numele retetei
                let answer = await userModel.modifyUsernameByName(username, newUsername); 
                let answerPhoto = await userModel.getUserPhoto(newUsername);
                let answer1 = true;
                if(answerPhoto != null && answerPhoto != undefined)
                    answer1 = await userModel.modifyUserPhotoByName(newUsername,'data/users/' + newUsername.replaceAll('%20', ' ') + "/user.jpg");
                if(answer1 === true && answer === true) {
                        response.statusCode = 202;
                        response.end('username:' + newUsername);
                        return ;
                }
                response.statusCode = 406;
                response.end();
                return ;
            });
        }
        if(connected === true && userType !== 'admin') {
            response.statusCode = 403;
            response.end();
            return ;
        }
        if(connected === false) {
            response.statusCode = 404;
            response.end();
            return ;
        }
    }

    static async PATCH_PASSWORD(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        if(cookie != undefined) {
            let username = cookie.substr(0,cookie.search("="));
            let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
            let connected = await userModel.validateUserCredentials(username,SESSION_ID);
            let userType = await userModel.getUserTypeByUsername(username);
            if(connected === true && userType === 'admin') {
                //obtinem numele retetei de la user

                var body = '';
                await request.on('data', chunk => {
                    body += chunk;
                }); 
                await request.on('end', async () => { 
                    var username = JSON.parse(body).username;
                    var password = JSON.parse(body).password;
                    //modificam numele retetei
                    let answer = await userModel.modifyPassword(password,username);
                    if(answer === true) {
                            response.statusCode = 202;
                            response.end('password:' + password);
                            return ;
                    }
                    response.statusCode = 406;
                    response.end();
                    return ;
                });
            }
            if(connected === true && userType !== 'admin') {
                response.statusCode = 403;
                response.end();
                return ;
            }
            if(connected === false) {
                response.statusCode = 404;
                response.end();
                return ;
            }
        }
        else {
            response.statusCode = 404;
            response.end();
            return ;
        }
    }

    static async PATCH_USER_TYPE(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        if(cookie != undefined) {
            let username = cookie.substr(0,cookie.search("="));
            let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
            let connected = await userModel.validateUserCredentials(username,SESSION_ID);
            let userType = await userModel.getUserTypeByUsername(username);
            if(connected === true && userType === 'admin') {
                //obtinem numele retetei de la user

                var body = '';
                await request.on('data', chunk => {
                    body += chunk;
                }); 
                await request.on('end', async () => { 
                    var username = JSON.parse(body).username;
                    var type = JSON.parse(body).type;
                    //modificam numele retetei
                    let answer = await userModel.modifyUserType(username, type);
                    if(answer === true) {
                            response.statusCode = 202;
                            response.end('type:' + type);
                            return ;
                    }
                    response.statusCode = 406;
                    response.end();
                    return ;
                });
            }
            if(connected === true && userType !== 'admin') {
                response.statusCode = 403;
                response.end();
                return ;
            }
            if(connected === false) {
                response.statusCode = 404;
                response.end();
                return ;
            }
        }
        else {
            response.statusCode = 404;
            response.end();
            return ;
        }
    }



    static async PATCH_RECIPE_PHOTO(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        let userType = await userModel.getUserTypeByUsername(username);
        if(connected === true && userType === 'admin') {
            //obtinem numele retetei de la user
            var form = new formidable.IncomingForm({ multiples: true});
            form.parse(request, async function (err, fields, files) {
                if (err) {//Presupunem ca daca am intampinat o eroare in acest moment, este vina serverului si trimitem status 500
                    console.log(err); 
                    response.statusCode = 500;
                    response.end('Internal server error!');
                    return ;
                } 
                else {
                    //Obtinem toate informatiile din FormData(fields)
                    var recipeName = fields.recipeName;
                  
                    //obtinem toate pozele din FormData(files)
                    var recipePhoto = files.recipePhoto;
                    
                    //verificam ca userul a trimis poze si nu alte lucruri
                    if(recipePhoto.type != 'image/jpeg' && recipePhoto.type != 'image/png' && recipePhoto.type != 'image/svg+xml') {
                        response.statusCode = 406;
                        response.end();
                        return ;
                    }
 
                    //salvam poza retetei
                    var pathRecipe = "data/recipes/" + recipeName;
                    var typeRecipePhoto;
                    if(recipePhoto.type == 'image/jpeg') 
                        typeRecipePhoto = 'jpg'
                    else if(recipePhoto.type == 'image/png') 
                        typeRecipePhoto = 'png';
                    else if(recipePhoto.type == 'image/svg+xml') 
                        typeRecipePhoto ='svg';
                    var newPath = pathRecipe + "/" + "recipePhoto." + typeRecipePhoto;
                    var oldPath = recipePhoto.path;
                    fs.rename(oldPath, newPath, function (err) {
                        if (err) {
                            console.log(err); 
                            response.statusCode = 406;
                            response.end('Unknown error');
                            return ;
                        }
                    });
                    //modificam in baza de date calea catre reteta
                    let answer = await recipeModel.modifyRecipePhotoByName(recipeName,newPath);
                    if(answer === true) {
                        response.statusCode = 202;
                        response.end('recipePhoto:/' + newPath.substr(5));
                        return ;
                    }
                    response.statusCode = 500;
                    response.end();
                    return ;
                }
            });
        }
        if(connected === true && userType !== 'admin') {
            response.statusCode = 403;
            response.end();
            return ;
        }
        if(connected === false) {
            response.statusCode = 404;
            response.end();
            return ;
        }
    }

    static async PATCH_USER_PHOTO(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        if(cookie != undefined) {
            let username = cookie.substr(0,cookie.search("="));
            let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
            let connected = await userModel.validateUserCredentials(username,SESSION_ID);
            let userType = await userModel.getUserTypeByUsername(username);
            if(connected === true && userType === 'admin') {
                //obtinem numele retetei de la user
                var form = new formidable.IncomingForm({ multiples: true});
                form.parse(request, async function (err, fields, files) {
                    if (err) {//Presupunem ca daca am intampinat o eroare in acest moment, este vina serverului si trimitem status 500
                        console.log(err); 
                        response.statusCode = 500;
                        response.end('Internal server error!');
                        return ;
                    } 
                    else {
                        var username = fields.username;
                    
                        //obtinem toate pozele din FormData(files)
                        var userPhoto = files.userPhoto;
                        
                        //verificam ca userul a trimis poze si nu alte lucruri
                        if(userPhoto.type != 'image/jpeg' && userPhoto.type != 'image/png' && userPhoto.type != 'image/svg+xml') {
                            response.statusCode = 406;
                            response.end();
                            return ;
                        }
    
                        //salvam poza retetei
                        var pathUser = "data/users/" + username;
                        var typeUserPhoto;
                        console.log('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
                        console.log(userPhoto.type);
                        console.log('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
                        if(userPhoto.type == 'image/jpeg') 
                            typeUserPhoto = 'jpg'
                        else if(userPhoto.type == 'image/png') 
                            typeUserPhoto = 'png';
                        else if(userPhoto.type == 'image/svg+xml') 
                            typeUserPhoto = 'svg';
                        var newPath = pathUser + "/" + "user." + typeUserPhoto;
                        var oldPath = userPhoto.path;
                        try {
                            fs.renameSync(oldPath, newPath);
                        }
                        catch(e) {
                            console.log(e);
                            response.statusCode = 500;
                            response.end();
                            return ;
                        }
                        //modificam in baza de date calea catre reteta
                        let answer = await userModel.modifyUserPhoto1(newPath,username);
                        if(answer === true) {
                            response.statusCode = 202;
                            response.end('userPhoto:/' + newPath.substr(5));
                            return ;
                        }
                        response.statusCode = 500;
                        response.end();
                        return ;
                    }
                });
            }
            if(connected === true && userType !== 'admin') {
                response.statusCode = 403;
                response.end();
                return ;
            }
            if(connected === false) {
                response.statusCode = 404;
                response.end();
                return ;
            }
        }
        else {
            response.statusCode = 404;
            response.end();
            return ;
        }
    }


    static async PATCH_RECIPE_TIME(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        let userType = await userModel.getUserTypeByUsername(username);
        if(connected === true && userType === 'admin') {
            //obtinem numele retetei de la user

            var body = '';
            await request.on('data', chunk => {
                body += chunk;
            }); 
            await request.on('end', async () => { 
                var recipeName = JSON.parse(body).recipeName;
                var newNumber = JSON.parse(body).newNumber;
                var type = JSON.parse(body).type;
                //modificam numele retetei
                let answer = await recipeModel.modifyRecipePrepTimeByName(recipeName, newNumber, type); 
                if(answer === true) {
                        response.statusCode = 202;
                        if(type === 'prep')
                            response.end('prepTime:' + newNumber);
                        else 
                            response.end('finTime:' + newNumber);
                        return ;
                }
                response.statusCode = 406;
                response.end();
                return ;
            });
        }
        if(connected === true && userType !== 'admin') {
            response.statusCode = 403;
            response.end();
            return ;
        }
        if(connected === false) {
            response.statusCode = 404;
            response.write('Page not found!');
            response.end();
            return ;
        }
    }

    static async PATCH_NR_INGREDIENTE(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        let userType = await userModel.getUserTypeByUsername(username);
        if(connected === true && userType === 'admin') {
            //obtinem numele retetei de la user

            var body = '';
            await request.on('data', chunk => {
                body += chunk;
            }); 
            await request.on('end', async () => { 
                var nringrediente = JSON.parse(body).nringrediente;
                //modificam numele retetei
                let answer = await settingsModel.modifyNumarIngrediente(nringrediente); 
                if(answer === true) {
                        response.statusCode = 202;
                        response.end('nringrediente:' + nringrediente)
                        return ;
                }
                response.statusCode = 406;
                response.end();
                return ;
            });
        }
        if(connected === true && userType !== 'admin') {
            response.statusCode = 403;
            response.end();
            return ;
        }
        if(connected === false) {
            response.statusCode = 404;
            response.write('Page not found!');
            response.end();
            return ;
        }
    }

    static async PATCH_NR_INSTRUCTIUNI(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        let userType = await userModel.getUserTypeByUsername(username);
        if(connected === true && userType === 'admin') {
            //obtinem numele retetei de la user

            var body = '';
            await request.on('data', chunk => {
                body += chunk;
            }); 
            await request.on('end', async () => { 
                var nrinstructiuni = JSON.parse(body).nrinstructiuni;
                //modificam numele retetei
                let answer = await settingsModel.modifyNumarInstructiuni(nrinstructiuni); 
                if(answer === true) {
                        response.statusCode = 202;
                        response.end('nrinstructiuni:' + nrinstructiuni);
                        return ;
                }
                response.statusCode = 406;
                response.end();
                return ;
            });
        }
        if(connected === true && userType !== 'admin') {
            response.statusCode = 403;
            response.end();
            return ;
        }
        if(connected === false) {
            response.statusCode = 404;
            response.write('Page not found!');
            response.end();
            return ;
        }
    }

    static async PATCH_RECIPE_TYPE(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        let userType = await userModel.getUserTypeByUsername(username);
        if(connected === true && userType === 'admin') {
            //obtinem numele retetei de la user

            var body = '';
            await request.on('data', chunk => {
                body += chunk;
            }); 
            await request.on('end', async () => { 
                var recipeName = JSON.parse(body).recipeName;
                var value = JSON.parse(body).value;
                var type = JSON.parse(body).type;
                //modificam numele retetei
                let answer = await recipeModel.modifyRecipeTypeByName(recipeName, value, type); 
                if(answer === true) {
                        response.statusCode = 202;
                        if(type === 'cat')
                            response.end('cat:' + value);
                        else 
                            response.end('dif:' + value);
                        return ;
                }
                response.statusCode = 406;
                response.end();
                return ;
            });
        }
        if(connected === true && userType !== 'admin') {
            response.statusCode = 403;
            response.end();
            return ;
        }
        if(connected === false) {
            response.statusCode = 404;
            response.write('Page not found!');
            response.end();
            return ;
        }
    }

    static async PATCH_RECIPE_INGREDIENTS(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        let userType = await userModel.getUserTypeByUsername(username);
        if(connected === true && userType === 'admin') {
            //obtinem numele retetei de la user

            var body = '';
            await request.on('data', chunk => {
                body += chunk;
            }); 
            await request.on('end', async () => { 
                var recipeName = JSON.parse(body).recipeName;
                var ingredients = JSON.parse(body).ingredients;
            
                //modificam numele retetei
                let recipeId = await recipeModel.getRecipeIdByName(recipeName);
                if(recipeId === null) {
                    response.statusCode = 500;
                    response.end();
                    return ;
                }
                let answer = await recipeModel.insertIngredientsIntoDatabase(recipeId, ingredients.length, ingredients); 
                let nrIngredients = await recipeModel.getNumberIngredients(recipeName);
                let answer2 = await recipeModel.updateNumberIngredients(recipeName, nrIngredients + ingredients.length);
                if(answer === true && answer2 === true) {
                    response.statusCode = 202;
                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                    console.log(nrIngredients + ingredients.length);
                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                    response.write('ing:' + (nrIngredients + ingredients.length))
                    response.end();
                    return ;
                }
                response.statusCode = 406;
                response.end();
                return ;
            });
        }
        if(connected === true && userType !== 'admin') {
            response.statusCode = 403;
            response.end();
            return ;
        }
        if(connected === false) {
            response.statusCode = 404;
            response.write('Page not found!');
            response.end();
            return ;
        }
    }

    static async PATCH_RECIPE_INSTRUCTIONS(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        let userType = await userModel.getUserTypeByUsername(username);
        if(connected === true && userType === 'admin') {
            //obtinem numele retetei de la user
            var form = new formidable.IncomingForm({ multiples: true});
            await form.parse(request, async function (err, fields, files) {
                if (err) {//Presupunem ca daca am intampinat o eroare in acest moment, este vina serverului si trimitem status 500
                    console.log(err); 
                    response.statusCode = 700;
                    response.end('Internal server error!');
                    return ;
                } 
                else {  
                    //Obtinem toate informatiile din FormData(fields)
                    var recipeName = fields.recipeName;
                    var nrInstructiuni = parseInt(fields.nrInstructiuni);
                    var pozeInstructiuni = files.pozeInstructiuni;
                    var instructiuniCSV = fields.instructiuni;
                    var instructiuni = instructiuniCSV.split(',');

                    //obtinem nr de instructiuni actual din baza de date
                    var nrActual = await recipeModel.getNumberInstructions(recipeName);
                    var nrTotal = nrActual + nrInstructiuni;
                    console.log('******************************************************');
                    console.log(nrActual);
                    console.log(nrTotal);
                    console.log(nrActual);
                    console.log('******************************************************');
                    //inseram in baza de date numarul de instructiuni
                    recipeModel.updateNumberInstructions(recipeName, nrTotal);

                    //salvam pozele instructiunilor
                    var type;
                    var arrayTypes = [];
                    var pathRecipe = "data/recipes/" + recipeName;
                    if(nrInstructiuni > 1) {
                        for (var i = 0; i < nrInstructiuni; i++) {
                            var oldPath =  pozeInstructiuni[i].path;
                            if(pozeInstructiuni[i].type == 'image/jpeg') {
                                type = 'jpg'
                                arrayTypes[i] = 'jpg';
                            }
                            else if(pozeInstructiuni[i].type == 'image/png') {
                                type = 'png';
                                arrayTypes[i] = 'png';
                            }
                            else if(pozeInstructiuni[i].type == 'image/svg+xml') {
                                type= 'svg';
                                arrayTypes[i] = 'svg';
                            }
                            var newPath = pathRecipe + '/' + ('poza' + (nrActual + i + 1)) + "." + type;
                            fs.rename(oldPath, newPath, function (err) {
                                if (err) {
                                    console.log(err); 
                                    response.statusCode = 406;
                                    response.end('Unknown error');
                                    return ;
                                }
                            });
                        }
                    }
                    else {
                        var oldPath =  pozeInstructiuni.path;
                        if(pozeInstructiuni.type == 'image/jpeg') {
                            type = 'jpg'
                            arrayTypes[0] = 'jpg';
                        }
                        else if(pozeInstructiuni.type == 'image/png') {
                            type = 'png';
                            arrayTypes[0] = 'png';
                        }
                        else if(pozeInstructiuni.type == 'image/svg+xml') {
                            type= 'svg';
                            arrayTypes[0] = 'svg';
                        }
                        arrayTypes[1] = ' ';
                        var newPath = pathRecipe + '/' + ('poza' + (nrActual + 1)) + '.' + type;
                        fs.rename(oldPath, newPath, function (err) {
                            if (err) {
                                console.log(err); 
                                response.statusCode = 406;
                                response.end('Unknown error');
                                return ;
                            }
                        });
                    }

                    //inseram in baza de date instructiunile
                    var pathRecipe = "data/recipes/" + recipeName;
                    let recipeId = await recipeModel.getRecipeIdByName(recipeName);
                    let answer = await recipeModel.insertInstructionsIntoDatabaseWithShift(recipeId,nrInstructiuni,instructiuni,arrayTypes,pathRecipe,nrActual);
                    if(answer !== null) {
                        response.statusCode = 202;
                        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                        console.log('nrInstrActual:' + nrActual);
                        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                        response.end('nrInstrActual:' + nrActual);
                        return ;
                    }
                    response.statusCode = 406;
                    response.end();
                    return ;
                }
            });
        }
        if(connected === true && userType !== 'admin') {
            response.statusCode = 403;
            response.end();
            return ;
        }
        if(connected === false) {
            response.statusCode = 404;
            response.end();
            return ;
        }
    }

}
