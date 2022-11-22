import { Component, OnInit } from '@angular/core';
import { OffersService } from "../../shared/service/offers.service";
import { OfferMinimalDto } from "../../shared/model/offer-minimal-dto.model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.css']
})
export class OffersListComponent implements OnInit {

  offers: OfferMinimalDto[] = [];

  constructor(private offersService: OffersService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.offersService.searchOffers(
        this.offersService.getOfferSearchSpecificationFromParams(params),
        this.offersService.getCurrentPageFromParams(params)
      ).subscribe((offersPage) => {
        this.offers = offersPage.content;
        this.offersService.emitOffersNumberOfPagesInitialized(offersPage.totalPages);
      });
    });
  }
}
