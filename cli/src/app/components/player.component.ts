import { Component, OnInit } from '@angular/core';
import { Song } from '../models/song';
import { GLOBAL } from '../services/global';

@Component({
    selector: 'player',
    template: `
        <div class="album-image">
            <span *ngIf="song.album">
                <img id="play-image-album" src="{{url + 'get-image-album/' + song.album.image}}"/>
            </span>
            <span *ngIf="!song.album">
                <img id="play-image-album" src="assets/media/default.png"/>
            </span>
        </div>
        <div class="audio-file">
            <p>Now Playing</p>
            <span id="play-song-title">
                {{song.name}}
            </span>
            •
            <span id="play-song-artist">
                <span *ngIf="song.album.artist">
                    {{song.album.artist.name}}
                </span>
            </span>
            <audio *ngIf="song.file" controls id="player">
                <source id="audio-source" src="{{url + 'get-file-song/' + song.file}}" type="audio/mpeg"/>
                <p>Your browser does not support HTML5 audio</p>
            </audio>
            <audio *ngIf="!song.file" controls id="player">
                <source id="audio-source" src="assets/media/default.wav" type="audio/mpeg"/>
                <p>Your browser does not support HTML5 audio</p>
            </audio>
        </div>
    `
})

export class PlayerComponent implements OnInit{
    
    public url:string;
    public song;

    constructor(){
        this.url = GLOBAL.url;
        this.song = new Song(1,'','','');
    }

    ngOnInit(){
        console.log('Loading Player');
        var song = JSON.parse(localStorage.getItem('sound_song'));
        if (song) {
            this.song = song;
        } else {
            this.song = new Song(1,'','','');
        }
    }
}