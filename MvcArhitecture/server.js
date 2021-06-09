const HTTP = require("http");
const Settings = require("./.env");
const Router = require("./core/Router.js");

const initServer = async () => {
    const server = new HTTP.createServer((req, res) => { 
        try {
            Router(req,res);
        }
        catch(e) {
            console.log(e);
        }
    });
    server.listen(Settings.port, Settings.host, () => {
        console.log(`Server running at port ${Settings.port}` );
    });
   
} 

initServer(); //Starting the server
