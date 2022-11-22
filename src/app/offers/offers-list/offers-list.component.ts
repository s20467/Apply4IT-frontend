import { Component, OnDestroy, OnInit } from '@angular/core';
import { OffersService } from "../../shared/service/offers.service";
import { OfferMinimalDto } from "../../shared/model/offer-minimal-dto.model";
import { Subscription } from "rxjs";
import {OfferSearchSpecification} from "../../shared/model/offer-search-specification.model";
import {OfferFilters} from "../../shared/model/offer-filters.model";
import {PaginationObject} from "../../shared/model/pagination-object.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {OfferFullDto} from "../../shared/model/offer-full-dto.model";

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.css']
})
export class OffersListComponent implements OnInit, OnDestroy {

  offers: OfferMinimalDto[] = [];
  paginationObject: PaginationObject;
  offersPaginationChangedSub: Subscription;


  searchObject: OfferSearchSpecification = {
    stringSearchSection: null,
    anyCategoryIdEqual: null,
    anyLocalizationIdEqual: null,
    remotePossibilityEqual: null,
    firstJobPossibilityEqual: null
  }

  constructor(private offersService: OffersService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.setOfferSearchDetailsFromQueryParams(params);
      this.offersService.searchOffers(this.searchObject, this.paginationObject.currentPage).subscribe((offersPage) => {
        this.offers = offersPage.content;
        this.paginationObject.numberOfPages = offersPage.totalPages;
        this.offersService.emitOffersPaginationInitialized();
      });
    });
    this.offersPaginationChangedSub = this.offersService.offersPaginationChanged.subscribe(() => {
      this.reloadParams();
    });
  }


  onSearchStringChanged(searchString: string | null) {
    if(searchString == "" || searchString == null) {
      this.searchObject.stringSearchSection = null;
    }
    else {
      this.searchObject.stringSearchSection = searchString;
    }
    this.paginationObject.currentPage = 0;
    this.reloadParams();
  }

  onOfferFiltersChanged(offerFilters: OfferFilters | null) {
    if(offerFilters == null) {
      this.searchObject.firstJobPossibilityEqual = null;
      this.searchObject.remotePossibilityEqual = null;
      this.searchObject.anyCategoryIdEqual = null;
      this.searchObject.anyLocalizationIdEqual = null;
    }
    else {
      this.searchObject.firstJobPossibilityEqual = offerFilters.firstJobPossibility;
      this.searchObject.remotePossibilityEqual = offerFilters.remoteJobPossibility;
      this.searchObject.anyCategoryIdEqual = offerFilters.categoriesIds;
      this.searchObject.anyLocalizationIdEqual = offerFilters.localizationsIds;
    }
    this.paginationObject.currentPage = 0;
    this.reloadParams();
  }

  reloadParams() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.offerSearchDetailsToQueryParams()
    });
  }

  offerSearchDetailsToQueryParams(): Params{
    return {
      anyCategoryIdEqual: this.arrayToString(this.searchObject.anyCategoryIdEqual),
      anyLocalizationIdEqual: this.arrayToString(this.searchObject.anyLocalizationIdEqual),
      stringSearchSection: this.searchObject.stringSearchSection,
      remotePossibilityEqual: this.searchObject.remotePossibilityEqual,
      firstJobPossibilityEqual: this.searchObject.firstJobPossibilityEqual,
      currentPage: this.paginationObject.currentPage
    };
  }

  setOfferSearchDetailsFromQueryParams(params: Params) {
    this.searchObject.anyCategoryIdEqual = params["anyCategoryIdEqual"] == null ? null : this.stringToArray(params["anyCategoryIdEqual"]);
    this.searchObject.anyLocalizationIdEqual = params["anyLocalizationIdEqual"] == null ? null : this.stringToArray(params["anyLocalizationIdEqual"]);
    this.searchObject.stringSearchSection = params["stringSearchSection"] == null ? null : params["stringSearchSection"];
    this.searchObject.remotePossibilityEqual = params["remotePossibilityEqual"] == null ? null : params["remotePossibilityEqual"];
    this.searchObject.firstJobPossibilityEqual = params["firstJobPossibilityEqual"] == null ? null : params["firstJobPossibilityEqual"];
    if(this.paginationObject == null) {
      this.paginationObject = {
        currentPage: 0,
        numberOfPages: 1
      }
    }
    if(params["currentPage"] != null) {
      this.paginationObject.currentPage = +params["currentPage"]
    }
  }

  arrayToString(arr: number[] | null) {
    if(arr == null) {
      return "[]"
    }
    return "[" + arr.join(",") + "]"
  }

  stringToArray(str: string): number[] | null{
    if(str == "[]") {
      return null;
    }
    return str.trim()
      .substring(1, str.length - 1)
      .split(",")
      .map((numStr) => { return +numStr })
  }

  ngOnDestroy() {
    this.offersPaginationChangedSub.unsubscribe();
  }
}
