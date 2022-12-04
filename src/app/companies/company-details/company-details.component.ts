import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CompaniesService } from "../../shared/service/companies.service";
import { UsersService } from "../../shared/service/users.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { CompanyFullDto } from "../../shared/model/company-full-dto.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { OffersService } from "../../shared/service/offers.service";
import { Location } from "@angular/common";

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
  isDescriptionEditMode = false;
  isAddressEditMode = false;
  descriptionEditForm: FormGroup;
  addressEditForm: FormGroup;
  @ViewChild("descriptionInput") descriptionInputTextarea: ElementRef<HTMLTextAreaElement>;

  constructor(
    private companiesService: CompaniesService,
    public usersService: UsersService,
    public offersService: OffersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
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
          new Promise(() => setTimeout(() => {this.isRecruiterAddedSuccess = false}, 5000));
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

  toggleDescriptionEditMode() {
    if(this.isDescriptionEditMode) {
      this.isDescriptionEditMode = false;
    }
    else {
      this.descriptionEditForm = new FormGroup({
        description: new FormControl(this.company.description, [Validators.maxLength(2000)])
      });
      this.isDescriptionEditMode = true;
      new Promise(() => setTimeout(() => {
        this.descriptionInputTextarea.nativeElement.style.height = "0px";
        this.descriptionInputTextarea.nativeElement.style.height = (this.descriptionInputTextarea.nativeElement.scrollHeight)+"px";
      }, 1));
    }
  }

  toggleAddressEditMode() {
    if(this.isAddressEditMode) {
      this.isAddressEditMode = false;
    }
    else {
      this.addressEditForm = new FormGroup({
        country: new FormControl(this.company.address.country, [Validators.required, Validators.minLength(4), Validators.maxLength(70)]),
        city: new FormControl(this.company.address.city, [Validators.required, Validators.maxLength(200)]),
        zip: new FormControl(this.company.address.zip, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
        street: new FormControl(this.company.address.street, [Validators.required, Validators.maxLength(200)]),
      })
      this.isAddressEditMode = true;
    }
  }

  autoGrowTextarea(e: any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight)+"px";
  }

  editDescription() {
    if(this.descriptionEditForm.valid) {
      this.companiesService.editCompanyDescription(this.company.id, this.descriptionEditForm.value["description"]).subscribe(() => {
        this.isDescriptionEditMode = false;
        this.companiesService.emitCompaniesChanged();
      });
    }
  }

  editAddress() {
    if(this.addressEditForm.valid) {
      this.companiesService.editCompanyAddress(this.company.id, this.addressEditForm.value).subscribe(() => {
        this.isAddressEditMode = false;
        this.companiesService.emitCompaniesChanged();
      });
    }
  }

  deleteCompany() {
    if(confirm("Czy na pewno chcesz usunąć tę firmę?")) {
      this.companiesService.deleteCompany(this.company.id).subscribe(() => {
        this.companiesService.emitCompaniesChanged();
      });
      this.location.back();
    }
  }
}
