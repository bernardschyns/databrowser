import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";
import {ICellEditorAngularComp} from "ag-grid-angular";
import * as moment from 'moment';

@Component({
    selector: 'app-text-editor-cell',
    template: `
    <input #i type="date" [value]="params.value"  (keydown)="onKeyDown($event)"/>
    `
  })
  export class DateEditorComponent implements AfterViewInit, ICellEditorAngularComp {
    @ViewChild('i', {read: ViewContainerRef}) public container;

   public  params;
    ngAfterViewInit() {
      setTimeout(() => {
        this.container.element.nativeElement.focus();
      });
    }
    isPopup(): boolean {
        return true;
    }
    agInit(params: any): void {
      this.params = params;
    }
    getValue() {
      return moment(new Date(this.container.element.nativeElement.value)).format('DD/MM/YYYY');
    } 
    onKeyDown(event) {
      if (event.keyCode === 39 || event.keyCode === 37) {
        event.stopPropagation();
      }
    }
  }