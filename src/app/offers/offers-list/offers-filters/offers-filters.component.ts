import { Component, OnInit } from '@angular/core';
import {LocalizationFullDto} from "../../../shared/model/localization-full-dto.model";
import {CategoryFullDto} from "../../../shared/model/category-full-dto.model";
import {CategoriesService} from "../../../shared/service/categories.service";
import {LocalizationsService} from "../../../shared/service/localizations.service";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";

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
    private formBuilder: FormBuilder
  ) { }

  get categoriesFormArray() {
    return this.filtersForm.controls['categories'] as FormArray
  }

  get localizationsFormArray() {
    return this.filtersForm.controls['localizations'] as FormArray
  }

  ngOnInit(): void {
    this.filtersForm = this.formBuilder.group({
      categories: new FormArray([]),
      localizations: new FormArray([]),
      firstJobPossibility: new FormControl(false),
      remoteJobPossibility: new FormControl(false)
    });

    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.categories.forEach((category) =>
        this.categoriesFormArray.push(new FormControl(false)));
    });

    this.localizationsService.getLocalizations().subscribe((localizations) => {
      this.localizations = localizations;
      this.localizations.forEach((localization) =>
        this.localizationsFormArray.push(new FormControl(false)));
    });
  }

  onSubmit() {
    let selectedCategoriesIds = this.filtersForm.value.categories
      .map((checked: boolean, i: number) => checked ? this.categories[i].id : null)
      .filter((v: number | null) => v !== null);

    let selectedLocalizationsIds = this.filtersForm.value.localizations
      .map((checked: boolean, i: number) => checked ? this.localizations[i].id : null)
      .filter((v: number | null) => v !== null);

    let firstJobPossibilityChecked = this.filtersForm.value["firstJobPossibility"];
    let remoteJobPossibilityChecked = this.filtersForm.value["remoteJobPossibility"];
  }

}
