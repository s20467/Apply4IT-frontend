import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { CategoryFullDto } from "../model/category-full-dto.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private urlBase: string = environment.apiUrlBase + "api/v1/";

  categoriesChanged = new Subject()

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get<CategoryFullDto[]>(this.urlBase + "categories");
  }

  editCategory(editedCategory: CategoryFullDto) {
    return this.http.put(this.urlBase + "categories", editedCategory);
  }

  createCategory(categoryTitle: string) {
    let newCategory = {id: null, title: categoryTitle}
    return this.http.post(this.urlBase + "categories", newCategory);
  }

  deleteCategory(categoryId: number) {
    return this.http.delete(this.urlBase + "categories/" + categoryId);
  }


  emitCategoriesChanged() {
    this.categoriesChanged.next(null);
  }
}
