import { Component, Input, OnInit } from '@angular/core';
import { OfferMinimalDto } from "../../../shared/model/offer-minimal-dto.model";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-offers-list-item',
  templateUrl: './offers-list-item.component.html',
  styleUrls: ['./offers-list-item.component.css']
})
export class OffersListItemComponent implements OnInit {

  @Input('offer') offer: OfferMinimalDto;

  constructor() { }

  ngOnInit(): void {
  }

}
