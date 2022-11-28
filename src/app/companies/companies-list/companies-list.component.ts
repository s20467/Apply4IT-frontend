import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { CompaniesService } from "../../shared/service/companies.service";
import { CompanyListItemDto } from "../../shared/model/company-list-item-dto.model";

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.css']
})
export class CompaniesListComponent implements OnInit {

  companies: CompanyListItemDto[] = [];
  private companiesChangedSub: Subscription;

  constructor(private companiesService: CompaniesService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.companiesService.searchCompaniesByName(
        this.companiesService.getSearchStringFromParams(params),
        this.companiesService.getCurrentPageFromParams(params)
      ).subscribe((companiesPage) => {
        this.companies = companiesPage.content;
        this.companiesService.emitCompaniesNumberOfPagesInitialized(companiesPage.totalPages);
      });
    });
    this.companiesChangedSub = this.companiesService.companiesChanged.subscribe(() => {
      let params = this.activatedRoute.snapshot.queryParams;
      this.companiesService.searchCompaniesByName(
        this.companiesService.getSearchStringFromParams(params),
        this.companiesService.getCurrentPageFromParams(params)
      ).subscribe((companiesPage) => {
        this.companies = companiesPage.content;
        this.companiesService.emitCompaniesNumberOfPagesInitialized(companiesPage.totalPages);
      });
    })
  }

  ngOnDestroy() {
    this.companiesChangedSub.unsubscribe();
  }
}
