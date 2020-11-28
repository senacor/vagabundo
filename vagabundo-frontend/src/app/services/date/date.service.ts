import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

// ISO 8601 formatting for a date
export const ISO_8601_FORMAT_DATE = 'YYYY-MM-DD';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  static toISODate(input: string): string {
    return dayjs(input)
      .format(ISO_8601_FORMAT_DATE)
      .toString();
  }

  static toNgbDate(input: string): NgbDateStruct {
    return {
      year: dayjs(input).get('year'),
      month: dayjs(input).get('month') + 1,
      day: dayjs(input).get('date')
    };
  }

  static getStartOfLastMonth(): string {
    return dayjs()
      .subtract(1, 'month')
      .startOf('month')
      .format(ISO_8601_FORMAT_DATE)
      .toString();
  }

  static getEndOfLastMonth(): string {
    return dayjs()
      .subtract(1, 'month')
      .endOf('month')
      .format(ISO_8601_FORMAT_DATE)
      .toString();
  }

  static getCurrentYear(): string {
    return dayjs()
      .get('year')
      .toString();
  }

}
