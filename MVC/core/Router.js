const http = require('http');
const url = require('url');
const User = require('./Model/user');
const fs = require('fs');
const querystring = require('querystring');
const user = require('./Model/user');
const path = require('path');
const landingController = require('./Controller/landingController.js');
const registerLoginController = require('./Controller/registerLoginController.js');
const addRecipeController = require('./Controller/addRecipePageController.js')

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
                    case "/feedPage.html":
                        fs.stat("core/View/feedPage.html", (err, stats) => {
                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'text/html');
                              if(stats) {
                                  fs.createReadStream("core/View/feedPage.html").pipe(response);
                              } else {
                                  response.statusCode = 404;
                                  response.end('Sorry, page not found!');
                              }
                          }); 
                    break;
                    case "/recipePage.html":
                        fs.stat("core/View/recipePage.html", (err, stats) => {
                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'text/html');
                              if(stats) {
                                  fs.createReadStream("core/View/recipePage.html").pipe(response);
                              } else {
                                  response.statusCode = 404;
                                  response.end('Sorry, page not found!');
                              }
                          }); 
                    break;
                    case "/termsPolicy.html":
                        fs.stat("core/View/termsPolicy.html", (err, stats) => {
                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'text/html');
                              if(stats) {
                                  fs.createReadStream("core/View/termsPolicy.html").pipe(response);
                              } else {
                                  response.statusCode = 404;
                                  response.end('Sorry, page not found!');
                              }
                          }); 
                    break;
                    case "/settingsPage.html":
                        fs.stat("core/View/settingsPage.html", (err, stats) => {
                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'text/html');
                              if(stats) {
                                  fs.createReadStream("core/View/settingsPage.html").pipe(response);
                              } else {
                                  response.statusCode = 404;
                                  response.end('Sorry, page not found!');
                              }
                          }); 
                    break;      
                    case "/loginRegister.html":
                        registerLoginController.GET(request,response);
                    break;
                    case "/addrecipePage.html":
                        addRecipeController.GET(request,response);
                    break;
                    default:    
                    let fileName = path.join(__dirname, "..", "public" , request.url);
                    if(request.url.endsWith('.png') || request.url.endsWith('.jpg'))
                        fileName = path.join(__dirname, "..", "public", 'images' , request.url);
                    else if(request.url.endsWith('.css'))  
                        fileName = path.join(__dirname, "..", "public", 'styles' , request.url);    
                    else if(request.url.endsWith('.js'))     
                        fileName = path.join(__dirname, "..", "public", 'javascript' , request.url);    
                    console.log(request.url);
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
                break;
            case "POST":  
                switch(currentUrl) {
                    case "/loginRegister.html":   
                        registerLoginController.POST(request,response);
                    break;
                    case "/addrecipePage.html":
                        addRecipeController.POST(request, response);
                    break;
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
// module.exports.Router = Router;

function getPhoto(response, path) {
   fs.readFile(path, function(err, data) {
      if (err) throw err;
      response.writeHead(200, {'Content-Type': 'image/png'});
      response.end(data); 
    });
}

function getCSS(response, path) {
   fs.readFile(path, function(err, data) {
      if (err) throw err;
      response.writeHead(200, {'Content-Type': 'text/css'});
      response.end(data); 
    });
}

function getJS(response, path) {
   fs.readFile(path, function(err, data) {
      if (err) throw err;
      response.writeHead(200, {'Content-Type': 'text/javascript'});
      response.end(data); 
    });
}

function getFormDataLogin(request,response) {
 
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    const JSON_URL = 'application/json';
    var body = '';
 
    if (request.headers['content-type'] === FORM_URLENCODED) {
            request.on('data', chunk => {
            body += chunk;
        }); 
    
        request.on('end', () => {
            //folosim querystring.parse() pentru a le separa
            var username = querystring.parse(body).username;
            var password = querystring.parse(body).password;
            console.log(username);
            user = new User();
            user.verifyUserCredentials(username,password, response);

    });
    
    }
    else if(request.headers['content-type'] === JSON_URL) {
        request.on('data', chunk => {
            body += chunk;
        }); 
        request.on('end', () => {
            
            //folosim querystring.parse() pentru a le separa
            var username = JSON.parse(body).username;
            var password = JSON.parse(body).password;
            console.log(username);
            console.log(password);
            console.log('############################################################################');
            ruser = new User();
            ruser.verifyUserCredentials(username,password, response);

        });
    }
}