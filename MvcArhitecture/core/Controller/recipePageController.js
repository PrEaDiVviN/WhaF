const fs = require('fs');
const user = require('../Model/user.js');
const recipe = require('../Model/recipe.js');
const Tokenizer = require('../../utility/tokenizer.js');
const formidable = require('formidable');

const userModel = new user();
const recipeModel = new recipe();

module.exports = class recipePageController {
    static async GET(request, response) {
        //Daca cookie-ul este setat, si este corect, atunci trimitem userului, pe langa pagina normala, si un form care ii permite sa arate ca a incercat reteta
        //                         , si este gresit, atunci trimitem userului pagina normala
        //Daca cookie-ul nu este setat, atunci trimitem userului pagina normala
        
        //Obtinem numele retetei
        let pageName = request.url.substr(8);
        pageName = pageName.substr(0,pageName.length-5);

        let cookie = request.headers.cookie;
        if(cookie != undefined) {
            let username = cookie.substr(0,cookie.search("="));
            let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
            let connected = await userModel.validateUserCredentials(username,SESSION_ID);
            if(connected === true) {//daca userul este logat
                //verificam intai ca reteta exista
                let exists = await recipeModel.getRecipeIdByName(pageName);
                if(exists != null) { //daca exista, atunci construim view-ul
                    //obtinem datele despre reteta
                    let data = await recipeModel.getAllInfoAboutRecipe(pageName);
                    if(data == null) {
                        response.writeHead(500,{'Content-type': 'text/plain'});
                        response.write('Internal server error');
                        response.end();
                        return ;
                    }
                    let recipeID = data.recipeID;
                    let categorie = data.categorie;
                    let nrIngrediente = data.nrIngrediente;
                    let preperationTime = data.preperationTime;
                    let finalizationTime = data.finalizationTime;
                    let nrInstructiuni = data.nrInstructiuni;
                    let dificultate = data.dificultate;
                    //obtinem ingredientele retetei
                    let dataIngrediente = await recipeModel.getAllIngredients(recipeID);
                    let ingrediente = '';
                    //construim string-ul dinamic pt ingrediente
                    for(let i = 0; i < nrIngrediente; i++) {
                        ingrediente = ingrediente + '<li><img src="/circle.png" alt="circle"><div>' + dataIngrediente.ingrediente[i].ingredient_name + '</div></li>';
                    }
                    //obtinem instructiunile retetei
                    let dataInstructiuni = await recipeModel.getAllInstructions(recipeID);
                    let instructiuni = '';
                    for(let i = 0; i < nrInstructiuni; i++) {
                        instructiuni = instructiuni + '<li><img src="/recipes/' + pageName + '/' + ('poza' + (i+1)) + '.jpg' + '" alt="photo"><div>' + dataInstructiuni.instructiuni[i].instructions +'</div></li>';
                    }

                    //modoficam view-ul si il trimitem
                    fs.readFile('core/View/recipePage.html', (err, buffer) => {
                        const formItems = '<input type="file"> <button id="tried" type="button"> Add to tried recipies!</button>'; //atunci ii permitem sa incerce reteta
                        const recipePhoto =  '/recipes/' + pageName + '/' + 'recipePhoto';
                        let data = eval(buffer.toString());
                        response.writeHead(200,{'Content-type': 'text/html'});
                        response.write(data);
                        response.end();
                    });
                }
                else { //afisam mesajul de eroare care spune ca pagina nu exista
                    response.writeHead(404,{'Content-type': 'text/plain'});
                    response.write('Page not found!');
                    return ;
                }
            } 
            else {
                fs.readFile('core/View/recipePage.html', (err, buffer) => {
                    if(err) {
                        response.writeHead(404,{'Content-type': 'text/plain'});
                        response.write('Page not found!');
                        return ;
                    } else {
                        const formItems = '';
                        let data = eval(buffer.toString());
                        response.writeHead(200,{'Content-type': 'text/html'});
                        response.write(data);
                        response.end();
                    }
                });
            }
        } 
        else {
            fs.readFile('core/View/recipePage.html', (err, buffer) => {
                if(err) {
                    response.writeHead(404,{'Content-type': 'text/plain'});
                    response.write('Page not found!');
                    return ;
                } else {
                    const formItems = '';
                    let data = eval(buffer.toString());
                    response.writeHead(200,{'Content-type': 'text/html'});
                    response.write(data);
                    response.end();
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
        }


   }

}