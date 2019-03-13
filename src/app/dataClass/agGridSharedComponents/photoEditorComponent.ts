import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";

import {ICellEditorAngularComp} from "ag-grid-angular";

@Component({
    selector: 'editor-cell',
    template: `
        <div #container class="mood" tabindex="0" (keydown)="onKeyDown($event)">
            <img [src]="src" (click)="onClick(true)" [ngClass]="{'selected' : happy, 'default' : !happy}">
            <input id="Field20" name="Field20" type="file" (change)="photoChange($event)" class="field file" size="12" data-file-max-size="0"
            tabindex="5" />
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
export class PhotoEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    private params: any;

    @ViewChild('container', {read: ViewContainerRef}) public container;
    public happy: boolean = false;
    public src:any;

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        setTimeout(() => {
            this.container.element.nativeElement.focus();
        })
    }
    photoChange(event) {
        
        let myFiles = event.currentTarget.files
        let file = myFiles[0];
        this.params.value
            .delete().then(res => {
                res['photo'].upload(file).then(res => {
                    // setTimeout(()=>{
                    this.src = `http://localhost:8081${res['photo']['uri']}`
                    // },0)
                    //file is uploaded and entity is updated
                });
            })
    }
    agInit(params: any): void {
        
        this.params = params;
        this.src = `http://localhost:8081${params.value['uri']}`
        this.setHappy(params.value === "Happy");
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

    onClick(happy: boolean) {
        this.setHappy(happy);
        this.params.api.stopEditing();
    }

    onKeyDown(event): void {
        let key = event.which || event.keyCode;
        if (key == 37 ||  // left
            key == 39) {  // right
            this.toggleMood();
            event.stopPropagation();
        }
    }
}