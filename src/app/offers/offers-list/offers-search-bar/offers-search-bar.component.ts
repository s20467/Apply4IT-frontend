import {Component, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import {Subject} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-offers-search-bar',
  templateUrl: './offers-search-bar.component.html',
  styleUrls: ['./offers-search-bar.component.css']
})
export class OffersSearchBarComponent implements OnInit {

  searchForm: FormGroup;
  @Output('searchStringChanged') searchStringChanged = new Subject<string>()

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      'searchString': new FormControl(null)
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      if(params["stringSearchSection"] != null) {
        this.searchForm.get("searchString")?.setValue(params["stringSearchSection"]);
      }
    })
  }

  onSubmit() {
    let searchString = this.searchForm.value['searchString'];
    this.searchStringChanged.next(searchString);
  }

}
