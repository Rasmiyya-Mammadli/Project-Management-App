/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user-service/user.service';

@Injectable({
  providedIn: 'root',
})
export class ExpCheckGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.userService.getTokenFromLS();

    if (token) {
      const decodedToken = this.userService.getInfoFromToken(token);

      if (!decodedToken) {
        return this.userService.logout();
      }

      const isTokenExpire = this.userService.tokenExpirationCheck(
        decodedToken.exp
      );

      if (isTokenExpire) {
        return this.userService.logout();
      }

      return true;
    }

    return this.router.parseUrl('/welcome');
  }
}


/* eslint-disable @typescript-eslint/no-unused-vars */

// import { Injectable } from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   CanActivate,
//   Router,
//   RouterStateSnapshot,
//   UrlTree,
// } from '@angular/router';
// import { Observable } from 'rxjs';
// import { UserService } from '../services/user-service/user.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class ExpCheckGuard implements CanActivate {
//   constructor(private userService: UserService, private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ):
//     | Observable<boolean | UrlTree>
//     | Promise<boolean | UrlTree>
//     | boolean
//     | UrlTree {
//     const authToken = this.userService.getTokenFromLS();

//     if (authToken) {
//       const decodedAuthToken = this.userService.getInfoFromToken(authToken);

//       if (!decodedAuthToken) {
//         // If the auth token cannot be decoded, log the user out.
//         return this.handleLogout();
//       }

//       if (this.isAuthTokenExpired(decodedAuthToken.exp)) {
//         // If the auth token has expired, log the user out.
//         return this.handleLogout();
//       }

//       // If the auth token is valid and has not expired, allow access to the route.
//       return true;
//     }

//     // If there is no auth token, redirect the user to the welcome page.
//     return this.router.parseUrl('/welcome');
//   }

//   private handleLogout(): boolean | UrlTree {
//     // Log the user out and redirect to the login page.
//     this.userService.logout();
//     return this.router.parseUrl('/login');
//   }

//   private isAuthTokenExpired(expirationTime: number): boolean {
//     // Determine if the auth token has expired based on its expiration time.
//     const currentTime = Math.floor(Date.now() / 1000);
//     return expirationTime < currentTime;
//   }
// }
