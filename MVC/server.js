const HTTP = require("http");
const Settings = require("./.env");
const Router = require("./core/Router.js");

const initServer = async () => {
    const server = new HTTP.createServer((req, res) => { 
        console.log("Processing Routes!");
        Router(req,res);
        console.log("No routes yet");
        
    });
    server.listen(Settings.port, Settings.host, () => {
        console.log(`Server running at port ${Settings.port}` );
    });
   
} 

initServer(); //Starting the server