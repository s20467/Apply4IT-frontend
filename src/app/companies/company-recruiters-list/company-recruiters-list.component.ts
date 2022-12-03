import { Component, OnInit } from '@angular/core';
import { UserMinimalDto } from "../../shared/model/user-minimal-dto.model";
import { ActivatedRoute, Params } from "@angular/router";
import { CompaniesService } from "../../shared/service/companies.service";

@Component({
  selector: 'app-company-recruiters-list',
  templateUrl: './company-recruiters-list.component.html',
  styleUrls: ['./company-recruiters-list.component.css']
})
export class CompanyRecruitersListComponent implements OnInit {

  recruiters: UserMinimalDto[];
  companyId: number;

  constructor(private activatedRoute: ActivatedRoute, private companiesService: CompaniesService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.companyId = +params['companyId'];
      this.companiesService.getRecruiters(this.companyId).subscribe((recruiters) => {
        this.recruiters = recruiters;
      });
    });
    this.companiesService.companiesChanged.subscribe(() => {
      this.companyId = +this.activatedRoute.snapshot.params['companyId'];
      this.companiesService.getRecruiters(this.companyId).subscribe((recruiters) => {
        this.recruiters = recruiters;
      });
    });
  }
}
