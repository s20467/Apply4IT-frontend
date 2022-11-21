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
  offersChangedSub: Subscription;
  offersPaginationChangedSub: Subscription;

  searchObject: OfferSearchSpecification = {
    stringSearchSection: null,
    anyCategoryIdEqual: null,
    anyLocalizationIdEqual: null,
    remotePossibilityEqual: null,
    firstJobPossibilityEqual: null
  }

  constructor(private offersService: OffersService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.paginationObject = {
      currentPage: 0,
      numberOfPages: 1
    }
  }

  ngOnInit(): void {
    this.offersService.searchOffers(null, this.paginationObject.currentPage).subscribe((offersPage) => {
      this.offers = offersPage.content;
      this.paginationObject.numberOfPages = offersPage.totalPages;
      this.offersService.emitOffersPaginationChanged();
    });
   this.offersChangedSub = this.offersService.offersChanged.subscribe(() => {
      this.offersService.searchOffers(this.searchObject, this.paginationObject.currentPage).subscribe((offersPage) => {
        this.offers = offersPage.content;
        this.paginationObject.numberOfPages = offersPage.totalPages;
      });
    });
    this.offersPaginationChangedSub = this.offersService.offersPaginationChanged.subscribe(() => {
      this.offersService.searchOffers(this.searchObject, this.paginationObject.currentPage).subscribe((offersPage) => {
        this.offers = offersPage.content;
        this.paginationObject.numberOfPages = offersPage.totalPages;
      });
    });
  }


  onSearchStringChanged(searchString: string | null) {
    if(searchString == "" || searchString == null) {
      this.searchObject.stringSearchSection = null;
    }
    else {
      this.searchObject.stringSearchSection = {
        titleLike: searchString,
        descriptionLike: searchString,
        anyExpectationLike: searchString,
        anyOfferAdvantageLike: searchString,
        companyNameLike: searchString,
        anyCategoryNameLike: searchString
      }
    }
    this.paginationObject.currentPage = 0;
    this.offersService.emitOffersChanged();
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
    this.offersService.emitOffersChanged();
  }

  ngOnDestroy() {
    this.offersChangedSub.unsubscribe();
    this.offersPaginationChangedSub.unsubscribe();
  }


}
