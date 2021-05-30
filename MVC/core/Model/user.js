const { Client } = require('pg');
const Tokenizer = require('../../utility/tokenizer.js');
const fs = require('fs');
const { request } = require('http');

//database connection
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'proiectTW',
    password: 'proiect',
    port: 5432,
});

client.connect();
 
module.exports = class user {
    async insertUserIntoDatabase(firstName, lastName, email, username, password, birthDate) {
        let pgQuery = 'INSERT INTO public.user (first_name, last_name, email, username, user_passwd, birth) VALUES ($1, $2, $3, $4, $5, $6);';
        let values = [firstName, lastName, email, username, password, birthDate];
        try {
          let result = await client.query(pgQuery, values); 
          console.log("@SEE");
          console.log(result);

          if (result != null) {
            console.log('*****DONE*****');
            return Promise.resolve(true);
          }

          console.log('returning null');
          return Promise.resolve(null);
        } catch(ex) {
          console.log(err);
          return Promise.resolve(false);
        };
    } 

    async validateUserCredentials(username, SSID) {
      let pgQuery = { 
        name: 'Getusername_DB',
        text: 'SELECT username FROM public.user WHERE public.user.username = $1',
        values: [username],  
      };

      let pgQuery2 = {
        name: 'GetsessionID_DB',
        text: 'SELECT sessionid FROM public.user JOIN public.session ON public.user.user_id = public.session.user_id WHERE public.user.username = $1;',
        values: [username],
      }

      try {
        let answer = await client.query(pgQuery); 

        if (answer.rows && answer.rows.length > 0) {
          try {
            let answer2 = await client.query(pgQuery2);

            if (answer2.rows && answer2.rows.length > 0) {  
              if (answer2.rows[0].sessionid === SSID)
                return Promise.resolve(true);
              else 
                return Promise.resolve(false);  
            }
            else {
              return Promise.resolve(false);
            } 
          } catch(e2) {
            console.log(e2);
            return Promise.resolve(false);
          }
        }
      } catch(e1) {
        console.log(e1);
        return Promise.resolve(false);
      } 

      return Promise.resolve(false);
    }

    async validateUserLogin(username, password) {
      let pgQuery = { 
        name: 'GetUserCredentials',
        text: 'SELECT username, user_passwd FROM public.user WHERE public.user.username = $1',
        values: [username],  
      };

      try {
        let result = await client.query(pgQuery);
        if (result.rows[0].user_passwd === password){
          return true;
        }

        return false;
      } catch(err) {
        console.log(err);
        return null;
      }
    }

    async validateUserRegister(password, confirm) {
      if (password === confirm) {
        return true;
      }
      else {
        return false;
      }
    }

    async validateRegisterPassword(password) {
      var i, lg = password.length;
      var char = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
      var number = "0123456789";
      var special = "_-~<>";
      var c = 0, n = 0, s = 0;

      if (lg < 7) {
        return false;
      }

      for (i = 0; i < lg; i++) {
        if (char.includes(password[i]) && c === 0) {
          c = 1;
        }

        if (number.includes(password[i]) && n === 0) {
          n = 1;
        }

        if (special.includes(password[i]) && s === 0) {
          s = 1;
        }
      }

      if (c === 1 && n === 1 && s ===1) {
        return true;
      }
      else {
        return false;
      }
    }

    async emailExists(email) {
      let pgQuery = { 
        name: 'EmailExists',
        text: 'SELECT email FROM public.user',
      };

      try {
        let result = await client.query(pgQuery);
        var lg = result.rows.length, i;

        for (i = 0; i < lg; i++) {
          if (result.rows[i].email === email) {
            return true;
          }
        }

        return false;
      } catch(err) {
        console.log(err);
        return null;
      }
    }

    async usernameExists(username) {
      let pgQuery = { 
        name: 'UsernameExists',
        text: 'SELECT username FROM public.user',
      };

      try {
        let result = await client.query(pgQuery);
        var lg = result.rows.length, i;

        for (i = 0; i < lg; i++) {
          if (result.rows[i].username === username) {
            return true;
          }
        }

        return false;
      } catch(err) {
        console.log(err);
        return null;
      }
    }

    async usernameFormat(username) {
      var i, lg = username.length;
      var char = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";

      if (lg < 8) {
        return false;
      }

      for (i = 0; i < lg; i++) {
        if (!char.includes(username[i])) {
          return false;
        }
      }

      return true;
    }

    async emailFormat(email) {
      var s1 = email.split("@");

      if (s1[1] == null) {
        return false;
      }
      else {
        var s2 = s1[1].split(".");

        if (s2[1] == null) {
          return false;
        }
        else {
          if (s2[1] != "com") {
            return false;
          }
          else
            return true;
        }
      }
    }

    async firstLastName(firstName, lastName) {
      var lgF = firstName.length, lgL = lastName.length;
      var char = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
      var i;

      for (i = 0; i < lgF; i++) {
        if (!char.includes(firstName[i])) {
          return false;
        }
      }

      for (i = 0; i < lgL; i++) {
        if (!char.includes(lastName[i])) {
          return false;
        }
      }

      return true;
    }

    async validateName(name) {
      var lg = name.length;
      var char = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
      var i;

      for (i = 0; i < lg; i++) {
        if (!char.includes(name[i])) {
          return false;
        }
      }

      return true;
    }

    async getSessionAndTime(username) {
        let pgQuery = { 
          name: 'GetUserLoginDetails',
          text: 'SELECT user_id, first_name, last_name FROM public.user WHERE public.user.username = $1',
          values: [username],  
        };

        try {
          let answerIDFNLN = await client.query(pgQuery);
          console.log(answerIDFNLN);

          let userID = answerIDFNLN .rows[0].user_id;
          let firstName = answerIDFNLN .rows[0].first_name;
          let lastName = answerIDFNLN .rows[0].last_name;

          let pgQuery2 = {
            name: 'GetUserSessionTime',
            text: 'SELECT connection_Time, sessionid FROM public.user JOIN public.session ON public.user.user_id = public.session.user_id WHERE public.user.user_id = $1;',
            values: [userID],
          };

          try { 
            let answerCONNT = await client.query(pgQuery2);
            if (answerCONNT.rows && answerCONNT.rows.length > 0) {
              //update connection time
              var cookieTime = new Date();
              cookieTime.setMinutes(cookieTime.getMinutes() + 30);

              let pgQuery4 = {
                name: 'UpdateSessionTime',
                text: 'UPDATE public.session SET connection_time = $1 WHERE user_id = $2;',
                values: [cookieTime, userID],
              };

              await client.query(pgQuery4); 

              return Promise.resolve({sessionid: answerCONNT.rows[0].sessionid, connectionTime: cookieTime});
            }
            else {
              var cookieTime = new Date();
              cookieTime.setMinutes(cookieTime.getMinutes() + 30);
              var token = Tokenizer.produceToken(username,firstName,lastName,cookieTime);

              let pgQuery3 = {
                name: 'InsertSession',
                text: 'INSERT INTO public.session (user_id,connection_Time,sessionid) VALUES($1,$2,$3)',
                values: [userID, cookieTime.toUTCString(), token],
              };

              await client.query(pgQuery3);  

              return Promise.resolve({sessionid: token, connectionTime: cookieTime});
            }
          } catch(e2) {
            console.log(e2);
            return Promise.resolve(null);
          }
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async logout(username) {
      let pgQuery = { 
        name: 'GetUserId',
        text: 'SELECT user_id FROM public.user WHERE public.user.username = $1',
        values: [username],  
      };

      try {
        let answer = await client.query(pgQuery);
        console.log(answer.rows.length);

        let userID = answer.rows[0].user_id;

        let pgQuery1 = {
          name: 'GetUserSession',
          text: 'SELECT sessionid FROM public.user JOIN public.session ON public.user.user_id = public.session.user_id WHERE public.user.user_id = $1;',
          values: [userID],
        };

        try { 
          let selected = await client.query(pgQuery1);
          console.log(selected);

          //facem ca cookie-ul sa fie expirat => este data si ora curenta 
          var cookieTime = new Date();
          cookieTime.setMinutes(cookieTime.getMinutes());

          let pgQuery2 = {
            name: 'UpdateConnTime',
            text: 'UPDATE public.session SET connection_time = $1 WHERE user_id = $2;',
            values: [cookieTime, userID],
          };

          await client.query(pgQuery2); 

          return Promise.resolve({sessionid: selected.rows[0].sessionid, connectionTime: cookieTime});
        } catch(e2) {
          console.log(e2);
          return Promise.resolve(null);
        }
      } catch(e1) {
        console.log(e1);
        return Promise.resolve(null);
      };
    }

    async getUserIdByUsername(username) {
      let pgQuery = { 
          name: 'GetUserIdByUsername',
          text: 'SELECT user_id FROM public.user WHERE public.user.username = $1',
          values: [username],  
      };

      try {
          let answer = await client.query(pgQuery);

          if (answer != null) {
              let userID = answer.rows[0].user_id;
              return Promise.resolve(userID);
          }
          else 
            return Promise.resolve(null);
      } catch(e1) {
        console.log(e1);
        return Promise.resolve(null);
      };
    }

    async updateFname(fName, userID) {
      let pgQuery = { 
        name: 'UpdateFirstName',
        text: 'UPDATE public.user SET first_name = $1 WHERE user_id = $2;',
        values: [fName, userID],  
      };

      try {
        let answer = await client.query(pgQuery);

        if (answer != null) {
            return Promise.resolve(true);
        }
        else 
          return Promise.resolve(null);
      } catch(e1) {
        console.log(e1);
        return Promise.resolve(null);
      };
    }

    async updateLname(lName, userID) {
      let pgQuery = { 
        name: 'UpdateLastName',
        text: 'UPDATE public.user SET last_name = $1 WHERE user_id = $2;',
        values: [lName, userID],  
      };

      try {
        let answer = await client.query(pgQuery);

        if (answer != null) {
            return Promise.resolve(true);
        }
        else 
          return Promise.resolve(null);
      } catch(e1) {
        console.log(e1);
        return Promise.resolve(null);
      };
    }

    async updateUsername(username, userID) {
      let pgQuery = { 
        name: 'UpdateUsername',
        text: 'UPDATE public.user SET username = $1 WHERE user_id = $2;',
        values: [username, userID],  
      };

      try {
        let answer = await client.query(pgQuery);

        if (answer != null) {
          return Promise.resolve(true);
        }
        else 
          return Promise.resolve(null);
      } catch(e1) {
        console.log(e1);
        return Promise.resolve(null);
      };
    }

    async updatePassword(password, userID) {
      let pgQuery = { 
        name: 'UpdatePassword',
        text: 'UPDATE public.user SET user_passwd = $1 WHERE user_id = $2;',
        values: [password, userID],  
      };

      try {
        let answer = await client.query(pgQuery);

        if (answer != null) {
            return Promise.resolve(true);
        }
        else 
          return Promise.resolve(null);
      } catch(e1) {
        console.log(e1);
        return Promise.resolve(null);
      };
    }

    async updateEmail(email, userID) {
      let pgQuery = { 
        name: 'UpdateEmail',
        text: 'UPDATE public.user SET email = $1 WHERE user_id = $2;',
        values: [email, userID],  
      };

      try {
        let answer = await client.query(pgQuery);

        if (answer != null) {
            return Promise.resolve(true);
        }
        else 
          return Promise.resolve(null);
      } catch(e1) {
        console.log(e1);
        return Promise.resolve(null);
      };
    }

    async updateBirthday(birthdate, userID) {
      let pgQuery = { 
        name: 'UpdateBirthdate',
        text: 'UPDATE public.user SET birth = $1 WHERE user_id = $2;',
        values: [birthdate, userID],  
      };

      try {
        let answer = await client.query(pgQuery);

        if (answer != null) {
            return Promise.resolve(true);
        }
        else 
          return Promise.resolve(null);
      } catch(e1) {
        console.log(e1);
        return Promise.resolve(null);
      };
    }

    async updatePhoto(newPath, userID) {
      let pgQuery = { 
        name: 'UpdatePhoto',
        text: 'UPDATE public.user SET photo = $1 WHERE user_id = $2;',
        values: [newPath, userID],  
      };

      try {
        let answer = await client.query(pgQuery);

        if (answer != null) {
            return Promise.resolve(true);
        }
        else 
          return Promise.resolve(null);
      } catch(e1) {
        console.log(e1);
        return Promise.resolve(null);
      };
    }

    async deleteSession(userID) {
      let pgQuery = { 
        name: 'DeleteSession',
        text: 'DELETE FROM public.session WHERE user_id = $1;',
        values: [userID],  
      };

      try {
        let answer = await client.query(pgQuery);

        if (answer != null) {
            return Promise.resolve(true);
        }
        else 
          return Promise.resolve(null);
      } catch(e1) {
        console.log(e1);
        return Promise.resolve(null);
      };
    }

    async deleteUser(userID) {
      let pgQuery = { 
        name: 'DeleteUser',
        text: 'DELETE FROM public.user WHERE user_id = $1;',
        values: [userID],  
      };

      try {
        let answer = await client.query(pgQuery);

        if (answer != null) {
            return Promise.resolve(true);
        }
        else 
          return Promise.resolve(null);
      } catch(e1) {
        console.log(e1);
        return Promise.resolve(null);
      };
    }

    verifyUserCredentials(username, password, response) {
        client.connect();
        let pgQuery = { 
          name: 'GetUserCredentials',
          text: 'SELECT username, user_passwd FROM public.user WHERE public.user.username = $1',
          values: [username],  
        };

        let pgQuery2 = {
          name: 'GetUserSessionID',
          text: 'SELECT sessionid, connection_Time, first_name, last_name FROM public.user JOIN public.session ON public.user.user_id = public.session.user_id;',
        }

        client.query(pgQuery,(err, res)=> {
          console.log(res);
          
          if (res.rows[0].user_passwd === password) {
            client.query(pgQuery2,(err,res) => {
              if (err) 
                console.log(err.message);
              else {
                console.log(request.body);

                var token = Tokenizer.produceToken(username,res.rows[0].first_name,res.rows[0].last_name,res.rows[0].connection_time);
                var cookie = {SESSION_ID: token, username: username, connection_time: res.rows[0].connection_time };
                var cookie_time = new Date();

                cookie_time.setMinutes(cookie_time.getMinutes() + 30);
                response.statusCode = 200;
                response.setHeader('Set-Cookie', username + '=' + token + '; path=/; expires=' + cookie_time);
                response.end();
              }
            });
          }
          else {
            response.statusCode = 400;
            response.setHeader('Content-Type', 'text/html');
            response.write("<h1>Your credentials were wrong!</h1>");
            response.end();
          }
            
          console.log(err);
        });
    }
}


