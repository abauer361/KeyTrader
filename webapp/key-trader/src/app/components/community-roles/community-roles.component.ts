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

  private userRoles: string[] = [];
  public username: string;
  public users: CommunityRole [] = [];

  allowed: boolean;
  accessDenied: boolean;

  loading = false;
  popup = false;

  serverUpdates: string[] = [];

  constructor(public communityService: CommunityService, public userComService: UserComService, private router: Router) { }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;


  ngOnInit() {
    this.loading = true;
    this.community = this.communityService.getCommunity();
    this.loadUsers();
    this.loading = false;
  }

  ngOnDestroy(): void {
  }

  loadUsers() {
    this.communityService.loadRoles(this.community.communityID);
    this.communityService.getCommunities().subscribe((communityRoles: CommunityRole []) => {
      this.users = communityRoles;
    });
  }

  addUser(newUser: string) {
    if (newUser.length > 0) {
      //TO DO ADD USERS TO ROLES
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
