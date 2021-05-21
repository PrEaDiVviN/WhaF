const http = require('http');
const fs = require('fs');
const { Pool } = require('pg');
const querystring = require('querystring');
const alert = require('alert');
const fetch = require('node-fetch');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(routing);

function routing(req, res) {
   let htmlFile = '';
	switch(req.url) {
		case '/':
			htmlFile = './Landing_Page/landing_page.html';
			break;
      case '/animation.css':
         getCSS(res, './Landing_Page/animation.css');
         break;
      case '/footer.css':
         getCSS(res, './Landing_Page/footer.css');
         break;
      case '/landing_page_PhoneView.css':
         getCSS(res, './Landing_Page/landing_page_PhoneView.css');
         break;
      case '/Other-Photos/burger.png':
         getPhoto(res, './Other-Photos/burger.png');
         break;

      case '/login-register':
         htmlFile = './Sign-In-Sign-Up-Page/sign-in-sign-up.html';
         break;
      case '/sign-in-sign-up.css':
         getCSS(res, './Sign-In-Sign-Up-Page/sign-in-sign-up.css');
         break;
      case '/Logo/Logo-final.png':
         getPhoto(res, './Logo/Logo-final.png');
         break;
      case '/Other-Photos/Recipes.jpg':
         getPhoto(res, './Other-Photos/Recipes.jpg');
         break;
      case '/sign-in-sign-up.js':
         getJS(res, './Sign-In-Sign-Up-Page/sign-in-sign-up.js');
         break;

      case '/home':
         htmlFile = './Home-Page/home-page.html';
         break;
      case '/home-page.css':
         getCSS(res, './Home-Page/home-page.css');
         break;
      case '/Logo/Logo-final1.png':
         getPhoto(res, './Logo/Logo-final1.png');
         break;
      case '/Other-Photos/Recipe15.jpg':
         getPhoto(res, './Other-Photos/Recipe15.jpg');
         break;
      case '/Other-Photos/Recipe14.jpg':
         getPhoto(res, './Other-Photos/Recipe14.jpg');
         break;
      case '/Other-Photos/Recipe13.jpg':
         getPhoto(res, './Other-Photos/Recipe13.jpg');
         break;
      case '/Other-Photos/Recipe20.jpg':
         getPhoto(res, './Other-Photos/Recipe20.jpg');
         break;
      case '/Other-Photos/Recipe21.jpg':
         getPhoto(res, './Other-Photos/Recipe21.jpg');
         break;
      case '/Other-Photos/Recipe22.jpg':
         getPhoto(res, './Other-Photos/Recipe22.jpg');
         break;
      case '/Other-Photos/Recipe12.jpg':
         getPhoto(res, './Other-Photos/Recipe12.jpg');
         break;
      case '/Other-Photos/Recipe11.jpg':
         getPhoto(res, './Other-Photos/Recipe11.jpg');
         break;
      case '/Other-Photos/Recipe10.jpg':
         getPhoto(res, './Other-Photos/Recipe10.jpg');
         break;
      case '/Other-Photos/Recipe17.jpg':
         getPhoto(res, './Other-Photos/Recipe17.jpg');
         break;
      case '/Other-Photos/Recipe18.jpg':
         getPhoto(res, './Other-Photos/Recipe18.jpg');
         break;
      case '/Other-Photos/Recipe19.jpg':
         getPhoto(res, './Other-Photos/Recipe19.jpg');
         break;
      case '/Other-Photos/Recipe1.jpg':
         getPhoto(res, './Other-Photos/Recipe1.jpg');
         break;
      case '/Other-Photos/Recipe2.jpg':
         getPhoto(res, './Other-Photos/Recipe2.jpg');
         break;
      case '/Other-Photos/Recipe3.jpg':
         getPhoto(res, './Other-Photos/Recipe3.jpg');
         break;
      case '/Other-Photos/Recipe4.jpg':
         getPhoto(res, './Other-Photos/Recipe4.jpg');
         break;
      case '/Other-Photos/Recipe5.jpg':
         getPhoto(res, './Other-Photos/Recipe5.jpg');
         break;
      case '/Other-Photos/Recipe6.jpg':
         getPhoto(res, './Other-Photos/Recipe6.jpg');
         break;
      case '/Other-Photos/Recipe7.jpg':
         getPhoto(res, './Other-Photos/Recipe7.jpg');
         break;
      case '/Other-Photos/Recipe8.jpg':
         getPhoto(res, './Other-Photos/Recipe8.jpg');
         break;
      case '/Other-Photos/Recipe9.jpg':
         getPhoto(res, './Other-Photos/Recipe9.jpg');
         break;
      case '/Other-Photos/Recipe10.jpg':
         getPhoto(res, './Other-Photos/Recipe10.jpg');
         break;
      case '/home-page.js':
         getJS(res, './Home-Page/home-page.js');
         break; 

      case '/my-account': 
         htmlFile = './MyAccountPage/myaccountPage.html';
         break;
      case '/footer.css':
         getCSS(res, './MyAccountPage/footer.css');
         break;
      case '/navbar.css':
         getCSS(res, './MyAccountPage/navbar.css');
         break;
      case '/myaccountPage.css':
         getCSS(res, './MyAccountPage/myaccountPage.css');
         break;
      case '/myaccountPageResponsive.css':
         getCSS(res, './MyAccountPage/myaccountPageResponsive.css');
         break;
      case '/logo3.png':
         getPhoto(res, './MyAccountPage/logo3.png');
         break; 
      case '/hamburger.jpg':
         getPhoto(res, './MyAccountPage/hamburger.jpg');
         break; 
      case '/Recipe1.jpg':
         getPhoto(res, './MyAccountPage/Recipe1.jpg');
         break; 
      case '/Recipe2.jpg':
         getPhoto(res, './MyAccountPage/Recipe2.jpg');
         break;
      case '/Recipe3.jpg':
         getPhoto(res, './MyAccountPage/Recipe3.jpg');
         break;  
      case '/Recipe4.jpg':
         getPhoto(res, './MyAccountPage/Recipe4.jpg');
         break; 
      case '/Recipe5.jpg':
         getPhoto(res, './MyAccountPage/Recipe5.jpg');
         break; 
      case '/Recipe6.jpg':
         getPhoto(res, './MyAccountPage/Recipe6.jpg');
         break; 
      case '/Recipe7.jpg':
         getPhoto(res, './MyAccountPage/Recipe7.jpg');
         break; 
      case '/Recipe8.jpg':
         getPhoto(res, './MyAccountPage/Recipe8.jpg');
         break; 
      case '/Recipe9.jpg':
         getPhoto(res, './MyAccountPage/Recipe9.jpg');
         break; 
      case '/user.png':
         getPhoto(res, './MyAccountPage/user.png');
         break; 
      case '/buttons.js':
         getJS(res, './MyAccountPage/buttons.js');
         break;

      case '/recipe-page': 
         htmlFile = './RecipePage/recipe.html';
         break;
      case '/recipe.css':
         getCSS(res, './RecipePage/recipe.css');
         break;
      case '/footer.css':
         getCSS(res, './RecipePage/footer.css');
         break;
      case '/navbar.css':
         getCSS(res, './RecipePage/navbar.css');
         break;
      case '/receipepagePhone.css':
         getCSS(res, './RecipePage/receipepagePhone.css');
         break;
      case '/logo3.png':
         getPhoto(res, './RecipePage/logo3.png');
         break;
      case '/Recipe4.jpg':
         getPhoto(res, './RecipePage/Recipe4.jpg');
         break;
      case '/circle.png':
         getPhoto(res, './RecipePage/circle.png');
         break; 
      case '/rulada-tiramisu-1.jpg':
         getPhoto(res, './RecipePage/rulada-tiramisu-1.jpg');
         break;
      case '/rulada-tiramisu-2.jpg':
         getPhoto(res, './RecipePage/rulada-tiramisu-2.jpg');
         break;
      case '/rulada-tiramisu-3.jpg':
         getPhoto(res, './RecipePage/rulada-tiramisu-3.jpg');
         break;
      case '/rulada-tiramisu-4.jpg':
         getPhoto(res, './RecipePage/rulada-tiramisu-4.jpg');
         break;
      case '/rulada-tiramisu-5.jpg':
         getPhoto(res, './RecipePage/rulada-tiramisu-5.jpg');
         break;

      case '/add-recipe':
         htmlFile = './AddRecipePage/addrecipePage.html';
         break;
      case '/footer.css':
         getCSS(res, './AddRecipePage/footer.css');
         break;
      case '/navbar.css':
         getCSS(res, './AddRecipePage/navbar.css');
         break;
      case '/addrecipePage.css':
         getCSS(res, './AddRecipePage/addrecipePage.css');
         break;
      case '/addrecipePageResponsiveView.css':
         getCSS(res, './AddRecipePage/addrecipePageResponsiveView.css');
         break;
      case '/logo3.png':
         getPhoto(res, './AddRecipePage/logo3.png');
         break;
      case '/user.png':
         getPhoto(res, './AddRecipePage/user.png');
         break;

      case '/terms-policy': 
         htmlFile = './Terms-Policy-Page/terms-and-policy.html';
         break;
      case '/Logo/Logo-final2.png':
         getPhoto(res, './Logo/Logo-final2.png');
         break;
      case '/Other-Photos/avatar-picture.png':
         getPhoto(res, './Other-Photos/avatar-picture.png');
         break;
      case '/terms-and-policy.css':
         getCSS(res, './Terms-Policy-Page/terms-and-policy.css');
         break;
      case '/terms-and-policy.js':
         getJS(res, './Terms-Policy-Page/terms-and-policy.js');
         break;

		default:
			break;
	}

	if (htmlFile)
      getHTML(res, htmlFile);

   if (req.method === 'POST') {
      getFormData(req, res);
   }
}

function getHTML(res, htmlFile) {
  	fs.stat(`./${htmlFile}`, (err, stats) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html');
  		if(stats) {
		  	fs.createReadStream(htmlFile).pipe(res);
  		} else {
  			res.statusCode = 404;
  			res.end('Sorry, page not found!');
  		}
  	});
}

function getPhoto(res, path) {
   fs.readFile(path, function(err, data) {
      if (err) throw err;
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.end(data); 
    });
}

function getCSS(res, path) {
   fs.readFile(path, function(err, data) {
      if (err) throw err;
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.end(data); 
    });
}

function getJS(res, path) {
   fs.readFile(path, function(err, data) {
      if (err) throw err;
      res.writeHead(200, {'Content-Type': 'text/javascript'});
      res.end(data); 
    });
}

function getFormData(req, res) {
   const FORM_URLENCODED = 'application/x-www-form-urlencoded';
   var body = '';

   if (req.headers['content-type'] === FORM_URLENCODED) {
      req.on('data', chunk => {
         body += chunk;
      }); 

      req.on('end', () => {
         //body = 'fname=123&lname=1234...'
         //folosim querystring.parse() pentru a le separa
         var fName = querystring.parse(body).fName;
         var lName = querystring.parse(body).lName;
         var mail = querystring.parse(body).mail;
         var UserName = querystring.parse(body).UserName;
         var Password = querystring.parse(body).Password;
         var passw = querystring.parse(body).passw;
         var data = querystring.parse(body).data;
         var photo = null;

         const values = [fName, lName, mail, UserName, Password, data, photo];

         if (passw === Password) {

         //database connection
         const pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'proiectTW',
            password: 'proiect',
            port: 5432,
            idleTimeoutMillis: 0,
            connectionTimeoutMillis: 0,
         });

         pool.connect( (err) => {
            if (err) 
               console.log(err);
         });

         let pgQuery = 'INSERT INTO public.user (first_name, last_name, email, username, user_passwd, birth, photo) VALUES ($1, $2, $3, $4, $5, $6, $7)'

         pool.query(pgQuery, values, (err, rez) => {
            if (err) {
               console.log(err);
            }
          
            if (rez) {
              console.log('Inserted values successfully.');
            }
         });

         pool.end();
        // req.url = '/home';
         //routing(req.url, res);
         //res.writeHead(302, {'Location': '/home.html'});
      }
      else {
         alert("Passwords do not coincide. Please try again.");
      }
      });
  }
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});