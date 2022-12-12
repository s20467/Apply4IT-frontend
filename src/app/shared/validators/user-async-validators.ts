import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { map, Observable } from "rxjs";
import { UsersService } from "../service/users.service";


export class CompanyAsyncValidators {
  static emailTakenValidator(usersService: UsersService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return usersService.checkIfEmailIsFree(control.value)
        .pipe(
          map((response: boolean) =>
            response ? null : {emailTaken: true}
          )
        );
    }
  }
}


