import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "../shared/service/users.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { LocalizationsService } from "../shared/service/localizations.service";
import { LocalizationFullDto } from "../shared/model/localization-full-dto.model";

@Component({
  selector: 'app-localizations-list',
  templateUrl: './localizations-list.component.html',
  styleUrls: ['./localizations-list.component.css']
})
export class LocalizationsListComponent implements OnInit {

  localizations: LocalizationFullDto[] = [];
  localizationsChangedSub: Subscription;
  isLocalizationCreateMode: boolean;
  localizationCreateForm: FormGroup;

  constructor(
    private usersService: UsersService,
    private location: Location,
    private router: Router,
    private localizationsService: LocalizationsService) { }

  ngOnInit(): void {
    if(!this.usersService.isLoggedIn()) {
      this.router.navigate(["/login"]);
    }
    else if(!this.usersService.isAdmin()) {
      this.location.back();
    }

    this.localizationsService.getLocalizations().subscribe((localizations) => {
      this.localizations = localizations;
    });
    this.localizationsChangedSub = this.localizationsService.localizationsChanged.subscribe(() => {
      this.localizationsService.getLocalizations().subscribe((localizations) => {
        this.localizations = localizations;
      });
    });
  }

  ngOnDestroy() {
    this.localizationsChangedSub.unsubscribe();
  }

  toggleLocalizationCreateMode() {
    if(this.isLocalizationCreateMode) {
      this.isLocalizationCreateMode = false;
    }
    else {
      this.localizationCreateForm = new FormGroup({
        localization: new FormControl(null, [Validators.required, Validators.maxLength(200)])
      });
      this.isLocalizationCreateMode = true;
    }
  }

  createLocalization() {
    if(this.localizationCreateForm.valid) {
      this.localizationsService.createLocalization(this.localizationCreateForm.value["localization"]).subscribe(() => {
        this.localizationsService.emitLocalizationsChanged();
        this.isLocalizationCreateMode = false;
      })
    }
  }

}
