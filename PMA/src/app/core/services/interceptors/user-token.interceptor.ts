import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user-service/user.service';

@Injectable()
export class UserTokenInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept = (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> => {
    const token = this.userService.getTokenFromLS();
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next.handle(req);
  }
}
