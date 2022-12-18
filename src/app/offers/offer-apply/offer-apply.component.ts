import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Params } from "@angular/router";
import { OffersService } from "../../shared/service/offers.service";
import { Location } from "@angular/common";
import { OfferFullDto } from "../../shared/model/offer-full-dto.model";

@Component({
  selector: 'app-offer-apply',
  templateUrl: './offer-apply.component.html',
  styleUrls: ['./offer-apply.component.css']
})
export class OfferApplyComponent implements OnInit {

  offer: OfferFullDto
  cvFileToUpload: File | null = null;
  applicationForm: FormGroup = new FormGroup({
    cv: new FormControl()
  });
  isApplySuccessful: boolean = false;

  constructor(
    private offersService: OffersService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.offersService.getOfferById(+params['offerId']).subscribe((offer) => {
        this.offer = offer;
      })
    });
  }

  handleFileInput(event: Event) {
    let file = (event.target as HTMLInputElement).files?.item(0);
    if(file !== undefined) {
      this.cvFileToUpload = file;
    }
  }

  onSubmit() {
    if(this.applicationForm.valid){
      this.offersService.applyForOffer(this.offer.id, this.cvFileToUpload).subscribe({
        next: () => {
          this.offersService.emitOffersChanged();
          this.isApplySuccessful = true
          new Promise(() => setTimeout(() => {this.location.back()}, 3000));
        },
        error: (error: HttpErrorResponse) => {
          this.applicationForm.setErrors({"UnknownServerError": true});
        }
      });
    }
  }

  // offerFullDtoToOfferMinimalDto(offerFullDto: OfferFullDto): OfferMinimalDto {
  //   return <OfferMinimalDto>{
  //     id: offerFullDto.id,
  //     title: offerFullDto.title,
  //     description: offerFullDto.description,
  //     address: offerFullDto.address,
  //     localization: offerFullDto.localization.name,
  //     company: offerFullDto.company,
  //     creationDate: offerFullDto.creationDate,
  //     closingDate: offerFullDto.closingDate,
  //     minSalaryPln: offerFullDto.minSalaryPln,
  //     maxSalaryPln: offerFullDto.maxSalaryPln,
  //     firstJobPossibility: offerFullDto.firstJobPossibility,
  //     categories: offerFullDto.categories.map(c => c.title),
  //     remotePossibility: offerFullDto.remotePossibility,
  //     isSavedByCurrentUser: offerFullDto.isSavedByCurrentUser
  //   }
  // }

}
