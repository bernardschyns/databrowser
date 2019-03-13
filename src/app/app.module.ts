// attention pour charger un nouveau template
//travailler dans wakanda après avoir importer de wufoo
//filter les for(i) où la variable i n'est pas définie => let i
//corriger un let counter
//rajouter initForm()pour exécuter la routine
//corriger dans le html les référence src à l'image voir les autres exemples déjà réalisés
//rajouter le ng-template adéquat au html que l'on aura filtré au niveau de son ng-form
// rajouter les identity.... que l'on veut insérer dans le template
// il faut sans doute payer pour que le calendrier fonctionne ainsi que pour télécharger des images
// sudo lsof -t -i tcp:8080| xargs kill -9
// sudo lsof -t -i tcp:8081| xargs kill -9
// sudo lsof -t -i tcp:4200| xargs kill -9
// sudo lsof -t -i tcp:9000| xargs kill -9
// sudo lsof -t -i tcp:8089| xargs kill -9

//j'ai enlevé dans le build de scripts --source-map qui permettait sans doute de debugger en prod

//sudo npm i -g npm pour mettre à jour node
// npm install rxjs@6 rxjs-compat@6 --save
// a réglé les problèmes apparus avec rxjs

// problème dans upload() de wakanda
//voir dans https://github.com/Wakanda/wakanda-issues/issues/218
//modification à apporter dans "wakanda-client.no-primise.js"
// dans version 2.6.0 c'était à la ligne 3554
//deuxième erreur détectée par bernard...pour uploader
//il faut d'abord deleter....et rajouter /rest/
// à la ligne 3541

//npm uninstall angular-flipclock --save
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER,NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app.routing';
import { NavbarModule } from './shared/navbar/navbar.module';

import { AppComponent } from './app.component';
import { DataClassesComponent } from './dataClass/dataClasses.component';
import { AgGridClassModule } from './dataClass/agGridClass/agGridClass.module';

import { TreeComponent } from './tree/tree.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { Wakanda } from './wakanda.service';
import { TournoiService } from './tournoi.service';

import { ApiService } from './shared/api.service';



import { InputTextModule, DropdownModule, DataListModule, GrowlModule, Message, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { TreeModule } from 'primeng/tree';


import { SidebarModule } from './sidebar/sidebar.module';

import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tabs/tab.component';
import { DynamicTabsDirective } from './tabs/dynamic-tabs.directive';
import { DemoModule } from './demo/module';
import { ServiceWorkerModule } from '@angular/service-worker';
import {NewsletterService} from "./services/newsletter.service";
import { AppInitService } from './app-init.service';
import { environment } from '../environments/environment';

import {CanDeactivateGuard} from './can-deactivate/can-deactivate.guard';

export function init_app(appLoadService: AppInitService) {
	return () => appLoadService.init();
  }

@NgModule({
	declarations: [
		AppComponent,
		DataClassesComponent,
		TreeComponent,
		TabsComponent,
		TabComponent,
		LoginComponent,
		HeaderComponent,
		DynamicTabsDirective,
	],

	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		NavbarModule,
		RouterModule,
		AppRoutingModule,
		DataListModule,
		GrowlModule,
		ConfirmDialogModule,
		TableModule,
		MultiSelectModule,
		ButtonModule,
		SplitButtonModule,
		DropdownModule,
		RadioButtonModule,
		CheckboxModule,
		DemoModule,
		TreeModule,
		CalendarModule,
		AgGridClassModule,
		//AgGridListModule,
		SidebarModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

	],
	providers: [
		ApiService,
		Wakanda,
		ConfirmationService,
		TournoiService,
		NewsletterService,
		AppInitService,
		AppInitService,
		CanDeactivateGuard,
		{
			provide: APP_INITIALIZER,
			useFactory: init_app,
			deps: [AppInitService],
			multi: true
		}
	],
	entryComponents: [
		TabComponent
	],
	bootstrap: [LoginComponent]
})
export class AppModule { }

// import { DataClass } from './dataclass';
// import { QueryOption } from './query-option';
// declare class Entity {
//     _key: string;
//     _stamp: number;
//     _deferred: boolean;
//     _dataClass: DataClass;
//     [key: string]: any;
//     save: () => Promise<Entity>;
//     delete: () => Promise<void>;
//     fetch: (options?: QueryOption) => Promise<Entity>;
//     recompute: () => Promise<Entity>;
//     constructor({key: entityKey, deferred, dataClass}: {
//         key: string;
//         deferred: boolean;
//         dataClass: DataClass;
//     });
// }
// export default Entity;
