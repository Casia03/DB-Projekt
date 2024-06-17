import { Component } from '@angular/core';

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

  // Control which form to show
  showLoginForm: boolean = true;

  constructor() {
    // Load users from localStorage
    const storedUsers = localStorage.getItem('signUpUsers');
    this.signupUsers = storedUsers ? JSON.parse(storedUsers) : [];
  }

  toggleForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  onSignUp() {
    const userExists = this.signupUsers.some(user => user.username === this.signupObj.username);
    
    if (!userExists) {
      this.signupUsers.push({ ...this.signupObj }); // Create a new object to avoid reference issues
      localStorage.setItem('signUpUsers', JSON.stringify(this.signupUsers));
      console.log("User " + JSON.stringify(this.signupObj) + " successfully signed up");

      // Clear the form
      this.signupObj = {
        username: '',
        email: '',
        password: ''
      };
    } else {
      console.log("User already exists");
    }
  }

  onLogin() {
    const user = this.signupUsers.find(user => user.username === this.loginObj.username && user.password === this.loginObj.password);

    if (user) {
      console.log("Login successful for user " + this.loginObj.username);
    } else {
      console.log("Invalid username or password");
    }

    // Clear the login form
    this.loginObj = {
      username: '',
      password: ''
    };
  }
}
