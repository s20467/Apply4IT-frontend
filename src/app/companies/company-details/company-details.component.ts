import { Component, OnInit } from '@angular/core';
import {CompaniesService} from "../../shared/service/companies.service";
import {UsersService} from "../../shared/service/users.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CompanyFullDto} from "../../shared/model/company-full-dto.model";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {OffersService} from "../../shared/service/offers.service";

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {

  company: CompanyFullDto;
  recruiterAddForm: FormGroup;
  isRecruiterAddedSuccess = false;
  isRecruiterAddFormSubmitted = false;

  constructor(
    private companiesService: CompaniesService,
    public usersService: UsersService,
    public offersService: OffersService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.recruiterAddForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.email]),
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      this.companiesService.getCompanyById(+params['companyId']).subscribe((company: CompanyFullDto) => {
        this.company = company;
      });
    });
    this.companiesService.companiesChanged.subscribe(() => {
      let companyId = +this.activatedRoute.snapshot.params['companyId'];
      this.companiesService.getCompanyById(companyId).subscribe((company: CompanyFullDto) => {
        this.company = company;
      });
    })
  }


  addRecruiter() {
    this.isRecruiterAddFormSubmitted = true;
    this.isRecruiterAddedSuccess = false;
    let recruiterEmail = this.recruiterAddForm.value["email"];
    let companyId = +this.activatedRoute.snapshot.params['companyId'];
    if(this.recruiterAddForm.valid) {
      this.companiesService.addRecruiter(companyId, recruiterEmail).subscribe({
        next: () => {
          this.companiesService.emitCompaniesChanged();
          this.isRecruiterAddFormSubmitted = false;
          this.isRecruiterAddedSuccess = true;
          this.recruiterAddForm = new FormGroup({
            'email': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.email]),
          });
          new Promise(f => setTimeout(() => {this.isRecruiterAddedSuccess = false}, 5000));
        },
        error: (error: HttpErrorResponse) => {
          if(error.status == 404) {
            this.recruiterAddForm.setErrors({"UserNotFound": true});
          }
          else if(error.status == 409) {
            this.recruiterAddForm.setErrors({"AlreadyRecruiter": true});
          }
          else{
            this.recruiterAddForm.setErrors({"UnknownServerError": true});
            console.log(error)
          }
        }})
    }
  }

  goToAllCompanyOffers() {
    let queryParams = this.offersService.paramsPlusCompanyIdEqual(this.activatedRoute.snapshot.queryParams, this.company.id);
    this.router.navigate(["/offers"], {queryParams: queryParams})
  }

  goToAllCompanyRecruiters() {
    this.router.navigate(["..", "recruiters"], {relativeTo: this.activatedRoute})
  }
}
