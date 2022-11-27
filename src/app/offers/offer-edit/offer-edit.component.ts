import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { CompaniesService } from "../../shared/service/companies.service";
import { CompanyMinimalDto } from "../../shared/model/company-minimal-dto.model";
import { UsersService } from "../../shared/service/users.service";
import { Router } from "@angular/router";
import { LocalizationsService } from "../../shared/service/localizations.service";
import { LocalizationFullDto } from "../../shared/model/localization-full-dto.model";
import { CategoryFullDto } from "../../shared/model/category-full-dto.model";
import { CategoriesService } from "../../shared/service/categories.service";
import { OffersService } from "../../shared/service/offers.service";
import { HttpErrorResponse } from "@angular/common/http";
import {ExpectationMinimalDto} from "../../shared/model/expectation-minimal-dto.model";
import {OfferAdvantageMinimalDto} from "../../shared/model/offer-advantage-minimal-dto.model";

@Component({
  selector: 'app-offer-edit',
  templateUrl: './offer-edit.component.html',
  styleUrls: ['./offer-edit.component.css']
})
export class OfferEditComponent implements OnInit {

  editingMode = false;
  companies: CompanyMinimalDto[] = [];
  localizations: LocalizationFullDto[] = [];
  categories: CategoryFullDto[] = [];

  offerEditForm: FormGroup;

  get categoriesFormArray() {
    return this.offerEditForm.controls["categories"] as FormArray;
  }

  get expectationsFormArray() {
    return this.offerEditForm.controls["expectations"] as FormArray;
  }

  get offerAdvantagesFormArray() {
    return this.offerEditForm.controls["offerAdvantages"] as FormArray;
  }

  constructor(
    private offersService: OffersService,
    private companiesService: CompaniesService,
    private localizationsService: LocalizationsService,
    private categoriesService: CategoriesService,
    private usersService: UsersService,
    private router: Router) { }

  ngOnInit(): void {
    this.offerEditForm = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(35)]),
      company: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.maxLength(2000)]),
      expectations: new FormArray([]),
      offerAdvantages: new FormArray([]),
      categories: new FormArray([]),
      closingDate: new FormControl(null, [Validators.required]),
      minSalaryPln: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100000)]),
      maxSalaryPln: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100000)]),
      localization: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(70)]),
      city: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      zip: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
      street: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      firstJobPossibility: new FormControl(),
      remoteJobPossibility: new FormControl(),
    });


    if(!this.usersService.isLoggedIn()) {
      this.router.navigate(["/login"]);
    }
    this.companiesService.getCompaniesOwnedAndRecruiting().subscribe((companies) => {
      this.companies = companies;
    });
    this.localizationsService.getLocalizations().subscribe((localizations) => {
      this.localizations = localizations;
    });
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  addCategorySlot() {
    this.categoriesFormArray.push(new FormControl(null, [Validators.required]));
  }

  addExpectationSlot() {
    this.expectationsFormArray.push(
      new FormGroup({
        description: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
        required: new FormControl(false)
      })
    );
  }

  addOfferAdvantageSlot() {
    this.offerAdvantagesFormArray.push(new FormControl(null, [Validators.required, Validators.maxLength(1000)]));
  }

  removeCategorySlot(controlToRemove: AbstractControl) {
    this.categoriesFormArray.removeAt(
      this.categoriesFormArray.controls.findIndex(
        (control) => {
          return control == controlToRemove
        }
      )
    );
  }

  removeExpectationSlot(controlToRemove: AbstractControl) {
    this.expectationsFormArray.removeAt(
      this.expectationsFormArray.controls.findIndex(
        (control) => {
          return control == controlToRemove
        }
      )
    );
  }

  removeOfferAdvantageSlot(controlToRemove: AbstractControl) {
    this.offerAdvantagesFormArray.removeAt(
      this.offerAdvantagesFormArray.controls.findIndex(
        (control) => {
          return control == controlToRemove
        }
      )
    );
  }

  onSubmit() {
    let formValue = this.offerEditForm.value;
    let expectations = formValue["expectations"].map((expectation: ExpectationMinimalDto, index: number) => {
      expectation.orderNumber = index;
      return expectation;
    });
    let offerAdvantages = formValue["offerAdvantages"].map((offerAdvantage: string, index: number) => {
      return <OfferAdvantageMinimalDto>{
        orderNumber: index,
        description: offerAdvantage
      };
    });
    if(this.offerEditForm.valid) {
      this.offersService.createOffer({
        title: formValue["title"],
        description: formValue["description"],
        companyId: formValue["company"],
        localizationId: formValue["localization"],
        closingDate: formValue["closingDate"],
        expectations: expectations,
        offerAdvantages: offerAdvantages,
        categoryIds: formValue["categories"],
        firstJobPossibility: formValue["firstJobPossibility"],
        remotePossibility: formValue["remoteJobPossibility"],
        minSalaryPln: formValue["minSalaryPln"],
        maxSalaryPln: formValue["maxSalaryPln"],
        address: {
          country: formValue["country"],
          city: formValue["city"],
          zip: formValue["zip"],
          street: formValue["street"]
        }
      }).subscribe({
        next: (newOfferId) => {
          this.router.navigate(["/offers", newOfferId, "details"])
        },
        error: (error: HttpErrorResponse) => {
          this.offerEditForm.setErrors({"UnknownServerError": true});
        }
      });
    }
  }

  autoGrowTextarea(e: any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight)+"px";
  }

}






















