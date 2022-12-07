import { Component, Input, OnInit } from '@angular/core';
import { CategoryFullDto } from "../../shared/model/category-full-dto.model";
import { CategoriesService } from "../../shared/service/categories.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-categories-list-item',
  templateUrl: './categories-list-item.component.html',
  styleUrls: ['./categories-list-item.component.css']
})
export class CategoriesListItemComponent implements OnInit {

  @Input("category") category: CategoryFullDto;

  isCategoryEditMode: boolean = false;
  categoryEditForm: FormGroup;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit(): void {
  }

  toggleCategoryEditMode() {
    if(this.isCategoryEditMode) {
      this.isCategoryEditMode = false
    }
    else {
      this.categoryEditForm = new FormGroup({
        category: new FormControl(this.category.title, [Validators.required, Validators.maxLength(50)])
      })
      this.isCategoryEditMode = true;
    }
  }

  editCategory() {
    if(this.categoryEditForm.valid) {
      let editedCategory: CategoryFullDto = {
        id: this.category.id,
        title: this.categoryEditForm.value["category"]
      }
      this.categoriesService.editCategory(editedCategory).subscribe({
        next: () => {
          this.categoriesService.emitCategoriesChanged();
          this.isCategoryEditMode = false
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.categoryEditForm.setErrors({"UnknownServerError": true});
        }
      })
    }
  }

  deleteCategory() {
    if(confirm("Czy na pewno chcesz usunąć kategorię '" + this.category.title + "'?")) {
      this.categoriesService.deleteCategory(this.category.id).subscribe(() => {
        this.categoriesService.emitCategoriesChanged();
      });
    }
  }

}
