import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '@authservice/authentication.service';
import { LoggedIn } from '@store/actions/user.actions';
import { Store } from '@ngrx/store';
import { State } from '@app/store/reducers';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private store: Store<State>,
    public auth: AuthenticationService,
    private router: Router
  ) {}

  /**
   * Used in the routing to check whether the route can be activated. This is only the case
   * when the user is logged in. If the user is not logged in redirect to the login page located
   * at Azure. Otherwise the route can be activated
   */
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/start']);
      return false;
    }
    this.store.dispatch(new LoggedIn());
    return true;
  }
}
