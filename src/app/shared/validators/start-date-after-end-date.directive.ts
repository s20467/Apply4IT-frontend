import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";


export const startDateAfterEndDateValidator: ValidatorFn =
  (control: AbstractControl): ValidationErrors | null => {
    let formGroup = control as FormGroup;
    let startDate = new Date(formGroup.value["startDate"]);
    let notFinishedYet = formGroup.value["endDateGroup"]["notFinishedYet"];
    let endDate = new Date(formGroup.value["endDateGroup"]["endDate"])
    if(!notFinishedYet && startDate >= endDate) {
      return { startDateAfterEndDate: true };
    }
    return null;
  }

