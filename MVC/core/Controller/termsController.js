const fs = require('fs');
const user = require('../Model/user.js');
const recipe = require('../Model/recipe.js');
const Tokenizer = require('../../utility/tokenizer.js');
const formidable = require('formidable');
const mv = require('mv');

const userModel = new user();

module.exports = class settingsController {
    static async GET(request, response) {
        //Daca cookie-ul este setat, si este corect, atunci permitem userului sa acceseze pagina
        //                         , si este gresit, atunci redirectionam userul userul spre /loginRegister.html
        //Daca cookie-ul nu este setat, atunci nu afisam username-ul, avatarul si butonul de logout
        let cookie = request.headers.cookie;

        if (cookie != undefined) {
            let username = cookie.substr(0, cookie.search("="));
            let SESSION_ID = cookie.substr(cookie.search("=") + 1, cookie.length);
            let connected = await userModel.validateUserCredentials(username, SESSION_ID);
            let avatar = '<img src = "/avatar-picture.png" alt = "Avatar">';
            let logout = '<button class = "my-page" onclick = "logout()"> Logout </button>';

            if (connected === true) {
                fs.readFile('core/View/termsPolicy.html', (err, buffer) => {
                    const username = cookie.substr(0, cookie.search("="));
                    const avatar = '<img src = "/avatar-picture.png" alt = "Avatar">';
                    const logout = '<button class = "home" onclick = "logout()"> Logout </button>';
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
            fs.readFile('core/View/termsPolicy', (err, buffer) => {
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