import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-creator',
  templateUrl: './list-creator.component.html',
  styleUrls: ['./list-creator.component.css']
})



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


  export class ListCreatorComponent implements OnInit {
    isSidebarOpen = false;
    films: Film[] = [];
    userLists: any[] = [];

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
      this.getFilms();
    }

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }

    getFilms(): void {
      // Fetch films from your backend API or any other source
      // Replace the following code with your actual implementation
      const onlySelected = false; // Set this variable to true if you want to filter selected films
      const filmsData: Film[] = []; // Replace this with your actual films data

      if (onlySelected) {
        this.films = filmsData.filter(film => film.selected);
      } else {
        this.films = filmsData;
      }
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
      // Replace the following code with your actual implementation
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
