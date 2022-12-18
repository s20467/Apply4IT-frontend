import { Component, Input, OnInit } from '@angular/core';
import { ExperienceFullDto } from "../../../shared/model/experience-full-dto.model";
import { UsersService } from "../../../shared/service/users.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-experiences-list-item',
  templateUrl: './user-experiences-list-item.component.html',
  styleUrls: ['./user-experiences-list-item.component.css']
})
export class UserExperiencesListItemComponent implements OnInit {

  @Input("userEmail") userEmail: string;
  @Input("experience") experience: ExperienceFullDto;

  constructor(public usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
  }

  goToEditExperience() {
    this.router.navigate(["/users", this.userEmail, "experience", this.experience.id, "edit"]);
  }

  deleteExperience() {
    if(confirm("Czy na pewno chcesz usunąć to doświadczenie: '" + this.experience.job + "'?")) {
      this.usersService.deleteUserExperience(this.userEmail, this.experience.id).subscribe(() => {
        this.usersService.emitUsersChanged()
      });
    }
  }
}
