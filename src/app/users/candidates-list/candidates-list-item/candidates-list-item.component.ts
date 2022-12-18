import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserCandidateDto } from "../../../shared/model/user-candidate-dto.model";
import {OffersService} from "../../../shared/service/offers.service";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-candidates-list-item',
  templateUrl: './candidates-list-item.component.html',
  styleUrls: ['./candidates-list-item.component.css']
})
export class CandidatesListItemComponent implements OnInit {

  @Input("candidate") candidate: UserCandidateDto;

  constructor(private router: Router, private offersService: OffersService) { }

  ngOnInit(): void {
  }

  downloadCv(event: Event) {
    event.stopPropagation()
    this.offersService.downloadApplicationCv(this.candidate.applicationId).subscribe((data) =>
      saveAs(data, "CV-" + this.candidate.firstName + "-" + this.candidate.lastName + ".pdf")
    );
  }

  goToCandidateProfile() {
    this.router.navigate(["/users", this.candidate.email, "profile"]);
  }
}
