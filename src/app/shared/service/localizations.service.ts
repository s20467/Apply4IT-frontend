import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { LocalizationFullDto } from "../model/localization-full-dto.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocalizationsService {

  private urlBase: string = environment.apiUrlBase + "api/v1/";

  localizationsChanged = new Subject();

  constructor(private http: HttpClient) { }

  getLocalizations() {
    return this.http.get<LocalizationFullDto[]>(this.urlBase + "localizations");
  }

  editLocalization(editedLocalization: LocalizationFullDto) {
    return this.http.put(this.urlBase + "localizations", editedLocalization);
  }

  createLocalization(localizationName: string) {
    let newLocalization = {id: null, name: localizationName}
    return this.http.post(this.urlBase + "localizations", newLocalization);
  }

  deleteLocalization(localizationId: number) {
    return this.http.delete(this.urlBase + "localizations/" + localizationId);
  }


  emitLocalizationsChanged() {
    this.localizationsChanged.next(null);
  }
}
