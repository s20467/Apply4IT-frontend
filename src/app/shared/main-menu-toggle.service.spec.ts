import { TestBed } from '@angular/core/testing';

import { MainMenuToggleService } from './main-menu-toggle.service';

describe('MainMenuToggleService', () => {
  let service: MainMenuToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainMenuToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
