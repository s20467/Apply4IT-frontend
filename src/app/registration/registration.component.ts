import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "../shared/service/users.service";
import { Router } from "@angular/router";
import { Address } from "../shared/model/address.model";
import { HttpErrorResponse } from "@angular/common/http";
import { userBirthDateTooEarly } from "../shared/validators/user-birth-date-too-early.directive";
import { userBirthDateTooLate } from "../shared/validators/user-birth-date-too-late.directive";
import { incorrectPasswordRepeatValidator } from "../shared/validators/incorrect-password-repeat.directive";
import { UserCreationDto } from "../shared/model/user-creation-dto.model";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;

  constructor(
    private usersService: UsersService,
    private router: Router
  ) { }

  get passwordGroup(): FormGroup {
    return this.registrationForm.get("passwordGroup") as FormGroup;
  }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
      lastName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      email: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.email]),
      birthDate: new FormControl(null, [Validators.required, userBirthDateTooEarly, userBirthDateTooLate]),
      passwordGroup: new FormGroup({
        password: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
        passwordRepeat: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)])
      }, [incorrectPasswordRepeatValidator]),
      country: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(70)]),
      city: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      zip: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
      street: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
    });
  }


  onSubmit() {
    if(this.registrationForm.valid) {
      let formValue = this.registrationForm.value;
      let newUser = <UserCreationDto>{
        password: formValue["passwordGroup"]["password"],
        firstName: formValue["firstName"],
        lastName: formValue["lastName"],
        birthdate: formValue["birthDate"],
        email: formValue["email"],
        address: <Address>{
          country: formValue["country"],
          city: formValue["city"],
          zip: formValue["zip"],
          street: formValue["street"]
        }
      }
      this.usersService.createUser(newUser).subscribe({
        next: () => {
          this.usersService.emitUsersChanged();
          this.router.navigate(["/registration-success"])
        },
        error: (error: HttpErrorResponse) => {
          this.registrationForm.setErrors({"UnknownServerError": true});
          console.log(error)
        }
      });
    }
  }

}
