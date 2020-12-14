import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunityService } from './community.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-community-form',
  templateUrl: './community-form.component.html',
  styleUrls: ['./community-form.component.css'],
  providers: [CommunityService]
})
export class CommunityFormComponent implements OnInit {

  constructor( private router: Router,
    private communityService: CommunityService) { }

  communityName: string;

  ngOnInit(): void {
  }

  onSubmitButtonClicked(form: NgForm): void {
    this.communityName = form.value.communityNameInput;
    console.log('Going to key-trader home page');
    this.communityService.createCommunity(this.communityName, this.communityName);
  }


  createCommunity(form: NgForm) {
    
  }


}
