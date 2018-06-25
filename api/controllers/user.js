'user strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function prueba(req, res){
    res.status(200).send({
        msg: 'User Controller'
    });
}

function saveUser(req, res){

    var user =  new User();
    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';

    if(params.password){

        bcrypt.hash(params.password, null, null, function(err, hash){

            user.password = hash;

            if(user.name != '' && user.surname != '' && user.email != ''){
                
                user.save((err, userStored) => {
                    if(err){
                        res.status(500).send({msg: 'Error Storage'});
                    }else{
                        if(!userStored){
                            res.status(404).send({msg: 'Error Storage'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            }else{
                res.status(200).send({msg: 'All is required'});
            }
        });
    }else{
        res.status(200).send({msg: 'Password required'});
    }
}

function loginUser(req, res){
    
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({msg: 'Error Query'});
        }else{
            if(!user){
                res.status(404).send({msg: 'User Not Found'});
            }else{
                //comprobar contraseña
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        //devolver los datos del usuario logged
                        if(params.gethash){
                            //devolver un token de jwl
                            res.status(200).send({
                                token: jwt.createToken(user) 
                            });
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({msg: 'Password Wrong'});
                    }
                });
            }
        }
    });
}

function updateUser(req, res){

    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        return res.status(500).send({msg: 'Error Server'});
    }

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if(err){
            res.status(500).send({msg: 'Error Server'});
        } else {
            if (!userUpdated) {
                res.status(404).send({msg: 'Error Updating'});
            } else {
                res.status(202).send({user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res){

    var userId = req.params.id;
    var file_name = 'Not uploaded';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {

                if (!userUpdated) {
                    res.status(404).send({msg: 'Error Updating'});
                } else {
                    res.status(200).send({image: file_name, user: userUpdated});
                }
            });

        } else {
            res.status(200).send({msg: 'Extention not valid'});
        }
    } else {
        res.status(200).send({msg: 'Have not uploaded any image yet'});
    }
}

function getImageFile(req, res){

    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;

    fs.exists(path_file, function(exists){
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({msg: 'Image not found'});
        }
    });
}

module.exports = {
    prueba,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};