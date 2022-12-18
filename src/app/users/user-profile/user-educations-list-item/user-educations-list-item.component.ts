import { Component, Input, OnInit } from '@angular/core';
import { EducationFullDto } from "../../../shared/model/education-full-dto.model";
import {UsersService} from "../../../shared/service/users.service";
import {UserEducationEditComponent} from "../user-education-edit/user-education-edit.component";
import {UserExperienceEditComponent} from "../user-experience-edit/user-experience-edit.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-educations-list-item',
  templateUrl: './user-educations-list-item.component.html',
  styleUrls: ['./user-educations-list-item.component.css']
})
export class UserEducationsListItemComponent implements OnInit {

  @Input("userEmail") userEmail: string;
  @Input("education") education: EducationFullDto;

  constructor(public usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
  }

  goToEditEducation() {
    this.router.navigate(["/users", this.userEmail, "education", this.education.id, "edit"]);
  }

  deleteEducation() {
    if(confirm("Czy na pewno chcesz usunąć to wykształcenie: '" + this.education.major + ", " + this.education.universityName + "'?")) {
      this.usersService.deleteUserEducation(this.userEmail, this.education.id).subscribe(() => {
        this.usersService.emitUsersChanged()
      });
    }
  }

}
