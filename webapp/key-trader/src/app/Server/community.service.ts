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
import { Subject } from 'rxjs';
import {environment} from '../../environments/environment';
import {CookieService} from 'ngx-cookie-service';
import { Community } from 'src/app/Models/community.model';
import { CommunityRole } from 'src/app/Models/community-role.model';


@Injectable({ providedIn: 'root' })
export class CommunityService {

  private isAuthenticated = false;
  private token: string;

  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private keyTraderAuthStatusListener = false;

  private validity: { validity: boolean };
  private validityUpdated = new Subject<{validity: boolean }>();


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
    console.log(body);
    const url = environment.getApiUrl("user/load-community");

    this.http.post(url,body)
    .subscribe(response => {
      console.log(response);
      var result = response['result']
      if (result) {
        //navigate to page so user can see new community
        console.log("Successfully retrieved communities.");
        console.log(result);
        return result;
      }
    });
  }

  createRole(communityID: string, username: string, role: string) {
    const body: CommunityRole = {
      communityID : communityID,
      username : username, 
      role : role
    };
    
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

  getCommunity(){
    return this.currentCommunity;
  }

  setCommunity(community: Community){
    this.currentCommunity = community;
  }

}