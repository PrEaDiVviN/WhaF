const { Pool, Client } = require('pg');
const Tokenizer = require('../../utility/tokenizer.js');
const fs = require('fs');
const { request } = require('http');
const { exception } = require('console');

//database connection
const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ProiectTW',
    password: 'proiect',
    port: 5432,
});

const transaction = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'ProiectTW',
    password: 'proiect',
    port: 5432,
});
client.connect();  
transaction.connect();
 
module.exports = class user {

    async modifyFirstName(firstName, username) {
        const queryText = 'UPDATE public.user SET first_name = $1 WHERE public.user.username = $2;';
        try {
            await transaction.query(queryText, [firstName, username]);
        }
        catch(e) {
          return false;
        }
        return true;
    } 

    async modifyLastName(lastName, username) {
        const queryText = 'UPDATE public.user SET last_name = $1 WHERE public.user.username = $2;';
        try {
            await transaction.query(queryText, [lastName, username]);
        }
        catch(e) {
          return false;
        }
        return true;
    }

    async modifyUsername(newUsername, username) {
        const queryText = 'UPDATE public.user SET username = $1 WHERE public.user.username = $2;';
        try {
            await transaction.query(queryText, [newUsername, username]);
            let oldPath = 'data/users/' + username;
            let newPath = 'data/users/' + newUsername;
            fs.renameSync(oldPath, newPath);
        }
        catch(e) {
          return false;
        }
        return true;
    }

    async modifyEmail(email, username) {
        const queryText = 'UPDATE public.user SET email = $1 WHERE public.user.username = $2;';
        try {
        await transaction.query(queryText, [email, username]);
        }
        catch(e) {
          return false;
        }
        return true;
    }

    async modifyPassword(password, username) {
        const queryText = 'UPDATE public.user SET user_passwd = $1 WHERE public.user.username = $2;';
        try {
            await client.query(queryText, [password, username]);
        }
        catch(e) {
          return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }

    async modifyUserType(username, type) {
      const queryText = 'UPDATE public.user SET type = $1 WHERE public.user.username = $2;';
      try {
          await client.query(queryText, [type, username]);
      }
      catch(e) {
        return Promise.resolve(false);
      }
      return Promise.resolve(true);
  }
   
   async modifybirthDate(birthDate, username) {
        const queryText = 'UPDATE public.user SET birth = $1 WHERE public.user.username = $2;';
        try {
        await transaction.query(queryText, [birthDate, username]);
        }
        catch(e) {
            console.log(e);
            return false;
        
        }
        return true;
   } 

   async modifyUserPhoto(userPhoto, username) {
        const queryText = 'UPDATE public.user SET photo = $1 WHERE public.user.username = $2;';
        const photoPath = 'data/users/' + username + '/user' + (userPhoto.type == 'image/jpeg' ? '.jpg' : (userPhoto.type == 'image/png' ? '.png' :'.svg')); 
        try {
            await transaction.query(queryText, [photoPath, username]);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
            let oldPath = userPhoto.path;
            fs.renameSync(oldPath, photoPath);
        }
        catch(e) {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
   }
   
   async modifyUserPhoto1(userPhoto, username) {
    const queryText = 'UPDATE public.user SET photo = $1 WHERE public.user.username = $2;';
    try {
        await client.query(queryText, [userPhoto, username]);
    }
    catch(e) {
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }


    async modifyUserDatas(firstName, lastName, email, username, newUsername, password, birthDate, userPhoto) {
      
        try {
            let restartSession = false;
            let changedUsername = false;
            await transaction.query('BEGIN');
            console.log('======================================================');
            console.log(typeof(newUsername));
            console.log('======================================================');
            if(newUsername != undefined) {
                console.log('INCERCAM SA SCHIMBAM USERNAME _UL');
                if(await this.modifyUsername(newUsername, username)) {
                    restartSession = true;
                    changedUsername = true;
                }
                else {
                    await transaction.query('ROLLBACK');
                    return 'username';
                }
            }
            if(firstName != undefined) {
                if(await this.modifyFirstName(firstName, changedUsername ? newUsername : username)) {
                    restartSession = true;
                    console.log('DONE => FIRSTNAME');
                }
                else {
                    await transaction.query('ROLLBACK'); 
                    return 'firstname';
                }
            }
            if(lastName != undefined) {
                if(await this.modifyLastName(lastName, changedUsername ? newUsername : username))
                    restartSession = true;
                else {
                    await transaction.query('ROLLBACK');
                    return 'lastname';
                }
            }
            if(email != undefined) {
                if(await this.modifyEmail(email, changedUsername ? newUsername : username))
                    restartSession = true;
                else {
                    await transaction.query('ROLLBACK');
                    return 'email'; 
                }
            }
            if(password != undefined) {
                if(await !this.modifyPassword(password, changedUsername ? newUsername : username)) {
                    await transaction.query('ROLLBACK');
                    return 'password'; 
                }
            }
            if(birthDate != undefined) {
                if(await this.modifybirthDate(birthDate, changedUsername ? newUsername : username))
                    restartSession = true;
                else {
                    await transaction.query('ROLLBACK');
                    return 'birthdate'; 
                }
            }
            if(userPhoto != undefined) {
                if(await !this.modifyUserPhoto(userPhoto, changedUsername ? newUsername : username)) {
                    await transaction.query('ROLLBACK');
                    return 'photo'; 
                }
            }
            await transaction.query('COMMIT');
            
            return 'success';
        } catch (e) {
            await transaction.query('ROLLBACK');
            return 'error';
        }
    }  
  
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

    async getPassword(username) {
      let pgQuery = { 
          name: 'GetUserPasswordByUsername',
          text: 'SELECT user_passwd FROM public.user WHERE public.user.username = $1',
          values: [username],  
      };
      console.log('ELENAELENAELENAELENAELENAELENAELENAELENAELENAELENAELENAELENA');
      console.log(username);
      console.log('ELENAELENAELENAELENAELENAELENAELENAELENAELENAELENAELENAELENA');
      try {
          let answer = await client.query(pgQuery);
          if(answer != null && answer.rows != null) {
              let password = answer.rows[0].user_passwd;
              return Promise.resolve(password);
          }
          else 
              return Promise.resolve(null);
      }
      catch(e1) {
        console.log(e1);
        return Promise.resolve(null);
      };
  }

  async modifyUserPhotoByName(username, newPhoto) {
    let pgQuery = 'UPDATE public.user SET photo = $1 WHERE username = $2';
    let values = [newPhoto, username]; 
    try {
        await client.query(pgQuery,values);
    }
    catch(e) {
        console.log(e);
        return Promise.resolve(null);
    }
    return Promise.resolve(true);
  }

  async modifyUsernameByName(username, newUsername) {
    let pgQuery = 'UPDATE public.user SET username = $1 WHERE username = $2';
    let values = [newUsername, username]; 
    try {
        await client.query(pgQuery,values);
        //modificam si numele folderului
        let pathUser = 'data/users/' + username;
        let newPathUser = 'data/users/' + newUsername;
        try {
           fs.renameSync(pathUser,newPathUser);
        }
        catch(e) {
            console.log(e);
            console.log('FOULDER NOT FOUND!');
            let changeback = [username, newUsername];
            await client.query(pgQuery, changeback);
            return Promise.resolve(null);
        }
    }
    catch(e) {
        console.log(e);
        return Promise.resolve(null);
    }
    return Promise.resolve(true);
}


  async getUserStatus(username) {
    let pgQuery = { 
        name: 'GetUserStatusByUsername',
        text: 'SELECT type FROM public.user WHERE public.user.username = $1',
        values: [username],  
    };
    try {
        let answer = await client.query(pgQuery);
        if(answer != null) {
            let status = answer.rows[0].type;
            return Promise.resolve(status);
        }
        else 
            return Promise.resolve(null);
    }
    catch(e1) {
      console.log(e1);
      return Promise.resolve(null);
    };
  }

  async getUserPhoto(username) {
    let pgQuery = { 
        name: 'GetUserPhotoByUsername',
        text: 'SELECT photo FROM public.user WHERE public.user.username = $1',
        values: [username],  
    };
    try {
        let answer = await client.query(pgQuery);
        if(answer != null && answer.rows != null && answer.rows[0] != undefined) {
            let photo = answer.rows[0].photo;
            return Promise.resolve(photo);
        }
        else 
            return Promise.resolve(null);
    }
    catch(e1) {
      console.log(e1);
      return Promise.resolve(null);
    };
  }

    
    async deleteUser(username, userId) {
      let pgQuery1 = 'UPDATE public.recipe SET user_id = 1 WHERE user_id = $1';
      let pgQuery2 = 'DELETE FROM public.user WHERE username = $1';
      let values1 = [userId];
      let values2 = [username];
      try {
          await transaction.query('BEGIN');
          await transaction.query(pgQuery1,values1);
          await transaction.query(pgQuery2,values2);
          let pathRecipe = 'data/users/' + username;
          try {
              fs.rmSync(pathRecipe, { recursive: true });
          }
          catch(e) {
              console.log(e);
              console.log('FOULDER NOT FOUND!');
          }
          await transaction.query('COMMIT');
          return Promise.resolve(true);
      } catch (e) {
          console.log(e);
          await transaction.query('ROLLBACK');
          return Promise.resolve(null);
      }
  }

    async getUserTypeByUsername(username) {
      let pgQuery = { 
          name: 'GetUserTypeByUsername',
          text: 'SELECT type FROM public.user WHERE public.user.username = $1',
          values: [username],  
      };
      try {
          let answer = await client.query(pgQuery);
          if(answer != null) {
              let userType = answer.rows[0].type;
              return Promise.resolve(userType);
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

    async getNamePhotoTypeFromAllUsers(skip, count) {
      let pgQuery = 'SELECT * FROM public.user LIMIT $1 OFFSET $2;';
      let values = [count, skip];
      let data = await client.query(pgQuery,values);

      let usernames = [];
      let userTypes = [];
      let userPhotos = [];

      if(data != null && data.rows[0] != undefined) {
              for(let i = 0; i < data.rows.length; i++) {
                  usernames.push(data.rows[i].username);
                  if(data.rows[i].photo != null)
                    userPhotos.push(data.rows[i].photo.substr(5).replaceAll('%20', ' '));
                  else
                    userPhotos.push(null);
                  userTypes.push(data.rows[i].type);
          }
          return Promise.resolve({usernames: usernames, userPhotos: userPhotos, userTypes: userTypes});
      }
      return Promise.resolve(null);
  }

    
}


