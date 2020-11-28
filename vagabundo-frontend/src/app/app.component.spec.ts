import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { HeaderComponent } from '@header/header.component';
import { EmissionComponent } from '@emission/emission.component';
import { DatepickerComponent } from '@datepicker/datepicker.component';
import { EmissionOverviewComponent } from '@emission-overview/emission-overview.component';
import { EmissionDistanceChartComponent } from '@emission-distance-chart/emission-distance-chart.component';
import { IntroductionComponent } from '@app/introduction/introduction.component';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from '@app/store/reducers';
import { SidebarComponent } from '@sidebar/sidebar.component';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { LoadingComponent } from '@loading/loading.component';
import { ErrorMessageComponent } from '@error-message/error-message.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent,
        EmissionComponent,
        DatepickerComponent,
        EmissionOverviewComponent,
        EmissionDistanceChartComponent,
        IntroductionComponent,
        SidebarComponent,
        LoadingComponent,
        ErrorMessageComponent
      ],
      imports: [
        RouterTestingModule,
        NgbDatepickerModule,
        NgbCollapseModule,
        NgbCarouselModule,
        FormsModule,
        FontAwesomeModule,
        RouterModule.forRoot([]),
        StoreModule.forRoot(reducers, { metaReducers }),
        JwtModule.forRoot({})
      ],
      providers: [
        JwtHelperService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Vagabundo'`, () => {
    expect(component.title).toEqual('Vagabundo');
  });

});
