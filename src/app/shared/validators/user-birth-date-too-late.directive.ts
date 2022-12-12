import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";


export const userBirthDateTooLate: ValidatorFn =
  (control: AbstractControl): ValidationErrors | null => {
    let dateValue = new Date(control.value);
    if(dateValue >= new Date()) {
      return { birthDateTooLate: true };
    }
    return null;
  }

