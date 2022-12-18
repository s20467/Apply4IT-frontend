import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { UsersService } from "../../../shared/service/users.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { dateAfterTodayValidator } from "../../../shared/validators/date-after-today.directive";
import { startDateAfterEndDateValidator } from "../../../shared/validators/start-date-after-end-date.directive";
import { HttpErrorResponse } from "@angular/common/http";
import {ExperienceFullDto} from "../../../shared/model/experience-full-dto.model";

@Component({
  selector: 'app-user-experience-edit',
  templateUrl: './user-experience-edit.component.html',
  styleUrls: ['./user-experience-edit.component.css']
})
export class UserExperienceEditComponent implements OnInit {

  experienceEditForm: FormGroup;
  isEditMode: boolean = false;
  endDateDisabled = false;
  @ViewChild("descriptionInput") descriptionInputTextarea: ElementRef<HTMLTextAreaElement>;

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
        this.experienceEditForm = new FormGroup({
          job: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
          companyName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
          description: new FormControl(null, [Validators.maxLength(2000)]),
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
        let experienceId = +this.activatedRoute.snapshot.params['experienceId'];
        this.usersService.getUserExperience(userEmail, experienceId).subscribe((experience) => {
          this.endDateDisabled = experience.stillWorking;
          this.experienceEditForm = new FormGroup({
            job: new FormControl(experience.job, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
            companyName: new FormControl(experience.companyName, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
            description: new FormControl(experience.description, [Validators.maxLength(2000)]),
            period: new FormGroup({
              startDate: new FormControl(experience.startDate, [Validators.required, dateAfterTodayValidator]),
              endDateGroup: new FormGroup({
                endDate: new FormControl(experience.endDate, [dateAfterTodayValidator]),
                notFinishedYet: new FormControl(experience.endDate == null)
              }, [this.conditionalEndDateRequiredValidator])
            }, [startDateAfterEndDateValidator]),
          });
          new Promise(() => setTimeout(() => {
            this.descriptionInputTextarea.nativeElement.style.height = "0px";
            this.descriptionInputTextarea.nativeElement.style.height = (this.descriptionInputTextarea.nativeElement.scrollHeight)+"px";
          }, 1));
        })
      }
    });
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
    if(this.experienceEditForm.valid) {
      let formValue = this.experienceEditForm.value;
      let userEmail = this.activatedRoute.snapshot.params['userEmail'];
      let experienceFullDto = <ExperienceFullDto>{
        job: formValue["job"],
        companyName: formValue["companyName"],
        description: formValue["description"],
        startDate: formValue["period"]["startDate"],
        endDate: formValue["period"]["endDateGroup"]["notFinishedYet"] == true ? null : formValue["period"]["endDateGroup"]["endDate"],
        stillWorking: formValue["period"]["endDateGroup"]["notFinishedYet"]
      }
      if(this.isEditMode) {
        let experienceId = +this.activatedRoute.snapshot.params['experienceId'];
        this.usersService.editUserExperience(userEmail, experienceId, experienceFullDto).subscribe({
          next: () => {
            this.usersService.emitUsersChanged();
            this.location.back();
          },
          error: (error: HttpErrorResponse) => {
            this.experienceEditForm.setErrors({"UnknownServerError": true});
          }
        });
      }
      else {
        this.usersService.createUserExperience(userEmail, experienceFullDto).subscribe({
          next: () => {
            this.usersService.emitUsersChanged();
            this.location.back();
          },
          error: (error: HttpErrorResponse) => {
            this.experienceEditForm.setErrors({"UnknownServerError": true});
          }
        });
      }
    }
  }

  toggleNoEndDate() {
    this.experienceEditForm.patchValue({
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
