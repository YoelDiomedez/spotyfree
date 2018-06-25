'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
    var songId = req.params.id;
    Song.findById(songId).populate({path: 'album'}).exec((err, song)=>{
        if (err) {
            res.status(500).send({msg: 'Internal Server Error'});
        } else {
            if (!song) {
                res.status(404).send({msg: 'Song not found'});
            } else {
                res.status(200).send({song});
            }
        }
    });
}

function saveSong(req, res){
    var song = new Song();
    var params =  req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songSaved)=>{
        if (err) {
            res.status(500).send({msg: 'Internal Server Error'});
        } else {
            if (!songSaved) {
                res.status(404).send({msg: 'Song not found'});
            } else {
                res.status(200).send({song: songSaved});
            }
        }
    });
}

function getSongs(req, res){
    var albumId = req.params.album;
    if (!albumId) {
        var find = Song.find({}).sort('number');
    } else {
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album',
        populate:{
            path: 'artist',
            models: 'Artist'
        }
    }).exec((err, songs)=>{
        if (err) {
            res.status(500).send({msg: 'Internal Server Error'});
        } else {
            if (!songs) {
                res.status(404).send({msg: 'Songs not found'});
            } else {
                res.status(200).send({songs});
            }
        }
    });
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated)=>{
        if (err) {
            res.status(500).send({msg: 'Internal Server Error'});
        } else {
            if (!songUpdated) {
                res.status(404).send({msg: 'Song not found'});
            } else {
                res.status(200).send({song: songUpdated});
            }
        }
    });
}

function deleteSong(req, res){
    var songId = req.params.id;
    Song.findByIdAndRemove(songId, (err, songRemoved)=>{
        if (err) {
            res.status(500).send({msg: 'Internal Server Error'});
        } else {
            if (!songRemoved) {
                res.status(404).send({msg: 'Song not found'});
            } else {
                res.status(200).send({song: songRemoved});
            }
        }
    });
}

function uploadFile(req, res){

    var songId = req.params.id;
    var file_name = 'Not uploaded';

    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'mp3' || file_ext == 'm4a') {

            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
                if (!songUpdated) {
                    res.status(404).send({msg: 'Error Updating'});
                } else {
                    res.status(200).send({song: songUpdated});
                }
            });

        } else {
            res.status(200).send({msg: 'Extention not valid'});
        }
    } else {
        res.status(200).send({msg: 'Have not uploaded any image yet'});
    }
}

function getSongFile(req, res){

    var songFile = req.params.songFile;
    var path_file = './uploads/songs/'+songFile;

    fs.exists(path_file, function(exists){
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({msg: 'File Song not found'});
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}