import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  isSidebarOpen = false;
  labels = [
    { label: 'Neue Filme', value: '2024' },
    { label: 'Für Kinder nicht geeignet', value: 'R' },
    { label: '80s Filme', value: '1980-1989' },
    { label: 'Filme ab 17 Jahren', value: 'NC-17' },
    { label: '90s Filme', value: '1990-1999' },
    { label: 'Filme für Kinder', value: 'G' },
    { label: '2000er Filme', value: '2000-2009' },
    { label: 'Filme für Teens', value: 'PG-13' },
    { label: 'Familienfreundlich', value: 'PG' },
  ];
  currentPage = 0;
  itemsPerPage = 5;
  slideDirection = '';
  isAnimating = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.disableAnimationButtons();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  nextPage() {
    if (!this.isAnimating && (this.currentPage + 1) * this.itemsPerPage < this.getTotalItemsCount()) {
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

  private disableAnimationButtons() {
    const animationButtons = document.querySelectorAll('.pagination-buttons button');
    animationButtons.forEach(button => button.setAttribute('disabled', 'true'));
    setTimeout(() => {
      animationButtons.forEach(button => button.removeAttribute('disabled'))
    }, 400);
  }

  navigateToFilmList(category: string) {
    switch (category) {
      case '2024':
        this.router.navigate(['film-list/year/2024']);
        break;
      case '1980-1989':
        this.router.navigate(['film-list/year/1980-1989']);
        break;
      case '1990-1999':
        this.router.navigate(['film-list/year/1990-1999']);
        break;
      case '2000-2009':
        this.router.navigate(['film-list/year/2000-2009']);
        break;
      case 'G':
        this.router.navigate(['film-list/rating/G']);
        break;
      case 'PG':
        this.router.navigate(['/film-list/rating/PG']);
        break;
      case 'PG-13':
        this.router.navigate(['/film-list/rating/PG-13']);
        break;
      case 'NC-17':
        this.router.navigate(['/film-list/rating/NC-17']);
        break;
      case 'R':
        this.router.navigate(['/film-list/rating/R']);
        break;
      default:
        this.router.navigate(['/film-list']);
        break;
    }
  }

  private getTotalItemsCount(): number {
    return this.labels.length;
  }

  getPagedItems(items: any[], page: number, pageSize: number): any[] {
    const startIndex = page * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }
}
