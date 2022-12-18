import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { OffersService } from "../../shared/service/offers.service";
import { UserCandidateDto } from "../../shared/model/user-candidate-dto.model";

@Component({
  selector: 'app-candidates-list',
  templateUrl: './candidates-list.component.html',
  styleUrls: ['./candidates-list.component.css']
})
export class CandidatesListComponent implements OnInit {

  candidates: UserCandidateDto[];

  constructor(private activatedRoute: ActivatedRoute, private offersService: OffersService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let offerId: number = +this.activatedRoute.snapshot.params['offerId'];
      this.offersService.getOfferCandidates(offerId).subscribe(candidates => {
        this.candidates = candidates;
      })
    });
  }

}
