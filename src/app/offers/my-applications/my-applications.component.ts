import { Component, OnInit } from '@angular/core';
import {OfferMinimalDto} from "../../shared/model/offer-minimal-dto.model";
import {OffersService} from "../../shared/service/offers.service";
import {Router} from "@angular/router";
import {UsersService} from "../../shared/service/users.service";

@Component({
  selector: 'app-my-applications',
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.css']
})
export class MyApplicationsComponent implements OnInit {

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
      this.offersService.getAppliedForOffers().subscribe(offers => {
        this.offers = offers.sort((o1, o2) =>
          Date.parse(o1.creationDate.toString()) - Date.parse(o2.creationDate.toString()))
      });
    }
  }

  goToAllOffers() {
    this.router.navigate(["/offers"]);
  }

}
