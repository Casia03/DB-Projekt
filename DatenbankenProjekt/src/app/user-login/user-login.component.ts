import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { DialogComponent } from '../dialog/dialog.component'; 

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

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog // Inject MatDialog
  ) {}

  onSignUp() {
    this.http.post('/api/register', this.signupObj)
      .subscribe(response => {
        this.showDialog('Registration Successful', 'You have registered successfully.');
        this.signupObj = {
          username: '',
          email: '',
          password: ''
        };
      }, error => {
        this.showDialog('Registration Failed', 'An error occurred during registration.');
      });
  }

  onLogin() {
    this.http.post('/api/login', this.loginObj)
      .subscribe(response => {
        this.showDialog('Login Successful', 'You have logged in successfully.');
        // Handle login success (e.g., store token, redirect)
        this.authService.login('dummyToken'); // Replace with actual token logic
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/user';
        this.router.navigate([returnUrl]);
      }, error => {
        this.showDialog('Login Failed', 'Invalid username or password.');
      });
  }

  showDialog(title: string, message: string): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: title,
        message: message
      }
    });
  }
}
