import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";


export const offerClosingDateTooLate: ValidatorFn =
  (control: AbstractControl): ValidationErrors | null => {
    let dateValue = new Date(control.value);
    dateValue.setHours(0,0,0,0);
    let dateThreshold = new Date();
    dateThreshold.setHours(0,0,0,0);
    dateThreshold.setFullYear(dateThreshold.getFullYear() + 1)
    if(dateValue >= dateThreshold) {
      return { closingDateTooLate: true };
    }
    return null;
  }

