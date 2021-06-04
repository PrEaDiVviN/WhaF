const fs = require('fs');
const user = require('../Model/user.js');
const recipe = require('../Model/recipe.js');
const Tokenizer = require('../../utility/tokenizer.js');
const formidable = require('formidable');

const userModel = new user();
const recipeModel = new recipe();

module.exports = class settingPageController {
    static async GET(request, response) {
        //Daca cookie-ul este setat, si este corect, atunci permitem userului ca acceseze pagina
        //                         , si este gresit, atunci redirectionam userul userul spre /sign-in-sign-up.html
        //Daca cookie-ul nu este setat, atunci redirectionam userul userul spre /sign-in-sign-up.html
        let cookie = request.headers.cookie;

        if(cookie != undefined) {
            let username = cookie.substr(0,cookie.search("="));
            let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
            let connected = await userModel.validateUserCredentials(username,SESSION_ID);
            if(connected === true) {
                fs.readFile('core/View/settingsPage.html', (err, buffer) => {
                    const username = cookie.substr(0,cookie.search("="));
                    //let data = eval(buffer.toString());
                    response.writeHead(200,{'Content-type': 'text/html'});
                    response.write(buffer);
                    response.end();
                });
            } 
            else {
                response.writeHead(302, { 'Location': '/sign-in-sign-up.html'});
                response.end();
            }
        } 
        else {
            response.writeHead(302, { 'Location': '/sign-in-sign-up.html'});
            response.end();
        }
    }

    
    static async POST(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        if(connected === true) {
            //Parsam datele si le introducem in tabelele necesare
            var form = new formidable.IncomingForm({ multiples: true});
            form.parse(request, async function (err, fields, files) {
                if (err) {//Presupunem ca daca am intampinat o eroare in acest moment, este vina serverului si trimitem status 500
                    console.log(err); 
                    response.statusCode = 500;
                    response.end('Unknown error');
                    return ;
                } 
                else if(fields.type === 'change'){
                    //Obtinem toate informatiile din FormData(fields)
                    var firstName = fields.firstName;
                    var lastName = fields.lastName;
                    console.log('++++++++++++++++++++++++');
                    var newUsername = fields.username;
                    console.log(newUsername)
                    console.log('++++++++++++++++++++++++');
                    var password = fields.password;
                    var email = fields.email;

                    var birthDate = fields.birthDate;
                    //obtinem toate pozele din FormData(files)
                    var userPhoto = files.userPhoto;  
                    //verificam ca userul a trimis poze si nu alte lucruri
                    if(userPhoto != undefined && userPhoto.type != 'image/jpeg' && userPhoto.type != 'image/png' && userPhoto.type != 'image/svg+xml') {
                        response.statusCode = 415;
                        response.end();
                        return ;
                    }

                    //obtinem id-ul userului
                    var userID = await userModel.getUserIdByUsername(username);
                    if(userID == null) {
                        console.log(err); 
                        response.statusCode = 500;
                        response.end('Internal server error!');
                        return ;
                    }
                    else {
                        //introducem datele in baza de date
                        let dbAnswer = await userModel.modifyUserDatas(firstName,lastName,email,username,newUsername, password,birthDate,userPhoto);
                        switch(dbAnswer) {
                            case 'success': {
                                response.statusCode = 200;
                                response.end();
                            }
                            break;
                            default: 
                                console.log(dbAnswer)
                                response.statusCode = 500;
                                response.end('Internal server error!');
                        }
                        
                    }
                }
                     /*
                    //salvam poza utilizatorului
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
                   
 
                */
            });
        } 
        else {
            response.writeHead(403);
            response.end();
        }

    }

}