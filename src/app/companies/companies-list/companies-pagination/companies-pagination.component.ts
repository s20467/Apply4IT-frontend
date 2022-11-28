import { Component, OnInit } from '@angular/core';
import { PaginationObject } from "../../../shared/model/pagination-object.model";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { CompaniesService } from "../../../shared/service/companies.service";

@Component({
  selector: 'app-companies-pagination',
  templateUrl: './companies-pagination.component.html',
  styleUrls: ['./companies-pagination.component.css']
})
export class CompaniesPaginationComponent implements OnInit {

  paginationObject: PaginationObject = {
    currentPage: 0,
    numberOfPages: 1
  };
  paginationNumbers: number[] = []
  companiesNumberOfPagesInitializedSub: Subscription;

  constructor(private companiesService: CompaniesService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.companiesNumberOfPagesInitializedSub = this.companiesService.companiesNumberOfPagesInitialized.subscribe(numberOfPages => {
      this.paginationObject.currentPage = this.companiesService.getCurrentPageFromParams(this.activatedRoute.snapshot.queryParams)
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
      queryParams: this.companiesService.paramsPlusCurrentPage(this.activatedRoute.snapshot.queryParams, newCurrentPage)
    });
  }

  pageForward() {
    let newCurrentPage = Math.min(this.paginationObject.currentPage+1, this.paginationObject.numberOfPages-1);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.companiesService.paramsPlusCurrentPage(this.activatedRoute.snapshot.queryParams, newCurrentPage)
    });
  }

  changePage(targetPageNumber: number) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.companiesService.paramsPlusCurrentPage(this.activatedRoute.snapshot.queryParams, targetPageNumber)
    });
  }

  ngOnDestroy() {
    this.companiesNumberOfPagesInitializedSub.unsubscribe();
  }

}
