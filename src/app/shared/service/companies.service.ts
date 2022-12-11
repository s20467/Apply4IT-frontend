import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompanyMinimalDto } from "../model/company-minimal-dto.model";
import { Subject } from "rxjs";
import { Page } from "../model/page.model";
import { CompanyListItemDto } from "../model/company-list-item-dto.model";
import { Params } from "@angular/router";
import { CompanyParams } from "../model/company-params.model";
import { CompanyFullDto } from "../model/company-full-dto.model";
import {UserMinimalDto} from "../model/user-minimal-dto.model";
import {Address} from "../model/address.model";
import {CompanySearchSpecification} from "../model/company-search-specification.model";
import {CompanyRegistrationDto} from "../model/company-registration-dto.model";

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  private urlBase: string = environment.apiUrlBase + "api/v1/";

  companiesNumberOfPagesInitialized = new Subject<number>();
  companiesChanged = new Subject<any>()

  constructor(private http: HttpClient) { }

  getCompanyById(companyId: number) {
    return this.http.get<CompanyFullDto>(this.urlBase + "companies/" + companyId);
  }

  getCompaniesOwnedAndRecruiting() {
    return this.http.get<CompanyMinimalDto[]>(this.urlBase + "companies/owned-and-recruiting-for");
  }

  searchCompaniesByName(companyName: string | null, pageNumber: number) {
    let params = new HttpParams().set('page', pageNumber);
    let companySearchSpecification = <CompanySearchSpecification>{
      nameLike: companyName,
      enabledEqual: true
    }
    return this.http.post<Page<CompanyListItemDto>>(this.urlBase + "companies/search", companySearchSpecification, { params: params });
  }

  searchNotEnabledCompaniesByName(companyName: string | null, pageNumber: number) {
    let params = new HttpParams().set('page', pageNumber);
    let companySearchSpecification = <CompanySearchSpecification>{
      nameLike: companyName,
      enabledEqual: false
    }
    return this.http.post<Page<CompanyListItemDto>>(this.urlBase + "companies/search", companySearchSpecification, { params: params });
  }

  getRecruiters(companyId: number) {
    return this.http.get<UserMinimalDto[]>(this.urlBase + "companies/" + companyId + "/recruiters");
  }

  addRecruiter(companyId: number, email: string) {
    return this.http.post(this.urlBase + "companies/" + companyId + "/recruiters/" + email, null);
  }

  removeRecruiter(companyId: number, email: string) {
    return this.http.delete(this.urlBase + "companies/" + companyId + "/recruiters/" + email);
  }

  editCompanyDescription(companyId: number, companyDescription: string) {
    return this.http.post(this.urlBase + "companies/" + companyId + "/edit-description", {description: companyDescription});
  }

  editCompanyAddress(companyId: number, companyAddress: Address) {
    return this.http.post(this.urlBase + "companies/" + companyId + "/edit-address", companyAddress);
  }

  deleteCompany(companyId: number) {
    return this.http.delete(this.urlBase + "companies/" + companyId);
  }

  uploadLogo(companyId: number, logoFile: File) {
    const formData = new FormData();
    formData.append("logo", logoFile, logoFile.name);
    return this.http.post(this.urlBase + "companies/" + companyId + "/upload-image", formData)
  }

  registerCompany(companyRegistrationDto: CompanyRegistrationDto) {
    return this.http.post<number>(this.urlBase + "companies/register", companyRegistrationDto);
  }

  checkIfCompanyNameIsFree(companyName: string) {
    return this.http.get<boolean>(this.urlBase + "companies/" + companyName + "/is-name-free");
  }

  enableCompany(companyId: number) {
    return this.http.put(this.urlBase + "companies/" + companyId + "/enable", null);
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
