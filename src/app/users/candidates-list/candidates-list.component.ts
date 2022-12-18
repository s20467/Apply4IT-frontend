import { Component, OnInit } from '@angular/core';
import { UserMinimalDto } from "../../shared/model/user-minimal-dto.model";
import { FormGroup } from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {UsersService} from "../../shared/service/users.service";

@Component({
  selector: 'app-candidates-list',
  templateUrl: './candidates-list.component.html',
  styleUrls: ['./candidates-list.component.css']
})
export class CandidatesListComponent implements OnInit {

  candidates: [];

  constructor(private activatedRoute: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
  }

}
