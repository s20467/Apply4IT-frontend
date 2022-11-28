import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";


export const maxSalSmallerThanMinSalValidator: ValidatorFn =
  (control: AbstractControl): ValidationErrors | null => {
    let formGroup = control as FormGroup;
    if(formGroup.value["minSalaryPln"] > formGroup.value["maxSalaryPln"]) {
      return { maxSalarySmaller: true };
    }
    return null;
  }

