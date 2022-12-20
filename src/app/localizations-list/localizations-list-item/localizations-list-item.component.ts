import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { LocalizationFullDto } from "../../shared/model/localization-full-dto.model";
import { LocalizationsService } from "../../shared/service/localizations.service";

@Component({
  selector: 'app-localizations-list-item',
  templateUrl: './localizations-list-item.component.html',
  styleUrls: ['./localizations-list-item.component.css']
})
export class LocalizationsListItemComponent implements OnInit {

  @Input("localization") localization: LocalizationFullDto;

  isLocalizationEditMode: boolean = false;
  localizationEditForm: FormGroup;

  constructor(private localizationsService: LocalizationsService) { }

  ngOnInit(): void {
  }

  toggleLocalizationEditMode() {
    if(this.isLocalizationEditMode) {
      this.isLocalizationEditMode = false
    }
    else {
      this.localizationEditForm = new FormGroup({
        localization: new FormControl(this.localization.name, [Validators.required, Validators.maxLength(200)])
      })
      this.isLocalizationEditMode = true;
    }
  }

  editLocalization() {
    if(this.localizationEditForm.valid) {
      let editedLocalization: LocalizationFullDto = {
        id: this.localization.id,
        name: this.localizationEditForm.value["localization"]
      }
      this.localizationsService.editLocalization(editedLocalization).subscribe({
        next: () => {
          this.localizationsService.emitLocalizationsChanged();
          this.isLocalizationEditMode = false
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.localizationEditForm.setErrors({"UnknownServerError": true});
        }
      })
    }
  }

  deleteLocalization() {
    if(confirm("Czy na pewno chcesz usunąć lokalizację '" + this.localization.name + "'?")) {
      this.localizationsService.deleteLocalization(this.localization.id).subscribe(() => {
        this.localizationsService.emitLocalizationsChanged();
      });
    }
  }

}
