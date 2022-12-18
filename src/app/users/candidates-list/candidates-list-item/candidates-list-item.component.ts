import {Component, Input, OnInit} from '@angular/core';
import {UserFullDto} from "../../../shared/model/user-full-dto.model";

@Component({
  selector: 'app-candidates-list-item',
  templateUrl: './candidates-list-item.component.html',
  styleUrls: ['./candidates-list-item.component.css']
})
export class CandidatesListItemComponent implements OnInit {

  @Input("candidate") candidate: UserFullDto;

  constructor() { }

  ngOnInit(): void {
  }

}
