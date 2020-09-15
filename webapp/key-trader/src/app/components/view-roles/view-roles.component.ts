import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ServerService} from '../../Server/server.service';
import { ViewChild} from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {Server} from '../../Models/server.model';
import {FormArray, FormControl} from '@angular/forms';
import {UserService} from '../../User/userService';
import {KeyTraderRole} from "../../Models/keyTraderRole.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-view-roles',
  templateUrl: './view-roles.component.html',
  styleUrls: ['./view-roles.component.css']
})
export class ViewRolesComponent implements OnInit, OnDestroy {

  server: Server;

  private userRoles: string[] = [];
  private userRolesSub: Subscription;

  keyTraderRoles: KeyTraderRole[] = [];
  private keyTraderRoleSub: Subscription;

  notifications: boolean[] = [];
  private notificationsSub: Subscription;

  addKeysNotification = false;
  claimKeysNotification = false;
  newUserNotification = false;


  rolesNotSet = true;

  allowed: boolean;
  accessDenied: boolean;

  loading = false;

  serverUpdates: string[] = [];

  constructor(public serverService: ServerService, public userService: UserService, private router: Router) { }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;


  ngOnInit() {
    this.loading = true;
    this.server = this.serverService.getServer();

    this.userService.getUserRoles(localStorage.getItem('token'), this.server.serverID);       // Adds each role the current user has
    this.userRolesSub = this.userService.getRolesUpdatedListener().subscribe( (roles: string[]) => {
      this.userRoles = roles;

      this.checkUserRole();
    });

    this.serverService.getKeyTraderRoles(this.server.serverID);
    this.keyTraderRoleSub = this.serverService.getKeyTraderRolesUpdatedList().subscribe((keyTraderRoles) => {
      this.keyTraderRoles = keyTraderRoles;
      if (this.keyTraderRoles.length === 0) {
        this.rolesNotSet = true;
      } else {
        this.rolesNotSet = false;
      }
    });

    this.serverService.getNotifications(this.server.serverID);
    this.notificationsSub = this.serverService.getNotificationsUpdated().subscribe((notifications) => {
      this.notifications = notifications;
      this.setNotifications();
    });

  }

  ngOnDestroy(): void {
    if (this.userRolesSub) {
      this.userRolesSub.unsubscribe();
    }
    if (this.keyTraderRoleSub) {
      this.keyTraderRoleSub.unsubscribe();
    }
    if (this.notificationsSub) {
      this.notificationsSub.unsubscribe();
    }
  }

  checkUserRole() {
    for (const role in this.userRoles) {
      if (this.userRoles[role] === 'Admin') {
        this.allowed = true;
        break;
      } else {
        this.allowed = false;
      }
    }

    if (this.allowed) {
      this.loading = false;
    } else {
      this.accessDenied = true;
    }
  }
  setNotifications() {
    // @ts-ignore
    this.addKeysNotification = this.notifications[0].newKey;
    // @ts-ignore
    this.claimKeysNotification = this.notifications[0].claimedKey;
    // @ts-ignore
    this.newUserNotification = this.notifications[0].newUser;
  }
}
