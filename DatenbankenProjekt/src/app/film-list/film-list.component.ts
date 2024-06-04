import { Component } from '@angular/core';

@Component({
  selector: 'app-film-list',
  templateUrl: './film-list.component.html',
  styleUrl: './film-list.component.css'
})



export class FilmListComponent {
  isSidebarOpen = false; // Initialer Zustand der Sidebar

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
