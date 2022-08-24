import {Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getUserLoggedIn } from '@store/selectors/user.selectors';
import { State } from '@app/store/reducers';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  private userLoggedIn$: Observable<boolean> = this.store.pipe(select(getUserLoggedIn));

  /** Navbar should collapse when the viewport width is too small. */
  isNavbarCollapsed = true;
  /** Link to cognito logout page. */
  logoutLink = environment.LOGOUT_URL;
  /** The header should not be visible if the start route is called. It means the user is not yet logged in. */
  isVisible: boolean = false;

  constructor(
    private store: Store<State>,
) { }


  ngOnInit(): void {
    this.userLoggedIn$.subscribe(loggedIn => this.isVisible = loggedIn);
  }
}
