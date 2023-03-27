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
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.handle();
  }

  handle() {
    return this.userService.getTokenFromLS() ? this.router.parseUrl('/') : true;
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */

// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
// import { UserService } from '../services/user-service/user.service';

// type CanActivateReturnType = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   constructor(
//     private router: Router,
//     private userService: UserService,
//   ) {}

//   /**
//    * Determines if the user is authorized to access a route.
//    * @param route The activated route.
//    * @param state The router state snapshot.
//    * @returns A boolean, an UrlTree or an Observable of a boolean or an UrlTree.
//    */
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CanActivateReturnType {
//     return this.isUserAuthenticated();
//   }

//   /**
//    * Checks if the user is authenticated.
//    * @returns True if the user is authenticated, false otherwise.
//    */
//   private isUserAuthenticated(): boolean | UrlTree {
//     return this.userService.getTokenFromLS() ? this.router.parseUrl('/') : true;
//   }
// }
