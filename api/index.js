'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/spotyfree', (err, res) => {
    if(err){
        throw err;
    }else{
        console.log("Connected to Data Base");
        app.listen(port, function(){
            console.log("API REST Server running at http://localhost:"+port);
        });
    }
});