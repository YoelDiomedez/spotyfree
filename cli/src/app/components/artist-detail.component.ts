import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';

import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit{
    
    public titulo:string;
    public artist: Artist;
    public albums: Album[];
    public identity;
    public token;
    public url:string;
    public alertMsg;
    public confirmado;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
      ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
      }

    ngOnInit(){
        console.log('Artist Detail Component ready!');
        this.getArtist();
    }

    getArtist(){

        this._route.params.forEach((params: Params)=>{
            let id = params['id'];

            this._artistService.getArtist(this.token, id).subscribe(
                (response:any) => {
                    if (!response.artist) {
                        this._router.navigate(['/']);
                    } else {
                        this.artist = response.artist;
                        //get albums too
                        this._albumService.getAlbums(this.token, response.artist._id).subscribe(
                            (response:any) =>{
                                if (!response.albums) {
                                    this.alertMsg = "There's no Albums yet";
                                } else {
                                    this.albums = response.albums;
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

    onCancelAlbum(){
        this.confirmado = null;
    }

    onDeleteAlbum(id){
        this._albumService.deleteAlbum(this.token, id).subscribe(
            (response:any)  =>{
                if (!response.album) {
                    this.alertMsg = 'Internal Sever Error';
                } else {
                    this.getArtist();
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
}