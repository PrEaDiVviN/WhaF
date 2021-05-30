const fs = require('fs');
const user = require('../Model/user.js');
const Tokenizer = require('../../utility/tokenizer.js');
const formidable = require('formidable');
const mv = require('mv');

const userModel = new user();

module.exports = class settingsController {
    static async GET(request, response) {
        //Daca cookie-ul este setat, si este corect, atunci permitem userului sa acceseze pagina
        //                         , si este gresit, atunci redirectionam userul userul spre /loginRegister.html
        //Daca cookie-ul nu este setat, atunci redirectionam userul userul spre /loginRegister.html
        let cookie = request.headers.cookie;

        if (cookie != undefined) {
            let username = cookie.substr(0, cookie.search("="));
            let SESSION_ID = cookie.substr(cookie.search("=") + 1, cookie.length);
            let connected = await userModel.validateUserCredentials(username, SESSION_ID);

            if (connected === true) {
                fs.readFile('core/View/settingsPage.html', (err, buffer) => {
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
                            response.statusCode = 302;
                            response.end(); 
                        } catch(e) {
                            console.log(e);
                            response.statusCode = 500;
                            response.end();
                        }  
                    }
                    else if (fields.type === 'Settings') {
                        //obtinem toate informatiile din FormData(fields)
                        var firstname = fields.firstname;
                        var lastname = fields.lastname;
                        var username1 = fields.username;
                        var password = fields.password;
                        var email = fields.email;
                        var birthdate = fields.birthdate;

                        //obtinem toate pozele din FormData(files)
                        var avatar = files.avatar;
                        
                        //obtinem id-ul userului
                        var userID = await userModel.getUserIdByUsername(username);
                        var allGood = false;
                        var firstUsername = username;
                        var usernameC = false;

                        if (userID == null) {
                            console.log(err); 
                            response.statusCode = 500;
                            response.end('Internal server error!');
                            return ;
                        }
                        else if (firstname != "") {
                            var validateF = await userModel.validateName(firstname);

                            if (validateF === false) {
                                response.statusCode = 203;
                                response.end();
                            }
                            else {
                                var raspuns = await userModel.updateFname(firstname, userID);

                                if (raspuns == null) {
                                    response.statusCode = 500;
                                    response.end('Unknown error');
                                    return ;
                                }
                                else {
                                    allGood = true;
                                }
                            }
                        }
                        else if (lastname != "") {
                            var validateL = await userModel.validateName(lastname);

                            if (validateL === false) {
                                response.statusCode = 203;
                                response.end();
                            }
                            else {
                                var raspuns1 = await userModel.updateLname(lastname, userID);

                                if (raspuns1 == null) {
                                    response.statusCode = 500;
                                    response.end('Unknown error');
                                    return ;
                                }
                                else {
                                    allGood = true;
                                }
                            }
                        }
                        else if (username1 != "") {
                            var usExists = await userModel.usernameExists(username1);

                            if (usExists === true) {
                                response.statusCode = 204;
                                response.end();
                            }
                            else {
                                var usFormat = await userModel.usernameFormat(username1);

                                if (usFormat === false) {
                                    response.statusCode = 205;
                                    response.end();
                                }
                                else 
                                    usernameC = true;
                            }
                        }
                        else if (password != "") {
                            var validateP = await userModel.validateRegisterPassword(password);

                            if (validateP === false) {
                                response.statusCode = 206;
                                response.end();
                            }
                            else {
                                var raspuns3 = await userModel.updatePassword(password, userID);

                                if (raspuns3 == null) {
                                    response.statusCode = 500;
                                    response.end('Unknown error');
                                    return ;
                                }
                                else {
                                    allGood = true;
                                }
                            }
                        }
                        else if (email != "") {
                            var mailExists = await userModel.emailExists(email);

                            if (mailExists === true) {
                                response.statusCode = 207;
                                response.end();
                            }
                            else {
                                var mailFormat = await userModel.emailFormat(email);

                                if (mailFormat === false) {
                                    response.statusCode = 208;
                                    response.end();
                                }
                                else {
                                    var raspuns4 = await userModel.updateEmail(email, userID);

                                    if (raspuns4 == null) {
                                        response.statusCode = 500;
                                        response.end('Unknown error');
                                        return ;
                                    }
                                    else {
                                        allGood = true;
                                    }
                                }
                            }
                        }
                        else if (birthdate != undefined && birthdate != "") {
                            var raspuns5 = await userModel.updateBirthday(birthdate, userID);

                            if (raspuns5 == null) {
                                response.statusCode = 500;
                                response.end('Unknown error');
                                return ;
                            }
                            else {
                                allGood = true;
                            }
                        }
                        else if (avatar != undefined) {
                            //verificam ca userul a trimis poze si nu alte lucruri
                            if (avatar.type != 'image/jpeg' && avatar.type != 'image/png' && avatar.type != 'image/svg+xml') {
                                response.statusCode = 701;
                                response.end();
                                return ;
                            }
                            else {
                                //tipul pozei
                                var type;

                                if (avatar.type == 'image/jpeg') 
                                    type = 'jpg';
                                else if (avatar.type == 'image/png') 
                                    type = 'png';
                                else if (avatar.type == 'image/svg+xml') 
                                    type ='svg';

                                //cream un folder cu numele utilizatorului in data de forma data/users/username
                                var pathUser = "data/users/" + firstUsername;
                                if (!fs.existsSync(pathUser)) {
                                    fs.mkdir(pathUser, {recursive: true}, err => {});
                                }

                                //obtinem calea catre poza userului
                                let newPath = 'data/users/' + firstUsername + '/' + 'avatar.' + type;
                
                                //luam poza de unde este salvata local
                                let oldPath = files.avatar.path;
                
                                //mutam fisierul in folderul userului
                                mv(oldPath, newPath, function(err) {
                                    if (err) {
                                        console.log(err); 
                                        response.statusCode = 500;
                                        response.end('Internal server error!');
                                        return ;
                                    }
                                });

                                var raspuns6 = await userModel.updatePhoto(newPath, userID);

                                if (raspuns6 == null) {
                                    response.statusCode = 500;
                                    response.end('Unknown error');
                                    return ;
                                }
                                else {
                                    allGood = true;
                                }
                            }
                        }

                        if (usernameC === true) {
                            //scapam de cookie-ul curent
                            try {
                                var infoUser = await userModel.logout(username);
        
                                response.setHeader('Set-Cookie', username + '=' + infoUser.sessionid + '; path=/; Expires=' + infoUser.connectionTime.toUTCString() + ';');
                                console.log(username + '=' + infoUser.sessionid + '; path=/; expires=' + infoUser.connectionTime.toUTCString() + ';');
                                    
                                //actualizam username-ul
                                var raspuns2 = await userModel.updateUsername(username1, userID);

                                if (raspuns2 == null) {
                                    response.statusCode = 500;
                                    response.end('Unknown error');
                                    return ;
                                }
                                else {
                                    try {
                                        var deleteSess = await userModel.deleteSession(userID);

                                        if (deleteSess == null) {
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                        else {
                                            response.statusCode = 200;
                                            response.end();
                                        }
                                    } catch(e1) {
                                        console.log(e1);
                                        response.statusCode = 500;
                                        response.end();
                                    }
                                }
                            } catch(e) {
                                console.log(e);
                                response.statusCode = 500;
                                response.end();
                            } 
                        } 
                        else if (allGood === true) {
                            response.statusCode = 201;
                            response.end();
                        }
                    }
                    else if (fields.type === 'Delete') {
                        //logout user 
                        try {
                            var info = await userModel.logout(username);

                            response.setHeader('Set-Cookie', username + '=' + info.sessionid + '; path=/; Expires=' + info.connectionTime.toUTCString() + ';');
                            console.log(username + '=' + info.sessionid + '; path=/; expires=' + info.connectionTime.toUTCString() + ';')
                            
                            //obtinem id-ul userului
                            var userID = await userModel.getUserIdByUsername(username);

                            if (userID == null) {
                                console.log(err); 
                                response.statusCode = 500;
                                response.end();
                                return ;
                            }
                            else {
                                //stergem userul din baza de date
                                try {
                                    var deleteUs = await userModel.deleteUser(userID);

                                    if (deleteUs == null) {
                                        response.statusCode = 500;
                                        response.end();
                                    }
                                    else {
                                        //stergem sesiunea corespunzatoare userului din baza de date
                                        try {
                                            var deleteSess = await userModel.deleteSession(userID);
            
                                            if (deleteSess == null) {
                                                response.statusCode = 500;
                                                response.end();
                                            }
                                            else {
                                                response.statusCode = 200;
                                                response.end();
                                            }
                                        } catch(e2) {
                                            console.log(e2);
                                            response.statusCode = 500;
                                            response.end();
                                        }
                                    }
                                } catch(e1) {
                                    console.log(e1);
                                    response.statusCode = 500;
                                    response.end();
                                }
                            }
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