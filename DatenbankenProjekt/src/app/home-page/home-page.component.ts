import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  isSidebarOpen = false; // Initialer Zustand der Sidebar

  toggleSidebar() { // Methode zum Umschalten des Zustands der Sidebar
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() { // Methode zum Schließen der Sidebar
    this.isSidebarOpen = false;
  }
}
