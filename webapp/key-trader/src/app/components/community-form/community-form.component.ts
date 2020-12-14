import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunityService } from '../../Server/community.service';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../Auth/auth.service';


@Component({
  selector: 'app-community-form',
  templateUrl: './community-form.component.html',
  styleUrls: ['./community-form.component.css'],
  providers: [CommunityService]
})
export class CommunityFormComponent implements OnInit {

  constructor( private router: Router, public authService: AuthService,
    private communityService: CommunityService) { }

  communityName: string;
  loading = false;
  userAuthenticated = false;

  ngOnInit(): void {
    this.loading = true;
    this.userAuthenticated = this.authService.getIsAuthenticated();
  }

  createCommunity(form: NgForm) {
    this.communityName = form.value.communityInput;
    if (this.communityName.length > 0) {
      console.log('Creating key trader community');
      this.communityService.createCommunity(this.communityName, this.communityName);
    }
  }

}
