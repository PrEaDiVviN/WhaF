const { Pool } = require('pg');
const user = require('./user.js');

//database connection
const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'proiectTW',
    password: 'proiect',
    port: 5432,
});

const userModel= new user();

client.connect();

module.exports = class settings {

    async getNrInstructiuni() {
        let pgQuery = 'SELECT nrinstructiuni FROM public.setari';
        try {
            let result = await client.query(pgQuery); 
            if (result.rows != undefined) {
                return Promise.resolve(result.rows[0].nrinstructiuni);
            }
            return Promise.resolve(false);
        }
        catch(err) {
            console.log(err);
            return Promise.resolve(false);
        };
    }

    async getNrIngrediente() {
        let pgQuery = 'SELECT nringrediente FROM public.setari';
        try {
            let result = await client.query(pgQuery); 
            if (result.rows != undefined) {
                return Promise.resolve(result.rows[0].nringrediente);
            }
            return Promise.resolve(false);
        }
        catch(err) {
            console.log(err);
            return Promise.resolve(false);
        };
    }

    async modifyNumarIngrediente(nringrediente) {
        let pgQuery = 'UPDATE public.setari SET nringrediente = $1';
        let values = [nringrediente];
        try {
            await client.query(pgQuery,values);
        }
        catch(e) {
            console.log(e);
            return Promise.resolve(null);
        }
        return Promise.resolve(true);
    }

    async modifyNumarInstructiuni(nrinstructiuni) {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log(nrinstructiuni);
        console.log(typeof(nrinstructiuni));
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        let pgQuery = 'UPDATE public.setari SET nrinstructiuni = $1';
        let values = [nrinstructiuni];
        try {
            await client.query(pgQuery,values);
        }
        catch(e) {
            console.log(e);
            return Promise.resolve(null);
        }
        return Promise.resolve(true);
    }

    async deleteSessions() {
        let pgQuery1 = 'SELECT * FROM public.session JOIN public.user ON public.user.user_id = public.session.user_id WHERE type != \'admin\'';
 
        try {
            await client.query('BEGIN');
            let data = await client.query(pgQuery1);
            if(data.rows!= undefined && data.rows!= null && data.rows[0] != undefined && data.rows[0] != null)
            for(let i = 0; i <data.rows.length ; i++) {
                let username = data.rows[i].username;
                let userid = data.rows[i].user_id;
                let answer = await userModel.deleteUser(username,userid);
                if(answer == null || answer == undefined) {
                    await client.query('ROLLBACK');
                    return Promise.resolve(null);
                }
            }
            await client.query('COMMIT');
            return Promise.resolve(true);
        } catch (e) {
            console.log(e);
            await client.query('ROLLBACK');
            return Promise.resolve(null);
        }
    }
}

