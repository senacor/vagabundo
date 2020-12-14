import { Component, OnInit } from '@angular/core';
import { StatsSelectionService } from '@statsselectionsevice/statsselection.service';
import { GranularityViewLevel } from '@models/granularityViewLevel';

@Component({
  selector: 'app-my-emission',
  templateUrl: './my-emission.component.html',
  styleUrls: ['./my-emission.component.scss']
})
export class MyEmissionComponent implements OnInit {

  constructor(
    private statsSelection: StatsSelectionService
  ) { }

  ngOnInit() {
    this.statsSelection.selectStats(GranularityViewLevel.Traveller);
  }
}
