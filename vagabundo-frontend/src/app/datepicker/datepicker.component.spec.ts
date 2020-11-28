import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Store, StoreModule} from '@ngrx/store';
import * as dayjs from 'dayjs';

import { metaReducers, reducers, State } from '@app/store/reducers';
import { DatepickerComponent } from './datepicker.component';
import { DateService } from '@dateservice/date.service';
import { SetDates } from '@store/actions/date.actions';
import { DateModel } from '@store/models/date';

describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;
  let store: Store<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DatepickerComponent
      ],
      imports: [
        NgbDatepickerModule,
        FormsModule,
        FontAwesomeModule,
        StoreModule.forRoot(reducers, { metaReducers })
      ],
      providers: [
        DateService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
  });

  it('should create a datepicker component', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should read the values from state for the two start dates', () => {
    const payload: DateModel = {
      fromDate: '2019-02-01',
      toDate: '2019-02-28'
    };

    store.dispatch(new SetDates(payload));
    fixture.detectChanges();
    component.ngOnInit();

    expect(component).toBeTruthy();
    expect(dayjs(payload.toDate).isSame(component.getToDate(), 'day')).toBe(true);
    expect(dayjs(payload.fromDate).isSame(component.getFromDate(), 'day')).toBe(true);
  });

  it('should save the chosen dates to the store', () => {
    const setDatesSpy = spyOn(store, 'dispatch');

    const fromDate: NgbDate = NgbDate.from({
      year: 2019,
      month: 2,
      day: 1
    });

    const toDate: NgbDate = NgbDate.from({
      year: 2019,
      month: 2,
      day: 15
    });

    const payload = new SetDates({
      fromDate: '2019-02-01',
      toDate: '2019-02-15'
    });

    component.onDateSelect(fromDate);
    component.onDateSelect(toDate);

    expect(component.fromDate).toEqual(fromDate);
    expect(component.toDate).toEqual(toDate);

    expect(setDatesSpy).toHaveBeenCalledTimes(1);
    expect(setDatesSpy).toHaveBeenCalledWith(payload);
  });

});
