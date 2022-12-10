import { Component, Input, OnInit } from '@angular/core';
import { UserMinimalDto } from "../../shared/model/user-minimal-dto.model";
import { Router } from "@angular/router";
import { UsersService } from "../../shared/service/users.service";

@Component({
  selector: 'app-admins-list-item',
  templateUrl: './admins-list-item.component.html',
  styleUrls: ['./admins-list-item.component.css']
})
export class AdminsListItemComponent implements OnInit {

  @Input("admin") admin: UserMinimalDto;

  constructor(private router: Router, private usersService: UsersService) { }

  ngOnInit(): void {
  }

  removeAdmin() {
    this.usersService.removeAdmin(this.admin.email).subscribe(() => {
      this.usersService.emitAdminsChanged();
    })
  }
}
