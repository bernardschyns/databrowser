import { Output, EventEmitter, Input, OnInit, AfterViewInit, Component, ViewChild, ViewContainerRef } from "@angular/core";
import { Observable, Subject } from 'rxjs/Rx';
import { ValueFormatterService } from "ag-grid";
export interface DynamicComposant {
    close: Subject<any>;
}
@Component({
    selector: 'photo-editor-cell',
    template: `
        <div  #container class="mood" tabindex="0" (keydown)="onKeyDown($event)">
            <img [src]="src" name="Field20"  [ngClass]="{'selected' : happy, 'default' : !happy}">
            <input id="Field20" name="Field20" type="file" (change)="photoChange($event)" class="field file" size="12" data-file-max-size="0"
            tabindex="5" />
            <input type="text"(paste) = "copied($event)">
        </div>
    `,
    styles: [`
        .mood {
            border-radius: 15px;
            border: 1px solid grey;
            background: #e6e6e6;
            padding: 15px;
            text-align: center;
            display: inline-block;
            outline: none
        }

        .default {
            padding-left: 10px;
            padding-right: 10px;
            border: 1px solid transparent;
            padding: 4px;
        }

        .selected {
            padding-left: 10px;
            padding-right: 10px;
            border: 1px solid lightgreen;
            padding: 4px;
        }
    `]
})
export class PhotoEditorPageComponent implements OnInit,
AfterViewInit, DynamicComposant
  {
    private params: any;
    @Input() entity;
    @Input() model;
    @Input() src: any;
    close = new Subject<any>();
    @ViewChild('container', { read: ViewContainerRef }) public container;
    public happy: boolean = false;

    public opened: boolean = false
    copied($event){
        let file =  event['clipboardData'].files[0]
        this.entity[this.model]
            .delete().then(res => {
                res['photo'].upload(file).then(res => {
                    // setTimeout(()=>{
                    this.src = `http://localhost:8081${res['photo']['uri']}`
                    // },0)
                    //file is uploaded and entity is updated

                });
            })
    }
    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        setTimeout(() => {
            this.container.element.nativeElement.focus();
        })
    }
    photoChange(event) {

        let myFiles = event.currentTarget.files
        let file = myFiles[0];
        this.entity[this.model]
            .delete().then(res => {
                res['photo'].upload(file).then(res => {
                    // setTimeout(()=>{
                    this.src = `http://localhost:8081${res['photo']['uri']}`
                    // },0)
                    //file is uploaded and entity is updated

                });
            })
    }
    ngOnInit() {
        
        this.agInit()
    }
    agInit(): void {
        // this.params = params;
        // this.src = `http://localhost:8081${params.value['uri']}`
        // this.setHappy(params.value === "Happy");
    }

    getValue(): any {

        return this.params.value
    }

    isPopup(): boolean {
        return true;
    }

    setHappy(happy: boolean): void {
        this.happy = happy;
    }

    toggleMood(): void {
        this.setHappy(!this.happy);
    }

    onKeyDown(event): void {
        if (event.keyCode === 27 || event.keyCode === 9) {

            //this.entity[this.model]
            this.close.next({ src: this.src })
        }
        let key = event.which || event.keyCode;
        if (key == 37 ||  // left
            key == 39) {  // right
            this.toggleMood();
            event.stopPropagation();
        }
    }
    ngDynamicComposant() {
    }
}