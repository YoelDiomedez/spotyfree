import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit{
    
    public titulo:string;
    public artist: Artist;
    public identity;
    public token;
    public url:string;
    public alertMsg;
    public is_edit;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _uploadService: UploadService
      ){
        this.titulo = 'Update Artist';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','');
        this.is_edit = true;
      }

    ngOnInit(){
        console.log('Artist updater component ready!');
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

    onSubmit(){
        this._route.params.forEach((params: Params) => {
            
            let id = params['id'];

            this._artistService.editArtist(this.token, id, this.artist).subscribe(
                (response:any) => {

                    if (!response.artist) {
                        this.alertMsg = 'Internal Server Error';

                    } else {
                        if (!this.filesToUpload) {
                            this._router.navigate(['/artist', response.artist._id]);
                        } else {
                            this._uploadService.makeFileRequest(this.url+'upload-image-artist/'+id, this.filesToUpload, this.token, 'image')
                            .then(
                                () => {
                                    this._router.navigate(['/artist', response.artist._id]);
                                },
                                (error)=>{
                                    console.log(error);
                                }
                            );
                        }
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

    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}