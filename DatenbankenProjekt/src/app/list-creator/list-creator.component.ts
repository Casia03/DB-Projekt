import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export class Film {
  film_id: number;
  title: string;
  description: string;
  image_link: string;
  selected: boolean = false;

  constructor(film_id: number, title: string, description: string, image_link: string) {
    this.film_id = film_id;
    this.title = title;
    this.description = description;
    this.image_link = image_link;
  }
}

@Component({
  selector: 'app-list-creator',
  templateUrl: './list-creator.component.html',
  styleUrls: ['./list-creator.component.css']
})

export class ListCreatorComponent implements OnInit {
  isSidebarOpen = false;
  films: Film[] = [];
  userLists: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getFilms();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getFilms(): void {
    // Fetch films from your backend API or any other source
    // Replace the following code with your actual implementation
    this.http.get<Film[]>('your-backend-api-url').subscribe(
      (response: Film[]) => {
        this.films = response;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching films:', error);
      }
    );
  }

  toggleSelection(film: Film): void {
    film.selected = !film.selected;
  }

  createList(): void {
    const selectedFilms = this.films.filter(film => film.selected);
    // Now you can send the selectedFilms array to your backend or perform any other operations
  }

  saveList(listName: string): void {
    const selectedFilms = this.films.filter(film => film.selected);
    const newList = {
      name: listName,
      films: selectedFilms.map(film => film.film_id) // Only store film IDs in the user list
    };
    this.userLists.push(newList);

    // Send the newList object to your backend API to save it in the MySQL table
    this.http.post('your-backend-api-url', newList).subscribe(
      (response: any) => {
        console.log('User list saved successfully:', response);
      },
      (error: HttpErrorResponse) => {
        console.error('Error saving user list:', error);
      }
    );
  }
}
