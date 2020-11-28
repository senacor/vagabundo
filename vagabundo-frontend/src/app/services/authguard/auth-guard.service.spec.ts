import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

import { AuthGuardService } from './auth-guard.service';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from '@app/store/reducers';

describe('AuthGuardService', () => {
  let service: AuthGuardService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        StoreModule.forRoot(reducers, { metaReducers }),
        JwtModule.forRoot({})
      ],
      providers: [
        JwtHelperService,
        { provide: 'Window', useFactory: (() => window) }
      ]
    })
      .compileComponents();
  }));

  it('should be created', () => {
    service = TestBed.get(AuthGuardService);
    expect(service).toBeTruthy();
  });
});
