import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";


export const offerClosingDateTooEarly: ValidatorFn =
  (control: AbstractControl): ValidationErrors | null => {
    let dateValue = new Date(control.value);
    if(dateValue <= new Date()) {
      return { closingDateTooEarly: true };
    }
    return null;
  }

