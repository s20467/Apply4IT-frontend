import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CompaniesService } from "../../shared/service/companies.service";
import { UsersService } from "../../shared/service/users.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { CompanyRegistrationDto } from "../../shared/model/company-registration-dto.model";
import { Address } from "../../shared/model/address.model";
import { CompanyAsyncValidators } from "../../shared/validators/company-async-validators";

@Component({
  selector: 'app-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.css']
})
export class CompanyRegistrationComponent implements OnInit {

  companyRegistrationForm: FormGroup;

  constructor(
    private companiesService: CompaniesService,
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(!this.usersService.isLoggedIn()) {
      this.router.navigate(["/login"]);
    }

    this.companyRegistrationForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(50)], [CompanyAsyncValidators.companyNameTakenValidator(this.companiesService)]),
      description: new FormControl(null, [Validators.maxLength(2000)]),
      email: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.email]),
      country: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(70)]),
      city: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      zip: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
      street: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
    });
  }


  onSubmit() {
    if(this.companyRegistrationForm.valid) {
      let formValue = this.companyRegistrationForm.value;
      let newCompany = <CompanyRegistrationDto>{
        name: formValue["name"],
        description: formValue["description"],
        contactEmail: formValue["email"],
        address: <Address>{
          country: formValue["country"],
          city: formValue["city"],
          zip: formValue["zip"],
          street: formValue["street"],
        }
      }
      this.companiesService.registerCompany(newCompany).subscribe({
        next: (newCompanyId: number) => {
          this.companiesService.emitCompaniesChanged();
          this.router.navigate(["/companies", "registration-success"])
        },
        error: (error: HttpErrorResponse) => {
          this.companyRegistrationForm.setErrors({"UnknownServerError": true});
          console.log(error)
        }
      });
    }
  }

  autoGrowTextarea(e: any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight)+"px";
  }

}
