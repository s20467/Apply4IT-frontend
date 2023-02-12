import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export const dateAfterTodayValidator: ValidatorFn =
  (control: AbstractControl): ValidationErrors | null => {
    let dateValue = new Date(control.value);
    let now = new Date();
    dateValue.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    if(dateValue >= now) {
      return { dateAfterToday: true };
    }
    return null;
  }

