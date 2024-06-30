import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  isSidebarOpen = false;
  user = {
    vorname: 'Max Mustermann',
    geburtsdatum: '01.01.1990',
    email: 'max.mustermann@example.com',
    liste1: ['Film 1', 'Film 2', 'Film 3'],
    liste2: ['Film A', 'Film B', 'Film C']
  };
  newListName: string = '';

  constructor(private router: Router) {}

  logout() {
    // Implement your logout logic here
    // For example, clearing user session, tokens, etc.
    console.log('User logged out');
    this.router.navigate(['/login']);
  }

  createList() {
    // Implement your create list logic here
    console.log('List created: ', this.newListName);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


}
