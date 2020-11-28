import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionOverviewComponent } from './emission-overview.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingComponent } from '@loading/loading.component';

describe('EmissionOverviewComponent', () => {
  let component: EmissionOverviewComponent;
  let fixture: ComponentFixture<EmissionOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        EmissionOverviewComponent,
        LoadingComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
