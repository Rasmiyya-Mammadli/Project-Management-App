import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  constructor(private translateService: TranslateService) {}

  ownValidator(allowedPattern: RegExp): ValidatorFn {
    return (formControl: AbstractControl): ValidationErrors | null => {
      const formControlValue = formControl.value;
      if (!formControlValue || (formControlValue && formControlValue.length < 2)) {
        return null;
      }

      const isValid = allowedPattern.test(formControlValue);
      return isValid ? null : { errorMsg: true };
    };
  }

  passValidator(): ValidatorFn {
    return (formControl: AbstractControl): ValidationErrors | null => {
      const formControlValue = formControl.value;

      if (!formControlValue) {
        return null;
      }

      const errors: Record<string, string> = {};

      const hasMinLength = /^.{8,}$/.test(formControlValue);
      if (!hasMinLength) {
        errors['hasMinLength'] = this.translateService.instant('FORM.passMinL');
      }

      const hasUpperCase = /[A-Z]/.test(formControlValue);
      if (!hasUpperCase) {
        errors['hasUpperCase'] = this.translateService.instant('FORM.passHasUpperCase');
      }

      const hasNumeric = /[0-9]/.test(formControlValue);
      if (!hasNumeric) {
        errors['hasNumeric'] = this.translateService.instant('FORM.passHasNumeric');
      }

      const hasSpecSymbol = /[!@#?\]]/.test(formControlValue);
      if (!hasSpecSymbol) {
        errors['hasSpecSymbol'] = this.translateService.instant('FORM.passHasSymbol');
      }

      return Object.keys(errors).length === 0 ? null : { errorMsg: errors };
    };
  }
}
