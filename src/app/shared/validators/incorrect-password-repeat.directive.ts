import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";


export const incorrectPasswordRepeatValidator: ValidatorFn =
  (control: AbstractControl): ValidationErrors | null => {
    let formGroup = control as FormGroup;
    if(formGroup.value["password"] != formGroup.value["passwordRepeat"]) {
      return { incorrectPasswordRepeat: true };
    }
    return null;
  }

