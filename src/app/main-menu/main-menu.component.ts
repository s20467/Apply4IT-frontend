import { Component, OnInit } from '@angular/core';
import {MainMenuToggleService} from "../shared/main-menu-toggle.service";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(public mainMenuToggleService: MainMenuToggleService) { }

  ngOnInit(): void {
  }

  public toggleMainMenuOpen() {
    this.mainMenuToggleService.emitMainMenuToggleChanged()
  }
}
