import { Component, Input, OnInit } from '@angular/core';

/**
 * A component to show a progress bar to display to the user that currently we are loading data.
 * Will expand to the whole width and is easy to include at the top of a card.
 */
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input() loading: boolean;
  constructor() { }

  ngOnInit() {
  }
}
