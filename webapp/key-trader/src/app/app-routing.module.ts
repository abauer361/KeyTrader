import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoginPageComponent} from './components/login-page/login-page.component';
import {LoginFormComponent} from './components/login-form/login-form.component';
import {SignupFormComponent} from './components/signup-form/signup-form.component';
import {SignupSuccessComponent} from './components/signup-success/signup-success.component';
import {ServersPageComponent} from './components/servers-page/servers-page.component';
import {AddKeyPageComponent} from './components/add-key-page/add-key-page.component';
import {SeeKeysPageComponent} from './components/see-keys-page/see-keys-page.component';
import {ChangeRolesComponent} from './components/change-roles/change-roles.component';
import {AuthGuard} from './Auth/auth.guard';
import {CommunitiesComponent} from './components/communities-page/communities-page.component';
import {ViewRolesComponent} from './components/view-roles/view-roles.component';
import {LoggedOutComponent} from './components/logged-out/logged-out.component';
import {NormalAuthGuard} from './Auth/auth-2.guard';
import {ProfilePageComponent} from './components/profile-page/profile-page.component';
const routes: Routes = [
  {path: '', component: ServersPageComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginPageComponent},
  {path: 'login-form', component: LoginFormComponent},
  {path: 'signup-form', component: SignupFormComponent},
  {path: 'signup-success', component: SignupSuccessComponent},
  {path: 'add-key', component: AddKeyPageComponent, canActivate: [NormalAuthGuard]},
  {path: 'see-keys', component: SeeKeysPageComponent, canActivate: [NormalAuthGuard]},
  {path: 'view-roles', component: ViewRolesComponent, canActivate: [NormalAuthGuard]},
  {path: 'settings', component: ChangeRolesComponent, canActivate: [NormalAuthGuard]},
  {path: 'profile-page', component: ProfilePageComponent},
  {path: 'communities-page', component: CommunitiesComponent, canActivate: [AuthGuard]},
  {path: 'logged-out', component: LoggedOutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }
