import { Component, OnDestroy, OnInit } from '@angular/core';
import { OffersService } from "../../shared/service/offers.service";
import { OfferMinimalDto } from "../../shared/model/offer-minimal-dto.model";
import { Subscription } from "rxjs";
import {OfferSearchSpecification} from "../../shared/model/offer-search-specification.model";
import {OfferFilters} from "../../shared/model/offer-filters.model";

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.css']
})
export class OffersListComponent implements OnInit, OnDestroy {

  offers: OfferMinimalDto[] = [];
  offersChangedSub: Subscription;
  pageNumber: number = 0;

  searchObject: OfferSearchSpecification = {
    stringSearchSection: null,
    anyCategoryIdEqual: null,
    anyLocalizationIdEqual: null,
    remotePossibilityEqual: null,
    firstJobPossibilityEqual: null
  }

  constructor(private offersService: OffersService) { }

  ngOnInit(): void {
    this.offersService.getOffers(this.pageNumber).subscribe((offersPage) => {
      this.offers = offersPage.content;
    });
   this.offersChangedSub = this.offersService.offersChanged.subscribe(() => {
     console.log(this.searchObject);
      this.offersService.searchOffers(this.searchObject, this.pageNumber).subscribe((offersPage) => {
        this.offers = offersPage.content;
        console.log(this.offers)
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
    this.pageNumber = 0;
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
    this.pageNumber = 0;
    this.offersService.emitOffersChanged();
  }

  ngOnDestroy() {
    this.offersChangedSub.unsubscribe();
  }


}
