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
                return Promise.resolve(true);
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
}