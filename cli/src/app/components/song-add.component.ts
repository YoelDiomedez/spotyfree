import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';

import { Song } from '../models/song';

@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit{
    
    public titulo:string;
    public song: Song;
    public identity;
    public token;
    public url:string;
    public alertMsg;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
      ){
        this.titulo = 'Create Song';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1,'','','');
      }

    ngOnInit(){
        console.log('Song adder component ready!');
    }

    onSubmit(){
        this._route.params.forEach((params: Params)=>{
            let album_id = params['album'];
            this.song.album = album_id;
            this._songService.addSong(this.token, this.song).subscribe(
                (response:any) => {
                    if (!response.song) {
                        this.alertMsg = 'Internal Server Error';
                    } else {
                        this.alertMsg = 'New Song Created Successfully';
                        this.song = response.song;
                        this._router.navigate(['/song/update', response.song._id]);
                    }
                },error => {
                    var errorMsg = <any>error;
                    if(errorMsg != null){
                      this.alertMsg = error.error.msg;
                    }
                }
            );
        });
    }
}