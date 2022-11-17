import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { PaginationObject } from "../../../shared/model/pagination-object.model";
import { OffersService } from "../../../shared/service/offers.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-offers-pagination',
  templateUrl: './offers-pagination.component.html',
  styleUrls: ['./offers-pagination.component.css']
})
export class OffersPaginationComponent implements OnInit, OnDestroy {

  @Input('paginationObject') paginationObject: PaginationObject;
  paginationNumbers: number[] = []
  offersPaginationChangedSub: Subscription;

  constructor(private offersService: OffersService) { }

  ngOnInit(): void {
    this.loadPaginationNumbers();
    this.offersService.offersPaginationChanged.subscribe(() => {
      this.loadPaginationNumbers();
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    })
  }


  loadPaginationNumbers() {
    this.paginationNumbers = []

    if(this.paginationObject.currentPage < 3) {
      for(let i=0; i<=this.paginationObject.currentPage; i++) {
        this.paginationNumbers.push(i)
      }
    }
    else {
      this.paginationNumbers.push(0, -1, this.paginationObject.currentPage-1, this.paginationObject.currentPage)
    }

    if(this.paginationObject.numberOfPages - this.paginationObject.currentPage <= 3) {
      for(let i=this.paginationObject.currentPage+1; i<this.paginationObject.numberOfPages; i++) {
        this.paginationNumbers.push(i)
      }
    }
    else {
      this.paginationNumbers.push(this.paginationObject.currentPage+1, -1, this.paginationObject.numberOfPages-1)
    }
  }

  pageBack() {
    this.paginationObject.currentPage = Math.max(0, this.paginationObject.currentPage-1);
    this.offersService.emitOffersPaginationChanged();
  }

  pageForward() {
    this.paginationObject.currentPage = Math.min(this.paginationObject.currentPage+1, this.paginationObject.numberOfPages-1);
    this.offersService.emitOffersPaginationChanged();
  }

  changePage(targetPageNumber: number) {
    this.paginationObject.currentPage = targetPageNumber;
    this.offersService.emitOffersPaginationChanged();
  }

  ngOnDestroy() {
    this.offersPaginationChangedSub.unsubscribe();
  }

}
