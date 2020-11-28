import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { StatsSelectionService } from '@statsselectionsevice/statsselection.service';
import { GranularityViewLevel } from '@models/granularityViewLevel';
import { Router } from '@angular/router';

/**
 * This component shows emission information on a card. It divides the view in two main parts:
 *
 * <ol>
 *   <li>Emissions compared to some other value. This will be shown as a percentage and also on a bar ranging from
 *       green (-100%) to red (+100%). On the bar there is an arrow visualizing the percentage.</li>
 *   <li>Three general data points in a table: distance, co2 emission and compensation</li>
 * </ol>
 *
 * All the data has to be bound to this component via data bindings.
 */
@Component({
  selector: 'app-emission-overview',
  templateUrl: './emission-overview.component.html',
  styleUrls: ['./emission-overview.component.scss']
})
export class EmissionOverviewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() distance: number;
  @Input() emission: number;
  @Input() compensation: number;
  @Input() comparedToOthers: number;
  @Input() statsToShow: string;
  /** Data is currently fetched from the backend. */
  @Input() isLoading = true;
  /** An optional route goal to transfer to when the element is clicked. If null no navigation occurs. */
  @Input() routeGoal: any[] = null;
  arrowLength: number;
  isIndicatorVisible = false;

  subscriptions: Subscription = new Subscription();

  constructor(private statsSelection: StatsSelectionService, private router: Router) {
  }

  ngOnInit(): void {
    this.arrowLength = this.calculateArrowLength();

    this.subscriptions.add(this.statsSelection.getSelectedStats().subscribe((stats: GranularityViewLevel) => {
      this.isIndicatorVisible = (stats === GranularityViewLevel[this.statsToShow]);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.comparedToOthers) {
      this.arrowLength = this.calculateArrowLength();
    }
  }

  onClick(): void {
    this.statsSelection.selectStats(GranularityViewLevel[this.statsToShow]);
    this.router.navigate(this.routeGoal);
  }

  /**
   * Calculates the length of the arrow as a percentage. For this the float will be re_calculated for css styling to
   * a percentage (e.g. 0.21 ==> 21) and the width will be halved as we only map half the scala to 100% (or -100%).
   */
  private calculateArrowLength(): number {
    return Math.min(Math.abs(this.comparedToOthers * 50), 50);
  }
}
