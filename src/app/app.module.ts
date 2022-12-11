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
import { ReactiveFormsModule } from "@angular/forms";
import { OffersSearchBarComponent } from './offers/offers-list/offers-search-bar/offers-search-bar.component';
import { OffersPaginationComponent } from './offers/offers-list/offers-pagination/offers-pagination.component';
import { OfferDetailsComponent } from './offers/offer-details/offer-details.component';
import { OfferEditComponent } from './offers/offer-edit/offer-edit.component';
import { CompaniesComponent } from './companies/companies.component';
import { CompaniesListComponent } from './companies/companies-list/companies-list.component';
import { CompaniesListItemComponent } from './companies/companies-list/companies-list-item/companies-list-item.component';
import { CompaniesPaginationComponent } from './companies/companies-list/companies-pagination/companies-pagination.component';
import { CompaniesSearchBarComponent } from './companies/companies-list/companies-search-bar/companies-search-bar.component';
import { CompanyDetailsComponent } from './companies/company-details/company-details.component';
import { LatestOffersListItemComponent } from './companies/company-details/latest-offers-list-item/latest-offers-list-item.component';
import { RecruitersListItemComponent } from './companies/company-details/recruiters-list-item/recruiters-list-item.component';
import { CompanyRecruitersListComponent } from './companies/company-recruiters-list/company-recruiters-list.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoriesListItemComponent } from './categories-list/categories-list-item/categories-list-item.component';
import { LocalizationsListComponent } from './localizations-list/localizations-list.component';
import { LocalizationsListItemComponent } from './localizations-list/localizations-list-item/localizations-list-item.component';
import { AdminsListComponent } from './admins-list/admins-list.component';
import { AdminsListItemComponent } from './admins-list/admins-list-item/admins-list-item.component';
import { CompanyRegistrationComponent } from './companies/company-registration/company-registration.component';
import { CompanyRegistrationSuccessComponent } from './companies/company-registration/company-registration-success/company-registration-success.component';

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
    OfferDetailsComponent,
    OfferEditComponent,
    CompaniesComponent,
    CompaniesListComponent,
    CompaniesListItemComponent,
    CompaniesPaginationComponent,
    CompaniesSearchBarComponent,
    CompanyDetailsComponent,
    LatestOffersListItemComponent,
    RecruitersListItemComponent,
    CompanyRecruitersListComponent,
    CategoriesListComponent,
    CategoriesListItemComponent,
    LocalizationsListComponent,
    LocalizationsListItemComponent,
    AdminsListComponent,
    AdminsListItemComponent,
    CompanyRegistrationComponent,
    CompanyRegistrationSuccessComponent
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
