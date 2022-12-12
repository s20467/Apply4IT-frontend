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
      'email': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(30)])
    });
  }

  onSubmit() {
    if(this.loginForm.valid) {
      this.usersService.login(this.loginForm.value['email'], this.loginForm.value['password']).subscribe({
      next: () => {
        this.usersService.emitAuthenticationStatusChanged();
        this.location.back();
      },
      error: (error: HttpErrorResponse) => {
        if(error.status >= 400 && error.status < 500) {
          this.loginForm.setErrors({"InvalidFormContent": true});
        }
        else if(error.status >= 500 && error.status < 600){
          this.loginForm.setErrors({"UnknownServerError": true});
        }
        else {
          console.log(error)
        }
      }})
    }
  }

}
