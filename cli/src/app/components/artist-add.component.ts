import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';

@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit{
    
    public titulo:string;
    public artist: Artist;
    public identity;
    public token;
    public url:string;
    public alertMsg;

    constructor(
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
      ){
        this.titulo = 'Create Artist';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','');
      }

    ngOnInit(){
        console.log('Artist adder component ready!');
    }

    onSubmit(){
        this._artistService.addArtist(this.token, this.artist).subscribe(
            (response:any) => {
                this.artist = response.artist;
                if (!response.artist) {
                    alert('Internal Server Error');
                } else {
                    this.alertMsg = 'New Artist created Successfully';
                    this.artist = response.artist;
                    this._router.navigate(['/artist/update', response.artist._id]);
                }
            },error => {
                var errorMsg = <any>error;
                if(errorMsg != null){
                  this.alertMsg = error.error.msg;
                }
            }
        );
    }
}