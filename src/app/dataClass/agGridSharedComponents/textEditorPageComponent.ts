import { Input, OnInit, AfterViewInit, Component, ViewChild, ViewContainerRef } from "@angular/core";
import { Observable, Subject } from 'rxjs/Rx';
export interface DynamicComposant {
  close: Subject<boolean>;
}
@Component({
  selector: 'app-text-editor-cell',
  template: `
      <textarea style="position:absolute;z-index:10 ;left:40px" #i  [value]="entity[model]"  (keydown)="onKeyDown($event)" [(ngModel)]="entity[model]" rows="10" cols="60"></textarea>
    `
})
export class TextEditorPageComponent implements OnInit,
 AfterViewInit, DynamicComposant 
 {
  close = new Subject<boolean>();
  @ViewChild('i') textInput;
  @Input() entity;
  @Input() model;
  @Input() value;
  public opened: boolean = false
  ngAfterViewInit() {
    this.textInput.nativeElement.focus();
  }
  ngOnInit() {
    this.agInit()
  }
  agInit() {
    if (typeof (this.entity[this.model]) == "object") {
      setTimeout(() => {
        this.entity[this.model] = JSON.stringify(this.entity[this.model])
      }, 0)
    }
  }
  getValue() {  }
  onKeyDown(event) {
    
    if (event.keyCode === 27 || event.keyCode === 9) {
      this.close.next(event.currentTarget.value)
      this.value=event.currentTarget.value

    }
    if (event.keyCode === 39 || event.keyCode === 37) {
      event.stopPropagation();
    }
  }
  ngDynamicComposant() {
  }
}