import { Component, OnInit } from '@angular/core';
import { MainMenuToggleService } from "../shared/service/main-menu-toggle.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  constructor(public mainMenuToggleService: MainMenuToggleService) { }

  ngOnInit(): void {
  }

  toggleMainMenuOpen(){
    this.mainMenuToggleService.emitMainMenuToggleChanged()
  }
}
