const { Pool } = require('pg');
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


 
module.exports = class recipe {
  
    async insertRecipeIntoDatabase(userID, recipeName, recipePhotoPath,  category, nrIngredients, prepTime, finalTime, nrInstructions, difficulty) {

        let pgQuery = 'INSERT INTO public.recipe (user_id, recipe_name, photo, category, nr_ingredients, prep_time, final_time, nr_instructions, difficulty) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);';
        let values = [userID, recipeName, recipePhotoPath, category ,nrIngredients, prepTime, finalTime, nrInstructions, difficulty];
        try {
            let result = await client.query(pgQuery, values); 
            if (result != null) {
                return Promise.resolve(true);
            }
            return Promise.resolve(null);
        }
        catch(err) {
            console.log(err);
            return Promise.resolve(null);
        };
    } 

    async getRecipeIdByName(recipeName) {
        let pgQuery = { 
            name: 'GetRecipeIdByName',
            text: 'SELECT recipe_id FROM public.recipe WHERE public.recipe.recipe_name = $1',
            values: [recipeName],  
        };
        try {
            let answer = await client.query(pgQuery);
            if(answer != null && answer.rows[0] != undefined) {
                let recipeID = answer.rows[0].recipe_id;
                return Promise.resolve(recipeID);
            }
            else 
                return Promise.resolve(null);
        }
        catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }


    async insertIngredientsIntoDatabase(recipeId ,nrIngredients, ingredients) {
        let pgQuery = 'INSERT INTO public.ingredient (recipe_id, ingredient_name) VALUES ($1, $2);';
        for(var i = 0; i < nrIngredients; i++)  {
            var values = [recipeId, ingredients[i]];
            try {
                let result = await client.query(pgQuery, values); 
                if (result == null) 
                    return Promise.resolve(null);
            }
            catch(err) {
                console.log(err);
                return Promise.resolve(null);
            }; 
        }
        return Promise.resolve(true);
    }

    async insertInstructionsIntoDatabase(recipeId, nrInstructions, instructions, arrayTypes, path) {
        let pgQuery = 'INSERT INTO public.instruction (recipe_id, instructions, photo) VALUES ($1, $2, $3);';
        for(var i = 0; i < nrInstructions; i++)  {
            var values = [recipeId, instructions[i], path + "/" + ("poza"+(i+1)) + "." + arrayTypes[i]];
            try {
                let result = await client.query(pgQuery, values); 
                if (result == null) 
                    return Promise.resolve(null);
            }
            catch(err) {
                console.log(err);
                return Promise.resolve(null);
            };
        }
        return Promise.resolve(true);
    }
}


