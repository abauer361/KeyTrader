import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {KeyService} from '../../Key/keyService';

import {Key} from '../../Models/key.model';
import {Server} from '../../Models/server.model';
import {UserService} from '../../User/userService';
import {Router} from "@angular/router";

@Component({
  selector: 'app-see-keys-page',
  templateUrl: './see-keys-page.component.html',
  styleUrls: ['./see-keys-page.component.css']
})
export class SeeKeysPageComponent implements OnInit {

  constructor(public keyService: KeyService, public userService: UserService, private router: Router) { }
  server: Server;

  keys: Key[] = [];
  keySub: Subscription;

  userRoles: string[];
  private rolesSub: Subscription;
  allowed: boolean;
  accessDenied: boolean;
  isViewer: boolean;

  ngOnInit() {
    this.server = this.keyService.getKeyServer();
    console.log(this.server);

    this.keyService.getKeys(this.server.serverID);
    this.keySub = this.keyService.getKeyUpdatedListener().subscribe((keys) => {
      this.keys = keys;
    });

    this.userService.getUserRoles(localStorage.getItem('token'), this.server.serverID);
    this.rolesSub = this.userService.getRolesUpdatedListener().subscribe( (roles: string[]) => {
      this.userRoles = roles;
      this.checkUserRole();
    });


  }
  checkUserRole() {
    this.allowed = false;
    for (const role in this.userRoles) {
      if (this.userRoles[role] === 'Recipient' || this.userRoles[role] === 'Donor/Recipient') {
        this.allowed = true;
        this.isViewer = false;
        break;
      }
      else if (this.userRoles[role] === 'Viewer')
      {
        this.allowed = true;
        this.isViewer = true;
      }
    }

    if(this.allowed === false) {
      this.accessDenied = true;
    }
  }

  redeemKey(gameKey) {
    console.log(gameKey);
    this.keyService.redeemKey(this.server.serverID, localStorage.getItem('token'), gameKey);
    this.router.navigateByUrl('/profile-page');
  }

}
