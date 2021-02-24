import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';


import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import {LogoutComponent} from './logout/logout.component';

import { LivreListeComponent } from './livre/livre-liste/livre-liste.component';



const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'livre/list', component: LivreListeComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
