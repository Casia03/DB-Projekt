import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  
  // Objekt für die Registrierung
  signupObj: any = {
    username: '',
    email: '',
    password: ''
  };

  // Objekt für den Login
  loginObj: any = {
    username: '',
    password: ''
  };

  isSidebarOpen = false;
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  // Variable zur Steuerung der Anzeige des Login-Formulars
  showLoginForm: boolean = true;

  // Methode zum Umschalten zwischen Login- und Registrierungsformular
  toggleForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  constructor(
    private http: HttpClient, // Injection von HttpClient für HTTP-Anfragen
    private router: Router, // Injection von Router für Navigation
    private route: ActivatedRoute, // Injection von ActivatedRoute für aktuelle Routeninformationen
    private authService: AuthService, // Injection von AuthService für Authentifizierungslogik
    private dialog: MatDialog // Injection von MatDialog für Dialog-Fenster
  ) {}

  // Methode zur Registrierung eines neuen Benutzers
  onSignUp() {
    this.http.post('/api/register', this.signupObj) // POST-Anfrage an die Registrierungs-API
      .subscribe(response => {
        console.log('Registration successful:', response);
        this.showDialog('Registration Successful', 'You have registered successfully.'); // Erfolgsdialog anzeigen
        // Zurücksetzen des Registrierungsobjekts
        this.signupObj = {
          username: '',
          email: '',
          password: ''
        };
      }, error => {
        console.error('Registration error:', error);
        this.showDialog('Registration Failed', 'An error occurred during registration.'); // Fehlerdialog anzeigen
      });
  }

  // Methode zum Einloggen eines Benutzers
 // Method to log in a user
// Method to log in a user
onLogin() {
  this.http.post('/api/login', this.loginObj) // POST request to login API
      .subscribe(
          (response: any) => {
              this.showDialog('Login Successful', 'You have logged in successfully.'); // Show success dialog
              
              // Token from server response
              const token = response.token;
              
              // Store the token using AuthService
              this.authService.login(token);
              
              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/user'; // Get return URL
              this.router.navigate([returnUrl]); // Navigate to return URL
          },
          (error) => {
              this.showDialog('Login Failed', 'Invalid username or password.'); // Show error dialog
          }
      );
}


  // Methode zum Anzeigen eines Dialogs
  showDialog(title: string, message: string): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: title,
        message: message
      }
    });
  }
}
