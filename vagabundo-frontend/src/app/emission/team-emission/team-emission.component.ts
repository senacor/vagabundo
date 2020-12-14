import { Component, OnInit } from '@angular/core';
import { GranularityViewLevel } from '@models/granularityViewLevel';
import { StatsSelectionService } from '@statsselectionsevice/statsselection.service';
import { TreemapData } from '@treemap/treemap-data';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getTeamStats } from '@store/selectors/team-stat.selectors';
import { State } from '@app/store/reducers';
import { TeamStats } from '@api/models/team-stats';
import { GetTeamStats } from '@store/actions/team-stat.actions';
import { DateModel } from '@store/models/date';
import { getAllDates } from '@store/selectors/date.selectors';

@Component({
  selector: 'app-team-emission',
  templateUrl: './team-emission.component.html',
  styleUrls: ['./team-emission.component.scss']
})
export class TeamEmissionComponent implements OnInit {
  private teamStats$: Observable<TeamStats[]> = this.store.pipe(select(getTeamStats));
  private dates$: Observable<DateModel> = this.store.pipe(select(getAllDates));

  dates: DateModel = {
    fromDate: null,
    toDate: null
  };

  /** Emission of all teams in total of the CO2 emission. */
  emissionData: TreemapData;
  /** Emission of all teams by the CO2 emission per person. */
  emissionPerPersonData: TreemapData;
  /** Color range for the treemap. All colors of the boxes will be in a range between these color values. */
  colors: string[] = ['#df0917', '#ffffff', '#01a688'];

  constructor(
    private store: Store<State>,
    private statsSelection: StatsSelectionService
  ) { }

  ngOnInit() {
    this.statsSelection.selectStats(GranularityViewLevel.Team);

    this.dates$.subscribe((dates: DateModel) => {
      this.dates = dates;

      this.store.dispatch(new GetTeamStats({
        fromDate: this.dates.fromDate,
        toDate: this.dates.toDate
      }));
    });
    this.teamStats$.subscribe(teamStats => {
      this.emissionData = this.convertTeamStatsToEmissionData(teamStats, false);
      this.emissionPerPersonData = this.convertTeamStatsToEmissionData(teamStats, true);
    });
  }

  private convertTeamStatsToEmissionData(teamStats: TeamStats[], perPerson: boolean): TreemapData {
    const data: TreemapData = {
      name: 'Total',
      value: 0,
      children: teamStats.map(team => {
        return {
          name: team.team,
          value: perPerson ? team.stats.total.emissionPerCapita.co2e : team.stats.total.emission.co2e
        };
      }).filter(team => team.value > 0)
    };
    return data;
  }

}
