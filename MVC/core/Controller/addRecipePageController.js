const fs = require('fs');
const user = require('../Model/user.js');
const Tokenizer = require('../../utility/tokenizer.js');
const formidable = require('formidable');
const mv = require('mv');

const userModel = new user();

module.exports = class addRecipePageController {
    static async GET(request, response) {
        //Daca cookie-ul este setat, si este corect, atunci redirectionam userul spre /feedPage.html
        //                         , si este gresit, atunci redirectionam userul userul spre /sign-in-sign-up.html
        //Daca cookie-ul nu este setat, atunci lasam userul sa aleaga ce vrea sa faca.(POST LOGIN/ POST REGISTER)

        let cookie = request.headers.cookie;

        if(cookie != undefined) {
            let username = cookie.substr(0,cookie.search("="));
            let SESSION_ID = cookie.substr(cookie.search("=") + 1,cookie.length);
            let connected = await userModel.validateUserCredentials(username,SESSION_ID);
            if(connected === true) {
                fs.readFile('core/View/addrecipePage.html', (err, buffer) => {
                    const username = cookie.substr(0,cookie.search("="));
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
            fs.stat("core/View/addrecipePage.html", (err, stats) => {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');
                if(stats) {
                    fs.createReadStream("core/View/addrecipePage.html").pipe(response);
                } else {
                    response.statusCode = 404;
                    response.end('Sorry, page not found!');
                }
            }); 
        }
    }

    static async POST(request, response) {
        var form = new formidable.IncomingForm();
        form.maxFields = 999999;
        await form.parse(request, await function(err, fields, files) {
            if(err)
                console.log(err);
            let varr = fields.recipeName;
            console.log(varr);
            var file = files.recipePhoto;
            var oldpath = file.path;
            var newpath = 'E:/Photos/' + file.name;

            mv(oldpath, newpath, function(err) {
                if (err) throw err;
            });
        });
        //console.log("DADA");
        //console.log(request);
        /*
        var body = '';
        request.on('data', chunk => {
            body += chunk;
        }); 
        */
        //request.on('end', async () => { 
          //console.log(body);
         // const blob = new Blob( , { type: 'text/csv' })
          response.statusCode = 200;
          response.end();
        //});
        
    }

}