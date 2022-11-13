import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { OfferMinimalDto } from "../model/offer-minimal-dto.model";
import { Page } from "../model/page.model";

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  private urlBase: string = environment.apiUrlBase + "api/v1/";

  offersChanged = new Subject<any>();

  constructor(private http: HttpClient) { }

  getOffers(pageNumber: number) {
    let params = new HttpParams().set('page', pageNumber);
    return this.http.get<Page<OfferMinimalDto>>(this.urlBase + "offers", { params: params });
  }

  emitOffersChanged() {
    this.offersChanged.next(null);
  }
}
