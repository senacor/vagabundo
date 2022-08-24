import { Component, OnInit } from '@angular/core';
import { StatsSelectionService } from '@statsselectionsevice/statsselection.service';
import { GranularityViewLevel } from '@models/granularityViewLevel';
import {Observable} from 'rxjs';
import {DateModel} from '@store/models/date';
import {select, Store} from '@ngrx/store';
import {getAllDates} from '@store/selectors/date.selectors';
import {State} from '@app/store/reducers';
import {GetTeamStats} from '@store/actions/team-stat.actions';

@Component({
  selector: 'app-my-emission',
  templateUrl: './my-emission.component.html',
  styleUrls: ['./my-emission.component.scss']
})
export class MyEmissionComponent implements OnInit {

  private dates$: Observable<DateModel> = this.store.pipe(select(getAllDates));

  dates: DateModel = {
    fromDate: null,
    toDate: null
  };

  constructor(
    private store: Store<State>,
    private statsSelection: StatsSelectionService
  ) { }

  ngOnInit() {
    this.statsSelection.selectStats(GranularityViewLevel.Traveller);

    this.dates$.subscribe((dates: DateModel) => {
      this.dates = dates;

      this.store.dispatch(new GetTeamStats({
        fromDate: this.dates.fromDate,
        toDate: this.dates.toDate
      }));
    });
  }
}
