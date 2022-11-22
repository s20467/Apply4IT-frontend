import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PaginationObject } from "../../../shared/model/pagination-object.model";
import { OffersService } from "../../../shared/service/offers.service";
import { Subscription} from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-offers-pagination',
  templateUrl: './offers-pagination.component.html',
  styleUrls: ['./offers-pagination.component.css']
})
export class OffersPaginationComponent implements OnInit, OnDestroy {

  paginationObject: PaginationObject = {
    currentPage: 0,
    numberOfPages: 1
  };
  paginationNumbers: number[] = []
  offersNumberOfPagesInitializedSub: Subscription;

  constructor(private offersService: OffersService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.offersNumberOfPagesInitializedSub = this.offersService.offersNumberOfPagesInitialized.subscribe(numberOfPages => {
      this.paginationObject.currentPage = this.offersService.getCurrentPageFromParams(this.activatedRoute.snapshot.queryParams)
      this.paginationObject.numberOfPages = numberOfPages;
      this.loadPaginationNumbers();
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

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  pageBack() {
    let newCurrentPage = Math.max(0, this.paginationObject.currentPage-1);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.offersService.paramsPlusCurrentPage(this.activatedRoute.snapshot.queryParams, newCurrentPage)
    });
  }

  pageForward() {
    let newCurrentPage = Math.min(this.paginationObject.currentPage+1, this.paginationObject.numberOfPages-1);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.offersService.paramsPlusCurrentPage(this.activatedRoute.snapshot.queryParams, newCurrentPage)
    });
  }

  changePage(targetPageNumber: number) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.offersService.paramsPlusCurrentPage(this.activatedRoute.snapshot.queryParams, targetPageNumber)
    });
  }

  ngOnDestroy() {
    this.offersNumberOfPagesInitializedSub.unsubscribe();
  }

}
