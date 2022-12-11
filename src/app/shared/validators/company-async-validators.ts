import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { map, Observable } from "rxjs";
import { CompaniesService } from "../service/companies.service";


export class CompanyAsyncValidators {
  static companyNameTakenValidator(companiesService: CompaniesService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return companiesService.checkIfCompanyNameIsFree(control.value)
        .pipe(
          map((response: boolean) =>
            response ? null : {companyNameTaken: true}
          )
        );
    }
  }
}


