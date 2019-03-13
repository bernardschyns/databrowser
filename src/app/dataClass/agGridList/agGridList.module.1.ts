import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridListComponent } from './agGridList.component';
import { AgGridClassModule } from '../agGridClass/agGridClass.module';

import { AgGridModule } from 'ag-grid-angular';
import { ButtonModule } from 'primeng/button';
import { NumberFormatterComponent } from '../agGridSharedComponents/numberFormatterComponent';
import { TimerFormatterComponent } from '../agGridSharedComponents/timerFormatterComponent';
import { NumericEditorComponent } from '../agGridSharedComponents/numericEditorComponent';
import { TextEditorComponent } from '../agGridSharedComponents/textEditorComponent';
import { BoolEditorComponent } from '../agGridSharedComponents/boolEditorComponent';
import { PauseEditorComponent } from '../agGridSharedComponents/pauseEditorComponent';
import { AliasEditorComponent } from '../agGridSharedComponents/aliasEditorComponent';
import { DateEditorComponent } from '../agGridSharedComponents/dateEditorComponent';
import { PhotoEditorComponent } from '../agGridSharedComponents/photoEditorComponent';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AgGridClassModule,
    AgGridModule.withComponents([
      NumberFormatterComponent,
      TimerFormatterComponent,
      NumericEditorComponent,
      TextEditorComponent,
      BoolEditorComponent,
      PauseEditorComponent,
      AliasEditorComponent,
      PhotoEditorComponent,
      DateEditorComponent,
    ]),
    ButtonModule,
  ],
  declarations: [
     AgGridListComponent,
    ],
  exports: [
    AgGridListComponent
  ]
})
export class AgGridListModule {}
