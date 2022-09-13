import {Component, OnInit, ViewChild} from '@angular/core';
import { StatsSelectionService } from '@statsselectionsevice/statsselection.service';
import { GranularityViewLevel } from '@models/granularityViewLevel';
import {Observable} from 'rxjs';
import {DateModel} from '@store/models/date';
import {select, Store} from '@ngrx/store';
import {getAllDates} from '@store/selectors/date.selectors';
import {State} from '@app/store/reducers';
import {GetTeamStats} from '@store/actions/team-stat.actions';
import {EmissionComponent} from '@emission/emission.component';

@Component({
  selector: 'app-company-emission',
  templateUrl: './company-emission.component.html',
  styleUrls: ['./company-emission.component.scss']
})
export class CompanyEmissionComponent implements OnInit {

  treesText  = ` müsstest du pflanzen, um den CO2-Ausstoß während des ausgewählten Zeitraums zu kompensieren.`;
  chickensText = ` verursachen bei ihrer Produktion so viel CO2.`;
  personsText  = ` produziert(en) ungefähr in einem Jahr die oben angegebene Menge CO2.`;
  carText   = ` muss ein Mittelklassewagen fahren, um so viel CO2 zu produzieren, wie oben angegeben.`;

  trees ;
  chickens ;
  persons ;
  km ;

  treesImage  =  "assets/img/tree.png";
  chickenImage =  "assets/img/chicken.png";
  teamImage  =  "assets/img/team.png";
  carImage =  "assets/img/car.png";

  private dates$: Observable<DateModel> = this.store.pipe(select(getAllDates));

  dates: DateModel = {
    fromDate: null,
    toDate: null
  };

  constructor(
    private store: Store<State>,
    private statsSelection: StatsSelectionService,
    private emissionComponent : EmissionComponent
  ) {
    this.trees = this.numberOfTrees(this.emissionComponent.companyStats?.total?.emission.co2e)+' Bäume';
    this.chickens = this.numberOfChickens(this.emissionComponent.companyStats?.total?.emission.co2e)+' Hühnchen';
    this.persons = this.numberOfPersons(this.emissionComponent.companyStats?.total?.emission.co2e)+' Durchschnittsmensch(en)';
    this.km = this.numberOfKm(this.emissionComponent.companyStats?.total?.emission.co2e)+' Kilometer';
  }

  ngOnInit() {
    this.statsSelection.selectStats(GranularityViewLevel.Company);

    this.dates$.subscribe((dates: DateModel) => {
      this.dates = dates;

      this.store.dispatch(new GetTeamStats({
        fromDate: this.dates.fromDate,
        toDate: this.dates.toDate
      }));
    });
  }

  numberOfTrees(co2e : number) : number{
    return (co2e * 80 ) / 1000;
  }

  numberOfChickens(co2e : number) : number{
    return co2e / 6.25;
  }

  numberOfPersons(co2e : number) : number{
    return Math.ceil(co2e/(11.2*100)) ;
  }

  numberOfKm(co2e : number) : number{
    return Math.ceil(co2e / (0.13));
  }

}
