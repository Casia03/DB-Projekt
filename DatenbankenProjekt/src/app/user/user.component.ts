import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isSidebarOpen = false;
  isEditingUsername = false;
  isEditingEmail = false;
  user = {
    Nutzername: '',
    Email: '',
    Passwort: ''
  };

  constructor(private authService: AuthService,
                private router: Router) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.authService.getUserInfo().subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching user info:', error);
      }
    );
  }
  logout(): void {
    this.authService.logout();
    console.log('User logged out');
    this.router.navigate(['/login']);
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  toggleEdit(field: string): void {
    if (field === 'username') {
      this.isEditingUsername = !this.isEditingUsername;
      if (!this.isEditingUsername) {
        this.updateUsername();
      }
    }else if (field === 'email') {
      this.isEditingEmail = !this.isEditingEmail;
      if (!this.isEditingEmail) {
        this.updateEmail();
      }
    }
  }
  updateUsername(): void {
    this.authService.updateUsername(this.user.Nutzername).subscribe(
      (response) => {
        console.log('Username updated successfully:', response);
        this.user.Nutzername = response.user.Nutzername; // Update local user info
      },
      (error) => {
        console.error('Error updating username:', error);
      }
    );
  }
  updateEmail(): void {
    this.authService.updateEmail(this.user.Email).subscribe(
      (response) => {
        console.log('Email updated successfully:', response);
        this.user.Email = response.user.Email; // Update local user info
      },
      (error) => {
        console.error('Error updating email:', error);
      }
    );
  }
  updatePassword(): void {
    this.authService.updatePassword(this.user.Passwort).subscribe(
        (response) => {
            console.log('Password updated successfully:', response.message);
        },
        (error) => {
            console.error('Error updating password:', error);
        }
    );
}

}
