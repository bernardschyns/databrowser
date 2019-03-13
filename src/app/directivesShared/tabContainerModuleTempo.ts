import { NgModule } from '@angular/core';

import { CommonModule, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DropdownModule } from 'primeng/primeng';
import { TreeModule } from 'primeng/tree';

import { IDataListes, IDataClasses, IDataClass2, ApiService, AdminData } from '../shared/api.service';


import { TabContainerComponent } from '../dataClass/tabContainerComponent';
import { TournoiComponent } from '../tree/tournoi.component'
import { TimerComponent } from '../shared/components/timerComponent';
import { HostListenerDirective } from '../directivesShared/hostListener.directive';
import { SubMenuDirective } from '../directivesShared/subMenu.directive';
import { MoveInputDirective } from '../directivesShared/moveInput.directive';

@NgModule({
    declarations: [
        TabContainerComponent,
        TournoiComponent,
        TimerComponent,
        HostListenerDirective,
        SubMenuDirective,
        MoveInputDirective,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        SplitButtonModule,
        DropdownModule,
        TreeModule,
    ],
    providers: [
        ApiService
        ],
    exports: [TabContainerComponent, TournoiComponent,TimerComponent, HostListenerDirective, SubMenuDirective, MoveInputDirective,],
    entryComponents: [],
    bootstrap: []
})
export class TabContainerModuleTempo { }