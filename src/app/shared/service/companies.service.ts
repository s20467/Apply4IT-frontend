import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CompanyMinimalDto} from "../model/company-minimal-dto.model";
import {Subject} from "rxjs";
import {Page} from "../model/page.model";
import {CompanyListItemDto} from "../model/company-list-item-dto.model";
import {Params} from "@angular/router";
import {CompanyParams} from "../model/company-params.model";

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  private urlBase: string = environment.apiUrlBase + "api/v1/";

  companiesNumberOfPagesInitialized = new Subject<number>();
  companiesChanged = new Subject<any>()

  constructor(private http: HttpClient) { }

  getCompaniesOwnedAndRecruiting() {
    return this.http.get<CompanyMinimalDto[]>(this.urlBase + "companies/owned-and-recruiting-for");
  }

  searchCompaniesByName(companyName: string | null, pageNumber: number) {
    let params = new HttpParams().set('page', pageNumber);
    console.log({nameLike: companyName})
    return this.http.post<Page<CompanyListItemDto>>(this.urlBase + "companies/search", {nameLike: companyName}, { params: params });
  }



  emitCompaniesChanged() {
    this.companiesChanged.next(null);
  }

  emitCompaniesNumberOfPagesInitialized(numberOfPages: number) {
    this.companiesNumberOfPagesInitialized.next(numberOfPages);
  }



  getCurrentPageFromParams(params: Params): number {
    if(!Object.keys(params).includes("companyParams")) {
      return 0;
    }
    let companyParams: CompanyParams = JSON.parse(params["companyParams"]);
    return companyParams.currentPage;
  }

  getSearchStringFromParams(params: Params): string | null {
    if(!Object.keys(params).includes("companyParams")) {
      return null;
    }
    let companyParams: CompanyParams = JSON.parse(params["companyParams"]);
    return companyParams.searchString;
  }

  paramsPlusCurrentPage(params: Params, currentPage: number): Params {
    let currentCompanyParams: CompanyParams = new CompanyParams();
    if(Object.keys(params).includes("companyParams")) {
      currentCompanyParams = JSON.parse(params["companyParams"]);
    }
    currentCompanyParams.currentPage = currentPage;
    return { companyParams: JSON.stringify(currentCompanyParams) }
  }

  paramsPlusSearchStringWithCurrentPageReset(params: Params, searchString: string | null): Params {
    let currentCompanyParams: CompanyParams = new CompanyParams();
    if(Object.keys(params).includes("companyParams")) {
      currentCompanyParams = JSON.parse(params["companyParams"]);
    }
    currentCompanyParams.searchString = searchString;
    currentCompanyParams.currentPage = 0;
    return { companyParams: JSON.stringify(currentCompanyParams) }
  }
}
