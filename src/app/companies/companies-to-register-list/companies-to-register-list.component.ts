import { Component, OnInit } from '@angular/core';
import { CompanyListItemDto } from "../../shared/model/company-list-item-dto.model";
import { Subscription } from "rxjs";
import { CompaniesService } from "../../shared/service/companies.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../../shared/service/users.service";

@Component({
  selector: 'app-companies-to-register-list',
  templateUrl: './companies-to-register-list.component.html',
  styleUrls: ['./companies-to-register-list.component.css']
})
export class CompaniesToRegisterListComponent implements OnInit {

  companies: CompanyListItemDto[] = [];
  private companiesChangedSub: Subscription;

  constructor(
    private companiesService: CompaniesService,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private router: Router) {
  }

  ngOnInit(): void {
    if(!this.usersService.isLoggedIn()) {
      this.router.navigate(["/login"])
    }
    else if(!this.usersService.isAdmin()) {
      this.router.navigate(["/offers"])
    }
    this.activatedRoute.queryParams.subscribe(params => {
      this.companiesService.searchNotEnabledCompaniesByName(
        this.companiesService.getSearchStringFromParams(params),
        this.companiesService.getCurrentPageFromParams(params)
      ).subscribe((companiesPage) => {
        this.companies = companiesPage.content;
        this.companiesService.emitCompaniesNumberOfPagesInitialized(companiesPage.totalPages);
      });
    });
    this.companiesChangedSub = this.companiesService.companiesChanged.subscribe(() => {
      let params = this.activatedRoute.snapshot.queryParams;
      this.companiesService.searchNotEnabledCompaniesByName(
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
