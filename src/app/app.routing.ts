import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { DataClassesComponent } from './dataClass/dataClasses.component';
import { TabsComponent } from './tabs/tabs.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import {CanDeactivateGuard} from './can-deactivate/can-deactivate.guard';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'app', component: AppComponent,
  //canDeactivate: [CanDeactivateGuard] // semblerait que malgré sa présence dans la documentation...ce soit inutile
  //sans doute parce qu'il est directement implémenté dans appcomponent
 },
  { path: '', redirectTo: 'dataClass', pathMatch: 'full' },
  // ligne inscrite après des heures de recherches sur une erreur http:/localhost:4204/null
  // { path: 'null',          redirectTo: 'dataClass', pathMatch: 'full' }
];
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
