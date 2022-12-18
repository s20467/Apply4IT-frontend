import { Component, OnInit } from '@angular/core';
import {OfferMinimalDto} from "../../shared/model/offer-minimal-dto.model";
import {OffersService} from "../../shared/service/offers.service";
import {Router} from "@angular/router";
import {UsersService} from "../../shared/service/users.service";

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.component.html',
  styleUrls: ['./my-offers.component.css']
})
export class MyOffersComponent implements OnInit {

  offers: OfferMinimalDto[];

  constructor(
    private usersService: UsersService,
    private offersService: OffersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(!this.usersService.isLoggedIn()) {
      this.router.navigate(["/login"]);
    }
    else {
      this.offersService.getMyOffers().subscribe(offers => {
        this.offers = offers
      });
    }
  }

  goToAllOffers() {
    this.router.navigate(["/offers"]);
  }
}
