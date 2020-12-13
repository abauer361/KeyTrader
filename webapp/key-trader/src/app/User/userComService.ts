/*
  User service is anything having to do with users.
  Even if some of these functions involve communities,
  the fact that users are involved in owning the communities, being a part of the communities,
  etc. means that it will be here.
*/

import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {Community} from '../Models/community.model';
import {KeyTraderRole} from "../Models/keyTraderRole.model";


@Injectable({providedIn: 'root'})
export class UserComService {

  private communities: Community[] = [];
  private communitiesUpdated = new Subject<Community []>();


  private userRoles: string[] = [];
  private userRolesUpdated = new Subject<string []>();

  constructor(private http: HttpClient, private router: Router) {}

  public getCommunityUpdatedListener() {
    return this.communitiesUpdated.asObservable();
  }



  public getUserRoles(token, guildID) {

    this.http.get<{message: string, roleTypes: string[]}>(environment.getApiUrl('discord/getUserRoles'), {params: {token, guildID}})
      .subscribe((communityData) => {
        this.userRoles = communityData.roleTypes;

        this.userRolesUpdated.next([...this.userRoles]);

      });
  }
  public getRolesUpdatedListener() {
    return this.userRolesUpdated.asObservable();
  }


}
