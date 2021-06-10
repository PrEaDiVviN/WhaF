const { Pool, Client } = require('pg');
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

const transaction = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'proiectTW',
    password: 'proiect',
    port: 5432,
});

transaction.connect();

module.exports = class recipe {
    async insertRecipeIntoDatabase(userID, recipeName, recipePhotoPath,  category, nrIngredients, prepTime, finalTime, nrInstructions, difficulty) {
        let score = 0;
        let pgQuery = 'INSERT INTO public.recipe (user_id, recipe_name, photo, category, nr_ingredients, prep_time, final_time, nr_instructions, difficulty, score) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);';
        let values = [userID, recipeName, recipePhotoPath, category ,nrIngredients, prepTime, finalTime, nrInstructions, difficulty, score];
        
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

    async insertSearch(userID, recipe, wanted, undesired, difficulty, prep, total, category) {
        let score = 0;
        let pgQuery = 'INSERT INTO public.search (user_id, recipe_name, wanted, unwanted, difficulty, prep, total, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);';
        let values = [userID, recipe, wanted, undesired, difficulty, prep, total, category];
        
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

    async insertSearchR(userID, nameR, score, prep, total, diff, id) {
        let pgQuery = 'INSERT INTO public.searchR (user_id, recipe_name, score, prep, total, difficulty, searchid) VALUES ($1, $2, $3, $4, $5, $6, $7);';
        let values = [userID, nameR, score, prep, total, diff, id];
        
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

    async getRecipeNameById(recipeID) {
        let pgQuery = { 
            name: 'GetRecipeNameById',
            text: 'SELECT recipe_name FROM public.recipe WHERE recipe_id = $1',
            values: [recipeID],  
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows[0] != undefined) {
                let recipeName = answer.rows[0].recipe_name;
                return Promise.resolve(recipeName);
            }
            else 
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async getNrRecipes() {
        let pgQuery = { 
            name: 'CountRecipes',
            text: 'SELECT COUNT(*) AS nr FROM public.recipe;', 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows[0] != undefined) {
                let count = answer.rows[0].nr;
                return Promise.resolve(count);
            }
            else 
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async getCategory(category) {
        let pgQuery = { 
            name: 'GetCategory',
            text: 'SELECT recipe_name FROM public.recipe WHERE category = $1;', 
            values: [category],
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows[0] != undefined) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows == undefined)
                return Promise.resolve('no rows');
            else 
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async addedR(username) {
        let pgQuery = { 
            name: 'Added',
            text: 'SELECT recipe_name FROM public.user u JOIN public.recipe r on u.user_id = r.user_id WHERE username = $1 ORDER BY recipe_id ASC;', 
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

    async sortDefault() {
        let pgQuery = { 
            name: 'SortDefault',
            text: 'SELECT recipe_name FROM public.recipe ORDER BY recipe_id DESC;', 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else 
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async sortPopularity() {
        let pgQuery = { 
            name: 'SortPopularity',
            text: 'SELECT recipe_name FROM public.recipe ORDER BY score DESC;', 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else 
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async sortPrep() {
        let pgQuery = { 
            name: 'SortPrep',
            text: 'SELECT recipe_name FROM public.recipe ORDER BY prep_time ASC;', 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else 
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async sortFinal() {
        let pgQuery = { 
            name: 'SortFinal',
            text: 'SELECT recipe_name FROM public.recipe ORDER BY final_time ASC;', 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else 
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async sortDiff() {
        let pgQuery = { 
            name: 'SortDiff',
            text: 'SELECT recipe_name FROM public.recipe ORDER BY difficulty ASC;', 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else 
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async sortAZ() {
        let pgQuery = { 
            name: 'SortAZ',
            text: 'SELECT recipe_name FROM public.recipe ORDER BY recipe_name ASC;', 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else 
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async getPopularRecipes() {
        let pgQuery = { 
            name: 'GetPopularRecipes',
            text: 'SELECT recipe_name, category, first_name, last_name FROM public.recipe r JOIN public.user u ON r.user_id = u.user_id ORDER BY score DESC;', 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else 
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async getPopularIngredients() {
        let pgQuery = { 
            name: 'GetPopularIngredients',
            text: 'SELECT ingredient_name, score FROM public.ingredient WHERE score > 0 ORDER BY score DESC;', 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else 
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async getUnwantedIngredients() {
        let pgQuery = { 
            name: 'GetUnwantedIngredients',
            text: 'SELECT ingredient_name FROM public.ingredient WHERE score > 0 ORDER BY search_score DESC;', 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else 
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async searchName(recipe) {
        var nameR = '%' + recipe + '%';

        let pgQuery = { 
            name: 'SearchByName',
            text: 'SELECT recipe_id, recipe_name FROM public.recipe WHERE recipe_name LIKE $1;', 
            values: [nameR],
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async searchWanted(wanted) {
        var ingredient = wanted.split(', ');
        var lg = ingredient.length, i;
        var query = 'SELECT recipe_name FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ';

        for (i = 0; i < lg; i++) {
            var name;
            if (i == 0 && lg != 1)
                name = '\'' + ingredient[i] + '\'' + ' INTERSECT ';
            else if (i == 0 && lg == 1) 
                name = '\'' + ingredient[i] + '\'' + ';';
            else if (i == lg - 1)
                name = 'SELECT recipe_name FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + ingredient[i] + '\'' + ';';
            else
                name = 'SELECT recipe_name FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + ingredient[i] + '\'' + ' INTERSECT ';
            
            query += name;
        }

        let pgQuery = { 
            name: 'SearchByWantedIngredients',
            text: query, 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async searchUnwanted(unwanted) {
        var ingredient = unwanted.split(', ');
        var lg = ingredient.length, i;
        var query = 'SELECT recipe_name FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.ingredient_id EXCEPT (SELECT recipe_name FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ';

        for (i = 0; i < lg; i++) {
            var name;
            if (i == 0 && lg != 1)
                name = '\'' + ingredient[i] + '\'' + ' UNION ';
            else if (i == 0 && lg == 1) 
                name = '\'' + ingredient[i] + '\'' + ');';
            else if (i == lg - 1)
                name = 'SELECT recipe_name FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + ingredient[i] + '\'' + ');';
            else
                name = 'SELECT recipe_name FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + ingredient[i] + '\'' + ' UNION ';
            
            query += name;

            //crestem scorul ingredientelor date de utilizator (search_score)
            let selectQ = 'SELECT ingredient_id, search_score FROM public.ingredient WHERE ingredient_name = $1 ORDER BY ingredient_id ASC;';
            var selectV = [ingredient[i]];
            var newScore;

            try {                
                let res1 = await client.query(selectQ, selectV);

                if (res1.rows.length >= 1) {
                    newScore = res1.rows[0].search_score + 1;            
                    var id = res1.rows[0].ingredient_id;

                    let updateQ = 'UPDATE public.ingredient SET search_score = $1 WHERE ingredient_id = $2;';
                    var updateV = [newScore, id];

                    try {
                        let res2 = await client.query(updateQ, updateV);

                        if (res2 == null)
                            return Promise.resolve(null);
                    } catch(err2) {
                        console.log(err2);
                        return Promise.resolve(null);
                    };
                }
            } catch(err1) {
                console.log(err1);
                return Promise.resolve(null);
            };
        }

        let pgQuery = { 
            name: 'SearchByUnwantedIngredients',
            text: query, 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async searchWU(wanted, undesired) {
        var un = undesired.split(', ');
        var wa = wanted.split(', ');
        var lgU = un.length, lgW = wa.length, i;
        var query = '(SELECT recipe_name FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ';

        for (i = 0; i < lgW; i++) {
            var name;
            if (i == 0 && lgW != 1)
                name = '\'' + wa[i] + '\'' + ' INTERSECT ';
            else if (i == 0 && lgW == 1)
                name = '\'' + wa[i] + '\'' + ') EXCEPT ';
            else if (i == lgW - 1)
                name = 'SELECT recipe_name FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + wa[i] + '\'' + ') EXCEPT ';
            else
                name = 'SELECT recipe_name FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + wa[i] + '\'' + ' INTERSECT ';
            
            query += name;
        }

        var newQ = '(SELECT recipe_name FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ';
        query += newQ;

        for (i = 0; i < lgU; i++) {
            var name;
            if (i == 0 && lgU != 1)
                name = '\'' + un[i] + '\'' + ' UNION ';
            else if (i == 0 && lgU == 1) 
                name = '\'' + un[i] + '\'' + ');';
            else if (i == lgU - 1)
                name = 'SELECT recipe_name FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + un[i] + '\'' + ');';
            else
                name = 'SELECT recipe_name FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + un[i] + '\'' + ' UNION ';
            
            query += name;

            //crestem scorul ingredientelor date de utilizator (search_score)
            let selectQ = 'SELECT ingredient_id, search_score FROM public.ingredient WHERE ingredient_name = $1 ORDER BY ingredient_id ASC;';
            var selectV = [un[i]];
            var newScore;

            try {                
                let res1 = await client.query(selectQ, selectV);

                if (res1.rows.length >= 1) {
                    newScore = res1.rows[0].search_score + 1;            
                    var id = res1.rows[0].ingredient_id;

                    let updateQ = 'UPDATE public.ingredient SET search_score = $1 WHERE ingredient_id = $2;';
                    var updateV = [newScore, id];

                    try {
                        let res2 = await client.query(updateQ, updateV);

                        if (res2 == null)
                            return Promise.resolve(null);
                    } catch(err2) {
                        console.log(err2);
                        return Promise.resolve(null);
                    };
                }
            } catch(err1) {
                console.log(err1);
                return Promise.resolve(null);
            };
        }

        let pgQuery = { 
            name: 'SearchByWU',
            text: query, 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async searchWD(wanted, difficulty) {
        var ingredient = wanted.split(', ');
        var lg = ingredient.length, i;
        var query = 'SELECT * FROM (';

        for (i = 0; i < lg; i++) {
            var name;

            if (i == lg - 1)
                name = 'SELECT recipe_name, difficulty FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + ingredient[i] + '\'' + ')  r1 WHERE difficulty = ' + '\'' + difficulty + '\'';
            else
                name = 'SELECT recipe_name, difficulty FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + ingredient[i] + '\'' + ' INTERSECT ';
            
            query += name;
        }

        let pgQuery = { 
            name: 'SearchWD',
            text: query, 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async searchWP(wanted, prep) {
        var ingredient = wanted.split(', ');
        var lg = ingredient.length, i;
        var query = 'SELECT * FROM (';

        for (i = 0; i < lg; i++) {
            var name;

            if (i == lg - 1)
                name = 'SELECT recipe_name, prep_time FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + ingredient[i] + '\'' + ')  r1 WHERE prep_time <= ' + prep;
            else
                name = 'SELECT recipe_name, prep_time FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + ingredient[i] + '\'' + ' INTERSECT ';
            
            query += name;
        }

        let pgQuery = { 
            name: 'SearchWP',
            text: query, 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async searchWT(wanted, total) {
        var ingredient = wanted.split(', ');
        var lg = ingredient.length, i;
        var query = 'SELECT * FROM (';

        for (i = 0; i < lg; i++) {
            var name;

            if (i == lg - 1)
                name = 'SELECT recipe_name, final_time FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + ingredient[i] + '\'' + ')  r1 WHERE final_time <= ' + total;
            else
                name = 'SELECT recipe_name, final_time FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + ingredient[i] + '\'' + ' INTERSECT ';
            
            query += name;
        }

        let pgQuery = { 
            name: 'SearchWT',
            text: query, 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async searchWC(wanted, category) {
        var ingredient = wanted.split(', ');
        var lg = ingredient.length, i;
        var query = 'SELECT * FROM (';

        for (i = 0; i < lg; i++) {
            var name;

            if (i == lg - 1)
                name = 'SELECT recipe_name, category FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + ingredient[i] + '\'' + ')  r1 WHERE category = ' + '\'' + category + '\'';
            else
                name = 'SELECT recipe_name, category FROM public.recipe r JOIN public.ingredient i ON r.recipe_id = i.recipe_id WHERE ingredient_name = ' + '\'' + ingredient[i] + '\'' + ' INTERSECT ';
            
            query += name;
        }

        let pgQuery = { 
            name: 'SearchWC',
            text: query, 
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async searchDifficulty(difficulty) {
        let pgQuery = { 
            name: 'SearchByDifficulty',
            text: 'SELECT recipe_id, recipe_name FROM public.recipe WHERE difficulty = $1;', 
            values: [difficulty],
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async searchPrep(prep) {
        let pgQuery = { 
            name: 'SearchByPrep',
            text: 'SELECT recipe_id, recipe_name FROM public.recipe WHERE prep_time <= $1;', 
            values: [prep],
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async searchTotal(total) {
        let pgQuery = { 
            name: 'SearchByTotal',
            text: 'SELECT recipe_id, recipe_name FROM public.recipe WHERE final_time <= $1;', 
            values: [total],
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async searchCategory(category) {
        let pgQuery = { 
            name: 'SearchByCategory',
            text: 'SELECT recipe_id, recipe_name FROM public.recipe WHERE category = $1;', 
            values: [category],
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async sortSearchP(userID, id) {
        let pgQuery = { 
            name: 'SearchResultsPop',
            text: 'SELECT recipe_name FROM public.searchR WHERE user_id = $1 AND searchid = $2 ORDER BY score DESC;', 
            values: [userID, id],
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async sortSearchPr(userID, id) {
        let pgQuery = { 
            name: 'SearchResultsPr',
            text: 'SELECT recipe_name FROM public.searchR WHERE user_id = $1 AND searchid = $2 ORDER BY prep ASC;', 
            values: [userID, id],
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async sortSearchF(userID, id) {
        let pgQuery = { 
            name: 'SearchResultsF',
            text: 'SELECT recipe_name FROM public.searchR WHERE user_id = $1 AND searchid = $2 ORDER BY total ASC;', 
            values: [userID, id],
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async sortSearchD(userID, id) {
        let pgQuery = { 
            name: 'SearchResultsD',
            text: 'SELECT recipe_name FROM public.searchR WHERE user_id = $1 AND searchid = $2 ORDER BY difficulty ASC;', 
            values: [userID, id],
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else if (answer.rows.length == 0) 
                return Promise.resolve('no rows');
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async getSearchRInfo(nameR) {
        let pgQuery = { 
            name: 'RecipeSomeInfo',
            text: 'SELECT score, prep_time, final_time, difficulty FROM public.recipe WHERE recipe_name = $1;', 
            values: [nameR],
        };

        try {
            let answer = await client.query(pgQuery);

            if (answer != null && answer.rows.length > 0) {
                return Promise.resolve(answer.rows);
            }
            else
                return Promise.resolve(null);
        } catch(e1) {
          console.log(e1);
          return Promise.resolve(null);
        };
    }

    async getSearchId(userID) {
        let pgQuery = { 
            name: 'SearchID',
            text: 'SELECT search_id FROM public.search WHERE user_id = $1 ORDER BY search_id DESC;', 
            values: [userID],
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

    async insertIngredientsIntoDatabase(recipeId ,nrIngredients, ingredients) {
        //inseram ingredientul in baza de date
        let pgQuery = 'INSERT INTO public.ingredient (recipe_id, ingredient_name, score, search_score) VALUES ($1, $2, $3, $4);';
        
        for (var i = 0; i < nrIngredients; i++)  {
            var score = 0, search = 0;
            var values = [recipeId, ingredients[i], score, search];

            try {
                let result = await client.query(pgQuery, values); 
                if (result == null) 
                    return Promise.resolve(null);
                else {
                    let selectQ = 'SELECT ingredient_id, score FROM public.ingredient WHERE ingredient_name = $1 ORDER BY ingredient_id ASC;';
                    var selectV = [ingredients[i]];

                    try {
                        let res1 = await client.query(selectQ, selectV);

                        if (res1.rows.length > 1) {
                            //update scor la primul rand returnat
                            if (res1.rows.length == 2)
                                score = res1.rows[0].score + 2;
                            else
                                score = res1.rows[0].score + 1;
                            var id = res1.rows[0].ingredient_id;

                            let updateQ = 'UPDATE public.ingredient SET score = $1 WHERE ingredient_id = $2;';
                            var updateV = [score, id];

                            try {
                                let res2 = await client.query(updateQ, updateV);

                                if (res2 == null)
                                    return Promise.resolve(null);
                            } catch(err2) {
                                console.log(err2);
                                return Promise.resolve(null);
                            };
                        }
                    } catch(err1) {
                        console.log(err1);
                        return Promise.resolve(null);
                    };
                } 
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

    async getHistory(username) {
        let pgQuery = { 
            name: 'History',
            text: 'SELECT recipe_name FROM public.user u JOIN public.searchR t on u.user_id = t.user_id  WHERE username = $1 ORDER BY search_id ASC;', 
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

    async getDefaultRecipes(skip, count) {
        let pgQuery = 'SELECT recipe_name FROM public.recipe ORDER BY recipe_id DESC LIMIT $1 OFFSET $2;';
        let values = [count, skip];
        let data = await client.query(pgQuery, values);

        let recipeName = [];

        if (data != null && data.rows[0] != undefined) {
            for (let i = 0; i < data.rows.length; i++) {
                recipeName.push(data.rows[i].recipe_name);
            }

            return Promise.resolve({recipeName: recipeName});
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