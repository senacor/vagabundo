import { Component, OnInit } from '@angular/core';
import { StatsSelectionService } from '@statsselectionsevice/statsselection.service';
import { GranularityViewLevel } from '@models/granularityViewLevel';

@Component({
  selector: 'app-company-emission',
  templateUrl: './company-emission.component.html',
  styleUrls: ['./company-emission.component.scss']
})
export class CompanyEmissionComponent implements OnInit {

  constructor(
    private statsSelection: StatsSelectionService
  ) { }

  ngOnInit() {
    this.statsSelection.selectStats(GranularityViewLevel.Company);
  }
}
