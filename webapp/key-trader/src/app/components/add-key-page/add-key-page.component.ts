import { Component, OnInit } from '@angular/core';
import { UserService } from '../../User/userService';
import { KeyService } from '../../Key/keyService';
import { Server } from '../../Models/server.model';
import { Subscription } from 'rxjs';
import { Key } from '../../Models/key.model';
import { Router } from "@angular/router";

@Component({
  selector: 'app-add-key-page',
  templateUrl: './add-key-page.component.html',
  styleUrls: ['./add-key-page.component.css']
})
export class AddKeyPageComponent implements OnInit {

  constructor(public userService: UserService, public keyService: KeyService, private router: Router) { }

  server: Server;
  gameKey: string;
  gameID: number;

  gameName: string;
  gamePrice: number;

  steamKey: Key;
  checkSteamKey = false;

  addedKey: boolean;

  otherKey = {gameID: 0, gamePrice: 0, gameName: '', keyString: ''};

  keyTypeSelected = 'Steam';

  userRoles: string[];
  private rolesSub: Subscription;
  allowed: boolean;
  accessDenied: boolean;

  ngOnInit() {
    this.server = this.keyService.getKeyServer();
    console.log(this.server);
    this.userService.getUserRoles(localStorage.getItem('token'), this.server.serverID);
    this.rolesSub = this.userService.getRolesUpdatedListener().subscribe((roles: string[]) => {
      this.userRoles = roles;
      this.checkUserRole();
    });

    console.log(this.server);

  }

  checkUserRole() {

    for (const role in this.userRoles) {
      console.log(this.userRoles[role]);
      console.log(this.userRoles[role] === 'Donor/Recipient');
      if (this.userRoles[role] === 'Donor' || this.userRoles[role] === 'Donor/Recipient') {
        this.allowed = true;
        break;
      } else {
        this.allowed = false;
      }
    }
    if (this.allowed === false) {
      this.accessDenied = true;
    }
  }
  onSubmit() {
    console.log('onSubmit is called');
    if (this.keyTypeSelected === 'Steam') {
      this.keyService.checkSteamKey(this.server.serverID, this.gameID, this.gameKey);
      this.keyService.getSteamKeyUpdated().subscribe((steamKey) => {
        this.steamKey = steamKey;
        this.checkSteamKey = true;
      });
    } else {
      this.otherKey.gameName = this.gameName;
      this.otherKey.gamePrice = this.gamePrice;
      this.otherKey.keyString = this.gameKey;
      this.otherKey.gameID = 0;
      this.keyService.addKey(this.server.serverID, this.otherKey);
    }
  }

  submitSteamKey() {
    this.keyService.addKey(this.server.serverID, this.steamKey);
    this.keyService.getKeyAddedUpdatedListener().subscribe(() => {
      this.checkSteamKey = false;
      // If needed this is where you could let the user know that the key addition succeeded or failed
    });

  }
}
