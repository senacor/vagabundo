import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEmissionComponent } from './my-emission.component';

describe('MyEmissionComponent', () => {
  let component: MyEmissionComponent;
  let fixture: ComponentFixture<MyEmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyEmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
