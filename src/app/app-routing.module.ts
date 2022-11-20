import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffersComponent } from "./offers/offers.component";
import { OffersListComponent } from "./offers/offers-list/offers-list.component";
import { LoginComponent } from './login/login.component';
import {OfferDetailsComponent} from "./offers/offer-details/offer-details.component";

const routes: Routes = [
  {path: '', redirectTo: 'offers/list', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'offers', component: OffersComponent, children:[
      {path: 'list', component: OffersListComponent},
      {path: ':offerId/details', component: OfferDetailsComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
