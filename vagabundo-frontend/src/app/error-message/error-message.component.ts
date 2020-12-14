import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Traveller } from '@api/models/traveller';
import { getTraveller } from '@store/selectors/traveller.selectors';
import { State } from '@app/store/reducers';
import { GetTraveller } from '@store/actions/traveller.actions';
import { AuthenticationService } from '@authservice/authentication.service';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {
  private traveller$: Observable<Traveller> = this.store.pipe(select(getTraveller));
  traveller: Traveller = null;

  constructor(
    private store: Store<State>,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.getTraveller();
  }

  private getTraveller(): void {
    this.store.dispatch(new GetTraveller(this.authenticationService.getBusinessKey()));
    this.traveller$.subscribe((traveller: Traveller) => this.traveller = traveller);
  }
}
