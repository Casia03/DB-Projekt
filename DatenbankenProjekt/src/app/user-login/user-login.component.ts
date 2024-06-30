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
  onLogin() {
    this.http.post('/api/login', this.loginObj) // POST-Anfrage an die Login-API
      .subscribe(response => {
        this.showDialog('Login Successful', 'You have logged in successfully.'); // Erfolgsdialog anzeigen
        // Login-Erfolg behandeln (z.B. Token speichern, Weiterleitung)
        this.authService.login('dummyToken'); // Ersetzen durch die tatsächliche Token-Logik
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/user'; // Rücksprung-URL ermitteln
        this.router.navigate([returnUrl]); // Navigation zur Rücksprung-URL
      }, error => {
        this.showDialog('Login Failed', 'Invalid username or password.'); // Fehlerdialog anzeigen
      });
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
