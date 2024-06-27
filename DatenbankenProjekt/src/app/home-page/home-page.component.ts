import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  isSidebarOpen = false; // Initialer Zustand der Sidebar

  movies = [
    { title: 'Film 1' },
    { title: 'Film 2' },
    { title: 'Film 3' },
    { title: 'Film 4' },
    { title: 'Film 5' },
    { title: 'Film 6' },
    { title: 'Film 7' },
    { title: 'Film 8' },
    { title: 'Film 9' },
    { title: 'Film 10' },
    { title: 'Film 11' },
    { title: 'Film 12' },
    { title: 'Film 13' },
    { title: 'Film 14' },
    { title: 'Film 15' },
    { title: 'Film 16' },
    { title: 'Film 17' },
    { title: 'Film 18' },
    { title: 'Film 19' },
    { title: 'Film 20' },
    { title: 'Film 21' },
    { title: 'Film 22' },
    { title: 'Film 23' },
    { title: 'Film 24' },
    { title: 'Film 25' },
  ];

  currentPage: number = 0;
  totalPages: number = 4;
  itemsPerPage = 5;
  slideDirection = '';
  isAnimating = false;

  ngOnInit(){
    this.disableAnimationButtons();
  }

  get displayedMovies() {
    const startIndex = this.currentPage * this.itemsPerPage;
    return this.movies.slice(startIndex, startIndex + this.itemsPerPage);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  nextPage() {
    if (!this.isAnimating && (this.currentPage + 1) * this.itemsPerPage < this.movies.length) {
      this.isAnimating = true;
      this.slideDirection = 'slide-left';
      setTimeout(() => {
        this.currentPage++;
        this.slideDirection = '';
        this.isAnimating = false;
        this.disableAnimationButtons();
      }, 400);
    }
  }

  previousPage() {
    if (!this.isAnimating && this.currentPage > 0) {
      this.isAnimating = true;
      this.slideDirection = 'slide-right';
      setTimeout(() => {
        this.currentPage--;
        this.slideDirection = '';
        this.isAnimating = false;
        this.disableAnimationButtons();
      }, 400);
    }
  }

  private disableAnimationButtons(){
    const animationButtons = document.querySelectorAll('.pagination-buttons button');
    animationButtons.forEach(button => button.setAttribute('disabled', 'true'));
    setTimeout(() => {
      animationButtons.forEach(button => button.removeAttribute('disabled'))
    }, 400)
  }
}
