import {Component, Input, OnInit} from '@angular/core';
import {OfferMinimalDto} from "../../../shared/model/offer-minimal-dto.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-latest-offers-list-item',
  templateUrl: './latest-offers-list-item.component.html',
  styleUrls: ['./latest-offers-list-item.component.css']
})
export class LatestOffersListItemComponent implements OnInit {

  @Input("offer") offer: OfferMinimalDto;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.offer.categories.push("Uczenie maszynowe")
    this.offer.categories.push("Data science")
    this.offer.categories.push("Java")
    this.offer.categories.push("Python")
  }

  onOfferClick() {
    this.router.navigate(["/offers", this.offer.id, "details"]);
  }

  onCompanyClick(event: Event) {
    event.stopPropagation();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
