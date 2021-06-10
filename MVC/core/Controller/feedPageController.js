const fs = require('fs');
const user = require('../Model/user.js');
const recipe = require('../Model/recipe.js');
const Tokenizer = require('../../utility/tokenizer.js');
const formidable = require('formidable');
const mv = require('mv');

const userModel = new user();
const recipeModel = new recipe();

module.exports = class settingsController {
    static async GET_DEFAULT_RECIPES(request, response) {
        var body = '';

        request.on('data', chunk => {
            body += chunk;
        }); 

        request.on('end', async () => { 
            var skip = parseInt(JSON.parse(body).skip);
            var count = parseInt(JSON.parse(body).count);
            var direction = JSON.parse(body).direction;
        
            var answer = await recipeModel.getDefaultRecipes(skip,count);
            var verify;

            if (direction == 'up') {
                verify = await recipeModel.getDefaultRecipes(skip + 9, count);
                console.log('=====================');
                console.log(verify);
                console.log(typeof(verify));
                console.log('=====================');
            }

            if (answer === null) {
                response.statusCode = 404;
                response.end('Internal Server Error! Please try again and if problem persists, contact the administrator!');
                return ;
            }

            var defaultRecipes = '';

            for (let i = 0; i < answer.recipeName.length; i++) {
                defaultRecipes += '<a href = "/recipe/' + answer.recipeName[i].replace('%20', ' ').replace('%20', ' ') + '.html">' + '<img src = "/recipes/' + answer.recipeName[i].replace('%20', ' ').replace('%20', ' ') + '/recipePhoto.jpg" alt = "' + answer.recipeName[i].replace('%20', ' ').replace('%20', ' ') + '" class = "item"></a>';
            }

            if (skip != 0)
                defaultRecipes += `
                    <div class = "split-previous"> 
                        <div class = "previous">
                            <button class = "default-buttons" onclick = "updateMinusPageRecipe()"> &laquo; Previous </button>
                        </div> 
                    </div> 
                    <div class = "split-next"> 
                        <div class = "next">
                            <button class = "default-buttons" onclick = "updatePlusPageRecipe()"> Next  &raquo; </button>
                        </div>
                    </div>`; 
            else if (direction == 'up')
                defaultRecipes += `
                    <div class = "split-previous"> 
                        <div class = "previous">
                            <button class = "default-buttons" onclick = "updateMinusPageRecipe()"> &laquo; Previous </button>
                        </div> 
                    </div>`;   
            else 
                defaultRecipes += `  
                    <div class = "split-next"> 
                            <div class = "next">
                                <button class = "default-buttons" onclick = "updatePlusPageRecipe()"> Next  &raquo; </button>
                            </div>
                    </div>`;     

            response.statusCode = 200;
            response.setHeader('Content-Type','text/html');
            response.write(defaultRecipes);
            response.end();
        });
    }

    static async GET(request, response) {
        //Daca cookie-ul este setat, si este corect, atunci permitem userului sa acceseze pagina
        //                         , si este gresit, atunci redirectionam userul userul spre /loginRegister.html
        //Daca cookie-ul nu este setat, atunci nu afisam username-ul, avatarul si butonul de logout
        let cookie = request.headers.cookie;
        var nr;
        var recipeName;

        var count = await recipeModel.getNrRecipes();
        var next = false;

        var defaultRecipes = '';
        var filtered = '';
        var recipes = await recipeModel.sortDefault();

        if (recipes == null) {
            response.statusCode = 500;
            response.end('Internal server error!');
        }
        else {
            var lg = recipes.length;
            var i;
            var next = false;
            var name;
            
            if (lg > 9) {
                next = true;
                lg = 9;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                defaultRecipes += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                defaultRecipes += '<div class = "split-next">';
                defaultRecipes += '<div class = "next">';
                defaultRecipes += ' <button class = "default-buttons" onclick = "updatePlusPageRecipe()"> Next  &raquo; </button> </div> </div>';
            }
        }

        var breakfast = '';
        var recipes = await recipeModel.getCategory('Breakfast');

        if (recipes == null) {
            breakfast = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                breakfast += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                breakfast += '<div class = "split-next">';
                breakfast += '<div class = "next">';
                breakfast += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var brunch = '';
        recipes = await recipeModel.getCategory('Brunch');

        if (recipes == null) {
            brunch = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                brunch += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                brunch += '<div class = "split-next">';
                brunch += '<div class = "next">';
                brunch += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var lunch = '';
        recipes = await recipeModel.getCategory('Lunch');

        if (recipes == null) {
            lunch = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                lunch += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                lunch += '<div class = "split-next">';
                lunch += '<div class = "next">';
                lunch += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var snacks = '';
        recipes = await recipeModel.getCategory('Snacks');

        if (recipes == null) {
            snacks = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                snacks += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                snacks += '<div class = "split-next">';
                snacks += '<div class = "next">';
                snacks += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var dinner = '';
        recipes = await recipeModel.getCategory('Dinner');

        if (recipes == null) {
            dinner = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                dinner += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                dinner += '<div class = "split-next">';
                dinner += '<div class = "next">';
                dinner += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var soups = '';
        recipes = await recipeModel.getCategory('Soups');

        if (recipes == null) {
            soups = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                soups += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                soups += '<div class = "split-next">';
                soups += '<div class = "next">';
                soups += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var salads = '';
        recipes = await recipeModel.getCategory('Salads');

        if (recipes == null) {
            salads = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                salads += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                salads += '<div class = "split-next">';
                salads += '<div class = "next">';
                salads += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var main = '';
        recipes = await recipeModel.getCategory('Main Dishes');

        if (recipes == null) {
            main = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                main += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                main += '<div class = "split-next">';
                main += '<div class = "next">';
                main += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var pasta = '';
        recipes = await recipeModel.getCategory('Pasta');

        if (recipes == null) {
            pasta = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                pasta += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                pasta += '<div class = "split-next">';
                pasta += '<div class = "next">';
                pasta += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var seafood = '';
        recipes = await recipeModel.getCategory('Seafood');

        if (recipes == null) {
            seafood = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                seafood += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                seafood += '<div class = "split-next">';
                seafood += '<div class = "next">';
                seafood += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var pizza = '';
        recipes = await recipeModel.getCategory('Pizza');

        if (recipes == null) {
            pizza = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                pizza += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                pizza += '<div class = "split-next">';
                pizza += '<div class = "next">';
                pizza += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var burgers = '';
        recipes = await recipeModel.getCategory('Burgers');

        if (recipes == null) {
            burgers = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                burgers += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                burgers += '<div class = "split-next">';
                burgers += '<div class = "next">';
                burgers += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var vegetarian = '';
        recipes = await recipeModel.getCategory('Vegetarian');

        if (recipes == null) {
            vegetarian = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                vegetarian += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                vegetarian += '<div class = "split-next">';
                vegetarian += '<div class = "next">';
                vegetarian += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var vegan = '';
        recipes = await recipeModel.getCategory('Vegan');

        if (recipes == null) {
            vegan = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                vegan += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                vegan += '<div class = "split-next">';
                vegan += '<div class = "next">';
                vegan += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var sides = '';
        recipes = await recipeModel.getCategory('Sides');

        if (recipes == null) {
            sides = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                sides += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                sides += '<div class = "split-next">';
                sides += '<div class = "next">';
                sides += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var sauces = '';
        recipes = await recipeModel.getCategory('Sauces');

        if (recipes == null) {
            sauces = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                sauces += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                sauces += '<div class = "split-next">';
                sauces += '<div class = "next">';
                sauces += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }
        
        var desserts = '';
        var recipes = await recipeModel.getCategory('Desserts');

        if (recipes == null) {
            desserts = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                desserts += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                desserts += '<div class = "split-next">';
                desserts += '<div class = "next">';
                desserts += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var drinks = '';
        recipes = await recipeModel.getCategory('Drinks');

        if (recipes == null) {
            drinks = '';
        }
        else {
            var lg = recipes.length;
            var i;
            next = false;
            var name;
            
            if (lg > 6) {
                next = true;
                lg = 6;
            }

            for (i = 0; i < lg; i++) {
                name = recipes[i].recipe_name;
                drinks += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
            }

            if (next === true) {
                drinks += '<div class = "split-next">';
                drinks += '<div class = "next">';
                drinks += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
            }
        }

        var popularR = '';

        var popular = await recipeModel.getPopularRecipes();

        if (popular == null) {
            response.statusCode = 500;
            response.end('Internal server error!');
        }
        else {
            var L = popular.length;
            var nr = 10;

            if (L < 10)
                nr = L;
            
            for (i = 0; i < nr; i++) {
                var Rname = popular[i].recipe_name;
                var categ = popular[i].category;
                var userN = popular[i].first_name + ' ' + popular[i].last_name;

                popularR += '<tr> <td> ' + (i + 1) + '</td>';
                popularR += '<td> <a href = "/recipe/' + Rname + '.html">' + Rname + '</a> </td>';
                popularR += '<td>' + categ + '</td>';
                popularR += '<td>' + userN + '</td> </tr>';
            }
        }

        var popularI = '';

        var ingredients = await recipeModel.getPopularIngredients();

        if (ingredients == null) {
            response.statusCode = 500;
            response.end('Internal server error!');
        }
        else {
            var L1 = ingredients.length;
            var nr1 = 10;

            if (L1 < 10)
                nr1 = L1;
            
            for (i = 0; i < nr1; i++) {
                var score = ingredients[i].score;
                var name = ingredients[i].ingredient_name;

                popularI += '<tr> <td> ' + (i + 1) + '</td>';
                popularI += '<td>' + name + '</td>';
                popularI += '<td>' + score + '</td> </tr>';
            }
        }

        var unwantedI = '';

        ingredients = await recipeModel.getUnwantedIngredients();

        if (ingredients == null) {
            response.statusCode = 500;
            response.end('Internal server error!');
        }
        else {
            var L1 = ingredients.length;
            var nr1 = 10;

            if (L1 < 10)
                nr1 = L1;
            
            for (i = 0; i < nr1; i++) {
                var name = ingredients[i].ingredient_name;

                unwantedI += '<tr> <td> ' + (i + 1) + '</td>';
                unwantedI += '<td>' + name + '</td>';
            }
        }
        
        var searched = '';

        var popularity = '';

        var prepping = '';
        var final = '';
        var diff = '';
        var alphabetic = '';

        if (cookie != undefined) {
            let username = cookie.substr(0, cookie.search("="));
            let SESSION_ID = cookie.substr(cookie.search("=") + 1, cookie.length);
            let connected = await userModel.validateUserCredentials(username, SESSION_ID);
            let avatar = '<img src = "/avatar-picture.png" alt = "Avatar">';
            let logout = '<button class = "my-page" onclick = "logout()"> Logout </button>';

            if (connected === true) {
                fs.readFile('core/View/feedPage.html', (err, buffer) => {
                    const username = cookie.substr(0, cookie.search("="));
                    const avatar = '<img src = "/avatar-picture.png" alt = "Avatar">';
                    const logout = '<button class = "my-page" onclick = "logout()"> Logout </button>';
                    let data = eval(buffer.toString());

                    response.writeHead(200,{'Content-type': 'text/html'});
                    response.write(data);
                    response.end();
                });
            } 
            else {
                response.statusCode = 500;
                response.end('Internal server error!');
            }
        } 
        else {
            fs.readFile('core/View/feedPage.html', (err, buffer) => {
                const username = '';
                const avatar = '';
                const logout = '';
                let data = eval(buffer.toString());

                response.writeHead(200, {'Content-type': 'text/html'});
                response.write(data);
                response.end();
            });
        }
    }

    static async POST(request, response) {
        //verificam daca datele credentiale ale userului sunt corecte
        let cookie = request.headers.cookie;
        var username, SESSION_ID, connected;

        if (cookie != undefined) {
            username = cookie.substr(0, cookie.search("="));
            SESSION_ID = cookie.substr(cookie.search("=") + 1, cookie.length); 
            connected = await userModel.validateUserCredentials(username,SESSION_ID);
        }
        else {
            username = '';
            SESSION_ID = '';
            connected = null;
        }

        //if (connected === true) {
            var form = new formidable.IncomingForm({ multiples: true});

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
                    if (fields.type === 'Logout') {
                        //setam expirarea cookie-ului la data si ora curenta
                        //redirectionam la loginRegister.html
                        try {
                            var User = await userModel.logout(username);

                            response.setHeader('Set-Cookie', username + '=' + User.sessionid + '; path=/; Expires=' + User.connectionTime.toUTCString() + ';');
                            console.log(username + '=' + User.sessionid + '; path=/; expires=' + User.connectionTime.toUTCString() + ';')
                            response.statusCode = 200;
                            response.end(); 
                        } catch(e) {
                            console.log(e);
                            response.statusCode = 500;
                            response.end();
                        }  
                    }
                    else if (fields.type === 'Search') {
                        //obtinem toate informatiile din FormData(fields)
                        var recipe = fields.recipe;
                        var wanted = fields.wanted;
                        var undesired = fields.undesired;
                        var difficulty = fields.difficulty;
                        var prep = fields.prep;
                        var total = fields.total;
                        var category = fields.category;
                        var userID;
                        var searched = '';
                        var found = false;
                        var r = false, w = false, u = false, d = false, p = false;
                        var t = false, c = false;

                        if (username != '') {
                            //obtinem id-ul userului
                            userID = await userModel.getUserIdByUsername(username);

                            if (userID == null) {
                                response.statusCode = 500;
                                response.end();
                            }
                        }
                        else {
                            userID = null;
                        }

                        if (recipe == "") {
                            recipe = null; 
                            r = true;
                        }
                        
                        if (wanted == "") {
                            wanted = null;
                            w = true;
                        }

                        if (undesired == "") {
                            undesired = null;
                            u = true;
                        }

                        if (difficulty == "") {
                            difficulty = null;
                            d = true;
                        }

                        if (prep == "") {
                            prep = null;
                            p = true;
                        }

                        if (total == "") {
                            total = null;
                            t = true;
                        }

                        if (category == "") {
                            category = null;
                            c = true;
                        }
                        
                        if (r === false) {
                            var searchBy = await recipeModel.searchName(recipe);

                            if (searchBy == null) {
                                response.statusCode = 500;
                                response.end('Internal server error!');
                            }
                            else if (searchBy == 'no rows') {
                                found = false;
                            }
                            else {
                                var lg = searchBy.length;
                                var i, nameR, id;
                                var next;
                                found = true;

                                if (lg > 9) {
                                    lg = 9; 
                                    next = true;
                                }
                                    
                                for (i = 0; i < lg; i++) {
                                    id = searchBy[i].recipe_id;
                                    nameR = searchBy[i].recipe_name;
                                    searched += '<a href = "/recipe/' + nameR + '.html">' + '<img src = "/recipes/' + nameR + '/recipePhoto.jpg" alt = "' + nameR + '" class = "item"></a>';

                                    var info = await recipeModel.getSearchRInfo(nameR);

                                    if (info == null) {
                                        response.statusCode = 500;
                                        response.end();
                                    }
                                    else {
                                        var id = await recipeModel.getSearchId(userID);
                                        var idS;

                                        if (id == null) {
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                        else if (id == '0') 
                                            idS = 1;
                                        else 
                                            idS = id[0].search_id + 1;

                                        try {
                                            var score1 = info[0].score;
                                            var prep = info[0].prep_time;
                                            var total = info[0].final_time;
                                            var diff = info[0].difficulty;

                                            var answer = await recipeModel.insertSearchR(userID, nameR, score1, prep, total, diff, idS);
                
                                            if (answer == null) {
                                                response.statusCode = 500;
                                                response.end();
                                            }
                                        } catch(e) {
                                            console.log(e);
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                    }
                                }

                                if (next === true) {
                                    searched += '<div class = "split-next">';
                                    searched += '<div class = "next">';
                                    searched += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                                }
                            }
                        }
                        else if (w === false && u === false) {
                            var searchBy = await recipeModel.searchWU(wanted, undesired);

                            if (searchBy == null) {
                                response.statusCode = 500;
                                response.end('Internal server error!');
                            }
                            else if (searchBy == 'no rows') {
                                found = false;
                            }
                            else {
                                var lg = searchBy.length;
                                var i, nameR, id;
                                var next;
                                found = true;

                                if (lg > 9) {
                                    lg = 9; 
                                    next = true;
                                }
                                    
                                for (i = 0; i < lg; i++) {
                                    nameR = searchBy[i].recipe_name;
                                    searched += '<a href = "/recipe/' + nameR + '.html">' + '<img src = "/recipes/' + nameR + '/recipePhoto.jpg" alt = "' + nameR + '" class = "item"></a>';
                                
                                    var info = await recipeModel.getSearchRInfo(nameR);

                                    if (info == null) {
                                        response.statusCode = 500;
                                        response.end();
                                    }
                                    else {
                                        var id = await recipeModel.getSearchId(userID);
                                        var idS;

                                        if (id == null) {
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                        else if (id == '0') 
                                            idS = 1;
                                        else 
                                            idS = id[0].search_id + 1;
                                            
                                        try {
                                            var score1 = info[0].score;
                                            var prep = info[0].prep_time;
                                            var total = info[0].final_time;
                                            var diff = info[0].difficulty;

                                            var answer = await recipeModel.insertSearchR(userID, nameR, score1, prep, total, diff, idS);
                
                                            if (answer == null) {
                                                response.statusCode = 500;
                                                response.end();
                                            }
                                        } catch(e) {
                                            console.log(e);
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                    }
                                }

                                if (next === true) {
                                    searched += '<div class = "split-next">';
                                    searched += '<div class = "next">';
                                    searched += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                                }
                            }
                        }
                        else if (w === false && d === false) {
                            var searchBy = await recipeModel.searchWD(wanted, difficulty);

                            if (searchBy == null) {
                                response.statusCode = 500;
                                response.end('Internal server error!');
                            }
                            else if (searchBy == 'no rows') {
                                found = false;
                            }
                            else {
                                var lg = searchBy.length;
                                var i, nameR, id;
                                var next;
                                found = true;

                                if (lg > 9) {
                                    lg = 9; 
                                    next = true;
                                }
                                    
                                for (i = 0; i < lg; i++) {
                                    nameR = searchBy[i].recipe_name;
                                    searched += '<a href = "/recipe/' + nameR + '.html">' + '<img src = "/recipes/' + nameR + '/recipePhoto.jpg" alt = "' + nameR + '" class = "item"></a>';
                                
                                    var info = await recipeModel.getSearchRInfo(nameR);

                                    if (info == null) {
                                        response.statusCode = 500;
                                        response.end();
                                    }
                                    else {
                                        var id = await recipeModel.getSearchId(userID);
                                        var idS;

                                        if (id == null) {
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                        else if (id == '0') 
                                            idS = 1;
                                        else 
                                            idS = id[0].search_id + 1;
                                            
                                        try {
                                            var score1 = info[0].score;
                                            var prep = info[0].prep_time;
                                            var total = info[0].final_time;
                                            var diff = info[0].difficulty;

                                            var answer = await recipeModel.insertSearchR(userID, nameR, score1, prep, total, diff, idS);
                
                                            if (answer == null) {
                                                response.statusCode = 500;
                                                response.end();
                                            }
                                        } catch(e) {
                                            console.log(e);
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                    }
                                }

                                if (next === true) {
                                    searched += '<div class = "split-next">';
                                    searched += '<div class = "next">';
                                    searched += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                                }
                            }
                        }
                        else if (w === false && p === false) {
                            var searchBy = await recipeModel.searchWP(wanted, prep);

                            if (searchBy == null) {
                                response.statusCode = 500;
                                response.end('Internal server error!');
                            }
                            else if (searchBy == 'no rows') {
                                found = false;
                            }
                            else {
                                var lg = searchBy.length;
                                var i, nameR, id;
                                var next;
                                found = true;

                                if (lg > 9) {
                                    lg = 9; 
                                    next = true;
                                }
                                    
                                for (i = 0; i < lg; i++) {
                                    nameR = searchBy[i].recipe_name;
                                    searched += '<a href = "/recipe/' + nameR + '.html">' + '<img src = "/recipes/' + nameR + '/recipePhoto.jpg" alt = "' + nameR + '" class = "item"></a>';
                                
                                    var info = await recipeModel.getSearchRInfo(nameR);

                                    if (info == null) {
                                        response.statusCode = 500;
                                        response.end();
                                    }
                                    else {
                                        var id = await recipeModel.getSearchId(userID);
                                        var idS;

                                        if (id == null) {
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                        else if (id == '0') 
                                            idS = 1;
                                        else 
                                            idS = id[0].search_id + 1;
                                            
                                        try {
                                            var score1 = info[0].score;
                                            var prep = info[0].prep_time;
                                            var total = info[0].final_time;
                                            var diff = info[0].difficulty;

                                            var answer = await recipeModel.insertSearchR(userID, nameR, score1, prep, total, diff, idS);
                
                                            if (answer == null) {
                                                response.statusCode = 500;
                                                response.end();
                                            }
                                        } catch(e) {
                                            console.log(e);
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                    }
                                }

                                if (next === true) {
                                    searched += '<div class = "split-next">';
                                    searched += '<div class = "next">';
                                    searched += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                                }
                            }
                        }
                        else if (w === false && t === false) {
                            var searchBy = await recipeModel.searchWT(wanted, total);

                            if (searchBy == null) {
                                response.statusCode = 500;
                                response.end('Internal server error!');
                            }
                            else if (searchBy == 'no rows') {
                                found = false;
                            }
                            else {
                                var lg = searchBy.length;
                                var i, nameR, id;
                                var next;
                                found = true;

                                if (lg > 9) {
                                    lg = 9; 
                                    next = true;
                                }
                                    
                                for (i = 0; i < lg; i++) {
                                    nameR = searchBy[i].recipe_name;
                                    searched += '<a href = "/recipe/' + nameR + '.html">' + '<img src = "/recipes/' + nameR + '/recipePhoto.jpg" alt = "' + nameR + '" class = "item"></a>';
                                
                                    var info = await recipeModel.getSearchRInfo(nameR);

                                    if (info == null) {
                                        response.statusCode = 500;
                                        response.end();
                                    }
                                    else {
                                        var id = await recipeModel.getSearchId(userID);
                                        var idS;

                                        if (id == null) {
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                        else if (id == '0') 
                                            idS = 1;
                                        else 
                                            idS = id[0].search_id + 1;
                                            
                                        try {
                                            var score1 = info[0].score;
                                            var prep = info[0].prep_time;
                                            var total = info[0].final_time;
                                            var diff = info[0].difficulty;

                                            var answer = await recipeModel.insertSearchR(userID, nameR, score1, prep, total, diff, idS);
                
                                            if (answer == null) {
                                                response.statusCode = 500;
                                                response.end();
                                            }
                                        } catch(e) {
                                            console.log(e);
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                    }
                                }

                                if (next === true) {
                                    searched += '<div class = "split-next">';
                                    searched += '<div class = "next">';
                                    searched += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                                }
                            }
                        }
                        else if (w === false && c === false) {
                            var searchBy = await recipeModel.searchWC(wanted, category);

                            if (searchBy == null) {
                                response.statusCode = 500;
                                response.end('Internal server error!');
                            }
                            else if (searchBy == 'no rows') {
                                found = false;
                            }
                            else {
                                var lg = searchBy.length;
                                var i, nameR, id;
                                var next;
                                found = true;

                                if (lg > 9) {
                                    lg = 9; 
                                    next = true;
                                }
                                    
                                for (i = 0; i < lg; i++) {
                                    nameR = searchBy[i].recipe_name;
                                    searched += '<a href = "/recipe/' + nameR + '.html">' + '<img src = "/recipes/' + nameR + '/recipePhoto.jpg" alt = "' + nameR + '" class = "item"></a>';
                                
                                    var info = await recipeModel.getSearchRInfo(nameR);

                                    if (info == null) {
                                        response.statusCode = 500;
                                        response.end();
                                    }
                                    else {
                                        var id = await recipeModel.getSearchId(userID);
                                        var idS;

                                        if (id == null) {
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                        else if (id == '0') 
                                            idS = 1;
                                        else 
                                            idS = id[0].search_id + 1;
                                            
                                        try {
                                            var score1 = info[0].score;
                                            var prep = info[0].prep_time;
                                            var total = info[0].final_time;
                                            var diff = info[0].difficulty;

                                            var answer = await recipeModel.insertSearchR(userID, nameR, score1, prep, total, diff, idS);
                
                                            if (answer == null) {
                                                response.statusCode = 500;
                                                response.end();
                                            }
                                        } catch(e) {
                                            console.log(e);
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                    }
                                }

                                if (next === true) {
                                    searched += '<div class = "split-next">';
                                    searched += '<div class = "next">';
                                    searched += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                                }
                            }
                        }
                        else if (w === false) {
                            var searchBy = await recipeModel.searchWanted(wanted);

                            if (searchBy == null) {
                                response.statusCode = 500;
                                response.end('Internal server error!');
                            }
                            else if (searchBy == 'no rows') {
                                found = false;
                            }
                            else {
                                var lg = searchBy.length;
                                var i, nameR, id;
                                var next;
                                found = true;

                                if (lg > 9) {
                                    lg = 9; 
                                    next = true;
                                }
                                    
                                for (i = 0; i < lg; i++) {
                                    nameR = searchBy[i].recipe_name;
                                    searched += '<a href = "/recipe/' + nameR + '.html">' + '<img src = "/recipes/' + nameR + '/recipePhoto.jpg" alt = "' + nameR + '" class = "item"></a>';
                                
                                    var info = await recipeModel.getSearchRInfo(nameR);

                                    if (info == null) {
                                        response.statusCode = 500;
                                        response.end();
                                    }
                                    else {
                                        var id = await recipeModel.getSearchId(userID);
                                        var idS;

                                        if (id == null) {
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                        else if (id == '0') 
                                            idS = 1;
                                        else 
                                            idS = id[0].search_id + 1;
                                            
                                        try {
                                            var score1 = info[0].score;
                                            var prep = info[0].prep_time;
                                            var total = info[0].final_time;
                                            var diff = info[0].difficulty;

                                            var answer = await recipeModel.insertSearchR(userID, nameR, score1, prep, total, diff, idS);
                
                                            if (answer == null) {
                                                response.statusCode = 500;
                                                response.end();
                                            }
                                        } catch(e) {
                                            console.log(e);
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                    }
                                }

                                if (next === true) {
                                    searched += '<div class = "split-next">';
                                    searched += '<div class = "next">';
                                    searched += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                                }
                            }
                        } 
                        else if (u === false) {
                            var searchBy = await recipeModel.searchUnwanted(undesired);

                            if (searchBy == null) {
                                response.statusCode = 500;
                                response.end('Internal server error!');
                            }
                            else if (searchBy == 'no rows') {
                                found = false;
                            }
                            else {
                                var lg = searchBy.length;
                                var i, nameR, id;
                                var next;
                                found = true;

                                if (lg > 9) {
                                    lg = 9; 
                                    next = true;
                                }
                                    
                                for (i = 0; i < lg; i++) {
                                    nameR = searchBy[i].recipe_name;
                                    searched += '<a href = "/recipe/' + nameR + '.html">' + '<img src = "/recipes/' + nameR + '/recipePhoto.jpg" alt = "' + nameR + '" class = "item"></a>';
                                
                                    var info = await recipeModel.getSearchRInfo(nameR);

                                    if (info == null) {
                                        response.statusCode = 500;
                                        response.end();
                                    }
                                    else {
                                        var id = await recipeModel.getSearchId(userID);
                                        var idS;

                                        if (id == null) {
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                        else if (id == '0') 
                                            idS = 1;
                                        else 
                                            idS = id[0].search_id + 1;
                                            
                                        try {
                                            var score1 = info[0].score;
                                            var prep = info[0].prep_time;
                                            var total = info[0].final_time;
                                            var diff = info[0].difficulty;

                                            var answer = await recipeModel.insertSearchR(userID, nameR, score1, prep, total, diff, idS);
                
                                            if (answer == null) {
                                                response.statusCode = 500;
                                                response.end();
                                            }
                                        } catch(e) {
                                            console.log(e);
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                    }
                                }

                                if (next === true) {
                                    searched += '<div class = "split-next">';
                                    searched += '<div class = "next">';
                                    searched += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                                }
                            }
                        }
                        else if (d === false) {
                            var searchBy = await recipeModel.searchDifficulty(difficulty);

                            if (searchBy == null) {
                                response.statusCode = 500;
                                response.end('Internal server error!');
                            }
                            else if (searchBy == 'no rows') {
                                found = false;
                            }
                            else {
                                var lg = searchBy.length;
                                var i, nameR, id;
                                var next;
                                found = true;

                                if (lg > 9) {
                                    lg = 9; 
                                    next = true;
                                }
                                    
                                for (i = 0; i < lg; i++) {
                                    id = searchBy[i].recipe_id;
                                    nameR = searchBy[i].recipe_name;
                                    searched += '<a href = "/recipe/' + nameR + '.html">' + '<img src = "/recipes/' + nameR + '/recipePhoto.jpg" alt = "' + nameR + '" class = "item"></a>';
                                
                                    var info = await recipeModel.getSearchRInfo(nameR);

                                    if (info == null) {
                                        response.statusCode = 500;
                                        response.end();
                                    }
                                    else {
                                        var id = await recipeModel.getSearchId(userID);
                                        var idS;

                                        if (id == null) {
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                        else if (id == '0') 
                                            idS = 1;
                                        else 
                                            idS = id[0].search_id + 1;
                                            
                                        try {
                                            var score1 = info[0].score;
                                            var prep = info[0].prep_time;
                                            var total = info[0].final_time;
                                            var diff = info[0].difficulty;

                                            var answer = await recipeModel.insertSearchR(userID, nameR, score1, prep, total, diff, idS);
                
                                            if (answer == null) {
                                                response.statusCode = 500;
                                                response.end();
                                            }
                                        } catch(e) {
                                            console.log(e);
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                    }
                                }

                                if (next === true) {
                                    searched += '<div class = "split-next">';
                                    searched += '<div class = "next">';
                                    searched += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                                }
                            }
                        }
                        else if (p === false) {
                            var searchBy = await recipeModel.searchPrep(prep);

                            if (searchBy == null) {
                                response.statusCode = 500;
                                response.end('Internal server error!');
                            }
                            else if (searchBy == 'no rows') {
                                found = false;
                            }
                            else {
                                var lg = searchBy.length;
                                var i, nameR, id;
                                var next;
                                found = true;

                                if (lg > 9) {
                                    lg = 9; 
                                    next = true;
                                }
                                    
                                for (i = 0; i < lg; i++) {
                                    id = searchBy[i].recipe_id;
                                    nameR = searchBy[i].recipe_name;
                                    searched += '<a href = "/recipe/' + nameR + '.html">' + '<img src = "/recipes/' + nameR + '/recipePhoto.jpg" alt = "' + nameR + '" class = "item"></a>';
                                
                                    var info = await recipeModel.getSearchRInfo(nameR);

                                    if (info == null) {
                                        response.statusCode = 500;
                                        response.end();
                                    }
                                    else {
                                        var id = await recipeModel.getSearchId(userID);
                                        var idS;

                                        if (id == null) {
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                        else if (id == '0') 
                                            idS = 1;
                                        else 
                                            idS = id[0].search_id + 1;
                                            
                                        try {
                                            var score1 = info[0].score;
                                            var prep = info[0].prep_time;
                                            var total = info[0].final_time;
                                            var diff = info[0].difficulty;

                                            var answer = await recipeModel.insertSearchR(userID, nameR, score1, prep, total, diff, idS);
                
                                            if (answer == null) {
                                                response.statusCode = 500;
                                                response.end();
                                            }
                                        } catch(e) {
                                            console.log(e);
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                    }
                                }

                                if (next === true) {
                                    searched += '<div class = "split-next">';
                                    searched += '<div class = "next">';
                                    searched += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                                }
                            }
                        }
                        else if (t === false) {
                            var searchBy = await recipeModel.searchTotal(total);

                            if (searchBy == null) {
                                response.statusCode = 500;
                                response.end('Internal server error!');
                            }
                            else if (searchBy == 'no rows') {
                                found = false;
                            }
                            else {
                                var lg = searchBy.length;
                                var i, nameR, id;
                                var next;
                                found = true;

                                if (lg > 9) {
                                    lg = 9; 
                                    next = true;
                                }
                                    
                                for (i = 0; i < lg; i++) {
                                    id = searchBy[i].recipe_id;
                                    nameR = searchBy[i].recipe_name;
                                    searched += '<a href = "/recipe/' + nameR + '.html">' + '<img src = "/recipes/' + nameR + '/recipePhoto.jpg" alt = "' + nameR + '" class = "item"></a>';
                                
                                    var info = await recipeModel.getSearchRInfo(nameR);

                                    if (info == null) {
                                        response.statusCode = 500;
                                        response.end();
                                    }
                                    else {
                                        var id = await recipeModel.getSearchId(userID);
                                        var idS;

                                        if (id == null) {
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                        else if (id == '0') 
                                            idS = 1;
                                        else 
                                            idS = id[0].search_id + 1;
                                            
                                        try {
                                            var score1 = info[0].score;
                                            var prep = info[0].prep_time;
                                            var total = info[0].final_time;
                                            var diff = info[0].difficulty;

                                            var answer = await recipeModel.insertSearchR(userID, nameR, score1, prep, total, diff, idS);
                
                                            if (answer == null) {
                                                response.statusCode = 500;
                                                response.end();
                                            }
                                        } catch(e) {
                                            console.log(e);
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                    }
                                }

                                if (next === true) {
                                    searched += '<div class = "split-next">';
                                    searched += '<div class = "next">';
                                    searched += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                                }
                            }
                        }
                        else if (c === false) {
                            var searchBy = await recipeModel.searchCategory(category);

                            if (searchBy == null) {
                                response.statusCode = 500;
                                response.end('Internal server error!');
                            }
                            else if (searchBy == 'no rows') {
                                found = false;
                            }
                            else {
                                var lg = searchBy.length;
                                var i, nameR, id;
                                var next;
                                found = true;

                                if (lg > 9) {
                                    lg = 9; 
                                    next = true;
                                }
                                    
                                for (i = 0; i < lg; i++) {
                                    id = searchBy[i].recipe_id;
                                    nameR = searchBy[i].recipe_name;
                                    searched += '<a href = "/recipe/' + nameR + '.html">' + '<img src = "/recipes/' + nameR + '/recipePhoto.jpg" alt = "' + nameR + '" class = "item"></a>';
                                
                                    var info = await recipeModel.getSearchRInfo(nameR);

                                    if (info == null) {
                                        response.statusCode = 500;
                                        response.end();
                                    }
                                    else {
                                        var id = await recipeModel.getSearchId(userID);
                                        var idS;

                                        if (id == null) {
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                        else if (id == '0') 
                                            idS = 1;
                                        else 
                                            idS = id[0].search_id + 1;
                                            
                                        try {
                                            var score1 = info[0].score;
                                            var prep = info[0].prep_time;
                                            var total = info[0].final_time;
                                            var diff = info[0].difficulty;

                                            var answer = await recipeModel.insertSearchR(userID, nameR, score1, prep, total, diff, idS);
                
                                            if (answer == null) {
                                                response.statusCode = 500;
                                                response.end();
                                            }
                                        } catch(e) {
                                            console.log(e);
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                    }
                                }

                                if (next === true) {
                                    searched += '<div class = "split-next">';
                                    searched += '<div class = "next">';
                                    searched += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                                }
                            }
                        }
                        
                        if (found == false) {
                            response.statusCode = 205;
                            response.end();
                        }
                        else try {
                            var answer = await recipeModel.insertSearch(userID, recipe, wanted, undesired, difficulty, prep, total, category);

                            if (answer == null) {
                                response.statusCode = 500;
                                response.end();
                            }
                            else {
                                response.statusCode = 201;
                                response.end(searched);                               
                            }
                        } catch(e) {
                            console.log(e);
                            response.statusCode = 500;
                            response.end();
                        }
                    }
                    else if (fields.type === 'Popular') {
                        var popularity = '';
                        var ok = true;
                        var recipes = await recipeModel.sortPopularity();

                        if (recipes == null) {
                            response.statusCode = 500;
                            response.end();
                            ok = false;
                        }
                        else {
                            var lg = recipes.length;
                            var i;
                            var next = false;
                            var name;
            
                            if (lg > 9) {
                                next = true;
                                lg = 9;
                            }

                            for (i = 0; i < lg; i++) {
                                name = recipes[i].recipe_name;
                                popularity += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
                            }

                            if (next === true) {
                                popularity += '<div class = "split-next">';
                                popularity += '<div class = "next">';
                                popularity += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                            }
                        }

                        if (ok === true) {
                            response.statusCode = 201;
                            response.end(popularity);
                        }
                    }
                    else if (fields.type === 'Prepping') {
                        var prepping = '';
                        var ok = true;
                        var recipes = await recipeModel.sortPrep();

                        if (recipes == null) {
                            response.statusCode = 500;
                            response.end();
                            ok = false;
                        }
                        else {
                            var lg = recipes.length;
                            var i;
                            var next = false;
                            var name;
            
                            if (lg > 9) {
                                next = true;
                                lg = 9;
                            }

                            for (i = 0; i < lg; i++) {
                                name = recipes[i].recipe_name;
                                prepping += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
                            }

                            if (next === true) {
                                prepping += '<div class = "split-next">';
                                prepping += '<div class = "next">';
                                prepping += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                            }
                        }

                        if (ok === true) {
                            response.statusCode = 201;
                            response.end(prepping);
                        }
                    }
                    else if (fields.type === 'Final') {
                        var final = '';
                        var ok = true;
                        var recipes = await recipeModel.sortFinal();

                        if (recipes == null) {
                            response.statusCode = 500;
                            response.end();
                            ok = false;
                        }
                        else {
                            var lg = recipes.length;
                            var i;
                            var next = false;
                            var name;
            
                            if (lg > 9) {
                                next = true;
                                lg = 9;
                            }

                            for (i = 0; i < lg; i++) {
                                name = recipes[i].recipe_name;
                                final += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
                            }

                            if (next === true) {
                                final += '<div class = "split-next">';
                                final += '<div class = "next">';
                                final += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                            }
                        }

                        if (ok === true) {
                            response.statusCode = 201;
                            response.end(final);
                        }
                    }
                    else if (fields.type === 'Diff') {
                        var diff = '';
                        var ok = true;
                        var recipes = await recipeModel.sortDiff();

                        if (recipes == null) {
                            response.statusCode = 500;
                            response.end();
                            ok = false;
                        }
                        else {
                            var lg = recipes.length;
                            var i;
                            var next = false;
                            var name;
            
                            if (lg > 9) {
                                next = true;
                                lg = 9;
                            }

                            for (i = 0; i < lg; i++) {
                                name = recipes[i].recipe_name;
                                diff += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
                            }

                            if (next === true) {
                                diff += '<div class = "split-next">';
                                diff += '<div class = "next">';
                                diff += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                            }
                        }

                        if (ok === true) {
                            response.statusCode = 201;
                            response.end(diff);
                        }
                    }
                    else if (fields.type === 'Default') {
                        var defaultRecipes = '';
                        var ok = true;
                        var recipes = await recipeModel.sortDefault();

                        if (recipes == null) {
                            response.statusCode = 500;
                            response.end();
                            ok = false;
                        }
                        else {
                            var lg = recipes.length;
                            var i;
                            var next = false;
                            var name;
            
                            if (lg > 9) {
                                next = true;
                                lg = 9;
                            }

                            for (i = 0; i < lg; i++) {
                                name = recipes[i].recipe_name;
                                defaultRecipes += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
                            }

                            if (next === true) {
                                defaultRecipes += '<div class = "split-next">';
                                defaultRecipes += '<div class = "next">';
                                defaultRecipes += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                            }
                        }

                        if (ok === true) {
                            response.statusCode = 201;
                            response.end(defaultRecipes);
                        }
                    }
                    else if (fields.type === 'Alph') {
                        var alphabetic = '';
                        var ok = true;
                        var recipes = await recipeModel.sortAZ();

                        if (recipes == null) {
                            response.statusCode = 500;
                            response.end();
                            ok = false;
                        }
                        else {
                            var lg = recipes.length;
                            var i;
                            var next = false;
                            var name;
            
                            if (lg > 9) {
                                next = true;
                                lg = 9;
                            }

                            for (i = 0; i < lg; i++) {
                                name = recipes[i].recipe_name;
                                alphabetic += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
                            }

                            if (next === true) {
                                alphabetic += '<div class = "split-next">';
                                alphabetic += '<div class = "next">';
                                alphabetic += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                            }
                        }

                        if (ok === true) {
                            response.statusCode = 201;
                            response.end(alphabetic);
                        }
                    }
                    else if (fields.type === 'PopS') {
                        var filtered = '';
                        var ok = true;

                        if (username != '') {
                            //obtinem id-ul userului
                            userID = await userModel.getUserIdByUsername(username);

                            if (userID == null) {
                                response.statusCode = 500;
                                response.end();
                            }
                        }
                        else {
                            userID = 0;
                        }

                        var id = await recipeModel.getSearchId(userID);
                        var idS;

                        if (id == null) {
                            response.statusCode = 500;
                            response.end();
                        }
                        else if (id == '0') 
                            idS = 0;
                        else 
                            idS = id[0].search_id;

                        var recipes = await recipeModel.sortSearchP(userID, idS);

                        if (recipes == null) {
                            response.statusCode = 500;
                            response.end();
                            ok = false;
                        }
                        else {
                            var lg = recipes.length;
                            var i;
                            var next = false;
                            var name;
            
                            if (lg > 9) {
                                next = true;
                                lg = 9;
                            }

                            for (i = 0; i < lg; i++) {
                                name = recipes[i].recipe_name;
                                filtered += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
                            }

                            if (next === true) {
                                filtered += '<div class = "split-next">';
                                filtered += '<div class = "next">';
                                filtered += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                            }
                        }

                        if (ok === true) {
                            response.statusCode = 201;
                            response.end(filtered);
                        }
                    }
                    else if (fields.type === 'PrepS') {
                        var filtered = '';
                        var ok = true;

                        if (username != '') {
                            //obtinem id-ul userului
                            userID = await userModel.getUserIdByUsername(username);

                            if (userID == null) {
                                response.statusCode = 500;
                                response.end();
                            }
                        }
                        else {
                            userID = 0;
                        }

                        var id = await recipeModel.getSearchId(userID);
                        var idS;

                        if (id == null) {
                            response.statusCode = 500;
                            response.end();
                        }
                        else if (id == '0') 
                            idS = 0;
                        else 
                            idS = id[0].search_id;

                        var recipes = await recipeModel.sortSearchPr(userID, idS);

                        if (recipes == null) {
                            response.statusCode = 500;
                            response.end();
                            ok = false;
                        }
                        else {
                            var lg = recipes.length;
                            var i;
                            var next = false;
                            var name;
            
                            if (lg > 9) {
                                next = true;
                                lg = 9;
                            }

                            for (i = 0; i < lg; i++) {
                                name = recipes[i].recipe_name;
                                filtered += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
                            }

                            if (next === true) {
                                filtered += '<div class = "split-next">';
                                filtered += '<div class = "next">';
                                filtered += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                            }
                        }

                        if (ok === true) {
                            response.statusCode = 201;
                            response.end(filtered);
                        }
                    }
                    else if (fields.type === 'FinalS') {
                        var filtered = '';
                        var ok = true;

                        if (username != '') {
                            //obtinem id-ul userului
                            userID = await userModel.getUserIdByUsername(username);

                            if (userID == null) {
                                response.statusCode = 500;
                                response.end();
                            }
                        }
                        else {
                            userID = 0;
                        }

                        var id = await recipeModel.getSearchId(userID);
                        var idS;

                        if (id == null) {
                            response.statusCode = 500;
                            response.end();
                        }
                        else if (id == '0') 
                            idS = 0;
                        else 
                            idS = id[0].search_id;

                        var recipes = await recipeModel.sortSearchF(userID, idS);

                        if (recipes == null) {
                            response.statusCode = 500;
                            response.end();
                            ok = false;
                        }
                        else {
                            var lg = recipes.length;
                            var i;
                            var next = false;
                            var name;
            
                            if (lg > 9) {
                                next = true;
                                lg = 9;
                            }

                            for (i = 0; i < lg; i++) {
                                name = recipes[i].recipe_name;
                                filtered += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
                            }

                            if (next === true) {
                                filtered += '<div class = "split-next">';
                                filtered += '<div class = "next">';
                                filtered += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                            }
                        }

                        if (ok === true) {
                            response.statusCode = 201;
                            response.end(filtered);
                        }
                    }
                    else if (fields.type === 'DiffS') {
                        var filtered = '';
                        var ok = true;

                        if (username != '') {
                            //obtinem id-ul userului
                            userID = await userModel.getUserIdByUsername(username);

                            if (userID == null) {
                                response.statusCode = 500;
                                response.end();
                            }
                        }
                        else {
                            userID = 0;
                        }

                        var id = await recipeModel.getSearchId(userID);
                        var idS;

                        if (id == null) {
                            response.statusCode = 500;
                            response.end();
                        }
                        else if (id == '0') 
                            idS = 0;
                        else 
                            idS = id[0].search_id;

                        var recipes = await recipeModel.sortSearchD(userID, idS);

                        if (recipes == null) {
                            response.statusCode = 500;
                            response.end();
                            ok = false;
                        }
                        else {
                            var lg = recipes.length;
                            var i;
                            var next = false;
                            var name;
            
                            if (lg > 9) {
                                next = true;
                                lg = 9;
                            }

                            for (i = 0; i < lg; i++) {
                                name = recipes[i].recipe_name;
                                filtered += '<a href = "/recipe/' + name + '.html">' + '<img src = "/recipes/' + name + '/recipePhoto.jpg" alt = "' + name + '" class = "item"></a>';
                            }

                            if (next === true) {
                                filtered += '<div class = "split-next">';
                                filtered += '<div class = "next">';
                                filtered += ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
                            }
                        }

                        if (ok === true) {
                            response.statusCode = 201;
                            response.end(filtered);
                        }
                    }
                }
            });
        //}
        /*else {
            response.writeHead(403);
            response.end();
        }*/
    }
}