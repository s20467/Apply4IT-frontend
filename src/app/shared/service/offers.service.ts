import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { OfferMinimalDto } from "../model/offer-minimal-dto.model";
import { Page } from "../model/page.model";
import {OfferSearchSpecification} from "../model/offer-search-specification.model";
import {OfferFullDto} from "../model/offer-full-dto.model";

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  private urlBase: string = environment.apiUrlBase + "api/v1/";

  offersChanged = new Subject<any>();
  offersPaginationChanged = new Subject<any>();

  constructor(private http: HttpClient) { }

  getOffers(pageNumber: number) {
    let params = new HttpParams().set('page', pageNumber);
    return this.http.get<Page<OfferMinimalDto>>(this.urlBase + "offers", { params: params });
  }

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

  emitOffersChanged() {
    this.offersChanged.next(null);
    this.emitOffersPaginationChanged();
  }

  emitOffersPaginationChanged() {
    this.offersPaginationChanged.next(null);
  }

}
