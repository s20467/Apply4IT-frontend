import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { CategoryFullDto } from "../model/category-full-dto.model";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private urlBase: string = environment.apiUrlBase + "api/v1/";

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get<CategoryFullDto[]>(this.urlBase + "categories");
  }
}
