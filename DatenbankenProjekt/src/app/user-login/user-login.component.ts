import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})

export class UserLoginComponent {

  signupUsers: any[] = [];
  signupObj: any = {
    username: '',
    email: '',
    password: ''
  };

  loginObj: any = {
    username: '',
    password: ''
  };

  constructor() {
  }

  onSignUp(){
    this.signupUsers.push(this.signupObj)
    localStorage.setItem('signUpUsers', JSON.stringify(this.signupUsers))
    this.signupObj = {
      username: '',
      email: '',
      password: ''
    };
  }

  onLogin(){

  }

}
