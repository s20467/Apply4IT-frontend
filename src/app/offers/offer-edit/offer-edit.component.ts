import {Component, ElementRef, OnInit, ViewChildren} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import { CompaniesService } from "../../shared/service/companies.service";
import { CompanyMinimalDto } from "../../shared/model/company-minimal-dto.model";
import { UsersService } from "../../shared/service/users.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalizationsService } from "../../shared/service/localizations.service";
import { LocalizationFullDto } from "../../shared/model/localization-full-dto.model";
import { CategoryFullDto } from "../../shared/model/category-full-dto.model";
import { CategoriesService } from "../../shared/service/categories.service";
import { OffersService } from "../../shared/service/offers.service";
import {ExpectationMinimalDto} from "../../shared/model/expectation-minimal-dto.model";
import {OfferAdvantageMinimalDto} from "../../shared/model/offer-advantage-minimal-dto.model";
import {HttpErrorResponse} from "@angular/common/http";
import {OfferCreationRequestDto} from "../../shared/model/offer-creation-request-dto.model";
import {maxSalSmallerThanMinSalValidator} from "../../shared/validators/max-sal-smaller-than-min-sal.directive";
import {offerClosingDateTooEarly} from "../../shared/validators/offer-closing-date-too-early.directive";
import {offerClosingDateTooLate} from "../../shared/validators/offer-closing-date-too-late.directive";

@Component({
  selector: 'app-offer-edit',
  templateUrl: './offer-edit.component.html',
  styleUrls: ['./offer-edit.component.css']
})
export class OfferEditComponent implements OnInit {

  isEditMode = false;
  editedOfferId: number;
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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private elem: ElementRef
  ) { }

  ngOnInit(): void {
    this.offerEditForm = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(35)]),
      company: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.maxLength(2000)]),
      expectations: new FormArray([]),
      offerAdvantages: new FormArray([]),
      categories: new FormArray([]),
      closingDate: new FormControl(null, [Validators.required, offerClosingDateTooEarly, offerClosingDateTooLate]),
      minSalaryPln: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100000)]),
      maxSalaryPln: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100000)]),
      localization: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(70)]),
      city: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      zip: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
      street: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      firstJobPossibility: new FormControl(),
      remoteJobPossibility: new FormControl(),
    }, { validators: maxSalSmallerThanMinSalValidator });


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

    let offerId: number = +this.activatedRoute.snapshot.params['offerId'];
    if(offerId) {
      this.isEditMode = true;
      this.editedOfferId = offerId
      this.offersService.getOfferById(offerId).subscribe((offer) => {
        offer.categories.forEach(category => {
          this.categoriesFormArray.push(
            new FormControl(category.id, [Validators.required])
          )
        });
        offer.expectations.forEach(expectation => {
          this.expectationsFormArray.push(
            new FormGroup({
              description: new FormControl(expectation.description, [Validators.required, Validators.maxLength(1000)]),
              required: new FormControl(expectation.required)
            })
          )
        });
        offer.offerAdvantages.forEach(offerAdvantage => {
          this.offerAdvantagesFormArray.push(
            new FormControl(offerAdvantage.description, [Validators.required, Validators.maxLength(1000)])
          )
        });
        this.offerEditForm.patchValue({
          title: offer.title,
          description: offer.description,
          company: offer.company.id,
          localization: offer.localization.id,
          closingDate: offer.closingDate,
          minSalaryPln: offer.minSalaryPln,
          maxSalaryPln: offer.maxSalaryPln,
          country: offer.address.country,
          city: offer.address.city,
          zip: offer.address.zip,
          street: offer.address.street,
          firstJobPossibility: offer.firstJobPossibility,
          remoteJobPossibility: offer.remotePossibility
        })
        this.refreshTextAreas()
      })
    }
  }

  async refreshTextAreas() {
    await new Promise(f => setTimeout(f, 1)); //todo not async
    let textareas = this.elem.nativeElement.querySelectorAll('textarea');
    textareas.forEach((textarea: any) => {
      textarea.style.height = "0px";
      textarea.style.height = (textarea.scrollHeight)+"px";
    })
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
    if(this.offerEditForm.valid) {
      if(!this.isEditMode) {
        this.offersService.createOffer(this.getOfferCreationRequestDtoFromForm()).subscribe({
          next: (newOfferId: number) => {
            this.offersService.emitOffersChanged();
            this.router.navigate(["/offers", newOfferId, "details"])
          },
          error: (error: HttpErrorResponse) => {
            this.offerEditForm.setErrors({"UnknownServerError": true});
          }
        });
      }
      else {
        this.offersService.updateOffer(this.getOfferCreationRequestDtoFromForm(), this.editedOfferId).subscribe({
          next: (updatedOfferId: number) => {
            this.offersService.emitOffersChanged();
            this.router.navigate(["/offers", updatedOfferId, "details"])
          },
          error: (error: HttpErrorResponse) => {
            this.offerEditForm.setErrors({"UnknownServerError": true});
          }
        });
      }
    }
  }

  getOfferCreationRequestDtoFromForm(): OfferCreationRequestDto {
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

    return {
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
    }
  }

  autoGrowTextarea(e: any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight)+"px";
  }

}






















