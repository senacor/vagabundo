import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

import { State } from '@app/store/reducers';
import { DateModel } from '@app/store/models/date';
import { SetDates } from '@app/store/actions/date.actions';
import { getAllDates } from '@app/store/selectors/date.selectors';
import { DateService } from '@dateservice/date.service';

/**
 * Allows the selection of two dates: a from and a to.
 * The chosen range is highlighted and stored.
**/
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {

  private dates$: Observable<DateModel> = this.store.pipe(select(getAllDates));
  private dates: DateModel;

  showCalendar = false;
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  startDate: NgbDate;
  faCalendarWeek: IconDefinition = faCalendarWeek;

  constructor(private store: Store<State>,
              private ngbDateAdapter: NgbDateAdapter<NgbDate>) {}

  ngOnInit(): void {
    this.dates$.subscribe((dates: DateModel) => this.dates = dates);
    this.startDate = this.ngbDateAdapter.toModel(DateService.toNgbDate(this.dates.fromDate));
  }

  onDateSelect(date: NgbDate): void {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.equals(this.fromDate)){
      this.toDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    if (this.fromDate && this.toDate) {
      this.setDates();
      this.showCalendar = false;
    }
  }

  isHovered(date: NgbDate): boolean {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate): boolean {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate): boolean {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  getFromDate(): string {
    return this.dates.fromDate;
  }

  getToDate(): string {
    return this.dates.toDate;
  }

  private setDates(): void {
    const payload: DateModel = {
      fromDate: DateService.toISODate(`${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`),
      toDate: DateService.toISODate(`${this.toDate.year}-${this.toDate.month}-${this.toDate.day}`)
    };

    this.store.dispatch(new SetDates(payload));
  }

}
