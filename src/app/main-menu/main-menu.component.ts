import { Component, OnInit } from '@angular/core';
import { MainMenuToggleService } from "../shared/service/main-menu-toggle.service";
import { UsersService } from "../shared/service/users.service";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(public mainMenuToggleService: MainMenuToggleService, public usersService: UsersService) { }

  ngOnInit(): void {
  }

  public toggleMainMenuOpen() {
    this.mainMenuToggleService.emitMainMenuToggleChanged();
  }

  public logout() {
    console.log('logout')
    this.usersService.logout();
    this.toggleMainMenuOpen();
  }

}
