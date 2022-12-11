import { Component, OnInit } from '@angular/core';
import { UserMinimalDto } from "../shared/model/user-minimal-dto.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { UsersService } from "../shared/service/users.service";

@Component({
  selector: 'app-admins-list',
  templateUrl: './admins-list.component.html',
  styleUrls: ['./admins-list.component.css']
})
export class AdminsListComponent implements OnInit {

  admins: UserMinimalDto[];
  isAdminAddMode: boolean;
  adminAddForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.getAdmins().subscribe(admins => {
      this.admins = admins;
    })
    this.usersService.adminsChanged.subscribe(() => {
      this.usersService.getAdmins().subscribe((admins) => {
        this.admins = admins;
      });
    });
  }

  toggleAdminAddMode() {
    if(this.isAdminAddMode) {
      this.isAdminAddMode = false;
    }
    else {
      this.adminAddForm = new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.email]),
      });
      this.isAdminAddMode = true;
    }
  }

  addAdmin() {
    let userEmail = this.adminAddForm.value["email"];
    if(this.adminAddForm.valid) {
      this.usersService.addAdmin(userEmail).subscribe({
        next: () => {
          this.usersService.emitAdminsChanged();
          this.isAdminAddMode = false;
        },
        error: (error: HttpErrorResponse) => {
          if(error.status == 404) {
            this.adminAddForm.setErrors({"UserNotFound": true});
          }
          else if(error.status == 409) {
            this.adminAddForm.setErrors({"AlreadyAdmin": true});
          }
          else{
            this.adminAddForm.setErrors({"UnknownServerError": true});
            console.log(error)
          }
        }})
    }
  }

}
