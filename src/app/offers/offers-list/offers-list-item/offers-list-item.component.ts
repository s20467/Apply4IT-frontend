import { Component, Input, OnInit } from '@angular/core';
import { OfferMinimalDto } from "../../../shared/model/offer-minimal-dto.model";
import {DomSanitizer} from "@angular/platform-browser";
import {OffersService} from "../../../shared/service/offers.service";
import {UsersService} from "../../../shared/service/users.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-offers-list-item',
  templateUrl: './offers-list-item.component.html',
  styleUrls: ['./offers-list-item.component.css']
})
export class OffersListItemComponent implements OnInit {

  @Input('offer') offer: OfferMinimalDto;

  constructor(private offersService: OffersService, private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
  }

  onClick() {
    this.router.navigate(['/offers', this.offer.id, "details"])
  }

  saveUnsaveOffer(event: Event) {
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
    event.stopPropagation();
  }

}
