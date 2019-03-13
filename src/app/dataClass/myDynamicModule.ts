import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MyComponent } from './myDynamicComponent';
//todo on pourrait tester de supprimer ce module et d'importer directement mycomponent dans aggridclass.component
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule
  ],
  declarations: [
      MyComponent,
    ],
  exports: [MyComponent]
})
export class MyDynamicModule {}
