import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{
  isSidebarOpen = false;
  user = {
    Nutzername: '',
    Email: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
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
    this.authService.logout(); // Clear the token
    console.log('User logged out');
    this.router.navigate(['/login']); // Navigate to the login page
  }

  meineListen() {
    //navigation to the list-creator-component
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


}
