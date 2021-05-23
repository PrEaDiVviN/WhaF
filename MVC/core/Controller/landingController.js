const fs = require('fs');
const user = require('../Model/user.js')

const userModel = new user();

module.exports = (request, response) => {
    //Daca cookie-ul este setat, si este corect, atunci redirectionam userul spre /feedPage.html
    //                         , si este gresit, atunci redirectionam userul spre /sign-in-sign-up.html
    //Daca cookie-ul nu este setat, atunci lasam userul sa aleaga ce vrea sa faca.
    if(request.headers.cookie != undefined) {
        let cookie = request.headers.cookie;
        let username = cookie.substr(0,cookie.search("="));
        let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
        let connected = userModel.validateUserCredentials(username,SESSION_ID);
        if(connected === true) {
            response.writeHead(302, { 'Location': '/feedPage.html'});
            response.end();
        } 
        else {
            response.writeHead(302, { 'Location': '/loginRegister.html'});
            response.end();
        }
    }
    else {
        fs.stat("core/View/landingPage.html", (err, stats) => {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/html');
            if(stats) {
                fs.createReadStream("core/View/landingPage.html").pipe(response);
            } else if(err) {
                response.statusCode = 404;
                response.end('Sorry, page not found!');
            }
        }); 
    }
};