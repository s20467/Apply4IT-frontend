import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";


export const userBirthDateTooEarly: ValidatorFn =
  (control: AbstractControl): ValidationErrors | null => {
    let dateValue = new Date(control.value);
    dateValue.setHours(0,0,0,0)
    let dateThreshold = new Date(1900, 0, 1);
    dateThreshold.setHours(0,0,0,0);
    if(dateValue < dateThreshold) {
      return { birthDateTooEarly: true };
    }
    return null;
  }

