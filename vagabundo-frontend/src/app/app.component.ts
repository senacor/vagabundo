import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getUserLoggedIn } from '@store/selectors/user.selectors';
import { State } from '@app/store/reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private userLoggedIn$: Observable<boolean> = this.store.pipe(select(getUserLoggedIn));

  isLoggedIn: boolean = true;
  title = 'Vagabundo';

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit(): void {
    this.userLoggedIn$.subscribe(loggedIn => this.isLoggedIn = loggedIn);
  }
}
