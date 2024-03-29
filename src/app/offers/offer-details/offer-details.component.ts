import { Component, OnInit } from '@angular/core';
import { OffersService } from "../../shared/service/offers.service";
import { UsersService } from "../../shared/service/users.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { OfferFullDto } from "../../shared/model/offer-full-dto.model";
import { Location } from "@angular/common";

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {

  offer: OfferFullDto;
  isAuthor: boolean;

  constructor(
    private offersService: OffersService,
    public usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.offersService.getOfferById(+params['offerId']).subscribe((offer: OfferFullDto) => {
        this.offer = offer;
        this.offersService.checkIfAuthorOfByOfferId(offer.id).subscribe((isAuthor: boolean) => {
          this.isAuthor = isAuthor;
        });
        this.offer.expectations.sort((o1, o2) => o1.orderNumber - o2.orderNumber);
        this.offer.offerAdvantages.sort((o1, o2) => o1.orderNumber - o2.orderNumber);
      })
    })
  }

  saveUnsaveOffer() {
    if(!this.usersService.isLoggedIn()) {
      this.router.navigate(["/login"]);
    }
    else {
      if(!this.offer.isSavedByCurrentUser) {
        this.offersService.saveOffer(this.offer.id).subscribe(() => {
          this.offer.isSavedByCurrentUser = true;
        });
      }
      else {
        this.offersService.unsaveOffer(this.offer.id).subscribe(() => {
          this.offer.isSavedByCurrentUser = false;
        });
      }
    }
  }

  editOffer() {
    this.router.navigate(["/offers", this.offer.id, "edit"])
  }

  deleteOffer() {
    if(confirm("Czy na pewno chcesz usunąć to ogłoszenie?")) {
      this.offersService.deleteOffer(this.offer.id).subscribe(() => {
        this.offersService.emitOffersChanged();
      });
      this.location.back();
    }
  }

  goToApplyForm() {
    if(!this.usersService.isLoggedIn()) {
      this.router.navigate(["/login"]);
    }
    else {
      this.router.navigate(["/offers", this.offer.id, "apply"]);
    }
  }
}
