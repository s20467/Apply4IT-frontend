import { Component, OnInit } from '@angular/core';
import { LocalizationFullDto } from "../../../shared/model/localization-full-dto.model";
import { CategoryFullDto } from "../../../shared/model/category-full-dto.model";
import { CategoriesService } from "../../../shared/service/categories.service";
import { LocalizationsService } from "../../../shared/service/localizations.service";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { OffersService } from "../../../shared/service/offers.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-offers-filters',
  templateUrl: './offers-filters.component.html',
  styleUrls: ['./offers-filters.component.css']
})
export class OffersFiltersComponent implements OnInit {

  categories: CategoryFullDto[] = [];
  localizations: LocalizationFullDto[] = [];

  filtersForm: FormGroup;

  constructor(
    private categoriesService: CategoriesService,
    private localizationsService: LocalizationsService,
    private offersService: OffersService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  get categoriesFormArray() {
    return this.filtersForm.controls['categories'] as FormArray
  }

  get localizationsFormArray() {
    return this.filtersForm.controls['localizations'] as FormArray
  }

  ngOnInit(): void {
    this.filtersForm = new FormGroup({
      categories: new FormArray([]),
      localizations: new FormArray([]),
      firstJobPossibility: new FormControl(false),
      remoteJobPossibility: new FormControl(false)
    });

    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;

      this.categories.forEach(() =>
        this.categoriesFormArray.push(new FormControl(false)));

      this.fillFiltersForm();
    });

    this.localizationsService.getLocalizations().subscribe((localizations) => {
      this.localizations = localizations;

      this.localizations.forEach(() =>
        this.localizationsFormArray.push(new FormControl(false)));

      this.fillFiltersForm();
    });

  }

  fillFiltersForm() {
    if(this.categories.length == 0 || this.localizations.length == 0) {
      return;
    }

    this.activatedRoute.queryParams.subscribe((params) => {
      let offerFilters = this.offersService.getOfferFiltersFromParams(params);

      let newFiltersFormValue = { //todo chande to setValue
        categories: <boolean[]>[],
        localizations: <boolean[]>[],
        firstJobPossibility: false,
        remoteJobPossibility: false
      }

      if (offerFilters != null) {
        this.categories.forEach((category) =>
          newFiltersFormValue.categories.push(offerFilters!.categoriesIds.includes(category.id)));

        this.localizations.forEach((localization) =>
          newFiltersFormValue.localizations.push(offerFilters!.localizationsIds.includes(localization.id)));

        newFiltersFormValue.firstJobPossibility = offerFilters.firstJobPossibility == null ? false : offerFilters.firstJobPossibility;

        newFiltersFormValue.remoteJobPossibility = offerFilters.remoteJobPossibility == null ? false : offerFilters.remoteJobPossibility;
      }

      this.filtersForm.patchValue(newFiltersFormValue);
    });

  }

    // if(offerFilters != null) {
    //
    //   this.filtersForm.addControl("categories", new FormArray([]));
    //   this.categories.forEach((category) =>
    //     this.categoriesFormArray.push(new FormControl(offerFilters?.categoriesIds.includes(category.id))));
    //
    //   this.filtersForm.addControl("localizations", new FormArray([]));
    //   this.localizations.forEach((localization) =>
    //     this.localizationsFormArray.push(new FormControl(offerFilters?.localizationsIds.includes(localization.id))));
    //
    //   this.filtersForm.addControl("firstJobPossibility", new FormControl(offerFilters.firstJobPossibility == null ? false : offerFilters.firstJobPossibility));
    //
    //   this.filtersForm.addControl("remoteJobPossibility", new FormControl(offerFilters.remoteJobPossibility == null ? false : offerFilters.remoteJobPossibility));
    // }
    // else {
    //   this.filtersForm.addControl("categories", new FormArray([]));
    //   this.categories.forEach((category) =>
    //     this.categoriesFormArray.push(new FormControl(false)));
    //
    //   this.filtersForm.addControl("localizations", new FormArray([]));
    //   this.localizations.forEach((localization) =>
    //     this.localizationsFormArray.push(new FormControl(false)));
    //
    //   this.filtersForm.addControl("firstJobPossibility", new FormControl(false))
    //
    //   this.filtersForm.addControl("remoteJobPossibility", new FormControl(false))
    // }

  onSubmit() {
    let selectedCategoriesIds = this.filtersForm.value.categories
      .map((checked: boolean, i: number) => checked ? this.categories[i].id : null)
      .filter((v: number | null) => v !== null);

    let selectedLocalizationsIds = this.filtersForm.value.localizations
      .map((checked: boolean, i: number) => checked ? this.localizations[i].id : null)
      .filter((v: number | null) => v !== null);

    let firstJobPossibilityChecked = this.filtersForm.value["firstJobPossibility"];
    let remoteJobPossibilityChecked = this.filtersForm.value["remoteJobPossibility"];

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.offersService.paramsPlusOfferFiltersWithCurrentPageReset(
        this.activatedRoute.snapshot.queryParams,
        {
          categoriesIds: selectedCategoriesIds,
          localizationsIds: selectedLocalizationsIds,
          firstJobPossibility: firstJobPossibilityChecked ? true : null,
          remoteJobPossibility: remoteJobPossibilityChecked ? true : null,
        })
    });
  }

}
