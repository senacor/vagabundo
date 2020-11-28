import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        JwtModule.forRoot({})
      ],
      providers: [
        JwtHelperService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(AuthenticationService);
  });

  it('should test the login', () => {
    expect(service).toBeTruthy();
    expect(service.isAuthenticated()).toBe(false);
  });
});
