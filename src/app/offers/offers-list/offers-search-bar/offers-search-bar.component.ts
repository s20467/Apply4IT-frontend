import {Component, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import {Subject} from "rxjs";

@Component({
  selector: 'app-offers-search-bar',
  templateUrl: './offers-search-bar.component.html',
  styleUrls: ['./offers-search-bar.component.css']
})
export class OffersSearchBarComponent implements OnInit {

  searchForm: FormGroup;
  @Output('searchStringChanged') searchStringChanged = new Subject<string>()

  constructor() { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      'searchString': new FormControl(null)
    });
  }

  onSubmit() {
    let searchString = this.searchForm.value['searchString'];
    this.searchStringChanged.next(searchString);
  }

}
