import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: any;

  ngOnInit() {
    // Beispielhafte User-Daten, diese sollten normalerweise von einem Service geladen werden
    this.user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      joinDate: new Date('2023-01-01'),
      ratedMovies: [
        { title: 'Inception', rating: 9 },
        { title: 'Interstellar', rating: 8 }
      ]
    };
  }
}
