import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';

import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit{
    
    public album: Album;
    public songs: Song[];
    public identity;
    public token;
    public url:string;
    public alertMsg;
    public confirmado;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService
      ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
      }

    ngOnInit(){
        console.log('Album Detail Component ready!');
        this.getAlbum();
    }

    getAlbum(){

        this._route.params.forEach((params: Params)=>{
            let id = params['id'];

            this._albumService.getAlbum(this.token, id).subscribe(
                (response:any) => {
                    if (!response.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = response.album;
                        this._songService.getSongs(this.token, response.album._id).subscribe(
                            (response:any)=>{
                                if (!response.songs) {
                                    this.alertMsg = "There's no Songs yet";
                                } else {
                                    this.songs = response.songs;
                                }
                            },error=>{
                                var errorMsg = <any>error;
                                if(errorMsg != null){
                                    this.alertMsg = error.error.msg;
                                }
                            }
                        );
                    }
                },
                error => {
                    var errorMsg = <any>error;
                    if(errorMsg != null){
                        this.alertMsg = error.error.msg;
                    }
                }
            );
        });
    }

    onDeleteConfirm(id){
        this.confirmado = id;
    }

    onCancelSong(){
        this.confirmado = null;
    }

    onDeleteSong(id){
        this._songService.deleteSong(this.token, id).subscribe(
            (response:any) =>{
                if (!response.song) {
                    this.alertMsg = 'Internal Sever Error';
                } else {
                    this.getAlbum();
                }
            },
            error => {
                var errorMsg = <any>error;
                if(errorMsg != null){
                    this.alertMsg = error.error.msg;
                } 
            }
        );
    }

    startPlayer(song){
        let song_player = JSON.stringify(song);
        let file_path = this.url + 'get-file-song/' + song.file;
        let image_path = this.url +'get-image-album/' + song.album.image;

        localStorage.setItem('sound_song', song_player);
        
        document.getElementById('audio-source').setAttribute('src', file_path);
        document.getElementById('play-image-album').setAttribute('src', image_path);

        (document.getElementById('player') as any).load();
        (document.getElementById('player') as any).play();
        
        document.getElementById('play-song-title').innerHTML = song.name;
        document.getElementById('play-song-artist').innerHTML = song.album.artist.name;  

    }
}