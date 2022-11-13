import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "../shared/service/users.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private usersService: UsersService, private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(30), Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(30)])
    });
  }

  onSubmit() {
    console.log(this.loginForm)
    console.log(this.loginForm.valid)
    if(this.loginForm.valid) {
      this.usersService.login(this.loginForm.value['email'], this.loginForm.value['password']).subscribe({
      next: () => {
        this.usersService.emitAuthenticationStatusChanged();
        this.location.back();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }})
    }
  }

}