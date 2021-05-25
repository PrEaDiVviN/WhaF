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
        } catch(err) {
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

            if (answer != null && answer.rows[0] != undefined) {
                let recipeID = answer.rows[0].recipe_id;
                return Promise.resolve(recipeID);
            }
            else 
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async insertIngredientsIntoDatabase(recipeId ,nrIngredients, ingredients) {
        let pgQuery = 'INSERT INTO public.ingredient (recipe_id, ingredient_name) VALUES ($1, $2);';
        
        for (var i = 0; i < nrIngredients; i++)  {
            var values = [recipeId, ingredients[i]];

            try {
                let result = await client.query(pgQuery, values); 
                if (result == null) 
                    return Promise.resolve(null);
            } catch(err) {
                console.log(err);
                return Promise.resolve(null);
            }; 
        }

        return Promise.resolve(true);
    }

    async insertInstructionsIntoDatabase(recipeId, nrInstructions, instructions, arrayTypes, path) {
        let pgQuery = 'INSERT INTO public.instruction (recipe_id, instructions, photo) VALUES ($1, $2, $3);';
        
        for (var i = 0; i < nrInstructions; i++)  {
            var values = [recipeId, instructions[i], path + "/" + ("poza"+(i+1)) + "." + arrayTypes[i]];
            
            try {
                let result = await client.query(pgQuery, values); 
                if (result == null) 
                    return Promise.resolve(null);
            } catch(err) {
                console.log(err);
                return Promise.resolve(null);
            };
        }
        
        return Promise.resolve(true);
    }

    async getAllInfoAboutRecipe(recipeName) {
        let pgQuery = 'SELECT * FROM public.recipe WHERE public.recipe.recipe_name = $1;';
        let values = [recipeName];
        let data = await client.query(pgQuery,values);

        if (data != null && data.rows[0] != undefined) {
            let recipeID = data.rows[0].recipe_id;
            let userID = data.rows[0].user_id;
            let recipePhoto = data.rows[0].photo;
            let categorie = data.rows[0].category;
            let nrIngrediente = data.rows[0].nr_ingredients;
            let preperationTime = data.rows[0].prep_time;
            let finalizationTime = data.rows[0].final_time;
            let nrInstructiuni = data.rows[0].nr_instructions;
            let dificultate = data.rows[0].difficulty;
            
            return Promise.resolve({recipeID: recipeID, userID: userID, recipePhoto: recipePhoto, categorie: categorie, nrIngrediente: nrIngrediente,
                preperationTime: preperationTime, finalizationTime: finalizationTime, nrInstructiuni: nrInstructiuni, dificultate: dificultate});
        }

        return Promise.resolve(null);
    }

    async getAllIngredients(recipeID) {
        let pgQuery = 'SELECT * FROM public.ingredient WHERE public.ingredient.recipe_id = $1;';
        let values = [recipeID];
        let data = await client.query(pgQuery,values);

        if (data != null && data.rows[0] != undefined) {
            let ingrediente = data.rows;
            return Promise.resolve({ingrediente: ingrediente});
        }

        return Promise.resolve(null);
    }

    async getAllInstructions(recipeID) {
        let pgQuery = 'SELECT * FROM public.instruction WHERE public.instruction.recipe_id = $1;';
        let values = [recipeID];
        let data = await client.query(pgQuery,values);

        if (data != null && data.rows[0] != undefined) {
            let instructiuni = data.rows;
            return Promise.resolve({instructiuni: instructiuni});
        }
        
        return Promise.resolve(null);
    }
}