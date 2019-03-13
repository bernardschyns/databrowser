import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";
import {ICellEditorAngularComp} from "ag-grid-angular";
@Component({
    selector: 'app-text-editor-cell',
    template: `
      <textarea #i  [value]="params.value"  (keydown)="onKeyDown($event)" rows="10" cols="60"></textarea>
    `
  })
  export class TextEditorComponent implements AfterViewInit, ICellEditorAngularComp {
    @ViewChild('i') textInput;
   public  params;
    ngAfterViewInit() {
      setTimeout(() => {
        
        this.textInput.element.nativeElement.focus();
    });
    }
    isPopup(): boolean {
        return true;
    }
    agInit(params: any): void {
       if(typeof(params.value)=="object") {
           
        params.value=JSON.stringify(params.value)
       }
      this.params = params;
    }
    getValue() {
      return this.textInput.nativeElement.value;
    }

    onKeyDown(event) {
      if (event.keyCode === 39 || event.keyCode === 37) {
        event.stopPropagation();
      }
    }
  }