const fs = require('fs');
const user = require('../Model/user.js');
const recipe = require('../Model/recipe.js');
const Tokenizer = require('../../utility/tokenizer.js');
const formidable = require('formidable');

const userModel = new user();
const recipeModel = new recipe();

module.exports = class addRecipePageController {
    static async GET(request, response) {
        //Daca cookie-ul este setat, si este corect, atunci redirectionam userul spre /feedPage.html
        //                         , si este gresit, atunci redirectionam userul userul spre /sign-in-sign-up.html
        //Daca cookie-ul nu este setat, atunci lasam userul sa aleaga ce vrea sa faca.(POST LOGIN/ POST REGISTER)

        let cookie = request.headers.cookie;

        if(cookie != undefined) {
            let username = cookie.substr(0,cookie.search("="));
            let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
            let connected = await userModel.validateUserCredentials(username,SESSION_ID);
            if(connected === true) {
                fs.readFile('core/View/addRecipePage.html', (err, buffer) => {
                    const username = cookie.substr(0,cookie.search("="));
                    let data = eval(buffer.toString());
                    response.writeHead(200,{'Content-type': 'text/html'});
                    response.write(data);
                    response.end();
                });
            } 
            else {
                response.writeHead(302, { 'Location': '/sign-in-sign-up.html'});
                response.end();
            }
        } 
        else {
            fs.stat("core/View/addrecipePage.html", (err, stats) => {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');
                if(stats) {
                    fs.createReadStream("core/View/addrecipePage.html").pipe(response);
                } else {
                    response.statusCode = 404;
                    response.end('Sorry, page not found!');
                }
            }); 
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
                    console.log("returneaza=========================================================================");
                    console.log(existsRecipeName);
                    console.log("returneaza=========================================================================");
                    if(existsRecipeName != null) {
                        response.statusCode = 700;
                        response.end();
                        return ;
                    }

                    //obtinem toate pozele din FormData(files)
                    var recipePhoto = files.recipePhoto;
                    var pozeInstructiuni = files.pozeInstructiuni;
                    
                    //verificam ca userul a trimis poze si nu alte lucruri
                    //TODO
                    

                    //cream un folder cu numele retetei in data de forma data/recipeName
                    var pathRecipe = "data/recipes/" + recipeName;
                    if (!fs.existsSync(pathRecipe)){
                        fs.mkdirSync(pathRecipe);
                    }
                    //salvam poza retetei
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
                    //salvam pozele instructiunilor
                    var type;
                    var arrayTypes = [];
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
                        var newPath = pathRecipe + '/' + ('poza' + (i+1)) + "." + type;
                        fs.rename(oldPath, newPath, function (err) {
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
                    if(userID == null) {
                        console.log(err); 
                        response.statusCode = 500;
                        response.end('Internal server error!');
                        return ;
                    }
                    else {
                        //introducem datele in baza de date
                        //introducerea retetei    
                        var raspuns = await recipeModel.insertRecipeIntoDatabase(userID,recipeName, pathRecipe + "/" + 'recipePhoto.' + typeRecipePhoto, categorie , nrIngrediente, preparationTime, finalizationTime, nrInstructiuni, dificultate);
                        if(raspuns == null) {
                            response.statusCode = 500;
                            response.end('Unknown error');
                            return ;
                        }
                        else { //introducerea ingredientelor
                            var raspunsId = await recipeModel.getRecipeIdByName(recipeName);
                            if(raspunsId != null) {
                                var status = recipeModel.insertIngredientsIntoDatabase(raspunsId, nrIngrediente, ingrediente);
                                if(status != null) { //introducerea instructiunilor
                                    var raspunsInstructiuni = await recipeModel.insertInstructionsIntoDatabase(raspunsId, nrInstructiuni, instructiuni, arrayTypes, pathRecipe);
                                    if(raspunsInstructiuni != null) {//reteta a fost introdusa cu success in baza de date!
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
            });
        } 
        else {
            response.writeHead(403);
            response.end();
        }

    }

}