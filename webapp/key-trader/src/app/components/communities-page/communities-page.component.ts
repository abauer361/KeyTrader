import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserService} from '../../User/userService';
import {CookieService} from 'ngx-cookie-service';

import {faCog, faPlus} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../Auth/auth.service';
import {Router} from '@angular/router';

import {CommunityService} from '../../Server/community.service';
import {Server} from '../../Models/server.model';

@Component({
  selector: 'app-communities-page',
  templateUrl: './communities-page.component.html',
  styleUrls: ['./communities-page.component.css']
})

export class CommunitiesComponent implements OnInit, OnDestroy {
  private jwt: any = {};      // The full jwt given to us from the backend

  private jwtKey: string;     // Just the jwt key that we can send to the backend to be decoded into the token

  servers: Server[] = [];
  private serverSub: Subscription;

  linkedServers: Server[] = [];
  private linkedServersSub: Subscription;

  settingsIcon = faCog;

  loading = false;
  userAuthenticated = false;

  private tokenValidity: { validity: boolean };


  constructor(public userService: UserService, public authService: AuthService,
              private router: Router,
              public serverService: CommunityService,
              private cookieService: CookieService) {}


  

  ngOnInit(): void {
      this.loading = true;
      this.userAuthenticated = this.authService
                .getIsAuthenticated();
  }
          
            
  retrieveServers() {
    this.userService.getUserDiscords(this.jwtKey);          // Initiates call to backend to ensure that the servers are loaded on the home page
    this.userService.getServerUpdatedListener().subscribe((servers) => {
      this.servers = servers;
      this.userService.getLinkedServersUpdatedListener().subscribe((linkedServers: Server[]) => {
        this.linkedServers = linkedServers;
        this.loading = false;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.serverSub) {
      this.serverSub.unsubscribe();
    }
    if (this.linkedServersSub) {
      this.linkedServersSub.unsubscribe();
    }
    // this.cookieService.deleteAll( '/ ',  '/' );
  }

  linkServer(server) {                    // Used to link server to key trader
    this.setServer(server);
    this.serverService.linkServer();
  }

  
  setServer(server) {               // Sets current server for settings page (Its own function for abstraction)
    this.serverService.setCommunity(server);
  }
  serverSettings(server) {
    this.setServer(server);
    this.router.navigateByUrl('/view-roles');
  }

}
