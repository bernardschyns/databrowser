import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridClassComponent } from './agGridClass.component';
import { AgGridModule } from 'ag-grid-angular';
import { NumberFormatterComponent } from '../agGridSharedComponents/numberFormatterComponent';
import { TimerFormatterComponent } from '../agGridSharedComponents/timerFormatterComponent';
import { NumericEditorComponent } from '../agGridSharedComponents/numericEditorComponent';
import { TextEditorComponent } from '../agGridSharedComponents/textEditorComponent';
import { BoolEditorComponent } from '../agGridSharedComponents/boolEditorComponent';
import { PauseEditorComponent } from '../agGridSharedComponents/pauseEditorComponent';


import { TextEditorPageComponent } from '../agGridSharedComponents/textEditorPageComponent';
import { AliasEditorComponent } from '../agGridSharedComponents/aliasEditorComponent';
import { DateEditorComponent } from '../agGridSharedComponents/dateEditorComponent';
import { PhotoEditorComponent } from '../agGridSharedComponents/photoEditorComponent';
import { PhotoEditorPageComponent } from '../agGridSharedComponents/photoEditorPageComponent';


import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MyDynamicModule } from '../../dataClass/myDynamicModule';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AgGridModule.withComponents([
      NumberFormatterComponent,
      TimerFormatterComponent,
      NumericEditorComponent,
      TextEditorComponent,
      BoolEditorComponent,
      PauseEditorComponent,
      TextEditorPageComponent,
      AliasEditorComponent,
      PhotoEditorComponent,
      PhotoEditorPageComponent,
      DateEditorComponent,
    ]),
    ButtonModule,
    SplitButtonModule,
    MyDynamicModule,
    AutoCompleteModule
  ],
  declarations: [
    AgGridClassComponent,
    NumberFormatterComponent,
    TimerFormatterComponent,
    NumericEditorComponent,
    TextEditorComponent,
    BoolEditorComponent,
    PauseEditorComponent,
    AliasEditorComponent,
    TextEditorPageComponent,
    PhotoEditorComponent,
    PhotoEditorPageComponent,
    DateEditorComponent,
  ],
  exports:
   [AgGridClassComponent,
    NumberFormatterComponent,
    TimerFormatterComponent,
    NumericEditorComponent,
    TextEditorComponent,
    BoolEditorComponent,
    TextEditorPageComponent,
    AliasEditorComponent,
    PhotoEditorComponent,
    PhotoEditorPageComponent,
    DateEditorComponent]
})
export class AgGridClassModule { }

