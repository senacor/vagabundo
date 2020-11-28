import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const window: Window = <any>{};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        JwtModule.forRoot({})
      ],
      providers: [
        JwtHelperService,
        { provide: 'Window', useFactory: (() => window) }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
