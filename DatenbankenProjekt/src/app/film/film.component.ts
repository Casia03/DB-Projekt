import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.css']
})
export class FilmComponent implements OnInit {
  isSidebarOpen = false;
  film: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadFilm();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadFilm() {
    const filmId = this.route.snapshot.paramMap.get('id');

    this.http.get<any>(`/film/${filmId}`).subscribe(
      (film: any) => {
        console.log(film);
        this.film = film;
        this.film.image_url = `/assets/pictures/${film.image_link}`;
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading film:', error);
      }
    );
  }
}