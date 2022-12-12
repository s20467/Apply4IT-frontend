import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration-success',
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.css']
})
export class RegistrationSuccessComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    new Promise(() => setTimeout(() => {this.router.navigate(["/offers"])}, 15000));
  }

  goToLoginPage() { //todo change to go to myProfile i wtedy automatyczne przekierowanie na login w ngoninit
    this.router.navigate(["/login"]);
  }

  goToHomePage() {
    this.router.navigate(["/offers"]);
  }

}
