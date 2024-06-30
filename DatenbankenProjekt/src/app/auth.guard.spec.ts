import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';


describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        AuthService,
        {
          provide: AuthService,
          useValue: { isLoggedIn: jasmine.createSpy() }
        }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is logged in', () => {
    (authService.isLoggedIn as jasmine.Spy).and.returnValue(true);

    const result = guard.canActivate({} as any, {} as any);

    expect(result).toBeTrue();
  });

  it('should deny access and redirect to login when user is not logged in', () => {
    (authService.isLoggedIn as jasmine.Spy).and.returnValue(false);
    spyOn(router, 'createUrlTree').and.callThrough();

    const result = guard.canActivate({} as any, { url: '/user' } as any);

    expect(result).toEqual(router.createUrlTree(['/login'], { queryParams: { returnUrl: '/user' } }));
  });
});
