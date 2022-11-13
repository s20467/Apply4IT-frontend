import { Component, OnDestroy, OnInit } from '@angular/core';
import { OffersService } from "../../shared/service/offers.service";
import { OfferMinimalDto } from "../../shared/model/offer-minimal-dto.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.css']
})
export class OffersListComponent implements OnInit, OnDestroy {

  offers: OfferMinimalDto[] = [];
  offersChangedSub: Subscription;
  pageNumber: number = 0;

  constructor(private offersService: OffersService) { }

  ngOnInit(): void {
    this.offersService.getOffers(this.pageNumber).subscribe((offersPage) => {
      this.offers = offersPage.content;
    });
   this.offersChangedSub = this.offersService.offersChanged.subscribe(() => {
      this.offersService.getOffers(this.pageNumber).subscribe((offersPage) => {
        this.offers = offersPage.content;
      });
    });
  }

  ngOnDestroy() {
    this.offersChangedSub.unsubscribe();
  }

}
