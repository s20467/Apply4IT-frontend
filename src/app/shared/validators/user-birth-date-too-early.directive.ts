import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";


export const userBirthDateTooEarly: ValidatorFn =
  (control: AbstractControl): ValidationErrors | null => {
    let dateValue = new Date(control.value);
    let dateThreshold = new Date(1900, 0, 1);
    if(dateValue < dateThreshold) {
      return { birthDateTooEarly: true };
    }
    return null;
  }

