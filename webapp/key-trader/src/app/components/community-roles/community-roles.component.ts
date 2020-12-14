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

@Component({
  selector: 'app-community-roles',
  templateUrl: './community-roles.component.html',
  styleUrls: ['./community-roles.component.css']
})
export class CommunityRolesComponent implements OnInit, OnDestroy {

  community: Community;

  public userRoles: string[] = ["Admin","Doner/Recipient","Doner","Recipient","Viewer","Blocked"];
  public username: string;
  public users: CommunityRole [] = [];
  private communityRoleSub: Subscription;

  allowed: boolean;
  accessDenied: boolean;

  loading = false;
  popup = false;

  constructor(public communityService: CommunityService, public userComService: UserComService, private router: Router) { }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;


  ngOnInit() {
    this.loading = true;
    this.community = this.communityService.getCommunity();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    if (this.communityRoleSub) {
      this.communityRoleSub.unsubscribe();
    }
  }

  loadUsers() {
    this.communityService.loadRoles(this.community.communityID);
    this.communityService.getCommunityRoles().subscribe((communityRoles: CommunityRole []) => {
      console.log("Testing");
      this.users = communityRoles;
      console.log(communityRoles);
     
      this.loading = false;
    });
  }

  updateRole(username: string, role: string) {
    const communityID = this.community.communityID;
    console.log(role);
    console.log("Updating role.");
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
