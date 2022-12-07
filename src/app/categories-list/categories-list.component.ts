import {Component, OnDestroy, OnInit} from '@angular/core';
import { UsersService } from "../shared/service/users.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import {CategoryFullDto} from "../shared/model/category-full-dto.model";
import {CategoriesService} from "../shared/service/categories.service";
import {Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit, OnDestroy {

  categories: CategoryFullDto[] = [];
  categoriesChangedSub: Subscription;
  isCategoryCreateMode: boolean;
  categoryCreateForm: FormGroup;

  constructor(
    private usersService: UsersService,
    private location: Location,
    private router: Router,
    private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    if(!this.usersService.isLoggedIn()) {
      this.router.navigate(["/login"]);
    }
    else if(!this.usersService.isAdmin()) {
      this.location.back();
    }

    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this.categoriesChangedSub = this.categoriesService.categoriesChanged.subscribe(() => {
      this.categoriesService.getCategories().subscribe((categories) => {
        this.categories = categories;
      });
    });
  }

  ngOnDestroy() {
    this.categoriesChangedSub.unsubscribe();
  }

  toggleCategoryCreateMode() {
    if(this.isCategoryCreateMode) {
      this.isCategoryCreateMode = false;
    }
    else {
      this.categoryCreateForm = new FormGroup({
        category: new FormControl(null, [Validators.required, Validators.maxLength(50)])
      });
      this.isCategoryCreateMode = true;
    }
  }

  createCategory() {
    if(this.categoryCreateForm.valid) {
      this.categoriesService.createCategory(this.categoryCreateForm.value["category"]).subscribe(() => {
        this.categoriesService.emitCategoriesChanged();
        this.isCategoryCreateMode = false;
      })
    }
  }

}
