import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from '@app/store/reducers';
import { RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbCollapseModule,
        RouterModule.forRoot([]),
        StoreModule.forRoot(reducers, { metaReducers })
      ],
      declarations: [
        SidebarComponent
      ],
      providers: [
        JwtHelperService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
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

  it('should render the sidebar when logged in', () => {
    component.isVisible = true;
    fixture.detectChanges();

    const navLinkElements = fixture.debugElement.nativeElement.querySelectorAll('.nav-link');
    expect(navLinkElements[0].textContent).toContain('Emissionen');
    expect(navLinkElements[1].textContent).toContain('Meine Reisen');
    expect(navLinkElements[2].textContent).toContain('Mein CST');
    expect(navLinkElements[3].textContent).toContain('Senacor');
    expect(navLinkElements[4].textContent).toContain('FAQ');
  });
});
