import { Component, OnDestroy, OnInit } from '@angular/core';
import { OffersService } from "../../shared/service/offers.service";
import { OfferMinimalDto } from "../../shared/model/offer-minimal-dto.model";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.css']
})
export class OffersListComponent implements OnInit, OnDestroy {

  offers: OfferMinimalDto[] = [];
  private offersChangedSub: Subscription;
  isCompanyOffersList: boolean = false;

  constructor(private offersService: OffersService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    if(this.offersService.getCompanyIdFromParams(this.activatedRoute.snapshot.queryParams) != null) {
      this.isCompanyOffersList = true;
    }
    this.activatedRoute.queryParams.subscribe(params => {
      this.offersService.searchOffers(
        this.offersService.getOfferSearchSpecificationFromParams(params),
        this.offersService.getCurrentPageFromParams(params)
      ).subscribe((offersPage) => {
        this.offers = offersPage.content;
        this.offersService.emitOffersNumberOfPagesInitialized(offersPage.totalPages);
      });
    });
    this.offersChangedSub = this.offersService.offersChanged.subscribe(() => {
      let params = this.activatedRoute.snapshot.queryParams;
      this.offersService.searchOffers(
        this.offersService.getOfferSearchSpecificationFromParams(params),
        this.offersService.getCurrentPageFromParams(params)
      ).subscribe((offersPage) => {
        this.offers = offersPage.content;
        this.offersService.emitOffersNumberOfPagesInitialized(offersPage.totalPages);
      });
    })
  }

  goToAllOffers() {
    this.router.navigate([""]);
  }

  ngOnDestroy() {
    this.offersChangedSub.unsubscribe();
  }
}
