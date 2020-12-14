import { Injectable } from '@angular/core';
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from '@dateservice/date.service';

@Injectable({
  providedIn: 'root'
})
export class DatepickerConfigService extends NgbDatepickerConfig {

  navigation: 'select' | 'arrows' | 'none' = 'select';

  minDate: NgbDateStruct = {
    year: Number(DateService.getCurrentYear()),
    month: 1,
    day: 1
  };

}
