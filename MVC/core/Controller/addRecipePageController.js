const fs = require('fs');
const user = require('../Model/user.js');
const recipe = require('../Model/recipe.js');
const Tokenizer = require('../../utility/tokenizer.js');
const formidable = require('formidable');
const mv = require('mv');

const userModel = new user();
const recipeModel = new recipe();

module.exports = class addRecipePageController {
    static async GET(request, response) {
        //Daca cookie-ul este setat, si este corect, atunci permitem userului sa acceseze pagina
        //                         , si este gresit, atunci redirectionam userul userul spre /loginRegister.html
        //Daca cookie-ul nu este setat, atunci redirectionam userul userul spre /loginRegister.html
        let cookie = request.headers.cookie;

        if (cookie != undefined) {
            let username = cookie.substr(0,cookie.search("="));
            let SESSION_ID = cookie.substr(cookie.search("=") + 1, cookie.length);
            let connected = await userModel.validateUserCredentials(username, SESSION_ID);

            if (connected === true) {
                fs.readFile('core/View/addRecipePage.html', (err, buffer) => {
                    const username = cookie.substr(0, cookie.search("="));
                    let data = eval(buffer.toString());

                    response.writeHead(200,{'Content-type': 'text/html'});
                    response.write(data);
                    response.end();
                });
            } 
            else {
                response.writeHead(302, { 'Location': '/loginRegister.html'});
                response.end();
            }
        } 
        else {
            response.writeHead(302, { 'Location': '/loginRegister.html'});
            response.end();
        }
    }

    static async POST(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0, cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1, cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);

        if (connected === true) {
            var form = new formidable.IncomingForm({ multiples: true});

            //Parsam datele si le introducem in tabelele necesare
            form.parse(request, async function (err, fields, files) {
                if (err) {
                    //Presupunem ca daca am intampinat o eroare in acest moment, este vina serverului si trimitem status 500
                    console.log(err); 
                    response.statusCode = 500;
                    response.end('Unknown error');
                    return ;
                } 
                else {
                    //verficam daca am primit comanda de logout
                    if (fields.recipeName === 'Logout') {
                        //setam expirarea cookie-ului la data si ora curenta
                        //redirectionam la loginRegister.html
                        try {
                            var infoUser = await userModel.logout(username);
                            response.setHeader('Set-Cookie', username + '=' + infoUser.sessionid + '; path=/; Expires=' + infoUser.connectionTime.toUTCString() + ';');
                            console.log(username + '=' + infoUser.sessionid + '; path=/; expires=' + infoUser.connectionTime.toUTCString() + ';')
                            response.statusCode = 302;
                            response.end(); 
                        } catch(e) {
                            console.log(e);
                            response.statusCode = 500;
                            response.end();
                        }  
                    }
                    else {
                        //Obtinem toate informatiile din FormData(fields)
                        var recipeName = fields.recipeName;
                        var nrIngrediente = fields.nrIngrediente;
                        var ingredienteCSV = fields.ingrediente;
                        var ingrediente = ingredienteCSV.split(",");
                        var preparationTime = fields.preparationTime;
                        var finalizationTime = fields.finalizationTime;
                        var nrInstructiuni = fields.nrInstructiuni;
                        var instructiuniCSV = fields.instructiuni;
                        var instructiuni = instructiuniCSV.split(",");
                        var dificultate = fields.dificultate;
                        var categorie = fields.categorie;

                        //verificam informatiile ca sunt valide
                        var existsRecipeName = await recipeModel.getRecipeIdByName(recipeName);
                        if (existsRecipeName != null) {
                            response.statusCode = 700;
                            response.end();
                            return ;
                        }

                        //obtinem toate pozele din FormData(files)
                        var recipePhoto = files.recipePhoto;
                        var pozeInstructiuni = files.pozeInstructiuni;
                    
                        //verificam ca userul a trimis poze si nu alte lucruri
                        if (recipePhoto.type != 'image/jpeg' && recipePhoto.type != 'image/png' && recipePhoto.type != 'image/svg+xml') {
                            response.statusCode = 701;
                            response.end();
                            return ;
                        }

                        if (nrInstructiuni > 1) {
                            for (var i = 0; i < nrInstructiuni; i++) 
                                if (pozeInstructiuni[i].type != 'image/jpeg' && pozeInstructiuni[i].type != 'image/png' && pozeInstructiuni[i].type != 'image/svg+xml') {
                                    response.statusCode = 701;
                                    response.end();
                                    return ;
                                }
                        }
                        else if (pozeInstructiuni.type != 'image/jpeg' && pozeInstructiuni.type != 'image/png' && pozeInstructiuni.type != 'image/svg+xml') {
                            response.statusCode = 701;
                            response.end();
                            return ;
                        }
                    
                        //cream un folder cu numele retetei in data de forma data/recipeName
                        var pathRecipe = "data/recipes/" + recipeName;
                        if (!fs.existsSync(pathRecipe)) {
                            fs.mkdir(pathRecipe, {recursive: true}, err => {});
                        }

                        //salvam poza retetei
                        var typeRecipePhoto;

                        if (recipePhoto.type == 'image/jpeg') 
                            typeRecipePhoto = 'jpg';
                        else if (recipePhoto.type == 'image/png') 
                            typeRecipePhoto = 'png';
                        else if (recipePhoto.type == 'image/svg+xml') 
                            typeRecipePhoto ='svg';

                        var newPath = pathRecipe + "/" + "recipePhoto." + typeRecipePhoto;
                        var oldPath = recipePhoto.path;

                        mv(oldPath, newPath, function(err) {
                            if (err) {
                                console.log(err); 
                                response.statusCode = 406;
                                response.end('Unknown error');
                                return ;
                            }
                        });

                        //salvam pozele instructiunilor
                        var type;
                        var arrayTypes = [];
                        if (nrInstructiuni > 1) {
                            for (var i = 0; i < nrInstructiuni; i++) {
                                var oldPath =  pozeInstructiuni[i].path;

                                if (pozeInstructiuni[i].type == 'image/jpeg') {
                                    type = 'jpg';
                                    arrayTypes[i] = 'jpg';
                                }
                                else if (pozeInstructiuni[i].type == 'image/png') {
                                    type = 'png';
                                    arrayTypes[i] = 'png';
                                }
                                else if (pozeInstructiuni[i].type == 'image/svg+xml') {
                                    type= 'svg';
                                    arrayTypes[i] = 'svg';
                                }

                                var newPath = pathRecipe + '/' + ('poza' + (i + 1)) + "." + type;

                                mv(oldPath, newPath, function(err) {
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

                            if (pozeInstructiuni.type == 'image/jpeg') {
                                type = 'jpg';
                                arrayTypes[0] = 'jpg';
                            }
                            else if (pozeInstructiuni.type == 'image/png') {
                                type = 'png';
                                arrayTypes[0] = 'png';
                            }
                            else if (pozeInstructiuni.type == 'image/svg+xml') {
                                type= 'svg';
                                arrayTypes[0] = 'svg';
                            }

                            arrayTypes[1] = ' ';
                            var newPath = pathRecipe + '/poza1.' + type;

                            mv(oldPath, newPath, function(err) {
                                if (err) {
                                    console.log(err); 
                                    response.statusCode = 406;
                                    response.end('Unknown error');
                                    return ;
                                }
                            });
                        }

                        //obtinem id-ul userului
                        var userID = await userModel.getUserIdByUsername(username);

                        if (userID == null) {
                            console.log(err); 
                            response.statusCode = 500;
                            response.end('Internal server error!');
                            return ;
                        }
                        else {
                            //introducem datele in baza de date
                            //introducerea retetei    
                            var raspuns = await recipeModel.insertRecipeIntoDatabase(userID,recipeName, pathRecipe + "/" + 'recipePhoto.' + typeRecipePhoto, categorie , nrIngrediente, preparationTime, finalizationTime, nrInstructiuni, dificultate);
                       
                            if (raspuns == null) {
                                response.statusCode = 500;
                                response.end('Unknown error');
                                return ;
                            }
                            else { 
                                //introducerea ingredientelor
                                var raspunsId = await recipeModel.getRecipeIdByName(recipeName);
                                if (raspunsId != null) {
                                    var status = recipeModel.insertIngredientsIntoDatabase(raspunsId, nrIngrediente, ingrediente);
                                
                                    if (status != null) { //introducerea instructiunilor
                                        var raspunsInstructiuni = await recipeModel.insertInstructionsIntoDatabase(raspunsId, nrInstructiuni, instructiuni, arrayTypes, pathRecipe);
                                        if (raspunsInstructiuni != null) {
                                            //reteta a fost introdusa cu success in baza de date!
                                            response.statusCode = 200;
                                            response.end();
                                        }
                                        else {
                                            response.statusCode = 500;
                                            response.end('Unknown error');
                                            return ;
                                        }
                                    }
                                    else {
                                        response.statusCode = 500;
                                        response.end('Unknown error');
                                        return ;
                                    }
                                }
                                else {
                                    response.statusCode = 500;
                                    response.end('Unknown error');
                                    return ;
                                }
                            }
                        }
                    }
                }
            });
        } 
        else {
            response.writeHead(403);
            response.end();
        }
    }
}