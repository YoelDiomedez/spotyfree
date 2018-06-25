import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit{
    
    public titulo:string;
    public album: Album;
    public identity;
    public token;
    public url:string;
    public alertMsg;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService
      ){
        this.titulo = 'Create Album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('','',2018,'','');
      }

    ngOnInit(){
        console.log('Album adder component ready!');
    }

    onSubmit(){
        this._route.params.forEach((params: Params)=>{
            let artist_id = params['artist'];
            this.album.artist = artist_id;
            this._albumService.addAlbum(this.token, this.album).subscribe(
                (response:any) => {
                    if (!response.album) {
                        this.alertMsg = 'Internal Server Error';
                    } else {
                        this.alertMsg = 'New album created Successfully';
                        this.album = response.album;
                        this._router.navigate(['/album/update', response.album._id]);
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