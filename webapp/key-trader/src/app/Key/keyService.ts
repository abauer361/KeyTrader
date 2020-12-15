/*
  This service is anything to do with keys. Getting keys, adding keys, verifying keys,
  and redeeming keys.

*/
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';

import {Key} from '../Models/key.model';
import {Server} from '../Models/server.model';
import {Community} from '../Models/community.model'
import { CommunityKey } from 'src/app/Models/community-key.model';

@Injectable({providedIn: 'root'})
export class KeyService {

  private currentServer: Server;
  private currentCommunity: Community;

  private keys: Key[] = [];
  private keysUpdated = new Subject<Key []>();

  private redeemedKeys: Key[] = [];
  private redeemedKeysUpdated = new Subject<Key []>();

  private steamKey: Key;
  private steamKeyUpdated = new Subject<Key>();

  constructor(private http: HttpClient) {}

  keyAdded : boolean;
  private keyAddedUpdated = new Subject<boolean>();

  public loadCommunityKeys(communityID) {
    this.http.get<{message: string, keys}>(environment.getApiUrl('user/get-keys'), {params: {communityID}})
    .subscribe((keyData) => {
      this.keys = keyData.keys;
      this.keysUpdated.next([...this.keys]);
    });
  }

  public removeCommunityKey(key) {
    this.http.get<{message: string, keys}>(environment.getApiUrl('user/remove-keys'), {params: {key}})
    .subscribe((response) => {
      console.log(response);
      var result = response['result']
      if (result) {
        //navigate to page so user can see new community
        console.log("Successfully deleted key.");
      }
    });
  }

  public addCommunityKey(communityID, key) {
    const body: CommunityKey = {
      communityID : communityID, 
      key: key
    };
    console.log(body);
    this.http.post(environment.getApiUrl('user/create-key') , body).subscribe(
        responseData => {
          this.keyAdded = true;
          this.keyAddedUpdated.next(this.keyAdded);
          console.log(responseData);
          //this.sendNotification(ID, 'newKey');
        }, err => {
          console.log(err);
          this.keyAdded = false;
      });

  }

 

  public getKeys(guildID) { 
    console.log(guildID);
    this.http.get<{message: string, keys}>(environment.getApiUrl('discord/getKeys'), {params: {guildID}})
      .subscribe((keyData) => {
        this.keys = keyData.keys;
        this.keysUpdated.next([...this.keys]);
      });
  }
  public getKeyUpdatedListener() {
    return this.keysUpdated.asObservable();
  }

  public addKey(guildID, key) {
    this.http.post(environment.getApiUrl('discord/addKey') , {guildID, key}).subscribe(
        responseData => {
          this.keyAdded = true;
          this.keyAddedUpdated.next(this.keyAdded);

          this.sendNotification(guildID, 'newKey');
        }, err => {
          console.log(err);
          this.keyAdded = false;
      });

  }

  private sendNotification(guildID, notificationType) {
    this.http.post(environment.getApiUrl('discord/sendNotification') , {guildID, notificationType}).subscribe(
      responseData => {
        console.log(responseData);
      }, err => {
        console.log(err);
      });
  }
  public getKeyAddedUpdatedListener() {
    return this.keyAddedUpdated.asObservable();
  }

  public checkSteamKey(guildID, gameID, gameKey) {

    this.http.get<{message: string, key: Key}>(environment.getApiUrl('discord/checkSteamKey'), {params: {guildID, gameID}})
      .subscribe((keyData) => {
        this.steamKey = keyData.key;
        this.steamKeyUpdated.next(this.steamKey);
        this.steamKey.keyString = gameKey;
        this.steamKey.gameID = gameID;
      });
  }

  public getSteamKeyUpdated() {
    return this.steamKeyUpdated.asObservable();
  }

  public redeemKey(guildID, token, keyString) {
    this.http.post(environment.getApiUrl('discord/redeemKey') , {token, keyString}).subscribe(
      responseData => {
        this.sendNotification(guildID, 'claimedKey');
      }, err => {
        console.log(err);
      }
    );
  }

  public getRedeemedKeys(token) {
    console.log(token);
    this.http.get<{message: string, keys}>(environment.getApiUrl('discord/userKeys'), {params: {token}})
      .subscribe((keyData) => {
        this.redeemedKeys = keyData.keys;
        this.redeemedKeysUpdated.next([...this.redeemedKeys]);
      });
  }
  public getRedeemedKeyUpdatedListener() {
    return this.redeemedKeysUpdated.asObservable();
  }

  setKeyServer(serverName) {
    this.currentServer = serverName;
  }
  setKeyCommunity(communityName){
    this.currentCommunity = communityName;
  }
  getKeyServer() {
    return this.currentServer;
  }
}
