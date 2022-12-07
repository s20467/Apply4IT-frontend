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

const routes: Routes = [
  {path: '', redirectTo: 'offers/list', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
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
      {path: ':companyId/details', component: CompanyDetailsComponent},
      {path: ':companyId/recruiters', component: CompanyRecruitersListComponent}
    ]},
  {path: 'categories', component: CategoriesListComponent},
  {path: 'categories/list', component: CategoriesListComponent},
  {path: 'localizations', component: LocalizationsListComponent},
  {path: 'localizations/list', component: LocalizationsListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
