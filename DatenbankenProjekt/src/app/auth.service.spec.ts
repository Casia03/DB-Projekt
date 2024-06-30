import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isLoggedIn', () => {
    it('should return false initially', () => {
      const loggedIn = service.isLoggedIn();
      expect(loggedIn).toBeFalse();
    });

    it('should return true after logging in', () => {
      service.login();
      const loggedIn = service.isLoggedIn();
      expect(loggedIn).toBeTrue();
    });

    it('should return false after logging out', () => {
      service.login();
      service.logout();
      const loggedIn = service.isLoggedIn();
      expect(loggedIn).toBeFalse();
    });
  });

  describe('login and logout', () => {
    it('should set isLoggedIn to true after login', () => {
      service.login();
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should set isLoggedIn to false after logout', () => {
      service.login();
      service.logout();
      expect(service.isLoggedIn()).toBeFalse();
    });
  });
});
