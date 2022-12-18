import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "../../shared/service/users.service";
import { OffersService } from "../../shared/service/offers.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { UserFullDto } from "../../shared/model/user-full-dto.model";
import { HttpErrorResponse } from "@angular/common/http";
import { UserPatchDto } from "../../shared/model/user-patch-dto.model";
import { Address } from "../../shared/model/address.model";
import {UserEducationEditComponent} from "./user-education-edit/user-education-edit.component";
import {UserExperienceEditComponent} from "./user-experience-edit/user-experience-edit.component";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: UserFullDto;
  currentUserMode: boolean = true;
  isUploadPhotoMode: boolean;
  photoFileToUpload: File | null = null;
  uploadPhotoForm: FormGroup;
  descriptionEditForm: FormGroup;
  addressEditForm: FormGroup;
  isDescriptionEditMode: boolean = false;
  isAddressEditMode: boolean = false;
  @ViewChild("descriptionInput") descriptionInputTextarea: ElementRef<HTMLTextAreaElement>;

  constructor(
    public usersService: UsersService,
    public offersService: OffersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    if(!this.usersService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.activatedRoute.url.subscribe((urlSegments) => {
      if(urlSegments[urlSegments.length-1].path == "my-profile") {
        this.currentUserMode = true;
        this.usersService.getCurrentUserDetails().subscribe((user) => {
          this.setUser(user);
        });
      }
      else {
        this.currentUserMode = false;
        let userEmail = this.activatedRoute.snapshot.params['userEmail'];
        this.usersService.getUserDetailsByEmail(userEmail).subscribe((user: UserFullDto) => {
          this.setUser(user);
        });
      }
    });
    this.usersService.usersChanged.subscribe(() => {
      if(this.currentUserMode) {
        this.usersService.getCurrentUserDetails().subscribe((user) => {
          this.setUser(user);
        });
      }
      else {
        let userEmail = this.activatedRoute.snapshot.params['userEmail'];
        this.usersService.getUserDetailsByEmail(userEmail).subscribe((user: UserFullDto) => {
          this.setUser(user);
        });
      }
    });
  }

  setUser(user: UserFullDto) {
    this.user = user;
    this.user.educations.sort((o1, o2) =>
      Date.parse(o1.startDate.toString()) - Date.parse(o2.startDate.toString())
    );
    this.user.experiences.sort((o1, o2) =>
      Date.parse(o1.startDate.toString()) - Date.parse(o2.startDate.toString())
    );
  }

  deleteUser() {
    if(confirm("Czy na pewno chcesz usunąć to konto?")) {
      this.usersService.deleteUser(this.user.email).subscribe(() => {
        if(this.currentUserMode) {
          this.usersService.logout();
        }
        this.usersService.emitUsersChanged();
        this.router.navigate(["/offers"]);
      });
    }
  }

  uploadPhoto() {
    if(this.uploadPhotoForm.valid && this.photoFileToUpload != null){
      this.usersService.uploadPhotoByEmail(this.user.email, this.photoFileToUpload).subscribe({
        next: () => {
          this.isUploadPhotoMode = false
          this.usersService.emitUsersChanged();
        },
        error: (error: HttpErrorResponse) => {
          this.uploadPhotoForm.setErrors({"UnknownServerError": true});
        }
      });
    }
  }

  handleFileInput(event: Event) {
    let file = (event.target as HTMLInputElement).files?.item(0);
    if(file !== undefined) {
      this.photoFileToUpload = file;
    }
  }

  toggleUploadPhotoMode() {
    if(this.isUploadPhotoMode) {
      this.isUploadPhotoMode = false;
    }
    else {
      this.uploadPhotoForm = new FormGroup({
        photo: new FormControl()
      })
      this.isUploadPhotoMode = true;
    }
  }

  toggleDescriptionEditMode() {
    if(this.isDescriptionEditMode) {
      this.isDescriptionEditMode = false;
    }
    else {
      this.descriptionEditForm = new FormGroup({
        description: new FormControl(this.user.description, [Validators.maxLength(2000)])
      });
      this.isDescriptionEditMode = true;
      new Promise(() => setTimeout(() => {
        this.descriptionInputTextarea.nativeElement.style.height = "0px";
        this.descriptionInputTextarea.nativeElement.style.height = (this.descriptionInputTextarea.nativeElement.scrollHeight)+"px";
      }, 1));
    }
  }

  toggleAddressEditMode() {
    if(this.isAddressEditMode) {
      this.isAddressEditMode = false;
    }
    else {
      this.addressEditForm = new FormGroup({
        country: new FormControl(this.user.address.country, [Validators.required, Validators.minLength(4), Validators.maxLength(70)]),
        city: new FormControl(this.user.address.city, [Validators.required, Validators.maxLength(200)]),
        zip: new FormControl(this.user.address.zip, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
        street: new FormControl(this.user.address.street, [Validators.required, Validators.maxLength(200)]),
      })
      this.isAddressEditMode = true;
    }
  }

  editDescription() {
    if(this.descriptionEditForm.valid) {
      let userPatchDto = new UserPatchDto();
      userPatchDto.description = <string>this.descriptionEditForm.value["description"];
      this.usersService.patchUser(this.user.email, userPatchDto).subscribe({
        next: () => {
          this.isDescriptionEditMode = false;
          this.usersService.emitUsersChanged();
        },
        error: (error: HttpErrorResponse) => {
          this.descriptionEditForm.setErrors({"UnknownServerError": true});
        }
      });
    }
  }

  editAddress() {
    if(this.addressEditForm.valid) {
      let userPatchDto = new UserPatchDto();
      userPatchDto.address = <Address>{
        country: this.addressEditForm.value["country"],
        city: this.addressEditForm.value["city"],
        zip: this.addressEditForm.value["zip"],
        street: this.addressEditForm.value["street"],
      };
      this.usersService.patchUser(this.user.email, userPatchDto).subscribe({
        next: () => {
          this.isAddressEditMode = false;
          this.usersService.emitUsersChanged();
        },
        error: (error: HttpErrorResponse) => {
          this.descriptionEditForm.setErrors({"UnknownServerError": true});
        }
      });
    }
  }

  autoGrowTextarea(e: any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight)+"px";
  }

  goToExperienceCreate() {
    this.router.navigate(["/users", this.user.email, "experience", "create"]);
  }

  goToEducationCreate() {
    this.router.navigate(["/users", this.user.email, "education", "create"]);
  }
}
