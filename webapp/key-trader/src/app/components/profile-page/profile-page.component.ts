import { Component, OnInit } from '@angular/core';
import {Key} from '../../Models/key.model';
import {Subscription} from 'rxjs';
import {KeyService} from '../../Key/keyService';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  constructor(private keyService: KeyService) { }

  redeemedKeys: Key[] = [];
  redeemedKeySub: Subscription;

  ngOnInit(): void {

    this.keyService.getRedeemedKeys(localStorage.getItem('token'));
    this.redeemedKeySub = this.keyService.getRedeemedKeyUpdatedListener().subscribe((keys) => {
      this.redeemedKeys = keys;
    });

  }
}
