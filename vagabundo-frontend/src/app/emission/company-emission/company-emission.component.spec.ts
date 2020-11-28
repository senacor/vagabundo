import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEmissionComponent } from './company-emission.component';

describe('CompanyEmissionComponent', () => {
  let component: CompanyEmissionComponent;
  let fixture: ComponentFixture<CompanyEmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyEmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyEmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
