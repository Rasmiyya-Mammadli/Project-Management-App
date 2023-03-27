import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize, throwError } from 'rxjs';
import { AUTH_ERROR_MSG, BODY_REQUEST_MSG, UNKNOWN_ERROR_MSG } from '../../API-error/api-error';
import { NotificationService } from '../../../core/services/notification-service/notification.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  submitted = false;

  loginForm = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  }, { updateOn: 'submit' });

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}
 
 handleHTTPError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.notificationService.openNotification(
        this.translateService.instant(AUTH_ERROR_MSG)
      );
    } else if (error.status === 400) {
      this.notificationService.openNotification(
        this.translateService.instant(BODY_REQUEST_MSG)
      );
    } else {
      this.notificationService.openNotification(
        this.translateService.instant(UNKNOWN_ERROR_MSG)
      );
    }

    return throwError(() => error);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.submitted = true;
      this.authService
        .login({
          login: this.loginForm.controls.login.value as string,
          password: this.loginForm.controls.password.value as string,
        })
        .pipe(
          finalize(() => {
            this.submitted = false;
          }),
          catchError((err: HttpErrorResponse) => this.handleHTTPError(err))
        )
        .subscribe({
          next: () => this.router.navigateByUrl('/'),
          error: () => {},
        });
    }
  }
}
