const { Pool } = require('pg');
const Tokenizer = require('../../utility/tokenizer.js');
const fs = require('fs');
const { request } = require('http');

//database connection
const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ProiectTW',
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
        }
      catch(ex) {
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
        if(answer.rows && answer.rows.length > 0) {
          try {
            let answer2 = await client.query(pgQuery2);
            if(answer2.rows && answer2.rows.length > 0) 
            {  
              if(answer2.rows[0].sessionid === SSID)
                return  Promise.resolve(true);
              else 
                return Promise.resolve(false);  
            }
            else {
              return Promise.resolve(false);
            } 
            
          }
          catch(e2) {
            console.log(e2);
            return Promise.resolve(false);
          }
        }
      } 
      catch(e1) {
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
        if(result.rows[0].user_passwd === password){
              return true;
        }
        return false;
      }
      catch(err) {
        console.log(err);
        return null;
      }
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
            if(answerCONNT.rows && answerCONNT.rows.length > 0){
                return Promise.resolve({sessionid: answerCONNT.rows[0].sessionid, connectionTime: new Date(answerCONNT.rows[0].connection_time)});
            }
            else {
              var cookieTime = new Date();
              cookieTime.setMinutes(cookieTime.getMinutes()+1440);
              var token = Tokenizer.produceToken(username,firstName,lastName,cookieTime);
              let pgQuery3 = {
                name: 'InsertSession',
                text: 'INSERT INTO public.session (user_id,connection_Time,sessionid) VALUES($1,$2,$3)',
                values: [userID, cookieTime.toUTCString(), token],
              };
              await client.query(pgQuery3);  
              return Promise.resolve({sessionid: token, connectionTime: cookieTime});
            }
          }
          catch(e2) {
            console.log(e2);
            return Promise.resolve(null);
          }
        }
        catch(e1) {
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
            if(answer != null) {
                let userID = answer.rows[0].user_id;
                return Promise.resolve(userID);
            }
            else 
                return Promise.resolve(null);
        }
        catch(e1) {
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
            if(res.rows[0].user_passwd === password) {
                client.query(pgQuery2,(err,res) => {
                    if(err) console.log(err.message);
                    else {
                      /*response.statusCode = 200;
                      response.setHeader('Content-Type', 'text/JSON');
                      var obj = {USERNAME: username, SESSION_ID: res.rows[0].sessionid, CONNECTION_TIME: res.rows[0].connection_time}
                      response.write(JSON.stringify(obj));
                      response.end();
                      */
                      console.log(request.body);
                      var token = Tokenizer.produceToken(username,res.rows[0].first_name,res.rows[0].last_name,res.rows[0].connection_time);
                      var cookie = {SESSION_ID: token, username: username, connection_time: res.rows[0].connection_time };
                      var cookie_time = new Date();
                      cookie_time.setMinutes(cookie_time.getMinutes() + 30);
                      response.statusCode = 200;
                      response.setHeader('Set-Cookie', username + '=' + token + '; path=/; expires=' + cookie_time);
                      response.end();

                      /* ==exemplu inserare in baza de date folosit pt a vedea ca timestampul este la fel(pe server arata diferit (diferenta ultimele 3cifre dispar cand sunt
                         ==reintroduse pe server))
                      let pgQuery3 = {
                        name: 'SeeInsert',
                        text: 'INSERT INTO public.session VALUES(2,2, $1, $2)',
                        values: [res.rows[0].connection_time, 767],
                      }
                      client.query(pgQuery3, (err,res) => {
                        if(err) console.log(err.message);
                        else {
                          console.log("SUCCESS============================================================");
                        }
                      });
                     console.log(res);
                     */
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


