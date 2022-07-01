console.log("=======================================================================");
console.log("Backend --> app.js");
console.log("=======================================================================");

const express = require('express');
const app = express();
const cors = require('cors');
const createHttpError = require('http-errors');
const { addRecord, getRecord, deleteRecord } = require('./storage');//get and add are the two functions imported from storage.js and can be used by just calling them 

app.use(cors())
app.use(express.json())

//========================================================
//endpoint --> get method
//========================================================
app.get('/storage', (req, res, next) => {
    //step 1 : retrieve user input from the url typed 
    //example: http://localhost:3000/storage?key=value
    //                _________________________|
    //               |
    const { key } = req.query;
    if (!key) {
        return next(createHttpError(400, 'Please provide a key'));
    }
    //Step two and three process the request , send response
    return getRecord(key)
        .then((result) => {
            console.log("result: " + result);
            if (!result) return next(createHttpError(404, `Key ${key} not found`));
            res.status(200).json(JSON.parse(result));
        })
        .catch(next);
})



//========================================================
//endpoint --> post method
//========================================================
app.post('/storage', (req, res, next) => {
    //step 1 : retrieve user input from the url typed 
    const extractedData = req.body;
    
    console.log("req.body" + JSON.stringify(req.body));
    if (!extractedData) {
        return next(createHttpError(400, 'Please provide a data'));
    }
    // Destructuring Assignment: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    const { key, expireDuration } = req.query;
    //Step two and three process the request , send response
    return addRecord(extractedData, key, expireDuration)
        .then((responsekey) => {
            console.log("responsekey: " + responsekey);
            res.status(201).json({ responsekey })
        })
        .catch(next);
           
})


//========================================================
//endpoint --> post method
//========================================================
app.post('/storage/shareId', (req, res, next) => {
    //step 1 : retrieve user input from the url typed 
    const extractedData = req.body.data;
    const extractedkey = req.body.key;
    
    console.log("req.body" + JSON.stringify(req.body));
    if (!extractedData) {
        return next(createHttpError(400, 'Please provide a data'));
    }
    // Destructuring Assignment: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    const { expireDuration } = req.query;
    //Step two and three process the request , send response
    return addRecord(extractedData, extractedkey, expireDuration)
        .then((responsekey) => {
            console.log("responsekey: " + responsekey);
            res.status(201).json({ responsekey })
        })
        .catch(next);
})

//[working]
//========================================================
//endpoint --> delete method
//========================================================
app.delete('/storage', (req, res, next) => {
    //step 1 : retrieve user input from the url typed 
    const currentTimeStamp = req.query.currentTimeStamp;
    console.log("expireTimeStamp: " + currentTimeStamp);

    //Step two and three process the request , send response
    return deleteRecord(currentTimeStamp)
        .then((response) => {
            console.log("response: " + response);
            res.status(200).json({response});
        })
        .catch(next);
})

//api to get all from storage
app.get('/storage/all' , (req,res,next) => {
    //isExpired can only be 1 or 0 , 0-->Not expired , 1-->expired
    const {lastId, pageSize , isExpired} = req.query;
    return getAll(lastId, pageSize , isExpired)
    .then((result) => res.json(result))
    .catch(next);

})


//update 
app.put('/storage' , (req,res,next) => {
    const {key , expiryDate} = req.query;
    return update(key, expiryDate)
    .then(() => res.sendStatus(200))
    .catch(next);

})


//========================================================
//endpoint --> MF to handle error that are not caused by the CRUD endpoint --> like typing the wrong url
//========================================================
app.use((req, res, next) => next(createHttpError(404, `Unknown resource ${req.method} ${req.originalUrl}`)))
app.use((error, req, res, next) => {
    console.error(error);
    next(error);
})
app.use((error, req, res) => res.status(error.status || 500).json({ error: error.message || 'Unknown error' }));

module.exports = app;