import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrl: './film.component.css'
})
export class FilmComponent {
  isSidebarOpen = false; // Initialer Zustand der Sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  http:any;
  constructor(client:HttpClient) {
    this.http = client;
  }
  film:any;
  getFilm() {
    this.http.get("/film").subscribe((data:any) =>{
      console.log(data);
      this.film = data;
    });
  }
}
