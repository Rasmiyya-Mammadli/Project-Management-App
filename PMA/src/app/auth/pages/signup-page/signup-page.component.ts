import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize, switchMap, throwError } from 'rxjs';
import { NewUser } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AUTH_ERROR_MSG, BODY_REQUEST_MSG, UNKNOWN_ERROR_MSG } from '../../API-error/api-error';
import { NotificationService } from '../../../core/services/notification-service/notification.service';
import { FormValidationService } from 'src/app/core/services/form-validation-service/form-validation.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
})
export class SignupPageComponent {
  submitted = false;

  signUpForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        this.formValidationService.ownValidator(
          /^([A-Za-zА]+)( ?)([A-Za-zА]+)?$/i
        ),
      ]),
      login: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        this.formValidationService.ownValidator(/^([A-Za-z0-9]+)$/i),
      ]),
      password: new FormControl('', [
        Validators.required,
        this.formValidationService.passValidator(),
      ]),
    },
    { updateOn: 'submit' }
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private formValidationService: FormValidationService,
    private translateService: TranslateService
  ) {}

  private handleHTTPError(error: HttpErrorResponse) {
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
    if (this.signUpForm.valid) {
      this.submitted = true;
      this.authService
        .signup(this.signUpForm.value as NewUser)
        .pipe(
          finalize(() => {
            this.submitted = false;
          }),
          switchMap(() => {
            return this.authService.login({
              login: this.signUpForm.controls.login.value as string,
              password: this.signUpForm.controls.password.value as string,
            });
          }),
          catchError(err => this.handleHTTPError(err))
        )
        .subscribe({
          next: () => this.router.navigateByUrl('/'),
          error: () => {},
        });
    }
  }
}
