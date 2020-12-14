import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CommunityService} from '../../Server/community.service';
import { ViewChild} from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {FormArray, FormControl} from '@angular/forms';
import {UserComService} from '../../User/userComService';
import {KeyTraderRole} from "../../Models/keyTraderRole.model";
import {Router} from "@angular/router";
import { Community } from 'src/app/Models/community.model';

@Component({
  selector: 'app-community-roles',
  templateUrl: './community-roles.component.html',
  styleUrls: ['./community-roles.component.css']
})
export class CommunityRolesComponent implements OnInit, OnDestroy {

  community: Community;

  private userRoles: string[] = [];
  public username: string;

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
    this.loading = false;
  }

  ngOnDestroy(): void {
  }

  addUser(username : string) {
    this.username = username;
    if (this.username.length > 0) {
      //TO DO ADD USERS TO ROLES
    }
  }

  search() {
    console.log("Search button");
  }

}
