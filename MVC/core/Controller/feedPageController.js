const fs = require('fs');
const user = require('../Model/user.js');
const recipe = require('../Model/recipe.js');
const Tokenizer = require('../../utility/tokenizer.js');
const formidable = require('formidable');
const mv = require('mv');

const userModel = new user();
const recipeModel = new recipe();

module.exports = class settingsController {
    static async GET(request, response) {
        //Daca cookie-ul este setat, si este corect, atunci permitem userului sa acceseze pagina
        //                         , si este gresit, atunci redirectionam userul userul spre /loginRegister.html
        //Daca cookie-ul nu este setat, atunci redirectionam userul userul spre /loginRegister.html
        let cookie = request.headers.cookie;
        var nr;
        var recipeName;
        var defaultRecipes = '';

        var count = await recipeModel.getNrRecipes();
        var next = false;

        if (count == null) {
            response.statusCode = 500;
            response.end('Internal server error!');
        }
        else if (count > 9) {
            next = true;
        }

        for (nr = 1; nr <= 9; nr++) {
            recipeName = await recipeModel.getRecipeNameById(nr);

            if (recipeName == null) {
                response.statusCode = 500;
                response.end('Internal server error!');
            }
            else {
                defaultRecipes = defaultRecipes + '<a href = "/recipe/' + recipeName + '.html">' + '<img src = "/recipes/' + recipeName + '/recipePhoto.jpg" alt = "' + recipeName + '" class = "item"></a>';
            }
        }

        if (next === true) {
            defaultRecipes = defaultRecipes + '<div class = "split-next">';
            defaultRecipes = defaultRecipes + '<div class = "next">';
            defaultRecipes = defaultRecipes + ' <button class = "default-buttons"> Next  &raquo; </button> </div> </div>';
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
        recipes = await recipeModel.getCategory('Main');

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

                response.writeHead(200,{'Content-type': 'text/html'});
                response.write(data);
                response.end();
            });
        }
    }

    static async POST(request, response) {
        //verificam daca datele credentiale ale userului sunt corecte
        let cookie = request.headers.cookie;
        let username = cookie.substr(0, cookie.search("=")); 
        let SESSION_ID = cookie.substr(cookie.search("=") + 1, cookie.length);
        let connected = await userModel.validateUserCredentials(username,SESSION_ID);

        if (connected === true) {
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
                }
            });
        }
        else {
            response.writeHead(403);
            response.end();
        }
    }
}