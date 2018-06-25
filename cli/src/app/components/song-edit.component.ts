import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UploadService } from '../services/upload.service';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';

import { Song } from '../models/song';

@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit{
    
    public titulo:string;
    public song: Song;
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
        private _songService: SongService,
        private _uploadService: UploadService
      ){
        this.titulo = 'Update Song';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1,'','','');
        this.is_edit = true;
      }

    ngOnInit(){
        console.log('Song updater component ready!');
        this.getSong();
    }

    getSong(){
        this._route.params.forEach((params: Params)=>{
            let id = params['id'];
            this._songService.getSong(this.token, id).subscribe(
                (response:any) => {
                    if (!response.song) {
                        this._router.navigate(['/']);
                    } else {
                        this.song = response.song;
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
            this._songService.editSong(this.token, id,this.song).subscribe(
                (response:any) => {
                    if (!response.song) {
                        this.alertMsg = 'Internal Server Error';
                    } else {
                        if (!this.filesToUpload) {
                            this._router.navigate(['/album', response.song.album]);
                        } else {
                            this._uploadService.makeFileRequest(this.url+'upload-file-song/'+id, this.filesToUpload, this.token, 'file')
                                .then(
                                    ()=>{
                                        this._router.navigate(['/album', response.song.album]);
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