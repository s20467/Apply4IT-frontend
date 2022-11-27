import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {OfferFullDto} from "../model/offer-full-dto.model";
import {CompanyMinimalDto} from "../model/company-minimal-dto.model";

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  private urlBase: string = environment.apiUrlBase + "api/v1/";

  constructor(private http: HttpClient) { }

  getCompaniesOwnedAndRecruiting() {
    return this.http.get<CompanyMinimalDto[]>(this.urlBase + "companies/owned-and-recruiting-for");
  }
}
