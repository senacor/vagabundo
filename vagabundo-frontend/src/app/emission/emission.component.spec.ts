import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from '@app/store/reducers';

import { EmissionComponent } from './emission.component';
import { DatepickerComponent } from '@datepicker/datepicker.component';
import { EmissionOverviewComponent } from '@emission-overview/emission-overview.component';
import { EmissionDistanceChartComponent } from '@emission-distance-chart/emission-distance-chart.component';

describe('EmissionComponent', () => {
  let component: EmissionComponent;
  let fixture: ComponentFixture<EmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmissionComponent,
        DatepickerComponent,
        EmissionOverviewComponent,
        EmissionDistanceChartComponent
      ],
      imports: [
        HttpClientModule,
        NgbDatepickerModule,
        FormsModule,
        FontAwesomeModule,
        StoreModule.forRoot(reducers, { metaReducers })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
