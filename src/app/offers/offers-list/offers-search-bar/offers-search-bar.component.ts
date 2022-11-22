import {Component, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {OffersService} from "../../../shared/service/offers.service";

@Component({
  selector: 'app-offers-search-bar',
  templateUrl: './offers-search-bar.component.html',
  styleUrls: ['./offers-search-bar.component.css']
})
export class OffersSearchBarComponent implements OnInit {

  searchForm: FormGroup = new FormGroup({
    'searchString': new FormControl(null)
  });

  constructor(private offersService: OffersService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      let searchString = this.offersService.getSearchStringFromParams(params);
      this.searchForm.patchValue({ searchString: searchString })
    })
  }

  onSubmit() {
    let searchString = this.searchForm.value['searchString'];
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.offersService.paramsPlusSearchString(
        this.activatedRoute.snapshot.queryParams,
        searchString
      )
    });
  }

}
