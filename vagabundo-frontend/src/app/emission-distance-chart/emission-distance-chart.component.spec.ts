import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionDistanceChartComponent } from './emission-distance-chart.component';
import { ErrorMessageComponent } from '@error-message/error-message.component';

describe('EmissionDistanceChartComponent', () => {
  let component: EmissionDistanceChartComponent;
  let fixture: ComponentFixture<EmissionDistanceChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmissionDistanceChartComponent,
        ErrorMessageComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissionDistanceChartComponent);
    component = fixture.componentInstance;
    component.stats = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
