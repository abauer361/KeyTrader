import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, Subject, Subscription} from 'rxjs';
import {Community} from '../Models/community.model';
import {KeyTraderRole} from '../Models/keyTraderRole.model';
import {Router} from '@angular/router';
import {Channel} from '../Models/channel.model';
import { timer } from 'rxjs/observable/timer';


@Injectable({providedIn: 'root'})
export class CommunityService {

  private currentCommunity: Community;

  private roles: string[] = [];
  private rolesUpdated = new Subject<string []>();

  private keyTraderRoles: KeyTraderRole[] = [];
  private keyTraderRolesUpdated = new Subject<KeyTraderRole []>();

  private notifications: boolean[] = [];
  private notificationsUpdated = new Subject<boolean []>();

  private channels: Channel[] = [];
  private channelsUpdated = new Subject<Channel []>();

  public showSuccess: boolean;     // Success timer info
  private successSub: Subscription;
  timer = timer(3000);

  constructor(private http: HttpClient, private router: Router) {
  }


  public getRoles(guildID) {
    this.http.get<{ message: string, roles: string[] }>(environment.getApiUrl('discord/getRoles'), {params: {guildID}})
      .subscribe((roleData) => {
        this.roles = roleData.roles;
        this.rolesUpdated.next([...this.roles]);
      });
  }
  public getRolesUpdatedList() {
    return this.rolesUpdated.asObservable();
  }

  public getKeyTraderRoles(guildID) {
    this.http.get<{ message: string, keyTraderRoles: KeyTraderRole[] }>(environment.getApiUrl('discord/getKeyTraderRoles'), {params: {guildID}})
      .subscribe((roleData) => {
        this.keyTraderRoles = roleData.keyTraderRoles;
        this.keyTraderRolesUpdated.next([...this.keyTraderRoles]);
      });
  }
  public getKeyTraderRolesUpdatedList() {
    return this.keyTraderRolesUpdated.asObservable();
  }

  setCommunity(community) {
    this.currentCommunity = community;
  }
  getCommunity() {
    return this.currentCommunity;
  }
  updateRoles(communityRoles, communityUpdates) {
    const guildID = this.currentCommunity.communityID;
    this.http.post(environment.getApiUrl('discord/saveRoles'), {communityRoles, communityUpdates, guildID}).subscribe(
      response => {
        console.log(response);
        this.router.navigateByUrl('/view-roles');
      }
    );
  }

  public getNotifications(guildID) {
    this.http.get<{ message: string, notifications: boolean[] }>(environment.getApiUrl('discord/getNotifications'), {params: {guildID}})
      .subscribe((notificationData) => {
        this.notifications = notificationData.notifications;
        this.notificationsUpdated.next([...this.notifications]);
      });
  }
  public getNotificationsUpdated() {
    return this.notificationsUpdated.asObservable();
  }

  public updateNotifications(keysAdded, keysClaimed, newUser) {

    const guildID = this.currentCommunity.communityID;
    this.http.post(environment.getApiUrl('discord/storeSettings'), {keysAdded, keysClaimed, newUser, guildID}).subscribe(
      response => {
        console.log(response);
        this.setTimer();
      }, error => {
        console.log(error);
      }
    );
  }

  public deleteChannels() {
    this.channels.length = 0;
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
