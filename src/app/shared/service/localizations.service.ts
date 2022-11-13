import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { LocalizationFullDto } from "../model/localization-full-dto.model";

@Injectable({
  providedIn: 'root'
})
export class LocalizationsService {

  private urlBase: string = environment.apiUrlBase + "api/v1/";

  constructor(private http: HttpClient) { }

  getLocalizations() {
    return this.http.get<LocalizationFullDto[]>(this.urlBase + "localizations");
  }

}
