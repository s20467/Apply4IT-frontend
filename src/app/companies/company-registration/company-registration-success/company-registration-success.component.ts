import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-company-registration-success',
  templateUrl: './company-registration-success.component.html',
  styleUrls: ['./company-registration-success.component.css']
})
export class CompanyRegistrationSuccessComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToHomePage() {
    this.router.navigate(["/offers"]);
  }

}
