import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CommunityService} from '../../Server/community.service';
import { ViewChild} from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {FormArray, FormControl} from '@angular/forms';
import {UserComService} from '../../User/userComService';
import {Router} from "@angular/router";
import { Community } from 'src/app/Models/community.model';
import { CommunityRole } from 'src/app/Models/community-role.model';
import {AuthService} from '../../Auth/auth.service';


@Component({
  selector: 'app-community-roles',
  templateUrl: './community-roles.component.html',
  styleUrls: ['./community-roles.component.css']
})
export class CommunityRolesComponent implements OnInit, OnDestroy {

  community: Community;

  public newRoles: string [] = [];
  public userRoles: string[] = ["Admin","Doner/Recipient","Doner","Recipient","Viewer","Blocked"];
  public username: string;
  public users: CommunityRole [] = [];
  private communityRoleSub: Subscription;
  userAuthenticated = false;

  allowed: boolean;
  accessDenied: boolean;

  loading = false;
  popup = false;

  constructor(public communityService: CommunityService, public userComService: UserComService, 
                      public authService: AuthService, private router: Router) { }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;


  ngOnInit() {
    this.loading = true;
    this.community = this.communityService.getCommunity();
    this.userAuthenticated = this.authService.getIsAuthenticated();
    this.username = this.authService.getUsername();
    if (this.userAuthenticated == true) {
      this.loadUsers();
    }
  }

  ngOnDestroy(): void {
    if (this.communityRoleSub) {
      this.communityRoleSub.unsubscribe();
    }
  }

  loadUsers() {
    this.communityService.loadRoles(this.community.communityID);
    this.communityService.getCommunityRoles().subscribe((communityRoles: CommunityRole []) => {
      this.users = communityRoles;
      for (let user in this.users) {
        const newRole = this.users[user].role;
        this.newRoles.push(newRole);
      }
      this.loading = false;
    });
  }

  updateRole(username: string, role: string) {
    const communityID = this.community.communityID;
    console.log("Updating role: " + role);
    this.communityService.createRole(communityID, username, role);
    
  }

  addUser(newUser: string) {
    if (newUser.length > 0) {
      const communityID = this.community.communityID;
      const role = "Viewer";
      //TODO: check existance of user in KeyTraderUsers
      console.log("Creating role.");
      this.communityService.createRole(communityID, newUser, role);
    }
  }
  search() {
    console.log("Search button");
  }

}
