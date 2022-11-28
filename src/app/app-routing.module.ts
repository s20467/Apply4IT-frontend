import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffersComponent } from "./offers/offers.component";
import { OffersListComponent } from "./offers/offers-list/offers-list.component";
import { LoginComponent } from './login/login.component';
import {OfferDetailsComponent} from "./offers/offer-details/offer-details.component";
import {OfferEditComponent} from "./offers/offer-edit/offer-edit.component";
import {CompaniesComponent} from "./companies/companies.component";
import {CompaniesListComponent} from "./companies/companies-list/companies-list.component";

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
      {path: 'list', component: CompaniesListComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
