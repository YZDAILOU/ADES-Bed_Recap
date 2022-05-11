const { Client } = require('pg')

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "Password",
    database: "gppa"
})

client.connect();

//if db connected , will print 
client.on("connect", () => {
    console.log("Successfully connected.....");
});

//if end will print this
client.on("end", () => {
    console.log("Connection ended...");
})


//we will be exporting 2 function , query and end --> will be used in storage.js 
module.exports = {
    query: (sql, params) => {
        console.log('SENDING QUERY | ', sql, params);
        return client.query(sql, params);
    },
    end: () => client.end(),
    POSTGRES_ERROR_CODE: {
        UNIQUE_CONSTRAINT: '23505',
    },

};

