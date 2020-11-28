import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from '@app/store/reducers';
import { RouterModule } from '@angular/router';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbCollapseModule,
        RouterModule.forRoot([]),
        StoreModule.forRoot(reducers, { metaReducers }),
        JwtModule.forRoot({
        })
      ],
      declarations: [
        HeaderComponent
      ],
      providers: [
        JwtHelperService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be logged out by default and hence not have a visible navigation bar', () => {
    const navbar = fixture.debugElement.nativeElement.querySelectorAll('.navbar');
    expect(navbar.length).toEqual(0);
  });

  it('should not render the navigation bar when logged out', () => {
    component.isVisible = false;
    fixture.detectChanges();

    const navbar = fixture.debugElement.nativeElement.querySelectorAll('.navbar');
    expect(navbar.length).toEqual(0);
  });

  it('should render the header bar when logged in', () => {
    component.isVisible = true;
    fixture.detectChanges();

    const navLinkElements = fixture.debugElement.nativeElement.querySelectorAll('.nav-link');
    expect(navLinkElements[0].textContent).toContain('Logout');
  });
});
