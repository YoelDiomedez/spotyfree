import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from './services/global';
import { UserService } from './services/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit{
  public title = 'SpotyFree';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMsg;
  public alertRegister;
  public url:string

  constructor(
    private _userService: UserService,
    private _router: Router
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit(){
    //getting data user
    this._userService.login(this.user).subscribe(
      (response: any) => {
        let identity = response.user;
        this.identity = identity;

        if(!this.identity._id){
          alert('Bad loggin');
        }else{
          //create an element to localstorage for user data
          localStorage.setItem('identity', JSON.stringify(identity));

          this._userService.login(this.user, 'true').subscribe(
            (response: any) => {
              let token = response.token;
              this.token = token;
      
              if(this.token.length <= 0){
                alert('Token not found');
              }else{
                //create an element to localstorage for token
                localStorage.setItem('token', token);
                this.user = new User('','','','','','ROLE_USER','');
              }
            },
            error => {
              var errorMsg = <any>error;
              if(errorMsg != null){
                this.errorMsg = error.error.msg;
              }
            }
          );
        }
      },
      error => {
        var errorMsg = <any>error;
        if(errorMsg != null){
          this.errorMsg = error.error.msg;
        }
      }
    );
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/']);
  }

  onSubmitRegister(){
    console.log(this.user_register);
    this._userService.signup(this.user_register).subscribe(
      (response: any) => {
        let user = response.user;
        this.user_register = user;

        if (!user._id) {
          this.alertRegister = 'Sign up went wrong';
        } else {
          this.alertRegister = "You're a member now, log in as: "+this.user_register.email;
          this.user_register = new User('','','','','','ROLE_USER','');
        }
      },
      error => {
        var errorMsg = <any>error;
        if(errorMsg != null){
          this.errorMsg = error.error.msg;
        }
      }
    );
  }
}
