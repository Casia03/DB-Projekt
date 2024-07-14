import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

// Test Suite für AuthGuard
describe('AuthGuard', () => {
  let guard: AuthGuard; // Instanz des zu testenden AuthGuard
  let authService: AuthService; // Mocked AuthService
  let router: Router; // Instanz des Routers

  // Konfiguration des Testbed vor jedem Test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Import von RouterTestingModule, um Router zu mocken
      providers: [
        AuthGuard, // Bereitstellung von AuthGuard
        AuthService, // Bereitstellung von AuthService
        {
          provide: AuthService,
          useValue: { isLoggedIn: jasmine.createSpy() } // Mocked AuthService mit jasmine Spy für isLoggedIn Methode
        }
      ]
    });
    guard = TestBed.inject(AuthGuard); // Instanz des AuthGuard injizieren
    authService = TestBed.inject(AuthService); // Instanz des AuthService injizieren
    router = TestBed.inject(Router); // Instanz des Routers injizieren
  });

  // Test, um sicherzustellen, dass der AuthGuard erstellt wird
  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
  // Test, um sicherzustellen, dass der Zugriff erlaubt ist, wenn der Benutzer eingeloggt ist
  it('should allow access when user is logged in', () => {
    (authService.isLoggedIn as jasmine.Spy).and.returnValue(true); // Rückgabewert von isLoggedIn auf true setzen

    const result = guard.canActivate({} as any, {} as any); // canActivate Methode aufrufen

    expect(result).toBeTrue(); // Überprüfen, ob das Ergebnis true ist
  });
  // Test, um sicherzustellen, dass der Zugriff verweigert wird und eine Weiterleitung zur Login-Seite erfolgt, wenn der Benutzer nicht eingeloggt ist
  it('should deny access and redirect to login when user is not logged in', () => {
    (authService.isLoggedIn as jasmine.Spy).and.returnValue(false); // Rückgabewert von isLoggedIn auf false setzen
    spyOn(router, 'createUrlTree').and.callThrough(); // Spy für createUrlTree Methode des Routers

    const result = guard.canActivate({} as any, { url: '/user' } as any); // canActivate Methode aufrufen

    expect(result).toEqual(router.createUrlTree(['/login'], { queryParams: { returnUrl: '/user' } })); // Überprüfen, ob das Ergebnis eine URL-Tree Weiterleitung zur Login-Seite ist
  });
});
