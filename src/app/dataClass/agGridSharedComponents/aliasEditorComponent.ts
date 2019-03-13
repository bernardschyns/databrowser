import { OnInit, AfterViewInit, ViewRef, ElementRef, Component, ViewChild, ViewContainerRef } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";
import { AgGridClassComponent } from '../agGridClass/agGridClass.component';
import { IDataListes, IDataClasses, IDataClass2, ApiService, AdminData } from '../../shared/api.service';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/observable/of'
import { Wakanda } from '../../wakanda.service';
@Component({
    selector: 'app-alias-editor-cell',
    template: `
        <p-autoComplete #i data-dataClass="Company" pInputText [(ngModel)]="entity[relatedToExtend]" [field]="attributeToExtend" [suggestions]="selectData"
            (completeMethod)="filterBrands($event)" [size]="30" [minLength]="1" [placeholder]="entity[colId]"
            [dropdown]="true" [ngModelOptions]="{standalone: true}">
            <ng-template let-brand pTemplate="item">
                <div class="ui-helper-clearfix" style="border-bottom:1px solid #D5D5D5">

                    <div style="font-size:18px;float:right;margin:10px 10px 0 0">{{brand[attributeToExtend]}}</div>
                </div>
            </ng-template>
            <label for="Field9">Country</label>
        </p-autoComplete>
    `
})
export class AliasEditorComponent implements OnInit, AfterViewInit, ICellEditorAngularComp {
    @ViewChild('i') textInput;
    public unsubscribe1: Subject<void> = new Subject();
    public unsubscribe2: Subject<void> = new Subject();
    public unsubscribe3: Subject<void> = new Subject();
    public unsubscribe4: Subject<void> = new Subject();
    public unsubscribe5: Subject<void> = new Subject();
    public dataClassPluck: string
    public dataClass: any = {};
    public className: string;
    public templateName: string;
    public src
    public queryFilter: string
    public queryString: string
    public attributeAutocomplete: "string"
    public selectData = [];
    public params;
    public entity: any
    public colId: string
    public attributeToExtend: string
    public classToExtend: string
    public relatedToExtend: string
    public index: number


    constructor(
        public api: ApiService,
        public wakanda: Wakanda,
    ) {}
    filterBrands(event) {
        function throttle(func, delay, watch) {
            if (watch) {
                clearTimeout(watch)
            }
            return setTimeout(func, delay)
        }
        this.queryString = event.query.toLowerCase()
        this.api.dataClassesStoreChanges.pluck(this.classToExtend).pluck(this.classToExtend).pluck('queryFilter').subscribe(
            queryFilter => {
                let myQueryFilter = queryFilter as string
                //this.queryFilter=myQueryFilter
                this.queryFilter = (myQueryFilter !== "") ? myQueryFilter : `${this.attributeToExtend}== :1`;
                this.dataClass = this.wakanda.catalog[this.classToExtend];
                let entity = {};
                let timeout = null;
                timeout = throttle(() =>
                Observable.fromPromise(
                    this.dataClass.query({ filter: this.queryFilter, params: [`*${this.queryString}*`], orderBy: this.attributeToExtend, pageSize: 100 }))
                    .subscribe(
                        res => {
                            if (res['entities']) {
                                this.selectData = res['entities'];
                            }
                        }), 500, timeout)
            }
        )
    }
    ngOnInit() {}
    ngAfterViewInit() {
        setTimeout(() => {
            //this.textInput.nativeElement.focus();
        });
    }
    isPopup(): boolean {
        return true;
    }
    agInit(paramsAgGrid: any): void {           
                this.entity = paramsAgGrid.node.data
                this.index = paramsAgGrid.index
                
                this.className = paramsAgGrid.node.data._dataClass.name
                this.colId = paramsAgGrid.column.colId
                let words = this.colId.split('_');
                this.attributeToExtend = words[0]
                this.classToExtend = words[1]
                let myAttribute = this.wakanda.catalog[this.className].attributes.find(
                    attribute => {
                        return attribute.type == words[1]
                    })

                this.relatedToExtend = myAttribute.name

        if (typeof (paramsAgGrid.value) == "object") {
            paramsAgGrid.value = JSON.stringify(paramsAgGrid.value)
        }
    }
    getValue() {
        this.entity[this.relatedToExtend] = this.textInput.value
        this.entity[this.relatedToExtend]['changed'] = this.entity[this.relatedToExtend]?'update':undefined
        return this.textInput.value[this.attributeToExtend];
    }
    onKeyDown(event) {
        if (event.keyCode === 39 || event.keyCode === 37) {
            event.stopPropagation();
        }
    }
}