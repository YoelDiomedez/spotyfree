'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_key';

exports.ensureAuth = function(req, res, next){

    if (!req.headers.authorization) {
        return res.status(403).send({msg: 'Headers are missing'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {

        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({msg: 'Token expired'});
        }
        
    } catch (ex) {
        //console.log(ex);
        return res.status(404).send({msg: 'Token not found'});
    }

    req.user = payload;

    next();
};