import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {OfferMinimalDto} from "../model/offer-minimal-dto.model";
import {Page} from "../model/page.model";
import {
  OfferSearchSpecification,
  OfferSearchSpecificationStringSearchSection
} from "../model/offer-search-specification.model";
import { OfferFullDto } from "../model/offer-full-dto.model";
import { Params } from "@angular/router";
import { OfferFilters } from "../model/offer-filters.model";
import { OfferParams } from "../model/offer-params.model";
import { OfferCreationRequestDto } from "../model/offer-creation-request-dto.model";

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  private urlBase: string = environment.apiUrlBase + "api/v1/";

  offersChanged = new Subject<any>();
  offersPaginationChanged = new Subject<any>();
  offersNumberOfPagesInitialized = new Subject<number>();

  constructor(private http: HttpClient) { }

  searchOffers(searchObject: OfferSearchSpecification | null, pageNumber: number) {
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

  createOffer(offer: OfferCreationRequestDto) {
    return this.http.post<number>(this.urlBase + "offers", offer);
  }

  updateOffer(offer: OfferCreationRequestDto, offerId: number) {
    return this.http.put<number>(this.urlBase + "offers/" + offerId, offer)
  }


  emitOffersChanged() {
    this.offersChanged.next(null);
    this.emitOffersPaginationChanged();
  }

  emitOffersPaginationChanged() {
    this.offersPaginationChanged.next(null);
  }

  emitOffersNumberOfPagesInitialized(numberOfPages: number) {
    this.offersNumberOfPagesInitialized.next(numberOfPages);
  }



  getOfferFiltersFromParams(params: Params): OfferFilters | null {
    if(!Object.keys(params).includes("offerParams")) {
      return null;
    }
    let offerParams: OfferParams = JSON.parse(params["offerParams"]);
    return {
      categoriesIds: offerParams.anyCategoryIdEqual,
      localizationsIds: offerParams.anyLocalizationIdEqual,
      remoteJobPossibility: offerParams.remotePossibilityEqual,
      firstJobPossibility: offerParams.firstJobPossibilityEqual
    };
  }

  getCurrentPageFromParams(params: Params): number {
    if(!Object.keys(params).includes("offerParams")) {
      return 0;
    }
    let offerParams: OfferParams = JSON.parse(params["offerParams"]);
    return offerParams.currentPage;
  }

  getSearchStringFromParams(params: Params): string | null {
    if(!Object.keys(params).includes("offerParams")) {
      return null;
    }
    let offerParams: OfferParams = JSON.parse(params["offerParams"]);
    return offerParams.searchString;
  }

  getCompanyIdFromParams(params: Params): number | null {
    if(!Object.keys(params).includes("offerParams")) {
      return null;
    }
    let offerParams: OfferParams = JSON.parse(params["offerParams"]);
    return offerParams.companyIdEqual;
  }

  getOfferSearchSpecificationFromParams(params: Params): OfferSearchSpecification | null{
    if(!Object.keys(params).includes("offerParams")) {
      return null;
    }
    let offerParams: OfferParams = JSON.parse(params["offerParams"])
    let offerSearchSpecification: OfferSearchSpecification = {
      remotePossibilityEqual: offerParams.remotePossibilityEqual,
      firstJobPossibilityEqual: offerParams.firstJobPossibilityEqual,
      anyCategoryIdEqual: offerParams.anyCategoryIdEqual,
      anyLocalizationIdEqual: offerParams.anyLocalizationIdEqual,
      companyIdEqual: offerParams.companyIdEqual,
      stringSearchSection: null,
    };
    if(offerParams.searchString != null && offerParams.searchString.length != 0) {
      offerSearchSpecification.stringSearchSection = {
        titleLike: offerParams.searchString,
        descriptionLike: offerParams.searchString,
        anyExpectationLike: offerParams.searchString,
        anyOfferAdvantageLike: offerParams.searchString,
        companyNameLike: offerParams.searchString,
        anyCategoryNameLike: offerParams.searchString
      };
    }
    return offerSearchSpecification;
  }

  paramsPlusCompanyIdEqual(params: Params, companyIdEqual: number | null) {
    let currentOfferParams: OfferParams = new OfferParams();
    if(Object.keys(params).includes("offerParams")) {
      currentOfferParams = JSON.parse(params["offerParams"]);
    }
    currentOfferParams.companyIdEqual = companyIdEqual;
    currentOfferParams.currentPage = 0;
    return { offerParams: JSON.stringify(currentOfferParams) }
  }

  paramsPlusOfferFiltersWithCurrentPageReset(params: Params, filters: OfferFilters): Params {
    let currentOfferParams: OfferParams = new OfferParams();
    if(Object.keys(params).includes("offerParams")) {
      currentOfferParams = JSON.parse(params["offerParams"]);
    }
    currentOfferParams.anyCategoryIdEqual = filters.categoriesIds;
    currentOfferParams.anyLocalizationIdEqual = filters.localizationsIds;
    currentOfferParams.firstJobPossibilityEqual = filters.firstJobPossibility;
    currentOfferParams.remotePossibilityEqual = filters.remoteJobPossibility;
    currentOfferParams.currentPage = 0;
    return { offerParams: JSON.stringify(currentOfferParams) }
  }

  paramsPlusCurrentPage(params: Params, currentPage: number): Params {
    let currentOfferParams: OfferParams = new OfferParams();
    if(Object.keys(params).includes("offerParams")) {
      currentOfferParams = JSON.parse(params["offerParams"]);
    }
    currentOfferParams.currentPage = currentPage;
    return { offerParams: JSON.stringify(currentOfferParams) }
  }

  paramsPlusSearchStringWithCurrentPageReset(params: Params, searchString: string | null): Params {
    let currentOfferParams: OfferParams = new OfferParams();
    if(Object.keys(params).includes("offerParams")) {
      currentOfferParams = JSON.parse(params["offerParams"]);
    }
    currentOfferParams.searchString = searchString;
    currentOfferParams.currentPage = 0;
    return { offerParams: JSON.stringify(currentOfferParams) }
  }

}
