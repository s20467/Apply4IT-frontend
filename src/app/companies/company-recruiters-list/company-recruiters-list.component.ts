import { Component, OnInit } from '@angular/core';
import { UserMinimalDto } from "../../shared/model/user-minimal-dto.model";
import { ActivatedRoute, Params } from "@angular/router";
import { CompaniesService } from "../../shared/service/companies.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-company-recruiters-list',
  templateUrl: './company-recruiters-list.component.html',
  styleUrls: ['./company-recruiters-list.component.css']
})
export class CompanyRecruitersListComponent implements OnInit {

  recruiters: UserMinimalDto[];
  companyId: number;
  isRecruiterAddMode: boolean;
  recruiterAddForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private companiesService: CompaniesService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.companyId = +params['companyId'];
      this.companiesService.getRecruiters(this.companyId).subscribe((recruiters) => {
        this.recruiters = recruiters;
      });
    });
    this.companiesService.companiesChanged.subscribe(() => {
      this.companyId = +this.activatedRoute.snapshot.params['companyId'];
      this.companiesService.getRecruiters(this.companyId).subscribe((recruiters) => {
        this.recruiters = recruiters;
      });
    });
  }

  toggleRecruiterAddMode() {
    if(this.isRecruiterAddMode) {
      this.isRecruiterAddMode = false;
    }
    else {
      this.recruiterAddForm = new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.email]),
      });
      this.isRecruiterAddMode = true;
    }
  }

  addRecruiter() {
    let recruiterEmail = this.recruiterAddForm.value["email"];
    let companyId = +this.activatedRoute.snapshot.params['companyId'];
    if(this.recruiterAddForm.valid) {
      this.companiesService.addRecruiter(companyId, recruiterEmail).subscribe({
        next: () => {
          this.companiesService.emitCompaniesChanged();
          this.isRecruiterAddMode = false;
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

}
