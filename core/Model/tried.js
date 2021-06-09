const { Pool } = require('pg');
const fs = require('fs');
const { request } = require('http');

//database connection
const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'proiectTW',
    password: 'proiect',
    port: 5432,
});

client.connect();

module.exports = class tried {
    async insertTriedIntoDatabase(userID, recipeName, recipePhoto) {
        let pgQuery = 'INSERT INTO public.tried (id_user, recipe_name, photo) VALUES ($1, $2, $3);';
        let values = [userID, recipeName, recipePhoto];

        try {
            let result = await client.query(pgQuery, values);

            if (result != null) {
                let selectQ = 'SELECT recipe_id, score FROM public.recipe WHERE recipe_name = $1;';
                let valSelect = [recipeName];

                try {
                    let select = await client.query(selectQ, valSelect);

                    if (select.rows.length > 0) {
                        var scor = select.rows[0].score + 1;
                        let updateQ = 'UPDATE public.recipe SET score = $1 WHERE recipe_id = $2';
                        let updateVal = [scor, select.rows[0].recipe_id];

                        try {
                            let res = await client.query(updateQ, updateVal);

                            if (res != null)
                                return Promise.resolve(true);
                            else
                                return Promise.resolve(null);
                        } catch(err2) {
                            console.log(err2);
                            return Promise.resolve(null);
                        };
                    }
                    else
                        return Promise.resolve(null);
                } catch(err1) {
                    console.log(err1);
                    return Promise.resolve(null);
                };
            }

            return Promise.resolve(null);
        } catch(err) {
            console.log(err);
            return Promise.resolve(null);
        };
    } 

    async getPhotoTryUserRecipe(recipeName, userID) {
        let pgQuery = 'SELECT * FROM public.tried WHERE public.tried.id_user = $1 AND public.tried.recipe_name = $2;';
        let values = [userID, recipeName];

        try {
            let result = await client.query(pgQuery, values); 

            if (result.rows != undefined && result.rows.length != 0) {
                return Promise.resolve(result.rows[0].photo);
            }

            return Promise.resolve(false);
        } catch(err) {
            console.log(err);
            return Promise.resolve(false);
        };
    }

    async triedR(username) {
        let pgQuery = { 
            name: 'Tried',
            text: 'SELECT recipe_name FROM public.user u JOIN public.tried t on u.user_id = t.id_user  WHERE username = $1 ORDER BY id_try ASC;', 
            values: [username],
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('0');
            else 
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }
}