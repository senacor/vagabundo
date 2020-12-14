import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@authservice/authentication.service';
import { Router } from '@angular/router';

/**
 * Thius component is bound on the path `logout`, which is called by the redirect
 * from AWS Cognito when the logout already happened.
 * So we clear our local storage from all authentication and then redirect to the start page.
 */
@Component({
  template: ''
})
export class LogoutComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.logoutFinished();
    this.router.navigate(['/start']);
  }
}
