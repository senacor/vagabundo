import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injector,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Stats, Traveller } from '@api/models';
import { DateModel } from '@app/store/models/date';

import { State } from '@app/store/reducers';

import { GetDates } from '@store/actions/date.actions';
import { getAllDates } from '@store/selectors/date.selectors';
import { GetStats, GetStatsByTeam, GetStatsByTraveller } from '@store/actions/stat.actions';
import { getCompanyStats, getStatsLoading, getTeamStats, getTravellerStats } from '@store/selectors/stat.selectors';
import { GetTraveller } from '@store/actions/traveller.actions';
import { getTraveller, getTravellerLoading } from '@store/selectors/traveller.selectors';
import { AuthenticationService } from '@authservice/authentication.service';
import { GranularityViewLevel } from '@models/granularityViewLevel';
import { StatsSelectionService } from '@statsselectionsevice/statsselection.service';
import { INTRODUCTION_COOKIE_NAME, IntroductionComponent } from '@app/introduction/introduction.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-emission',
  templateUrl: './emission.component.html',
  styleUrls: ['./emission.component.scss']
})
export class EmissionComponent implements OnInit {
  private companyStats$: Observable<Stats> = this.store.pipe(select(getCompanyStats));
  private teamStats$: Observable<Stats> = this.store.pipe(select(getTeamStats));
  private travellerStats$: Observable<Stats> = this.store.pipe(select(getTravellerStats));
  private dates$: Observable<DateModel> = this.store.pipe(select(getAllDates));
  private traveller$: Observable<Traveller> = this.store.pipe(select(getTraveller));
  private travellerLoading$: Observable<Boolean> = this.store.pipe(select(getTravellerLoading));
  private statsLoading$: Observable<boolean> = this.store.pipe(select(getStatsLoading));

  /** Introduction modal. */
  introduction: IntroductionComponent;

  dates: DateModel = {
    fromDate: null,
    toDate: null
  };
  companyStats: Stats = null;
  teamStats: Stats = null;
  travellerStats: Stats = null;
  emissionDistanceStatistics: Stats = null;
  traveller: Traveller = null;

  /** Is emission/distance statistics loading? */
  isEmissionDistanceStatisticsLoading = false;
  /** Are all statistics still loading? */
  isStatsLoading = false;

  message: string;

  @Output() co2e = this.companyStats?.total?.emission.co2e;

  constructor(
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    private statsSelection: StatsSelectionService,
    private authenticationService: AuthenticationService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private cookie: CookieService,
  ) { }

  ngOnInit(): void {


    this.getTraveller();
    this.getDates();

    this.travellerLoading$.subscribe((isTravellerLoading: boolean) => {
      if (!isTravellerLoading) {
        this.getStats();
      }
    });
    this.statsLoading$.subscribe(isLoading => {
      this.isStatsLoading = isLoading;
      this.isEmissionDistanceStatisticsLoading = isLoading;
    });
    this.openIntroduction();
  }

  /**
   * If the introduction component was never opened before open it on load of the component.
   * After that set a cookie so it will not be opened again.
   */
  private openIntroduction(): void {
    if (this.cookie.get(INTRODUCTION_COOKIE_NAME) !== 'set') {
      this.loadIntroduction();
      this.introduction.open();
    }
  }

  /**
   * Attaches the introduction component to the HTML.
   */
  private loadIntroduction(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(IntroductionComponent);
    const componentRef = componentFactory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.introduction = componentRef.instance;
  }

  private getDates(): void {
    this.store.dispatch(new GetDates());
    this.dates$.subscribe((dates: DateModel) => this.dates = dates);
  }

  private getStats(): void {
    this.isEmissionDistanceStatisticsLoading = true;

    this.companyStats$.subscribe((stats: Stats) => {
      this.subscribeEmissionDistanceStatistics(stats, GranularityViewLevel.Company);
      this.companyStats = stats;
    });
    this.teamStats$.subscribe((stats: Stats) => {
      this.subscribeEmissionDistanceStatistics(stats, GranularityViewLevel.Team);
      this.teamStats = stats;
    });
    this.travellerStats$.subscribe((stats: Stats) => {
      this.subscribeEmissionDistanceStatistics(stats, GranularityViewLevel.Traveller);
      this.travellerStats = stats;
    });

    this.store.dispatch(new GetStats({
      fromDate: this.dates.fromDate,
      toDate: this.dates.toDate
    }));

    this.store.dispatch(new GetStatsByTeam({
      team: this.traveller.team,
      fromDate: this.dates.fromDate,
      toDate: this.dates.toDate
    }));

    this.store.dispatch(new GetStatsByTraveller({
      travellerBK: this.traveller.bk,
      fromDate: this.dates.fromDate,
      toDate: this.dates.toDate
    }));

  }

  /**
   * Subscribe the emission/distance chart to the statistics data so we update the chart when
   * reloading the statistics.
   * @param stats statistics
   * @param selection selected type
   */
  private subscribeEmissionDistanceStatistics(stats: Stats, selection: GranularityViewLevel): void {
    this.statsSelection.getSelectedStats().subscribe(type => {
      if (type === selection) {
        this.emissionDistanceStatistics = stats;
      }
    });
  }

  private getTraveller(): void {
    this.store.dispatch(new GetTraveller(this.authenticationService.getBusinessKey()));
    this.traveller$.subscribe((traveller: Traveller) => this.traveller = traveller);
  }
}
