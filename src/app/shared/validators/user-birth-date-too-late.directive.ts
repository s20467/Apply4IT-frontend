import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";


export const userBirthDateTooLate: ValidatorFn =
  (control: AbstractControl): ValidationErrors | null => {
    let dateValue = new Date(control.value);
    dateValue.setHours(0,0,0,0);
    let now = new Date();
    now.setHours(0,0,0,0);
    if(dateValue >= now) {
      return { birthDateTooLate: true };
    }
    return null;
  }

