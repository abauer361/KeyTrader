import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {ServerService} from '../../Server/server.service';
import { ViewChild} from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {Server} from '../../Models/server.model';
import {FormArray, FormControl} from '@angular/forms';
import {UserService} from '../../User/userService';
import {Router} from  '@angular/router';
import {Channel} from '../../Models/channel.model';


@Component({
  selector: 'app-change-roles',
  templateUrl: './change-roles.component.html',
  styleUrls: ['./change-roles.component.css']
})
export class ChangeRolesComponent implements OnInit, OnDestroy {
  server: Server;

  roles: string[] = [];
  private roleSub: Subscription;

  channels: Channel[] = [];
  private channelSub: Subscription;

  notifications: boolean[] = [];
  private notificationsSub: Subscription;

  discordRoles = new FormArray([]);

  userRoles: string[];
  allowed: boolean;
  accessDenied = false;

  serverUpdates: string[] = [];

  loading = false;

  keysAdded: boolean;     // Notification settings
  keysClaimed: boolean;
  newUser: boolean;

  notificationChannel: string;



  constructor(public serverService: ServerService, private userService: UserService, private router: Router) { }



  ngOnInit() {
    this.server = this.serverService.getServer();
    this.loading = true;
    this.getUserRoles();

    this.serverService.getRoles(this.server.serverID);                                                // Lots of roles. I know. Confusing. This set of roles deals with the discord roles such as Admin, Mod, User, etc.
    this.roleSub = this.serverService.getRolesUpdatedList().subscribe((roles) => {      // These roles are specific to each server.
      this.roles = roles;
      for (const role in roles) {
        this.addRole();
      }
    });

    this.serverService.getChannels(this.server.serverID);
    this.channelSub = this.serverService.getChannelsUpdated().subscribe((channels) => {      // These roles are specific to each server.
      this.channels = channels;
    });

    this.serverService.getNotifications(this.server.serverID);    // Gets notification settings for adding keys, viewing keys, new users.
    this.notificationsSub = this.serverService.getNotificationsUpdated().subscribe((notifications) => {
      this.notifications = notifications;
      this.setNotifications();
    });
  }

  ngOnDestroy() {
    this.channels.length = 0;
    this.serverService.deleteChannels();

    if (this.roleSub) {
      this.roleSub.unsubscribe();
    }
    if (this.channelSub) {
      this.channelSub.unsubscribe();
    }
    if (this.notificationsSub) {
      this.notificationsSub.unsubscribe();
    }
  }

  getUserRoles() {
    this.userService.getUserRoles(localStorage.getItem('token'), this.server.serverID);       // This deals with the user's roles. The current logged in user will have an array of roles assigned to him/her
    this.userService.getRolesUpdatedListener().subscribe( (roles: string[]) => {             // This function uses the user service to pull all of those roles from the backend
      this.userRoles = roles;

      this.checkUserRole();
    });
  }

  addRole() {
    this.discordRoles.push(new FormControl(''));
  }

  UpdateRoles() {
    this.serverService.updateRoles(this.roles, this.discordRoles.value);
  }
  UpdateNotifications() {
    this.serverService.updateNotifications(this.keysAdded, this.keysClaimed, this.newUser);

    if (this.notificationChannel !== undefined) {
      this.serverService.updateChannels(this.notificationChannel);
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

  setNotifications() {    // Uses the notification subscription to get the values from backend, and then uses the int to boolean helper to chagne the 0/1 values to true and false
    // @ts-ignore
    this.keysAdded = this.intToBooleanHelper(this.notifications[0].newKey);
    // @ts-ignore
    this.keysClaimed = this.intToBooleanHelper(this.notifications[0].claimedKey);
    // @ts-ignore
    this.newUser = this.intToBooleanHelper(this.notifications[0].newUser);

  }
  intToBooleanHelper(notificationInteger) {
    if (notificationInteger === 0) {
      return false;
    } else {
      return true;
    }
  }

  changeAddedKey() {
    this.keysAdded = !this.keysAdded;
  }
  changeRedeemedKey() {
    this.keysClaimed = !this.keysClaimed;
  }
  changeNewUser() {
    this.newUser = !this.newUser;
  }


}
