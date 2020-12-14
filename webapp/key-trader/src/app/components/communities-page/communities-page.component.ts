import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserComService} from '../../User/userComService';
import {CookieService} from 'ngx-cookie-service';

import {faCog, faPlus} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../Auth/auth.service';
import {Router} from '@angular/router';
import {KeyService} from '../../Key/keyService';
import {Community} from '../../Models/community.model';
import {CommunityService} from '../../Server/community.service'

@Component({
  selector: 'app-communities-page',
  templateUrl: './communities-page.component.html',
  styleUrls: ['./communities-page.component.css']
})

export class CommunitiesComponent implements OnInit, OnDestroy {
  private jwt: any = {};      // The full jwt given to us from the backend


  communities: Community[] = [];
  private communitySub: Subscription;


  settingsIcon = faCog;

  loading = false;
  userAuthenticated = false;
  username = "None";

  private tokenValidity: { validity: boolean };


  constructor(public userComService: UserComService, public authService: AuthService,
              private router: Router, public keyService: KeyService,
              public communityService: CommunityService,
              private cookieService: CookieService) {}
  

  ngOnInit(): void {
      this.loading = true;
      this.userAuthenticated = this.authService
                .getIsAuthenticated();
      if (this.userAuthenticated == true) {
        this.username = this.authService.getUsername();
        
        this.retrieveCommunity();
      }
  }
          
  retrieveCommunity() {
    this.loadCommunity(this.username)
    this.loading = false;
  }

  loadCommunity(username) {
    console.log('Locating key trader community');
    this.communityService.loadCommunity(username);
    this.communityService.getCommunities().subscribe((community: Community []) => {
      this.communities = community;
      this.loading = false;
    });
  }


  ngOnDestroy(): void {
    // this.cookieService.deleteAll( '/ ',  '/' );
    if (this.communitySub) {
      this.communitySub.unsubscribe();
    }
  }

  setRoleCommunity(community) {
    //this.keyService.setKeyCommunity(community);
    this.communityService.setCommunity(community);
  }

  addRoles(community) {
    console.log("Navigating to community-roles page.")
    this.setRoleCommunity(community);
    this.router.navigate(['/community-roles']);

  }

  addKey(community) {
    console.log("Navigating to community-roles page.")
    this.setRoleCommunity(community);
    this.router.navigate(['/add-key']);

  }

  viewKey(community) {
    console.log("Navigating to community-roles page.")
    this.setRoleCommunity(community);
    this.router.navigate(['/add-key']);

  }

  createCommunity() {
    this.router.navigateByUrl('/community-form')
  }
  
  setCommunity(community) {               // Sets current community for settings page (Its own function for abstraction)
    this.communityService.setCommunity(community);
  }
  communitySettings(community) {
    this.setCommunity(community);
    this.router.navigateByUrl('/view-roles');
  }

}
