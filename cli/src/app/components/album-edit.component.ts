import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UploadService } from '../services/upload.service';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit{
    
    public titulo:string;
    public album: Album;
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
        private _albumService: AlbumService,
        private _uploadService: UploadService
      ){
        this.titulo = 'Update Album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('','',2018,'','');
        this.is_edit = true;
      }

    ngOnInit(){
        console.log('Album updater component ready!');
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

    onSubmit(){
        this._route.params.forEach((params: Params)=>{
            let id = params['id'];
            this._albumService.editAlbum(this.token, id, this.album).subscribe(
                (response:any) => {
                    if (!response.album) {
                       this.alertMsg = 'Internal Server Error';
                    } else {
                        if (!this.filesToUpload) {
                            this._router.navigate(['/artist', response.album.artist]);
                        } else {
                            this._uploadService.makeFileRequest(this.url+'upload-image-album/'+id, this.filesToUpload, this.token, 'image')
                            .then(
                                ()=>{
                                    this._router.navigate(['/artist', response.album.artist]);
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