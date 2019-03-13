import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule,ButtonModule,InputTextModule, DropdownModule, DataListModule, GrowlModule, Message, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
@NgModule({
    imports: [
         RouterModule,
          CommonModule,
          AutoCompleteModule,
          FormsModule,
          ButtonModule,
          DataListModule],
    declarations: [ SidebarComponent ],
    exports: [ SidebarComponent ]
})
export class SidebarModule {}
