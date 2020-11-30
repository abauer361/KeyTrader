import { BrowserModule } from   '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CookieService } from 'ngx-cookie-service';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwappingSquaresSpinnerModule } from 'angular-epic-spinners';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './components/main/main.component';
import { InnerCompComponent } from './components/inner-comp/inner-comp.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { ServersPageComponent } from './components/servers-page/servers-page.component';
import { SeeKeysPageComponent } from './components/see-keys-page/see-keys-page.component';
import { AddKeyPageComponent } from './components/add-key-page/add-key-page.component';
import { ChangeRolesComponent} from './components/change-roles/change-roles.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { ViewRolesComponent } from './components/view-roles/view-roles.component';
import { LoggedOutComponent } from './components/logged-out/logged-out.component';
import { AuthService } from "./Auth/auth.service";
import { MatToolbarModule } from "@angular/material/toolbar";
import { NormalAuthGuard } from "./Auth/auth-2.guard";
import { AuthGuard } from "./Auth/auth.guard";
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from './components/error/error.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    InnerCompComponent,
    LoginPageComponent,
    LoginFormComponent,
    SignupFormComponent,
    ServersPageComponent,
    SeeKeysPageComponent,
    AddKeyPageComponent,
    ChangeRolesComponent,
    NavMenuComponent,
    ViewRolesComponent,
    LoggedOutComponent,
    ProfilePageComponent,
    AccessDeniedComponent,
    ErrorComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        FontAwesomeModule,
        MatListModule,
        MatCardModule,
        MatButtonModule,
        MatMenuModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        SwappingSquaresSpinnerModule,
        MatToolbarModule,
        MatSlideToggleModule,
        MatDialogModule
    ],
  providers: [CookieService, AuthService, AuthGuard, NormalAuthGuard, { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
