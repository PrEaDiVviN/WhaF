const fs = require('fs');
const user = require('../Model/user.js');
const recipe = require('../Model/recipe.js');
const tried = require('../Model/tried.js');
const settings = require('../Model/settings.js');
const formidable = require('formidable');

const userModel = new user();
const recipeModel = new recipe();
const triedModel = new tried();
const settingsModel = new settings();

module.exports = class recipePageController {
    static async GET(request, response) {

        //Daca cookie-ul este setat, si este corect, atunci trimitem userului, pe langa pagina normala, si un form care ii permite sa arate ca a incercat reteta
        //                         , si este gresit, atunci trimitem userului pagina normala
        //Daca cookie-ul nu este setat, atunci trimitem userului pagina normala

        //obtinem numele retetei

       

        let pageName = request.url.substr(8);
        pageName = pageName.substr(0,pageName.length-5);
        pageName = pageName.replaceAll('%20',' ');
        console.log(pageName);

        //verificam daca reteta exista
        let exists = await recipeModel.getRecipeIdByName(pageName);
        if(exists != null) { //daca exista, atunci construim view-ul
            //obtinem datele despre reteta
            console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
            
            console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
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
                ingrediente = ingrediente + '<li class="relative" id="li' + (i + 1) + '"><img src="/circle.png" alt="circle"><div id="div' + (i+1) + '" >' + dataIngrediente.ingrediente[i].ingredient_name + '</div> </li>';
            }
            //obtinem instructiunile retetei
            let dataInstructiuni = await recipeModel.getAllInstructions(recipeID);
            let instructiuni = '';
            for(let i = 0; i < nrInstructiuni; i++) {
                instructiuni = instructiuni + '<li><img src="/recipes/' + pageName + ('/poza' + (i + 1))  + (dataInstructiuni.instructiuni[i].photo.substr(dataInstructiuni.instructiuni[i].photo.length-4)).replace('%20',' ') + '" alt="photo"><div>' + dataInstructiuni.instructiuni[i].instructions +'</div></li>';
            }
            //obtinem calea catre poza retetei
            const recipePhoto =  '/recipes/' + pageName.replaceAll('%20', ' ') + '/' + 'recipePhoto.jpg' + '?' + new Date().getTime();

            //setam variabila care va ilustra posibilitatea de a trimite o reteta la sigur vid
            var formItems = '';
            
            let cookie = request.headers.cookie;
            if(cookie != undefined) {
                ///daca userul este conectat, atunci ii trimitem si posibilitatea de a-si adauga propria incercare daca nu a incercat deja,
                ///daca a incercat, atunci afisam faptul ca incercat
                let username = cookie.substr(0,cookie.search("="));
                let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
                let connected = await userModel.validateUserCredentials(username,SESSION_ID);
                if(connected === true) {
                    let userID = await userModel.getUserIdByUsername(username);
                    let result = await triedModel.getPhotoTryUserRecipe(pageName,userID);
                    if(result === false)
                        formItems = '<input id="add" type="file"> <button id="tried" onclick="savePhoto()" type="button"> Add to tried recipies!</button>'; //atunci ii permitem sa incerce reteta
                    else        
                        formItems = '<h1 style="color:purple;">Here is your try!</h1> <a style="width: 50vw;" href="/users/' + username + '/' + result.replace("%20", " ") +'"><img alt="try photo" style="width: 100%; height: auto;" src="/users/' + username + '/' + result.replace("%20", " ") + '" ></a>';
                }
            }
            let cookie1 = request.headers.cookie; 
            let changeRecipeName = '';
            let changeRecipePhoto = '';
            let changeInfoPrep = '';
            let changeInfoFin = '';
            let changeInfoCat = '';
            let changeInfoDif = '';
            let changeIngredients = '';
            let changeInstructions = '';
            if(cookie1 != undefined) {
                let username = cookie1.substr(0,cookie1.search("="));
                let SESSION_ID = cookie1.substr(cookie1.search("=") + 1,cookie1.length);
                let connected = await userModel.validateUserCredentials(username,SESSION_ID);
                let userType = await userModel.getUserTypeByUsername(username);
                if(connected === true && userType === 'admin') {
                    ingrediente = '';
                    for(let i = 0; i < nrIngrediente; i++) {
                        ingrediente = ingrediente + '<li class="relative" id="li' + (i + 1) + '"><img src="/circle.png" alt="circle"><div id="div' + (i+1) + '" >' + dataIngrediente.ingrediente[i].ingredient_name + '</div> <img src="/deleteButton.png" id="delete' +(i+1) + '" alt="delete" class="deleteButton" onclick="deleteIngredient(this.id)"></li>';
                    }

                    changeRecipeName = `<form>
                                            <input id="inputChangeName" type="text" placeholder="new name">
                                            <button type="button" id="changeName" onclick="modifyRecipeName(0)">Change page Name</button>
				                        </form>`;
                    changeRecipePhoto = `<form>
                                            <input id="inputChangeRecipePhoto" type="file">
                                            <button type="button" id="changeRecipePhoto" onclick="changeRecipePhoto1()">Change recipePhoto</button>
                                        </form>`;

                    changeInfoPrep = `<form>
                                        <input id="inputChangePreparationTime" type="number" placeholder="new preparation time">
                                        <button type="button" id="changePrepationTime" onclick = "changeRecipeTime('prep')">Change preparation time!</button>
                                      </form>`;
					changeInfoFin = `<form>
                                        <input id="inputChangeFinalisationTime" type="number" placeholder="new finalisation time">
                                        <button type="button" id="changeFinalisationTime" onclick="changeRecipeTime('fin')">Change finalisation time!</button>
                                    </form>	`;
                    changeInfoCat = `<form>
                                        <select id="categorie" name="categorie">
                                            <option value="Fast Food">Fast food</option>
                                            <option value="Supe">Supe</option>
                                            <option value="Deserturi">Deserturi</option>
                                        </select>
                                        <button type="button" id="changeCategory" onclick="changeSelect('cat')">Change Category</button>
                                    </form>  `;
                    changeInfoDif =  `<form>
                                        <select id="dificultate" name="dificultate">
                                            <option value="Usor">Usor</option>
                                            <option value="Mediu">Mediu</option>
                                            <option value="Greu">Greu</option>
                                        </select>
                                        <button type="button" id="changeDificultateReteta"  onclick="changeSelect('dif')">Change dificulty!</button>
                                     </form>`;
                    
                    changeIngredients = `<form>
                    <label for="nringrediente">Adauga ingrediente</label>	<select id="nringrediente" name="nringrediente" onchange="addIngredient()">
                    <option value="none" selected>Niciunul</option>
                    <option value="1" >1</option>`;
                    let nrIng = await settingsModel.getNrIngrediente();
                    for (let i = 1; i < nrIng; i++) {
                        changeIngredients = changeIngredients + '<option value="' + (i + 1) + '">'+ (i+1) + '</option>';
                    }
                    changeIngredients = changeIngredients + '</select></form>';

                    let nrIns = await settingsModel.getNrInstructiuni();
                    changeInstructions = `<form> <label for="nrinstructiuni">Adauga instructiuni</label>	<select id="nrinstructiuni" name="nrinstructiuni" onchange="addInstruction()">
                    <option value="none" selected>Niciuna</option>
                    <option value="1">1</option>`;
                    for(let i = 1; i < nrIns; i++) {
                        changeInstructions = changeInstructions + '<option value="' + (i + 1) + '">'+ (i+1) + '</option>';
                    }
                    changeInstructions = changeInstructions + `</select> </form>`;
                }
            }

            //trimitem reteta catre user
            fs.readFile('core/View/recipePage.html', (err, buffer) => {
                if(err) {
                    response.writeHead(404,{'Content-type': 'text/plain'});
                    response.write('Page not found!');
                    return ;
                } else {
                    let data = eval(buffer.toString());
                    response.writeHead(200,{'Content-type': 'text/html'});
                    response.write(data);
                    response.end();
                }
            });
        }
        else { //afisam mesajul de eroare care spune ca pagina nu exista
            response.writeHead(404,{'Content-type': 'text/plain'});
            response.write('Sorry! Page not found!');
            return ;
        }


    }

    static async POST(request, response) {
        //verificam daca datele credentialele userului sunt bune
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);
        
        if(connected === true) {
            var form = new formidable.IncomingForm({ multiples: true});
            form.parse(request, async function (err, fields, files) {
                //luam numele retetei
                console.log(fields);
                let recipeName = fields.recipeName;
                //luam tipul pozei
                let type = (files.recipePhoto.type === 'image/jpeg') ? '.jpg' : (files.recipePhoto.type === 'image/png' ? '.png' : '.svg');
                //obtinem calea catre poza userului
                let newPath = 'data/users/' + username + '/' + recipeName + type;
                //luam poza de unde este salvata local
                let oldPath = files.recipePhoto.path;
                //mutam fisierul in folderul userului
                fs.rename(oldPath, newPath, function (err) {
                    if (err) {
                        console.log(err); 
                        response.statusCode = 500;
                        response.end('Internal server error!');
                        return ;
                    }
                });
                //inseram in baza de date ca userul a incercat reteta
                let userId = await userModel.getUserIdByUsername(username);
                let photo = recipeName + type;
                
                let result = await triedModel.insertTriedIntoDatabase(userId,recipeName,photo);
                //trimitem raspunsul catre user
                if(result != null) {
                    response.statusCode = 201;
                    response.end();
                }
                else {
                    response.statusCode = 500;
                    response.end();
                }
            });
        }


   }

}