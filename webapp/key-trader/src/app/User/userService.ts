/*
  User service is anything having to do with users.
  Even if some of these functions involve servers,
  the fact that users are involved in owning the servers, being a part of the servers,
  etc. means that it will be here.
*/

import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {Server} from '../Models/server.model';
import {KeyTraderRole} from "../Models/keyTraderRole.model";


@Injectable({providedIn: 'root'})
export class UserService {

  private servers: Server[] = [];
  private serversUpdated = new Subject<Server []>();

  private linkedServers: Server[] = [];
  private linkedServersUpdated = new Subject<Server []>();

  private userRoles: string[] = [];
  private userRolesUpdated = new Subject<string []>();

  constructor(private http: HttpClient, private router: Router) {}

  public getUserDiscords(jwtToken) {
    this.http.get<{message: string, servers: Server[], serversLinked: Server[]}>(environment.getApiUrl('discord/getServers'), {params: {token: jwtToken}})
      .subscribe((serverData) => {
        console.log(serverData);
        this.servers = serverData.servers;
        this.serversUpdated.next([...this.servers]);

        this.linkedServers = serverData.serversLinked;
        this.linkedServersUpdated.next([...this.linkedServers]);
      }, error => {
        console.log(error);
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
      }
  );
  }
  public getServerUpdatedListener() {
    return this.serversUpdated.asObservable();
  }

  public getLinkedServersUpdatedListener() {
    return this.linkedServersUpdated.asObservable();
  }


  public getUserRoles(token, guildID) {

    this.http.get<{message: string, roleTypes: string[]}>(environment.getApiUrl('discord/getUserRoles'), {params: {token, guildID}})
      .subscribe((serverData) => {
        this.userRoles = serverData.roleTypes;

        this.userRolesUpdated.next([...this.userRoles]);

      });
  }
  public getRolesUpdatedListener() {
    return this.userRolesUpdated.asObservable();
  }


}
