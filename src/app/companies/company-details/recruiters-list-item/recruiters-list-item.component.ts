import {Component, Input, OnInit} from '@angular/core';
import {UserMinimalDto} from "../../../shared/model/user-minimal-dto.model";
import {Router} from "@angular/router";
import {CompaniesService} from "../../../shared/service/companies.service";

@Component({
  selector: 'app-recruiters-list-item',
  templateUrl: './recruiters-list-item.component.html',
  styleUrls: ['./recruiters-list-item.component.css']
})
export class RecruitersListItemComponent implements OnInit {

  @Input("recruiter") recruiter: UserMinimalDto;
  @Input("companyId") companyId: number;

  constructor(private router: Router, private companiesService: CompaniesService) { }

  ngOnInit(): void {
  }

  removeRecruiter() {
     this.companiesService.removeRecruiter(this.companyId, this.recruiter.email).subscribe(() => {
       this.companiesService.emitCompaniesChanged();
     })
  }

}
