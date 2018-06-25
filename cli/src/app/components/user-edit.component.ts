import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit{
    
    public titulo:string;
    public user: User;
    public identity;
    public token;
    public alertMsg;
    public filesToUpload: Array<File>;
    public url:string;

    constructor(
        private _userService: UserService
      ){
        this.titulo = 'My Account';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
      }

    ngOnInit(){
        console.log('User edit component ready!');
    }

    onSubmit(){
        this._userService.updateUser(this.user).subscribe(

            (response:any) => {

                if (!response.user) {
                    this.alertMsg = "Couldn't update your account";
                } else {

                    localStorage.setItem('identity', JSON.stringify(response.user));
                    document.getElementById("identity_name").innerHTML = this.user.name;
                    
                    if (!this.filesToUpload) {
                        
                    } else {
                        this.makeFileRequest(this.url+'upload-image-user/'+this.user._id,this.filesToUpload).then(
                            (result:any)=>{
                                let res = JSON.parse(result);
                                this.user.image = res.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));
                                let image_path = this.url+'get-image-user/'+this.user.image;
                                document.getElementById("image-logged").setAttribute('src', image_path);
                            }
                        );
                    }
                    this.alertMsg = "Account updated successfully";
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

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    makeFileRequest(url: string, files: Array<File>){
        
        var token = this.token;

        return new Promise(function(resolve, reject){
            
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();

            for(var i=0; i<files.length; i++){
                formData.append('image', files[i], files[i].name);
            }

            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4) {
                    if(xhr.status == 200){
                        resolve(xhr.response);
                    }else{
                        reject(xhr.response);
                    }
                }
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}