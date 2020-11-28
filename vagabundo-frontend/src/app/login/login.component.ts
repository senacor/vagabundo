import { Component, Inject, OnInit } from '@angular/core';
import { AuthenticationService } from '@authservice/authentication.service';

/**
 * Login component has no visible component and is called when Azure replies to the client.
 * This component will trigger the login process using JWT.
 */
@Component({
  template: ''
})

export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    @Inject('Window') private window: Window
  ) {}

  ngOnInit() {
    const params: Map<string, string> = this.parseHashParams();
    const token = params.get('access_token');
    this.authService.login(token);
  }

  /**
   * Parses the parameters after a hash in the current URL.
   * Puts the parameters as key/value pair into a map.
   */
  parseHashParams(): Map<string, string> {
    const paramString = this.window.location.hash.substr(1);
    return new Map<string, string>(
      paramString.split('&').map((keyValueString): [string, string] => {
        const split = keyValueString.split('=');
        return [split[0], split[1]];
      })
    );
  }
}
