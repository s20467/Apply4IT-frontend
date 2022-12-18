import { Component, OnInit } from '@angular/core';
import { UsersService } from "../../shared/service/users.service";
import { Router } from "@angular/router";
import { CompaniesService } from "../../shared/service/companies.service";
import { CompanyListItemDto } from "../../shared/model/company-list-item-dto.model";
import {CompanyMinimalDto} from "../../shared/model/company-minimal-dto.model";

@Component({
  selector: 'app-my-companies',
  templateUrl: './my-companies.component.html',
  styleUrls: ['./my-companies.component.css']
})
export class MyCompaniesComponent implements OnInit {

  companies: CompanyListItemDto[];

  constructor(
    private usersService: UsersService,
    private companiesService: CompaniesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(!this.usersService.isLoggedIn()) {
      this.router.navigate(["/login"]);
    }
    else {
      this.companiesService.getMyCompanies().subscribe(companies => {
        this.companies = companies;
      })
    }
  }

}
