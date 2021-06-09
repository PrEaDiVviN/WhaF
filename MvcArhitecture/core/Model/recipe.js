const { Pool, Client } = require('pg');
const fs = require('fs');
const { request } = require('http');
const { Console } = require('console');

//database connection
const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ProiectTW',
    password: 'proiect',
    port: 5432,
});

client.connect();

const transaction = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'ProiectTW',
    password: 'proiect',
    port: 5432,
});

transaction.connect();


 
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

    async getNumberIngredients(recipeName) {
        let pgQuery = 'SELECT nr_ingredients FROM public.recipe WHERE public.recipe.recipe_name = $1';
        let values = [recipeName];
        
        try {
            let nr = await client.query(pgQuery, values);
            return Promise.resolve(nr.rows[0].nr_ingredients);
        }
        catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }


    async updateNumberIngredients(recipeName, number) {
        let pgQuery = 'UPDATE public.recipe SET nr_ingredients = $1 WHERE public.recipe.recipe_name = $2';
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        console.log(number);
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        let values = [number, recipeName];
        
        try {
            await client.query(pgQuery, values);
            return Promise.resolve(true);
        }
        catch(e1) {
          console.log(e1);
          console.log('Problema la numar!');
          return Promise.resolve(null);
        };
    }

    async getNumberInstructions(recipeName) {
        let pgQuery = 'SELECT nr_instructions FROM public.recipe WHERE public.recipe.recipe_name = $1';
        let values = [recipeName];
        
        try {
            let nr = await client.query(pgQuery, values);
            return Promise.resolve(nr.rows[0].nr_instructions);
        }
        catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async updateNumberInstructions(recipeName, number) {
        let pgQuery = 'UPDATE public.recipe SET nr_instructions = $1 WHERE public.recipe.recipe_name = $2';
        let values = [number, recipeName];
        try {
            await client.query(pgQuery, values);
            return Promise.resolve(true);
        }
        catch(e1) {
          console.log(e1);
          console.log('Problema la numar!');
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

    async insertInstructionsIntoDatabaseWithShift(recipeId, nrInstructions, instructions, arrayTypes, path, shift) {
        let pgQuery = 'INSERT INTO public.instruction (recipe_id, instructions, photo) VALUES ($1, $2, $3);';
        for(var i = 0; i < nrInstructions; i++)  {
            var values = [recipeId, instructions[i], path + "/" + ("poza"+(shift + i + 1)) + "." + arrayTypes[i]];
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

    async getNamePhotoCategoryFromAllRecipes(skip, count) {
        let pgQuery = 'SELECT * FROM public.recipe LIMIT $1 OFFSET $2;';
        let values = [count, skip];
        let data = await client.query(pgQuery,values);

        let recipeName = [];
        let recipePhoto = [];
        let categorie = [];

        if(data != null && data.rows[0] != undefined) {
                for(let i = 0; i < data.rows.length; i++) {
                    recipeName.push(data.rows[i].recipe_name);
                    recipePhoto.push(data.rows[i].photo.substr(5).replace('%20', ' '));
                    categorie.push(data.rows[i].category);
            }
            return Promise.resolve({recipeName: recipeName, recipePhoto: recipePhoto, categorie: categorie});
        }
        return Promise.resolve(null);
    } 


    async getAllInfoAboutRecipe(recipeName) {
        let pgQuery = 'SELECT * FROM public.recipe WHERE public.recipe.recipe_name = $1;';
        let values = [recipeName];
        let data = await client.query(pgQuery,values);
        if(data != null && data.rows[0] != undefined) {
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
        if(data != null && data.rows[0] != undefined) {
            let ingrediente = data.rows;
            return Promise.resolve({ingrediente: ingrediente});
        }
        return Promise.resolve(null);
    }

    async getAllInstructions(recipeID) {
        let pgQuery = 'SELECT * FROM public.instruction WHERE public.instruction.recipe_id = $1;';
        let values = [recipeID];
        let data = await client.query(pgQuery,values);
        if(data != null && data.rows[0] != undefined) {
            let instructiuni = data.rows;
            return Promise.resolve({instructiuni: instructiuni});
        }
        return Promise.resolve(null);
    }

    async deleteRecipe(recipeName, recipeId) {
        let pgQuery = 'DELETE FROM public.instruction WHERE recipe_id = $1';
        let pgQuery2 = 'DELETE FROM public.ingredient WHERE recipe_id = $1';
        let values1 = [recipeId];
        let pgQuery3 = 'DELETE FROM public.recipe WHERE recipe_name = $1';
        let values2 = [recipeName];
        try {
            await transaction.query('BEGIN');
            await transaction.query(pgQuery,values1);
            await transaction.query(pgQuery2,values1);
            await transaction.query(pgQuery3, values2);
            let pathRecipe = 'data/recipes/' + recipeName;
            try {
                fs.rmSync(pathRecipe, { recursive: true });
            }
            catch(e) {
                console.log(e);
                console.log('FOULDER NOT FOUND!');
            }
            await transaction.query('COMMIT');
            return true;
        } catch (e) {
            console.log(e);
            await transaction.query('ROLLBACK');
            return null;
        }
    }

    async deleteIngredient(recipeId, ingredientText) {
        let pgQuery = 'DELETE FROM public.ingredient WHERE ingredient_name = $1 AND recipe_id = $2';
        console.log('_________________________________________________________');
        console.log(ingredientText);
        console.log(recipeId);
        console.log('_________________________________________________________');
        let values = [ingredientText,recipeId];
        try {
            await client.query(pgQuery,values);
            await client.query('COMMIT');
            return true;
        } catch (e) {
            console.log(e);
            return null;
        }
    }


    async modifyRecipeNameByName(recipeName, newRecipeName) {
        let pgQuery = 'UPDATE public.recipe SET recipe_name = $1 WHERE recipe_name = $2';
        let values = [newRecipeName, recipeName]; 
        try {
            await client.query(pgQuery,values);
            //modificam si numele folderului
            let pathRecipe = 'data/recipes/' + recipeName;
            let newPathName = 'data/recipes/' + newRecipeName
            try {
                fs.renameSync(pathRecipe,newPathName);
            }
            catch(e) {
                console.log(e);
                console.log('FOULDER NOT FOUND!');
                let changeback = [recipeName, newRecipeName];
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

    async modifyRecipePhotoByName(recipeName, newPhoto) {
        let pgQuery = 'UPDATE public.recipe SET photo = $1 WHERE recipe_name = $2';
        let values = [newPhoto, recipeName]; 
        try {
            await client.query(pgQuery,values);
        }
        catch(e) {
            console.log(e);
            return Promise.resolve(null);
        }
        return Promise.resolve(true);
    }



    async modifyRecipePrepTimeByName(recipeName, newNumber, type) {
        let pgQuery;
        if(type === 'prep') 
            pgQuery = 'UPDATE public.recipe SET prep_time = $1 WHERE recipe_name = $2';
        else 
            pgQuery = 'UPDATE public.recipe SET final_time = $1 WHERE recipe_name = $2';
        let values = [newNumber, recipeName]; 
        try {
            await client.query(pgQuery,values);
        }
        catch(e) {
            console.log(e);
            return Promise.resolve(null);
        }
        return Promise.resolve(true);
    }

    async modifyRecipeTypeByName(recipeName, value, type) {
        let pgQuery;
        if(type === 'cat') 
            pgQuery = 'UPDATE public.recipe SET category = $1 WHERE recipe_name = $2';
        else 
            pgQuery = 'UPDATE public.recipe SET difficulty = $1 WHERE recipe_name = $2';
        let values = [value, recipeName]; 
        try {
            await client.query(pgQuery,values);
        }
        catch(e) {
            console.log(e);
            return Promise.resolve(null);
        }
        return Promise.resolve(true);
    }
}


