import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getUserLoggedIn } from '@store/selectors/user.selectors';
import { State } from '@app/store/reducers';
import { AuthenticationService } from '@authservice/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  /** AWS Cognito logout URL. */
  logoutUrl = environment.LOGOUT_URL;
  private userLoggedIn$: Observable<boolean> = this.store.pipe(select(getUserLoggedIn));
  /** The header should not be visible if the start route is called. It means the user is not yet logged in. */
  isVisible: boolean;

  constructor(
    private store: Store<State>,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.userLoggedIn$.subscribe(loggedIn => this.isVisible = loggedIn);
  }
}
