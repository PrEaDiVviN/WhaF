const http = require('http');
const url = require('url');
const User = require('./Model/user');
const fs = require('fs');
const querystring = require('querystring');
const user = require('./Model/user');
const path = require('path');
const landingController = require('./Controller/landingController.js');
const registerLoginController = require('./Controller/registerLoginController.js');
const addRecipeController = require('./Controller/addRecipePageController.js');
const recipePageController = require('./Controller/recipePageController.js');
const adminPageController = require('./Controller/adminPageController.js');
const settingsController = require('./Controller/settingsController.js');
const feedController = require('./Controller/feedPageController.js');
const termsController = require('./Controller/termsController.js');

module.exports = (request, response) => {
        const method = request.method;
        const currentUrl = request.url;
        const searchParameters = currentUrl.searchParams;
        switch (method) {
            case "GET":
                switch (currentUrl) {
                    case "/":
                        landingController(request , response);
                    break; 
                    case "/loginRegister.html":
                        registerLoginController.GET(request,response);
                    break;
                    case "/addrecipePage.html":
                        addRecipeController.GET(request,response);
                    break;
                    case "/settingsPage.html":
                        settingsController.GET(request,response);
                    break;
                    case "/feedPage.html":
                        feedController.GET(request,response);
                    break;
                    case "/termsPolicy.html":
                        termsController.GET(request,response);
                    break;
                    case "/adminPage.html":
                        adminPageController.GET(request,response);
                    break;
                    default: 
                            console.log('---------------------------');
                            console.log(request.url);   
                            console.log('---------------------------');
                            if(request.url.substr(0,7) === '/recipe' && ((request.url.substr(request.url.length - 5) === '.html')
                                ||request.url.includes('.jpg') || request.url.includes('.png') || request.url.includes('.svg'))) {//daca suntem pe recipe
                            
                            if(request.url.substr(request.url.length - 5) === '.html')//daca se termina in .html, atunci trebuie sa trimitem View-ul
                                recipePageController.GET(request,response);
                            else {//altfel trebuie sa trimitem pozele viewului
                                let reqUrl = request.url.replace('%20', ' ').replace('%20', ' ').replace('%20', ' ');
                                var photoPath;
                                if(request.url.includes('?'))
                                photoPath = "data/" + reqUrl.substr(0,reqUrl.indexOf('?'));
                                else
                                    photoPath = "data/" + reqUrl;
                            //TODO, tipuri fotografii  
                            try {
                                response.statusCode = 200;
                                fs.createReadStream(photoPath).pipe(response);
                            }
                            catch(e) {
                                console.log(e);
                                response.statusCode(404);
                                response.end();
                            }
                        }
                    }
                    else if(request.url.substr(0,6) === '/users') {
                        if(request.url.includes('?') == false) {
                            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
                            console.log('AM intrat');
                            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
                            var filePath = 'data/' + request.url.replace('%20',' ').replace('%20',' ').replace('%20',' ');
                            console.log(filePath);
                            try {
                                response.statusCode = 200;
                                fs.createReadStream(filePath).pipe(response);
                            }
                            catch(e) {
                                console.log(e);
                                response.statusCode = 404;
                                response.end();
                            }
                        }
                        else {
                            let reqUrl = request.url.replace('%20', ' ').replace('%20', ' ').replace('%20', ' ');
                            var photoPath;
                            if(request.url.includes('?'))
                                photoPath = "data/" + reqUrl.substr(0,reqUrl.indexOf('?'));
                            try {
                                response.statusCode = 200;
                                fs.createReadStream(photoPath).pipe(response);
                            }
                            catch(e) {
                                console.log(e);
                                response.statusCode = 404;
                                response.end();
                            }
                        }
                    }
                    else if(request.url.substr(request.url.length-4) === '.tfl')     
                        adminPageController.GET_USER_SETTINGS(request, response);
                    else {
                        var splitRoute = request.url.split("/");
                        var file = splitRoute[splitRoute.length-1];
                        console.log("=================================");
                        console.log(file);
                        console.log("=================================");
                        let fileName = path.join(__dirname, "..", "public" , file);
                        if(file.endsWith('.png') || file.endsWith('.jpg'))
                            fileName = path.join(__dirname, "..", "public", 'images' , file);
                        else if(file.endsWith('.css'))  
                            fileName = path.join(__dirname, "..", "public", 'styles' , file);    
                        else if(file.endsWith('.js'))     
                            fileName = path.join(__dirname, "..", "public", 'javascript' , file);    
                        fs.stat(fileName, (err, stats) => {
                            if(err) {
                                response.statusCode = 404;
                                response.end('Sorry, page not found!');
                            } else {
                                if(fileName.toLowerCase().endsWith('.css'))
                                    response.setHeader('Content-Type', 'text/css'); 
                                else if(fileName.toLowerCase().endsWith('.js'))
                                    response.setHeader('Content-Type', 'text/javascript'); 
                                fs.createReadStream(fileName).pipe(response);
                            }
                        });
                    }
                }
                break;
            case "POST":  
                switch(currentUrl) {
                    case "/loginRegister.html":   
                        registerLoginController.POST(request,response);
                    break;
                    case "/addrecipePage.html":
                        addRecipeController.POST(request, response);
                    break;
                    case "/recipePage.html":
                        recipePageController.POST(request,response);
                    break;
                    case "/settingsPage.html":
                        settingsController.POST(request, response);
                    break;
                    case "/feedPage.html":
                        feedController.POST(request, response);
                    break;
                    case "/termsPolicy.html":
                        termsController.POST(request,response);
                    break;
                    case "/recipeSkipAndCount":
                        adminPageController.GET_RECIPES(request,response); 
                    break; 
                    case "/deleteRecipe":
                        adminPageController.DELETE_RECIPE(request, response);
                    break;
                    case "/userSkipAndCount":
                        adminPageController.GET_USERS(request,response);
                    break;
                    default:
                        response.statusCode = 404;
                        response.end();
                }
                break;
                case "DELETE": 
                switch(currentUrl) {
                    case "/deleteRecipe":
                        adminPageController.DELETE_RECIPE(request, response);
                    break;
                    case "/deleteIngredient":
                        adminPageController.DELETE_INGREDIENT(request,response);
                    break;
                    case "/deleteUser":
                        adminPageController.DELETE_USER(request,response); 
                    break;
                    case "/deleteSessionTable":
                        adminPageController.DELETE_SESSION_USER(request,response);
                    break;
                    default:
                        response.statusCode = 404;
                        response.end();
                }
            break; 
            case "PATCH": 
                switch(currentUrl) {
                    case "/modifyRecipe/recipeName":
                        adminPageController.PATCH_RECIPE_NAME(request,response);
                    break;
                    case "/modifyRecipe/recipePhoto":
                        adminPageController.PATCH_RECIPE_PHOTO(request,response);
                    break;
                    case "/modifyRecipe/Time":
                        adminPageController.PATCH_RECIPE_TIME(request, response);
                    break;
                    case "/modifyRecipe/Type":
                        adminPageController.PATCH_RECIPE_TYPE(request, response);
                    break;
                    case "/modifyRecipe/addIngredients":
                        adminPageController.PATCH_RECIPE_INGREDIENTS(request, response);
                    break;
                    case "/modifyRecipe/addInstructions":
                        adminPageController.PATCH_RECIPE_INSTRUCTIONS(request, response);
                    break;
                    case "/modifyUser/userName":
                        adminPageController.PATCH_USERNAME(request,response);
                    break;
                    case "/modifyUser/userPhoto":
                        adminPageController.PATCH_USER_PHOTO(request,response);
                    break;
                    case "/modifyUser/password":
                        adminPageController.PATCH_PASSWORD(request,response);
                    break;
                    case "/modifyUser/Type":
                        adminPageController.PATCH_USER_TYPE(request,response);
                    break;
                    case "/modifyPanelRecipe/nringrediente": 
                        adminPageController.PATCH_NR_INGREDIENTE(request,response);
                    break;
                    case "/modifyPanelRecipe/nrInstructiuni":
                        adminPageController.PATCH_NR_INSTRUCTIUNI(request,response);
                    break;
                    default:
                        response.statusCode = 404;
                        response.end();
                }
            break;
            case "OPTIONS": 
                    const headers = {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                        'Access-Control-Max-Age': 2592000
                    };
                    response.writeHeader(200, headers);
                    response.end();
                break;    
            default: 
                console.log("Not a valid request!");
        }
}