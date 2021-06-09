const fs = require('fs');
const user = require('../Model/user.js');
const Tokenizer = require('../../utility/tokenizer.js');

const userModel = new user();

module.exports = class registerLoginController {
    static async GET(request, response) {
        //Daca cookie-ul este setat, si este corect, atunci redirectionam userul spre /feedPage.html
        //                         , si este gresit, atunci redirectionam userul userul spre /sign-in-sign-up.html
        //Daca cookie-ul nu este setat, atunci lasam userul sa aleaga ce vrea sa faca.(POST LOGIN/ POST REGISTER)

        let cookie = request.headers.cookie;

        if(cookie != undefined) {
            let username = cookie.substr(0,cookie.search("="));
            let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
            console.log(SESSION_ID);
            let connected = await userModel.validateUserCredentials(username,SESSION_ID);
            if(connected === true) {
                response.writeHead(302, { 'Location': '/feedPage.html'});
                response.end();
            } 
            else {
                fs.stat("core/View/sign-in-sign-up.html", (err, stats) => {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'text/html');
                    if(stats) {
                        fs.createReadStream("core/View/sign-in-sign-up.html").pipe(response);
                    } else {
                        response.statusCode = 404;
                        response.end('Sorry, page not found!');
                    }
                }); 
            }
        } 
        else {
            fs.stat("core/View/sign-in-sign-up.html", (err, stats) => {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');
                if(stats) {
                    fs.createReadStream("core/View/sign-in-sign-up.html").pipe(response);
                } else {
                    response.statusCode = 404;
                    response.end('Sorry, page not found!');
                }
            }); 
        }
    }

    static POST(request, response) {
        //Obtinem informatiile introduse de catre user, daca sunt valide, atunci setam un cookie si il redirectionam catre feedPage
        //                                            , daca nu sunt valide, atunci atentionam userul ca informatiile introduse nu sunt valide 
        //printr-un alert.  
        var body = '';
        request.on('data', chunk => {
            body += chunk;
        }); 
        request.on('end', async () => { 
            if(JSON.parse(body).type === 'Login') {
                var username = JSON.parse(body).username;
                var password = JSON.parse(body).password;
                var answer = await userModel.validateUserLogin(username,password);
                if(answer === null) {
                    response.statusCode = 500;
                    response.end('Internal Server Error! Please try again and if problem persists, contact the administrator!');
                }
                else if(answer === true) {
                    try {
                        var infoUser = await userModel.getSessionAndTime(username);
                        response.statusCode = 200;
                        response.setHeader('Set-Cookie', username + '=' + infoUser.sessionid + '; path=/; Expires=' + infoUser.connectionTime.toUTCString() + ';');
                        console.log(username + '=' + infoUser.sessionid + '; path=/; expires=' + infoUser.connectionTime.toUTCString() + ';')
                        response.end();   
                    }
                    catch(e) {
                        console.log(e);
                        response.statusCode = 500;
                        response.end();
                    }  
                }
                else {
                    response.statusCode = 403;
                    response.end();
                }
            }
            else if(JSON.parse(body).type === 'Register') {
                var firstName = JSON.parse(body).firstName;
                var lastName = JSON.parse(body).lastName;
                var email = JSON.parse(body).email;
                var username = JSON.parse(body).username;
                var password = JSON.parse(body).password;
                var birthDate = JSON.parse(body).birthDate; 


                var answer = await userModel.insertUserIntoDatabase(firstName,lastName,email,username,password,birthDate); 
                if(answer === null) {
                    response.statusCode = 500;
                    response.end('Internal Server Error! Please try again and if problem persists, contact the administrator!');
                }
                else if(answer === true) {
                    var pathRecipe = "data/users/" + username;
                    if (!fs.existsSync(pathRecipe)){
                        fs.mkdirSync(pathRecipe);
                    }

                    response.statusCode = 201;
                    response.end();        
                }
                else {
                    response.statusCode = 409;
                    response.end();
                }
            }
        });
        
    }

}