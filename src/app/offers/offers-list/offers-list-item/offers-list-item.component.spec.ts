import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersListItemComponent } from './offers-list-item.component';

describe('OffersListItemComponent', () => {
  let component: OffersListItemComponent;
  let fixture: ComponentFixture<OffersListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffersListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
