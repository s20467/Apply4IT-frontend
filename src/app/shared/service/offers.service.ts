import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {OfferMinimalDto} from "../model/offer-minimal-dto.model";
import {Page} from "../model/page.model";
import {OfferSearchSpecification} from "../model/offer-search-specification.model";
import {OfferFullDto} from "../model/offer-full-dto.model";
import {Params} from "@angular/router";
import {OfferFilters} from "../model/offer-filters.model";
import {PaginationObject} from "../model/pagination-object.model";
import {OfferParams} from "../model/offer-params.model";

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  private urlBase: string = environment.apiUrlBase + "api/v1/";

  offersChanged = new Subject<any>();
  offersPaginationChanged = new Subject<any>();
  offersPaginationInitialized = new Subject<any>();

  constructor(private http: HttpClient) { }

  getOffers(pageNumber: number) {
    let params = new HttpParams().set('page', pageNumber);
    return this.http.get<Page<OfferMinimalDto>>(this.urlBase + "offers", { params: params });
  }

  searchOffers(searchObject: OfferSearchSpecification | null, pageNumber: number) {
    if(typeof(searchObject?.stringSearchSection) == 'string'){
      let searchString = searchObject.stringSearchSection;
      searchObject = JSON.parse(JSON.stringify(searchObject)) as OfferSearchSpecification
      searchObject.stringSearchSection = {
        titleLike: searchString,
        descriptionLike: searchString,
        anyExpectationLike: searchString,
        anyOfferAdvantageLike: searchString,
        companyNameLike: searchString,
        anyCategoryNameLike: searchString
      }
    }
    let params = new HttpParams().set('page', pageNumber);
    return this.http.post<Page<OfferMinimalDto>>(this.urlBase + "offers/search", searchObject, { params: params });
  }

  getOfferById(offerId: number) {
    return this.http.get<OfferFullDto>(this.urlBase + "offers/" + offerId);
  }

  deleteOffer(offerId: number) {
    return this.http.delete(this.urlBase + "offers/" + offerId);
  }

  saveOffer(offerId: number) {
    return this.http.post(this.urlBase + "offers/" + offerId + "/save", null);
  }

  unsaveOffer(offerId: number) {
    return this.http.post(this.urlBase + "offers/" + offerId + "/unsave", null);
  }

  checkIfAuthorOfByOfferId(offerId: number) {
    return this.http.get<boolean>(this.urlBase + "offers/" + offerId + "/am-i-author");
  }




  emitOffersChanged() {
    this.offersChanged.next(null);
    this.emitOffersPaginationChanged();
  }

  emitOffersPaginationChanged() {
    this.offersPaginationChanged.next(null);
  }

  emitOffersPaginationInitialized() {
    this.offersPaginationInitialized.next(null);
  }




  getOfferFiltersFromParams(params: Params): OfferFilters {
    let offerParams: OfferParams = JSON.parse(params["offersParams"]);
    return {
      categoriesIds: offerParams.anyCategoryIdEqual,
      localizationsIds: offerParams.anyLocalizationIdEqual,
      remoteJobPossibility: offerParams.remotePossibilityEqual,
      firstJobPossibility: offerParams.firstJobPossibilityEqual
    };
  }

  getCurrentPageFromParams(params: Params): number {
    let offerParams: OfferParams = JSON.parse(params["offersParams"]);
    return offerParams.currentPage;
  }

  getSearchStringFromParams(params: Params): string | null {
    let offerParams: OfferParams = JSON.parse(params["offersParams"]);
    return offerParams.searchString;
  }

  addOfferFiltersToParams(params: Params, filters: OfferFilters): Params {
    let currentOfferParams: OfferParams = JSON.parse(params["offerParams"]);
    currentOfferParams.anyCategoryIdEqual = filters.categoriesIds;
    currentOfferParams.anyLocalizationIdEqual = filters.localizationsIds;
    currentOfferParams.firstJobPossibilityEqual = filters.firstJobPossibility;
    currentOfferParams.remotePossibilityEqual = filters.remoteJobPossibility;
    return { offerParams: currentOfferParams }
  }

  addCurrentPageToParams(params: Params, currentPage: number): Params {
    let currentOfferParams: OfferParams = JSON.parse(params["offerParams"]);
    currentOfferParams.currentPage = currentPage;
    return { offerParams: currentOfferParams }
  }

  addSearchStringToParams(params: Params, searchString: string | null): Params {
    let currentOfferParams: OfferParams = JSON.parse(params["offerParams"]);
    currentOfferParams.searchString = searchString;
    return { offerParams: currentOfferParams }
  }



}
