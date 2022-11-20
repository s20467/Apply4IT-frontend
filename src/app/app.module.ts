import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { OffersComponent } from './offers/offers.component';
import { OffersListComponent } from './offers/offers-list/offers-list.component';
import { OffersListItemComponent } from './offers/offers-list/offers-list-item/offers-list-item.component';
import { OffersFiltersComponent } from './offers/offers-list/offers-filters/offers-filters.component';
import { AppRoutingModule } from "./app-routing.module";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { JwtInterceptor } from './shared/service/jwt-interceptor.service';
import { JwtRefreshInterceptor } from './shared/service/jwt-refresh-interceptor.service';
import { LoginComponent } from './login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import { OffersSearchBarComponent } from './offers/offers-list/offers-search-bar/offers-search-bar.component';
import { OffersPaginationComponent } from './offers/offers-list/offers-pagination/offers-pagination.component';
import { OfferDetailsComponent } from './offers/offer-details/offer-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainMenuComponent,
    OffersComponent,
    OffersListComponent,
    OffersListItemComponent,
    OffersFiltersComponent,
    LoginComponent,
    OffersSearchBarComponent,
    OffersPaginationComponent,
    OfferDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtRefreshInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule{}
