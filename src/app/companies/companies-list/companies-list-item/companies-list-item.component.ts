import {Component, Input, OnInit} from '@angular/core';
import {CompanyListItemDto} from "../../../shared/model/company-list-item-dto.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-companies-list-item',
  templateUrl: './companies-list-item.component.html',
  styleUrls: ['./companies-list-item.component.css']
})
export class CompaniesListItemComponent implements OnInit {

  @Input('company') company: CompanyListItemDto;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToCompanyDetails() {
    this.router.navigate(["/companies", this.company.id, "details"]);
  }
}
