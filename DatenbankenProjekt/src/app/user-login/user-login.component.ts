import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {

  signupObj: any = {
    username: '',
    email: '',
    password: ''
  };

  loginObj: any = {
    username: '',
    password: ''
  };
  
  showLoginForm: boolean = true;

  toggleForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  constructor(private http: HttpClient) {}
  onSignUp() {
    this.http.post('/api/register', this.signupObj)
      .subscribe(response => {
        console.log("Registration successful:", response);
        this.signupObj = {
          username: '',
          email: '',
          password: ''
        };
      }, error => {
        console.error("Registration error:", error);
      });
  }

  onLogin() {
    this.http.post('/api/login', this.loginObj)
      .subscribe(response => {
        console.log("Login successful:", response);
        // Handle login success (e.g., store token, redirect)
      }, error => {
        console.error("Login error:", error);
      });
  }
}
