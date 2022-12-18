import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export const dateAfterTodayValidator: ValidatorFn =
  (control: AbstractControl): ValidationErrors | null => {
    if(new Date(control.value) > new Date()) {
      return { dateAfterToday: true };
    }
    return null;
  }

