import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListListenComponent } from './list-listen.component';

describe('ListListenComponent', () => {
  let component: ListListenComponent;
  let fixture: ComponentFixture<ListListenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListListenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListListenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
