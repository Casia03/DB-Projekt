import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.css']
})
export class FilmComponent implements OnInit {
  isSidebarOpen = false; // Initialer Zustand der Sidebar
  films: any[] = []; //Array der Filme beinhaltet

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getFilms(); //Filmdaten werden aufgerufen wenn das component initialisiert wird
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getFilms() {
    this.http.get<any[]>('/film').subscribe(
      (data: any[]) => {
        console.log(data);
        this.films = data;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching films', error);
      }
    );
  }


  /*
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
  */

}
