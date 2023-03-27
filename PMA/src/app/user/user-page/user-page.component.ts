import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { catchError, finalize, throwError } from 'rxjs';
import { UserService } from '../../core/services/user-service/user.service';
import { NotificationService } from '../../core/services/notification-service/notification.service';
import { getUser } from '../../core/store/selectors/user.selectors';
import { AUTH_ERROR_MSG, BODY_REQUEST_MSG, UNKNOWN_ERROR_MSG } from '../../auth/API-error/api-error';
import * as UserAction from '../../core/store/actions/user.actions';
import { User } from 'src/app/user/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { openDialog } from '../../core/modal/confirm-modal/confirm-modal.component';
import { FormValidationService } from 'src/app/core/services/form-validation-service/form-validation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  User!: User;

  isSubmitted = false;

  isSuccessSubmitted = false;

  ProfileForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        this.formValidationService.ownValidator(
          /^([A-Za-zА]+)( ?)([A-Za-zА]+)?$/i
        ),
      ]),
      login: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
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
    private userService: UserService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private store: Store,
    private formValidationService: FormValidationService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.store.select(getUser).subscribe(user => {
      if (user) {
        this.User = user;
        this.ProfileForm.setValue({
          name: user.name || '',
          login: user.login,
          password: '',
        });

        if (!user.name) {
          this.store.dispatch(UserAction.fetchUser());
        }
      }
    });
  }

  handleHTTPError(error: HttpErrorResponse) {
    if (error.status === 409) {
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

  onSubmit(formDirective: FormGroupDirective) {
    if (this.ProfileForm.valid) {
      this.isSubmitted = true;
      this.userService
        .updateUser(
          {
            name: this.ProfileForm.controls.name.value!,
            login: this.ProfileForm.controls.login.value!,
            password: this.ProfileForm.controls.password.value!,
          },
          this.User._id
        )
        .pipe(
          finalize(() => {
            this.isSubmitted = false;
          }),
          catchError(err => this.handleHTTPError(err))
        )
        .subscribe({
          next: () => {
            this.isSuccessSubmitted = true;
            formDirective.resetForm();
            this.ProfileForm.setValue({
              name: this.User.name!,
              login: this.User.login,
              password: '',
            });

            setTimeout(() => {
              this.isSuccessSubmitted = false;
            }, 3000);
          },
          error: () => {},
        });
    }
  }

  openConfirmModal() {
    openDialog(
      this.dialog,
      this.userService.deleteUser(this.User._id),
      this.translateService.instant('CONFIRM_MODAL.targetAccount')
    );
  }
}
