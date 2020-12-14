/*
Auth service:
Basically anything having to do with the jwt is in here which includes:
  Logging in
  Getting authorization
  Logging out
  Setting timers
  Validating token with the backend
*/




import {Injectable, OnInit} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import {environment} from '../../environments/environment';
import {CookieService} from 'ngx-cookie-service';
import { Community } from 'src/app/Models/community.model';
import { CommunityRole } from 'src/app/Models/community-role.model';
import { timer } from 'rxjs/observable/timer';


@Injectable({ providedIn: 'root' })
export class CommunityService {

  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private keyTraderAuthStatusListener = false;

  private validity: { validity: boolean };
  private validityUpdated = new Subject<{validity: boolean }>();

  private communities: Community [] = [];
  private communitiesUpdated = new Subject<Community []>();

  private communityRoles: CommunityRole [] = [];
  private communityRolesUpdated = new Subject<CommunityRole []>();
 
  public showSuccess: boolean;     // Success timer info
  private successSub: Subscription;
  timer = timer(3000);

  private currentCommunity: Community;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {

  }

  createCommunity(communityID: string, communityName: string, username: string){
    const body: Community = {
      communityID : communityID, 
      communityName : communityName
    };
    const url = environment.getApiUrl("user/create-community");
    this.http.post(url,body)
    .subscribe(response => {
      console.log(response);
      var result = response['result']
      if (result) {
        //navigate to page so user can see new community
        console.log("Successfully created community.");
        const role = "Admin";
        this.createRole(communityID,username,role);
      }
    });
  }

  loadCommunity(username: string){
    const body = {
      username: username
    }
    const url = environment.getApiUrl("user/load-community");

    this.http.post<{ message: string, communities: Community [] }>(url,body)
    .subscribe((result) => {
      console.log(result);
      this.communities = result.communities;
      this.communitiesUpdated.next([...this.communities]);
      this.setTimer();
      console.log("Successfully loaded community.");
    }), error => {
      console.log(error);
    };
  }

  createRole(communityID: string, username: string, role: string) {
    const body: CommunityRole = {
      communityID : communityID,
      username : username, 
      role : role
    };
    console.log(body);
    const url = environment.getApiUrl("user/update-role");
    this.http.post(url,body)
    .subscribe(response => {
      console.log(response);
      var result = response['result']
      if (result) {
        //navigate to page so user can see new community
        console.log("Successfully created role.");
        this.router.navigate(['/communities-page']);
      }
    });
  }


  loadRoles(communityID: string){
    const body = {
      communityID: communityID
    }
    const url = environment.getApiUrl("user/load-roles");

    this.http.post<{ message: string, communityRoles: CommunityRole [] }>(url,body)
    .subscribe((result) => {
      console.log(result);
      this.communityRoles = result.communityRoles;
      this.communityRolesUpdated.next([...this.communityRoles]);
      this.setTimer();
      console.log("Successfully loaded community.");
    }), error => {
      console.log(error);
    };
  }

  setCommunity(community){
    this.currentCommunity = community;
  }

  getCommunity() {
    return this.currentCommunity;
  }

  getCommunities() {
    return this.communitiesUpdated.asObservable();
  }

  getCommunityRoles() {
    return this.communityRolesUpdated.asObservable();
  }

  public setTimer() {
    console.log('timer called');
    // set showloader to true to show loading div on view
    this.showSuccess   = true;
    this.successSub = this.timer.subscribe(() => {
      console.log('timer removed');
      // set showloader to false to hide loading div from view after 5 seconds
      this.showSuccess = false;
    });
  }

}