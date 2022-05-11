console.log("=======================================================================");
console.log("Backend --> database.js");
console.log("=======================================================================");
//automatically load the.env file in the root of your project and initialize 
//the values. It will skip any variables that have already been set.
require('dotenv').config();
const pg = require('pg');
//establish connection with db
const dbConfig = { connectionString: process.env.DATABASE_URL };
let db;

if (process.env.NODE_ENV === 'test') {
  db = new pg.Client(dbConfig);
  db.connect();
} else {
  db = new pg.Pool({
    ...dbConfig,
    max: process.env.MAX_CONNECTION || 5,
  });
}

//we will be exporting 2 function , query and end --> will be used in storage.js 
module.exports = {
  query: (sql, params) => {
    console.log('SENDING QUERY | ', sql, params);
    return db.query(sql, params);
  },
  end: () => db.end(),
  POSTGRES_ERROR_CODE: {
    UNIQUE_CONSTRAINT: '23505',
  },
};
