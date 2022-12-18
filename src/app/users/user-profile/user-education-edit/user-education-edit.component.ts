import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { UsersService } from "../../../shared/service/users.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { EducationFullDto } from "../../../shared/model/education-full-dto.model";
import { Location } from "@angular/common";
import { dateAfterTodayValidator } from "../../../shared/validators/date-after-today.directive";
import { startDateAfterEndDateValidator } from "../../../shared/validators/start-date-after-end-date.directive";

@Component({
  selector: 'app-user-education-edit',
  templateUrl: './user-education-edit.component.html',
  styleUrls: ['./user-education-edit.component.css']
})
export class UserEducationEditComponent implements OnInit {

  educationEditForm: FormGroup;
  isEditMode: boolean = false;
  specializationDisabled = false;
  endDateDisabled = false;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    if (!this.usersService.isLoggedIn()) {
      this.router.navigate(["/login"]);
    }

    this.activatedRoute.url.subscribe((urlSegments) => {
      if (urlSegments[urlSegments.length - 1].path == "create") {
        this.isEditMode = false;
        this.educationEditForm = new FormGroup({
          major: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
          specializationGroup: new FormGroup({
            specialization: new FormControl(null, [Validators.minLength(2), Validators.maxLength(50)]),
            noSpecialization: new FormControl(false),
          }, [this.conditionalSpecializationRequiredValidator]),
          universityName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
          period: new FormGroup({
            startDate: new FormControl(null, [Validators.required, dateAfterTodayValidator]),
            endDateGroup: new FormGroup({
              endDate: new FormControl(null, [dateAfterTodayValidator]),
              notFinishedYet: new FormControl(false)
            }, [this.conditionalEndDateRequiredValidator])
          }, [startDateAfterEndDateValidator]),
        });
      }
      else {
        this.isEditMode = true;
        let userEmail = this.activatedRoute.snapshot.params['userEmail'];
        let educationId = +this.activatedRoute.snapshot.params['educationId'];
        this.usersService.getUserEducation(userEmail, educationId).subscribe((education) => {
          this.endDateDisabled = education.stillStudying;
          this.specializationDisabled = education.specialization == null;
          this.educationEditForm = new FormGroup({
            major: new FormControl(education.major, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
            specializationGroup: new FormGroup({
              specialization: new FormControl(education.specialization, [Validators.minLength(2), Validators.maxLength(50)]),
              noSpecialization: new FormControl(education.specialization == null)
            }, [this.conditionalSpecializationRequiredValidator]),
            universityName: new FormControl(education.universityName, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
            period: new FormGroup({
              startDate: new FormControl(education.startDate, [Validators.required, dateAfterTodayValidator]),
              endDateGroup: new FormGroup({
                endDate: new FormControl(education.endDate, [dateAfterTodayValidator]),
                notFinishedYet: new FormControl(education.endDate == null)
              }, [this.conditionalEndDateRequiredValidator])
            }, [startDateAfterEndDateValidator]),
          });
        })
      }
    });
  }

  conditionalSpecializationRequiredValidator: ValidatorFn =
    (control: AbstractControl): ValidationErrors | null => {
      let endDateGroupValue = (control as FormGroup).value;
      let specialization = endDateGroupValue["specialization"];
      let noSpecialization = endDateGroupValue["noSpecialization"];
      if(!noSpecialization && (specialization == null || specialization == "")) {
        return { conditionalSpecializationRequired: true };
      }
      return null;
    }

  conditionalEndDateRequiredValidator: ValidatorFn =
    (control: AbstractControl): ValidationErrors | null => {
      let endDateGroupValue = (control as FormGroup).value;
      let endDate = endDateGroupValue["endDate"];
      let notFinishedYet = endDateGroupValue["notFinishedYet"];
      if(!notFinishedYet && endDate == null) {
        return { conditionalEndDateRequired: true };
      }
      return null;
    }

  onSubmit() {
    if(this.educationEditForm.valid) {
      let formValue = this.educationEditForm.value;
      let userEmail = this.activatedRoute.snapshot.params['userEmail'];
      let educationFullDto = <EducationFullDto>{
        major: formValue["major"],
        specialization: formValue["specializationGroup"]["noSpecialization"] == true ? null : formValue["specializationGroup"]["specialization"],
        universityName: formValue["universityName"],
        startDate: formValue["period"]["startDate"],
        endDate: formValue["period"]["endDateGroup"]["notFinishedYet"] == true ? null : formValue["period"]["endDateGroup"]["endDate"],
        stillStudying: formValue["period"]["endDateGroup"]["notFinishedYet"]
      }
      if(this.isEditMode) {
        let educationId = +this.activatedRoute.snapshot.params['educationId'];
        this.usersService.editUserEducation(userEmail, educationId, educationFullDto).subscribe({
          next: () => {
            this.usersService.emitUsersChanged();
            this.location.back();
          },
          error: (error: HttpErrorResponse) => {
            this.educationEditForm.setErrors({"UnknownServerError": true});
          }
        });
      }
      else {
        this.usersService.createUserEducation(userEmail, educationFullDto).subscribe({
          next: () => {
            this.usersService.emitUsersChanged();
            this.location.back();
          },
          error: (error: HttpErrorResponse) => {
            this.educationEditForm.setErrors({"UnknownServerError": true});
          }
        });
      }
    }
  }

  toggleNoSpecialization() {
    this.educationEditForm.patchValue({
      specializationGroup: {
        specialization: null
      }
    });
    this.specializationDisabled = !this.specializationDisabled;
  }

  toggleNoEndDate() {
    this.educationEditForm.patchValue({
      period: {
        endDateGroup: {
          endDate: null
        }
      }
    });
    this.endDateDisabled = !this.endDateDisabled;
  }

  autoGrowTextarea(e: any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight)+"px";
  }

}
