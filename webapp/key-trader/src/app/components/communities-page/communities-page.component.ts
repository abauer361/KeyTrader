import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserService} from '../../User/userService';
import {CookieService} from 'ngx-cookie-service';

import {faCog, faPlus} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../Auth/auth.service';
import {Router} from '@angular/router';
import {KeyService} from '../../Key/keyService';
import {ServerService} from '../../Server/server.service';
import {Server} from '../../Models/server.model';

@Component({
  selector: 'app-servers-page',
  templateUrl: './servers-page.component.html',
  styleUrls: ['./servers-page.component.css']
})

export class ServersPageComponent implements OnInit, OnDestroy {
  private jwt: any = {};      // The full jwt given to us from the backend

  private jwtKey: string;     // Just the jwt key that we can send to the backend to be decoded into the token

  servers: Server[] = [];
  private serverSub: Subscription;

  linkedServers: Server[] = [];
  private linkedServersSub: Subscription;

  settingsIcon = faCog;

  loading = false;

  private tokenValidity: { validity: boolean };

  constructor(public userService: UserService, public authService: AuthService,
              private router: Router, public keyService: KeyService,
              public serverService: ServerService,
              private cookieService: CookieService) {}


  ngOnInit() {
    this.loading = true;
    if (localStorage.getItem('token')) {   // Checks if the the jwt has been stored in local storage yet
      this.jwtKey = localStorage.getItem(('token'));
      this.retrieveServers();
    } else {                                           // If it hasn't been stored, then get it from the cookie and login
        console.log('token not in local');
        this.jwt = JSON.parse(this.cookieService.get('jwt'));
        this.jwtKey = this.jwt.token;
        console.log(this.jwtKey);
        this.authService.validateToken(this.jwtKey);
        this.authService.getValidityUpdated().subscribe((validity) => {
          console.log(validity);
          this.tokenValidity = validity;
          if (this.tokenValidity) {
            this.jwtKey = this.jwt.token;
            this.authService.login(this.jwt);

            this.retrieveServers();
          } else {
            this.router.navigateByUrl('/login');
          }
        });
      }
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

  setKeyServer(server) {              // Sets current server for add and see keys page
    this.keyService.setKeyServer(server);
  }
  addKey(server) {
    this.setKeyServer(server);
    this.router.navigateByUrl('/add-key');
  }
  seeKeys(server) {
    this.setKeyServer(server);
    this.router.navigateByUrl('/see-keys');
  }
  setServer(server) {               // Sets current server for settings page (Its own function for abstraction)
    this.serverService.setServer(server);
  }
  serverSettings(server) {
    this.setServer(server);
    this.router.navigateByUrl('/view-roles');
  }

}
