import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {OffersService} from "../../../shared/service/offers.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CompaniesService} from "../../../shared/service/companies.service";

@Component({
  selector: 'app-companies-search-bar',
  templateUrl: './companies-search-bar.component.html',
  styleUrls: ['./companies-search-bar.component.css']
})
export class CompaniesSearchBarComponent implements OnInit {

  searchForm: FormGroup = new FormGroup({
    'searchString': new FormControl(null)
  });

  constructor(private companiesService: CompaniesService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      let searchString = this.companiesService.getSearchStringFromParams(params);
      this.searchForm.patchValue({ searchString: searchString })
    })
  }

  onSubmit() {
    let searchString = this.searchForm.value['searchString'];
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.companiesService.paramsPlusSearchStringWithCurrentPageReset(
        this.activatedRoute.snapshot.queryParams,
        searchString
      )
    });
  }

}
