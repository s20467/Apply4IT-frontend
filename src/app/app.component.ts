import {Component, OnInit} from '@angular/core';
import {MainMenuToggleService} from "./shared/main-menu-toggle.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Apply4IT-front';

  isMainMenuOpen = true;

  constructor(public mainMenuToggleService: MainMenuToggleService) {
  }

  ngOnInit(): void {
    this.mainMenuToggleService.mainMenuToggleChanged.subscribe(() => {
      this.isMainMenuOpen = !this.isMainMenuOpen;
    })
  }
}
