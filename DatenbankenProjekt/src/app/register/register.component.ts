import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  signupUsers: any[] = [];
  signupObj: any = {
    username: '',
    email: '',
    password: ''
  };

  constructor() {
  }

  onSubmit() {
  }

  onSignUp(){

  }
}
