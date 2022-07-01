console.log("=======================================================================");
console.log("Backend --> storage.js");
console.log("=======================================================================");
const createHttpError = require('http-errors');
const { nanoid } = require('nanoid');//nanoid is a module build in npm to generate nano id
const { query, POSTGRES_ERROR_CODE } = require('./databaseConfig');
//table name for db
const TABLE_NAME = 'storage_tab';
module.exports.TABLE_NAME = TABLE_NAME;
//this sql is used to create the table --> used at ./script/init_db.js file
const CREATE_TABLE_SQL = `
    CREATE TABLE ${TABLE_NAME} (
        id SERIAL primary key,
        key VARCHAR unique not null,
        data VARCHAR not null,
        expire_on INT not null
    );
`;
module.exports.CREATE_TABLE_SQL = CREATE_TABLE_SQL;

//this is to generate the timestamp of n days later --> expiry time
function getTimestampAfterNDays(n) {
    return Math.floor(new Date().getTime() / 1000) + n * 24 * 60 * 60;
    ///                              |_this is to set the date , the parameter is the date to be set --e.g new Date().setDate(5)--> the date will be set to 5 may
}
module.exports.getTimestampAfterNDays = getTimestampAfterNDays;



let Storage = {
    //this is all the functions which is going to be called by the app.js when an endpoint is being called in app.js 
    //perform task such as query the database and returning the result back to the server
    addRecord: function (data, key = nanoid(), expireAfterDays = 7) {
        const expireOn = getTimestampAfterNDays(expireAfterDays);
        const sql = `INSERT INTO ${TABLE_NAME} 
                 (key, data, expire_on) 
                 VALUES
                 ($1, $2, $3) 
                 RETURNING key`
        //        this is the sql command that will be executed to add data into  db
        //             |     
        //             |          array of data to be passed to use to add inside the db  
        //             |                |            
        return query(sql, [key, JSON.stringify(data), expireOn,])
            .then((response) => {
                console.log("Insert successfully....");
                //sanity check 
                console.log(response);
                return response.rows[0].key
            })
            .catch((error) => {
                //sanity check
                console.log(error);
                if (error.code === POSTGRES_ERROR_CODE.UNIQUE_CONSTRAINT) {
                    throw createHttpError(400, `Key ${key} already exists`);
                }
                else throw error.code; // unexpected error
            });
    },

    getRecord: function (key) {

        const sql = `SELECT data FROM ${TABLE_NAME} 
                 where key = $1`
        //        this is the sql command that will be executed to retrieve data from  db
        //             |     
        //             |      array of data to be passed to use in the condition of retrieving data
        //             |        |         
        return query(sql, [key]).then((result) => {
            console.log("Get successfully....");
            if (!result.rows.length) return null;
            return (result.rows[0].data);
        });
    },

    //deleting record --> [working]
    deleteRecord: function (currentTimeStamp) {

        const sql = `DELETE FROM ${TABLE_NAME} 
                 where expire_on < $1`
        //        this is the sql command that will be executed to retrieve data from  db
        //             |     
        //             |      array of data to be passed to use in the condition of retrieving data
        //             |        |         
        return query(sql, [currentTimeStamp])
            .then((result) => {
                console.log("result: " + result.rowCount);
                return (result.rowCount);
            })
            .catch((error) => {
                console.log("error: " + error);
            });
    },

    getAll: function (lastId = 0, limit = 20 , isExpired = 1) {
        const operator = +isExpired ? '<=' : '>' ;
        const now = getTimestampAfterNDays(0);
        //sql
        const sql = `SELECT * FROM ${TABLE_NAME} where id > $1 AND expire_on ${operator} $2 LIMIT $3`;
        //execute query
        return query(sql, [lastId,now, limit]).then((result) => {
            console.log("Get successfully....");
            return result.rows;
        });
    },



    update: function (key , expiryDate) {
        //sql
        const sql = `UPDATE ${TABLE_NAME} SET expire_on = $1 WHERE key = $2`
        //execute query
        return query(sql, [expiryDate,key]).then((result) => {
            console.log("Get successfully....");
            if (!result.rowCount) throw createHttpError(400, `key ${key} not found!`);//if no rowCOunt means nothing is updated

        });
    },



}

module.exports = Storage;