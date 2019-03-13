import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { AppComponent } from '../../app.component';
@Component({
    selector: 'square-cell',
    template: `<input type='checkbox' (change)="handleCheckboxChange($event)"  [checked]="checked" />`
})
export class BoolEditorComponent implements ICellRendererAngularComp {
    public params: any;
    public checked: boolean;
    constructor(
        public core: AppComponent,
    ){}
    agInit(params: any): void {
        var monField = params.colDef.field;
        this.checked = (params.data && params.data[monField]) ? true : false
        this.params = params;
    }
    public handleCheckboxChange(event): void {
        
        var monNode = this.params.node.rowIndex;
        var monField = this.params.colDef.field;
        this.params.node.data[monField] = this.params.data[monField] ? false : true
        this.params.data.save().then(
            res => {
                this.core._setGrwolMsg({
                    severity: 'success',
                    summary: 'Save data',
                    detail: 'BoolEditorComponent saved successful!'
                });
            },
            err => {
                this.core._setGrwolMsg({
                    severity: 'error',
                    summary: 'Save data',
                    detail: 'Could not save data!'
                })
            }
        )
    }
    refresh(): boolean {
        return false;
    }
}