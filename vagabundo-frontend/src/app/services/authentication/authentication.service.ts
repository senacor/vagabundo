import { Inject, Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

import { JwtHelperService } from '@auth0/angular-jwt';
import { DOCUMENT } from '@angular/common';


const TOKEN_KEY = 'token';
const DATA_KEY = 'jwt_data';

export function tokenGetter() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * An authentication service using JWT (JSON Web Token). Stores the jwt
 * in local storage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    @Inject(DOCUMENT) private document: any
  ) {}

  /**
   * Returns whether the user is authenticated with a valid jwt token in local storage.
   */
  public isAuthenticated(): boolean {
    const jwt = localStorage.getItem(TOKEN_KEY);
    try {
      const decodedToken = this.jwtHelper.decodeToken(jwt);
      const isExpired = this.jwtHelper.isTokenExpired(jwt);

      return (decodedToken !== undefined && decodedToken !== null) && decodedToken.iss === environment.iss && !isExpired;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  /**
  * returns the business key which is XYZ while the userId has the format "XYZ@senacor.com"
  **/
  private extractBusinessKey(userId: string): string {
     // First get everything before the @ and then remove the other part
     return userId.split('@')[0];
  }

  /**
   * Returns the business key of the logged in user
   */
  public getBusinessKey(): string {
    const jwt = localStorage.getItem(TOKEN_KEY);
    return this.extractBusinessKey(this.jwtHelper.decodeToken(jwt).username);
  }

  /**
   * Try to login a user using a JWT. It verifies the jwt and if successful saves the token
   * in local storage for further usage. If not successful an exception is thrown.
   * @param jwt json web token
   */
  public login(jwt: string): Promise<boolean> {
    if (isDevMode()) {
      console.log('Login attempt with jwt', jwt);
    }
    const decodedToken = this.jwtHelper.decodeToken(jwt);
    const isExpired = this.jwtHelper.isTokenExpired(jwt);

    if (decodedToken.iss === environment.iss && !isExpired) {
      localStorage.setItem(TOKEN_KEY, jwt);
      localStorage.setItem(DATA_KEY, decodedToken);
    } else {
      throw new Error('Invalid login attempt with jwt token: ' + jwt);
    }

    return this.router.navigate(['/']);
  }

  /**
   * The logout on AWS Cognito already happened and now the user should be logged out in the client.
   * Deletes the jwt token from local storage.
   */
  public logoutFinished(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(DATA_KEY);
  }
}
