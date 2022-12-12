import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffersComponent } from "./offers/offers.component";
import { OffersListComponent } from "./offers/offers-list/offers-list.component";
import { LoginComponent } from './login/login.component';
import { OfferDetailsComponent } from "./offers/offer-details/offer-details.component";
import { OfferEditComponent } from "./offers/offer-edit/offer-edit.component";
import { CompaniesComponent } from "./companies/companies.component";
import { CompaniesListComponent } from "./companies/companies-list/companies-list.component";
import { CompanyDetailsComponent } from "./companies/company-details/company-details.component";
import { CompanyRecruitersListComponent } from "./companies/company-recruiters-list/company-recruiters-list.component";
import { CategoriesListComponent } from "./categories-list/categories-list.component";
import { LocalizationsListComponent } from "./localizations-list/localizations-list.component";
import { AdminsListComponent } from "./admins-list/admins-list.component";
import { CompanyRegistrationComponent } from "./companies/company-registration/company-registration.component";
import {
  CompanyRegistrationSuccessComponent
} from "./companies/company-registration/company-registration-success/company-registration-success.component";
import {
  CompaniesToRegisterListComponent
} from "./companies/companies-to-register-list/companies-to-register-list.component";
import {RegistrationComponent} from "./registration/registration.component";
import {RegistrationSuccessComponent} from "./registration/registration-success/registration-success.component";

const routes: Routes = [
  {path: '', redirectTo: 'offers/list', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'registration-success', component: RegistrationSuccessComponent},
  {path: 'offers', component: OffersComponent, children:[
      {path: '', component: OffersListComponent},
      {path: 'list', component: OffersListComponent},
      {path: 'create', component: OfferEditComponent},
      {path: ':offerId/details', component: OfferDetailsComponent},
      {path: ':offerId/edit', component: OfferEditComponent}
    ]},
  {path: 'companies', component: CompaniesComponent, children:[
      {path: '', component: CompaniesListComponent},
      {path: 'list', component: CompaniesListComponent},
      {path: 'register', component: CompanyRegistrationComponent},
      {path: 'registration-success', component: CompanyRegistrationSuccessComponent},
      {path: 'registered', component: CompaniesToRegisterListComponent},
      {path: ':companyId/details', component: CompanyDetailsComponent},
      {path: ':companyId/recruiters', component: CompanyRecruitersListComponent}
    ]},
  {path: 'categories', component: CategoriesListComponent},
  {path: 'categories/list', component: CategoriesListComponent},
  {path: 'localizations', component: LocalizationsListComponent},
  {path: 'localizations/list', component: LocalizationsListComponent},
  {path: 'admins', component: AdminsListComponent},
  {path: 'admins/list', component: AdminsListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
