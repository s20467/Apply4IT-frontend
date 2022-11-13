import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MainMenuToggleService {

  mainMenuToggleChanged = new Subject<any>()

  constructor() { }

  emitMainMenuToggleChanged(){
    this.mainMenuToggleChanged.next(null);
  }
}
