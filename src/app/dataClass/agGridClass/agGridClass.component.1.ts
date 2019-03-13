// import * as $ from 'jquery';
// import 'jquery-ui-dist/jquery-ui';
import * as moment from 'moment';
import { ViewChildren, QueryList, Component, Inject, Injectable, ViewChild, ViewRef, ElementRef, SecurityContext, NgModuleFactory, AfterViewInit, OnInit, Query } from '@angular/core';
import { Observable, BehaviorSubject, Subject, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Wakanda } from '../../wakanda.service';
import { ApiService, AdminData } from '../../shared/api.service';
import { IndexService } from '../../shared/index.service';
import { AppComponent } from '../../app.component';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/components/table/table';
import { SelectItem } from 'primeng/api';
import { PanelMenu, MenuItem } from 'primeng/primeng'
import * as util from '../../shared/utilitaires';
import { NumberFormatterComponent } from '../agGridSharedComponents/numberFormatterComponent';
import { TimerFormatterComponent } from '../agGridSharedComponents/timerFormatterComponent';
import { NumericEditorComponent } from '../agGridSharedComponents/numericEditorComponent';
import { TextEditorComponent } from '../agGridSharedComponents/textEditorComponent';
import { BoolEditorComponent } from '../agGridSharedComponents/boolEditorComponent';
import { PauseEditorComponent } from '../agGridSharedComponents/pauseEditorComponent';
import { AliasEditorComponent } from '../agGridSharedComponents/aliasEditorComponent';
import { DateEditorComponent } from '../agGridSharedComponents/dateEditorComponent';
import { PhotoEditorComponent } from '../agGridSharedComponents/photoEditorComponent';
// import "ag-grid-enterprise";
@Component({
    selector: 'app-ag-grid',
    templateUrl: './agGridClass.component.html',
    styleUrls: ['./agGridClass.component.scss'],
    providers: [
        { provide: IndexService, useClass: IndexService },
    ]
})
export class AgGridClassComponent implements AfterViewInit, OnInit {
    public items: any[];
    public queryFilter: string = ""
    public IDToFind: number
    public adminData: AdminData;
    public paramsVisit = {}
    public agStyles = {}
    public gridStyles = {}
    public pageStyles = {}
    public freeVisit: boolean = true
    //variables pour agGrid
    public gridApi;
    public gridColumnApi;
    public columnDefs: any;
    public selectedColumns: any[];
    public totalRecords = 0;
    public selectedPageSize: number;
    public rowSelection;
    public rowModelType;
    public paginationPageSize = 100;
    public cacheOverflowSize;
    public maxConcurrentDatasourceRequests;
    public infiniteInitialRowCount;
    public maxBlocksInCache;
    public defaultColDef;
    private rowClassRules;
    private getRowHeight;
    //variable pour dataBrowser
    public dataClass;
    public entities: any[];
    public dataStoreUrl
    public selectedEntity;
    public myComponentLoaded: boolean = false
    //public agGridInited: boolean = false
    @ViewChild('modalMove') modalMove: ElementRef
    @ViewChild('ag') listGrid: ElementRef
    @ViewChild('page') pageGrid: ElementRef
    //pour implémenter un arrêt intelligent des plucks
    public unsubscribe1: Subject<void> = new Subject();
    public unsubscribe2: Subject<void> = new Subject();
    public unsubscribe3: Subject<void> = new Subject();
    public unsubscribe5: Subject<void> = new Subject();
    public template: string;
    public className: string;
    public liste: string;
    // public components: any;
    //pour implémenter la création de nouvelles fiches
    public nodeNumber: number
    public attributesToSelect: string[] = []
    public attributesToFetch: any[] = []
    public frameworkComponents = {
        numberFormatterComponent: NumberFormatterComponent,
        timerFormatterComponent: TimerFormatterComponent,
        numericEditorComponent: NumericEditorComponent,
        textEditorComponent: TextEditorComponent,
        boolEditorComponent: BoolEditorComponent,
        pauseEditorComponent: PauseEditorComponent,
        aliasEditorComponent: AliasEditorComponent,
        photoEditorComponent: PhotoEditorComponent,
        dateEditorComponent: DateEditorComponent,
    };
    // collection: any = {};
    public index: number = 0;
    public browserState: string
    constructor(
        public wakanda: Wakanda,
        public api: ApiService,
        public index$: IndexService,
        public core: AppComponent,
        public confirmationService: ConfirmationService
    ) { }
    private async saveOnBrowserOn(entities, niveau) {
        if (Array.isArray(entities)) {
            await this.saveOnBrowserOnArray(entities, niveau + 1)
            // .then(()=>{
            //     console.log("array",niveau)
            // })
        }
        else {
            await this.saveOnBrowserOnObject(entities, niveau + 1)
            // .then(()=>{
            //     console.log("object",niveau)
            // })
        }
    }
    private async saveOnBrowserOnArray(entities, niveau) {
        niveau
        entities
        // nous allons créer un tableau d'index à supprimer en temps voulu
        var indexToDelete: number[] = []
        entities
            .filter(async (entitySource, index) => {
                switch (entitySource['changed']) {
                    case "delete": {
                        await indexToDelete.push(index)
                        break
                    }
                }
                return entitySource['changed']
            })
            .map(async entitySource => {
                const entitySourceMisAJour = async (entitySource) => {
                    switch (niveau) {
                        case 1: {   
                            debugger                         
                            await this._saveEntity(this.index, entitySource, "update", false, "save")
                                .then(res => {
                                                                        
                                    console.log("object", niveau)
                                })
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                };
                switch (entitySource['changed']) {
                    case "add":
                    case "delete":
                    case "update": {
                        await this.saveOnBrowserOn(entitySource, niveau)
                        await entitySourceMisAJour(entitySource)
                        break
                    }
                }
            })
        // nous sommes à présent prêts pour mettre entities à jour
        // subtil, il est impératif de modifier ce tableau en commençant par le plus grand indice,
        // histoire de ne pas interférer avec les modifications suivantes
        indexToDelete.sort(function (a, b) {
            return b - a;
        });
        indexToDelete.map(async index => {
            await entities.splice(index, 1)
        })
    }
    private async saveOnBrowserOnObject(entitySource, niveau) {
        switch (niveau) {
            case 2: {
                await this.attributesToFetch.map(async (a, index) => {
                    switch (a.kind) {
                        case ('relatedEntities'):
                            {
                                if (entitySource[a.name]['entities'])
                                    await this.saveOnBrowserOn(entitySource[a.name]['entities'], niveau);
                                break
                            }
                    }
                })
                break
            }
            case 4: {   
                entitySource             
                switch (entitySource['changed']) {
                    case 'add': {  
                        Promise.all([                                    
                            this.wakanda.catalog['WakandaLogin'].create(entitySource._dataClass.name, entitySource.save())
                            .then(res => {
                                entitySource=res
                                debugger
                                console.log("object update", niveau)
                            })                     
                           ]
                            )                      
                        break
                    }
                    case 'update': {
                        Promise.all([this._saveEntity(this.index, entitySource, "update", false, "save"),
                        this._saveEntity(this.index, entitySource, "update", false, "save")
                            .then(() => {
                                console.log("object update", niveau)
                            })])

                        break
                    }
                    case 'delete': {
                        await entitySource.delete()
                            .then(() => {
                                console.log("object delete", niveau)
                            })
                        break
                    }
                }
                break
            }
            default: {
                throw "this will never happen, niveau est toujours égal à 2 ou 4";
            }
        }
    }
    /*
    getDatePicker = (() => {
        function Datepicker() { }
        Datepicker.prototype.init = function (params) {
            // (<any>jQuery(function ($) {
            // }));thi
            const $ = jQuery;

            this.eInput = document.createElement("input");
            this.eInput.value = params.value;

            $(this.eInput)['datepicker']({ dateFormat: "dd/mm/yy", changeMonth: true, changeYear: true });
        };
        Datepicker.prototype.getGui = function () {
            return this.eInput;
        };
        Datepicker.prototype.afterGuiAttached = function () {
            this.eInput.focus();
            this.eInput.select();
        };
        Datepicker.prototype.getValue = function () {
            return this.eInput.value;
        };
        Datepicker.prototype.destroy = function () { };
        Datepicker.prototype.isPopup = function () {
            return false;
        };
        return Datepicker;
    })
    */
    save(severity: string) {
        this.confirmationService.confirm({ message: "bonjour" });
    }
    ngOnInit() {
        //affectations pour agGrid
        this.getRowHeight = function (params) {
            return (params.data && params.data['changed'] && params.data['changed'] == "delete") ? 0 : 25
        };
        this.rowClassRules = {
            "sick-days-warning": function (params) {
                return (params.data && params.data['changed'] && params.data['changed'] == "delete") ? true : false
            },
            // "sick-days-breach": "data.qte > 8"
        };
        this.defaultColDef = {
            width: 150,
            editable: true,
            filter: "agTextColumnFilter"
        };
        this.rowSelection = "single";
        this.rowModelType = "infinite";
        this.cacheOverflowSize = 0;
        this.maxConcurrentDatasourceRequests = 1;
        this.infiniteInitialRowCount = 1000;
        this.maxBlocksInCache = 0;
        //affectations pour dataBrowser    
        setTimeout(() => {
            this.wakanda.browserStateStoreChanges.distinctUntilChanged().subscribe(
                async browserState => {
                    if (browserState == "save") {
                        await this.saveOnBrowserOn(this.entities, 0)
                        alert('tout enregistré');
                        this.gridApi.refreshCells()
                    }
                    this.browserState = browserState
                }
            )
            //todo revisiter ceci pour la visite guidée
            this.api.dataClassStoreChanges.takeUntil(this.unsubscribe1).distinctUntilChanged().subscribe(
                dataClass => {
                    this.IDToFind = (dataClass.IDToFind) ? (dataClass.IDToFind as number) : null
                    this.freeVisit = (dataClass.freeVisit == undefined) ? true : (dataClass.freeVisit as boolean)
                    let save = (dataClass.save) ? (dataClass.save as boolean) : false
                    let name = (dataClass.name) ? (dataClass.name as string) : ""
                    let template = (dataClass.template) ? (dataClass.template as string) : 'default'
                    this.liste = (dataClass.liste) ? (dataClass.liste as string) : 'default'
                    this.queryFilter = (dataClass.filter) ? dataClass.filter : ""
                    if (dataClass.name) {
                        this.className = (name as string);
                    }
                    if (this.className === undefined) {
                        this.className = (name as string);
                    }
                    if (dataClass.save) {
                        // this._saveEntity()
                        //this.api.setDataClass({name:this.className,save:false})
                    }
                    if (dataClass.filter) {
                        this.paramsVisit = { filter: dataClass.filter }
                    }
                    //recherche des fonctions attribuables à la dataClass
                    //todo rajouter le tableau des fonctions dans un set..., pour éviter un appel à Wakanda
                    let myMethods = this.wakanda.catalog[this.className].methods

                    this.items = []
                    Object.keys(myMethods)
                        .filter(key => myMethods[key].length > 0)
                        .map(key => {
                            myMethods[key]
                                .map(func => {
                                    this.items.push({ label: func, icon: "fa fa-angle-double-left", command: () => { this._toFacture(func); } })
                                })
                        })
                    this.unsubscribe1.next();
                    this.unsubscribe1.complete();

                }
            )
            this.api.dataStoreURLStore.pluck('url').takeUntil(this.unsubscribe2).distinctUntilChanged().subscribe(url => {
                this.dataStoreUrl = url
                this.unsubscribe2.next();
                this.unsubscribe2.complete();
            },
                (error) => console.error(error),
            )
            this.api.dataStoreURLStoreChanges.pluck('adminData').takeUntil(this.unsubscribe3).distinctUntilChanged().subscribe(adminData => {
                this.adminData = (adminData as AdminData)
                this.agStyles = { 'width.px': 1100, 'height.px': 550 }

                this.gridStyles = {
                    //'display': (this.adminData.isAdmin && this.freeVisit) ? 'block' : 'none'
                    'display': (this.freeVisit) ? 'block' : 'none'
                }
                this.pageStyles = {
                    //'display': (this.adminData.isAdmin && this.freeVisit) ? 'none' : 'block'
                    'display': (this.freeVisit) ? 'none' : 'block'
                }
                this.unsubscribe3.next();
                this.unsubscribe3.complete();
            })
            if (this.className) {
                this.api.dataListesStoreChanges.pluck(this.className).pluck(this.liste).takeUntil(this.unsubscribe5).subscribe(
                    dataColumnDef => {
                        if (dataColumnDef) {
                            this.selectedColumns = dataColumnDef['columnDef']
                            this.queryFilter = dataColumnDef['queryFilter']
                            //this.unsubscribe5.next()
                        }
                    })
            }
        }, 0)
    }
    ngAfterViewInit() {
        this.moveElement()
        // setTimeout(
        //     ()=>{
        //         this.agGridInited=true
        //     },2000 )
    }
    _toFacture(name) {
        "use strict";
        //this.catalog[this.className].toFacture(this.selectedEntitySource)
        var action = this.wakanda.catalog[this.className][name]

        var customAction = () => {
            action(this.selectedEntity).then(res => {

                this.api.setDataClass({ name: res['name'], template: res['template'], IDToFind: res['IDToFind'], freeVisit: res['freeVisit'] })
            })
        }
        var func = new Function("action", "return function " + name + "(){ action() };")(customAction); //we call it
        func();
    }
    public setMultiLines(index: number) {
        this.selectedEntity = (this.entities[index]) ? this.entities[index] : this.selectedEntity
        this.index$.setIndex(index)
        this.gridApi.forEachNode((node) => {
            if (node.rowIndex == index) {
                node.setSelected(true);
            }
        });
        //this.gridApi.setFocusedCell(index, "ID", null);
    }
    public first() {
        this.selectedEntity['changed'] = 'update';
        this._saveEntity();
        (this.index > 0) ? this.navigateModal("top") : {}
    }
    public last() {
        this.selectedEntity['changed'] = 'update';
        this._saveEntity(this.index, this.selectedEntity, "update", false);
        (this.index < this.nodeNumber - 1) ? this.navigateModal("bottom") : {}
    }
    public prev() {
        this.selectedEntity['changed'] = 'update';
        this._saveEntity(this.index, this.selectedEntity, "update", false);
        (this.index > 0) ? this.navigateModal("up") : {}
    }
    public next() {
        this.selectedEntity['changed'] = 'update';
        this._saveEntity(this.index, this.selectedEntity, "upadate", false);
        (this.index < this.nodeNumber - 1) ? this.navigateModal("down") : {}
    }
    public onBack() {
        this.selectedEntity['changed'] = 'update'
        this._saveEntity(this.index, this.selectedEntity, "update", true)
    }
    public async _saveEntity(index?, nodeData?, mode?, toggle?, context?) {
        mode = mode ? mode : "update"
        context = context ? context : "normal"
        nodeData = nodeData ? nodeData : this.selectedEntity;
        toggle = toggle ? toggle : false
        index = index ? index : this.index
        //var rowNode = this.gridApi.getSelectedNodes()[0]
        function myToggle(x: any) {
            if (x.style.display === "none") {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }
        }
        if (context == "save") {
            return await this.wakanda._saveSecure(nodeData)
        }
        else {
            await this.wakanda._saveSecure(nodeData).then(
                res => {
                    if (context == "save") {
                        
                        return res
                    }
                    else {
                        switch (mode) {
                            case "update": {
                                this.gridApi
                                this.entities[index] = res
                                this.entities[index]['changed'] = (this.browserState == "offline") ? this.entities[index]['changed'] : undefined
                                this.gridApi.updateRowData({
                                    update: [res],
                                    addIndex: index
                                });
                                //rowNode.updateData(res)
                                if (toggle) {
                                    myToggle(this.pageGrid.nativeElement)
                                    myToggle(this.listGrid.nativeElement)
                                }
                                break
                            }
                            case "add": {
                                this.nodeNumber++
                                this.entities.splice(index, 0, res);
                                var res = this.gridApi.updateRowData({
                                    add: [res],
                                    addIndex: index
                                });
                                this.gridApi.forEachNode((node) => {
                                    if (node.rowIndex == index) {
                                        node.setSelected(true);
                                    }
                                    else {
                                        node.setSelected(false);
                                    }
                                });
                                break
                            }
                            default:
                                throw "this will never happen, navigation is always on of the 4 keys above";
                        }

                        this.core._setGrwolMsg({
                            severity: (this.browserState == "offline") ? 'warn' : 'success',
                            summary: 'GridClass - Save data',
                            detail: 'GridClass saved successful!'
                        });
                    }
                }, err => {

                    this.core._setGrwolMsg({
                        severity: 'error',
                        summary: 'GridClass - Save data',
                        detail: err
                    });
                })
        }

    }
    public navigateModal(to) {
        let myCell = this.gridApi.getFocusedCell();
        let params = {};
        params['previousCellDef'] = myCell;
        switch (to) {
            case "top": {
                params['target'] = 0
                params['key'] = 38
                break
            }
            case "up": {
                params['target'] = this.index - 1
                params['key'] = 38
                break
            }
            case "down": {
                params['target'] = this.index + 1
                params['key'] = 40
                break
            }
            case "bottom": {
                params['target'] = this.nodeNumber - 1
                params['key'] = 40
                break
            }
            default:
                throw "this will never happen, navigation is always on of the 4 keys above";
        }
        this.navigateToNextCell(params);
        (to == "down") ? myCell['rowIndex']++ : myCell['rowIndex']--;
        let colId = myCell['column']['colId'];
        this.gridApi.setFocusedCell(params['target'], colId, null);
    }
    navigateToNextCell = (params) => {
        let target
        var previousCell = params.previousCellDef;
        var suggestedNextCell = params.nextCellDef;
        var KEY_UP = 38;
        var KEY_DOWN = 40;
        var KEY_LEFT = 37;
        var KEY_RIGHT = 39;
        switch (params.key) {
            case KEY_DOWN:
                target = (params['target'] !== undefined) ? params['target'] : previousCell['rowIndex'] + 1
                if (target <= this.nodeNumber) {
                    this.setMultiLines(target)
                    previousCell = params.previousCellDef;
                }
                return suggestedNextCell;
            case KEY_UP:
                target = (params['target'] !== undefined) ? params['target'] : previousCell['rowIndex'] - 1
                if (target >= 0) {
                    this.setMultiLines(target)
                    previousCell = params.previousCellDef
                }
                return suggestedNextCell;
            case KEY_LEFT:
            case KEY_RIGHT:
                return suggestedNextCell;
            default:
                throw "this will never happen, navigation is always on of the 4 keys above";
        }
    }
    _loadDataClass(paramsAgGrid) {


        //jdo pour intégrer dans sidebar
        if (this.className !== '') {
            this.dataClass = this.wakanda.catalog[this.className]
            this.dataClass.attributes.map(attribute => {
                switch (attribute.kind) {
                    case ('relatedEntity'):
                    case ('relatedEntities'): {
                        this.attributesToSelect.push(attribute.name)
                        this.attributesToFetch.push({ name: attribute.name, kind: attribute.kind })
                        break
                    }
                }
            })
            const callSearchApi = paramsAgGrid => {
                setTimeout(this.searchAgGridData(paramsAgGrid), 0);
            }
            let timeout = null;
            var dataSource = {
                rowCount: null,
                getRows: paramsAgGrid => {
                    timeout = throttle(
                        () => callSearchApi(paramsAgGrid), 500, timeout
                    )
                },
            };
            paramsAgGrid.api.setDatasource(dataSource);
        }
    }
    public searchAgGridData(paramsAgGrid): (...args) => void {
        return () => {
            paramsAgGrid.paginationPageSize = this.paginationPageSize;
            this.queryFilter = (this.queryFilter) ? this.queryFilter : ""
            let myParams = (this.adminData.isAdmin) ? util.mapFilterSorter(paramsAgGrid, this.queryFilter) : this.paramsVisit;

            var lastRow = -1;
            myParams['select'] = (this.attributesToSelect.length >= 0) ? this.attributesToSelect : null
            var myObservable = this._searchData(myParams);
            myObservable.subscribe(data => {
                //todo gérer startRow et endRow pour charger
                this.entities = data['entities'];
                if (this.entities.length > 0) {
                    this.nodeNumber = this.entities.length
                    this.index = 0
                    this.selectedEntity = this.entities[this.index]
                    this.setMultiLines(this.index);
                    this.myComponentLoaded = true
                }
                this.totalRecords = data['_count'];
                lastRow = this.totalRecords < paramsAgGrid.endRow ? this.totalRecords : -1;
                this.rowModelType = "clientSide"
                paramsAgGrid.successCallback(this.entities, lastRow);
                this.sizeToFit();
                //identifions un éventuel ID à détecter dans le tableau
                //todo et s'il ne devait pas être dans le premier batch de 100 entities détectées
                if (this.IDToFind) {
                    let myEntity = this.entities.find(entity => entity.ID === this.IDToFind)
                    this.index = this.entities.indexOf(myEntity)
                    this.index = (this.index !== -1) ? this.index : 0
                }
            }, err => {
                this.core._setGrwolMsg({
                    severity: 'error',
                    summary: 'Searching data failed',
                    detail: 'Error: ' + err
                });
            });
        };
    }

    _searchData(params) {
        if (this.dataClass) {

            return Observable.fromPromise(this.dataClass.query(
                params
            ))
        }
    }
    loadDataLazy(paramsAgGrid) {
        if (!this.dataClass) {
            this._loadDataClass(paramsAgGrid);
        } else {
            //this._searchData(params);
        }
    }
    public _configEmulNavigatorToTrue() {
        window['config']['emulNavigator'] = true
    }
    moveElement() {
        // Make the DIV element draggable:

        //dragElement(this.modalMove.nativeElement);

        function dragElement(elmnt) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            // otherwise, move the DIV from anywhere inside the DIV: 
            elmnt.onmousedown = dragMouseDown;


            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                // stop moving when mouse button is released:
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
    }
    _deleteEntity() {

        let selectedEntity = this.entities[this.index]
        //let selectedEntity = this.gridApi.getSelectedRows()[0];
        var rowNode = this.gridApi.getSelectedNodes()[0]
        if (selectedEntity) {
            const gridListRefreshOnDelete = () => {
                //this.gridApi.updateRowData({ remove: [selectedEntity] });
                this.nodeNumber--;
                this.entities.splice(this.index, 1);
                this.gridApi.refreshInfiniteCache();
                //rowNode.updateData(res)

                this.index = 0;
                setTimeout(() => {
                    this.setMultiLines(this.index);
                }, 0);
                //this.gridApi.refreshInfiniteCache();
                this.core._setGrwolMsg({
                    severity: 'success',
                    summary: 'GridClass Remove data',
                    detail: 'GridClass Data removed successfully!'
                });
            };
            this.confirmationService.confirm({
                message: 'Are you sure that you want to delete this entity?',
                accept: () => {

                    if (this.browserState == "offline") {
                        selectedEntity['changed'] = 'delete'
                        //rowNode.setRowHeight(0)
                        rowNode.setDataValue('deleted', true)
                        //this.entitiestoRemove.push(selectedEntity)
                        //this.entities.splice(this.index,1);
                        //gridListRefreshOnDelete()
                    }
                    else {
                        selectedEntity.delete().then(
                            gridListRefreshOnDelete,
                            err => {
                                this.core._setGrwolMsg({
                                    severity: 'error',
                                    summary: 'GridClass Remove data',
                                    detail: 'GridClass Could not remove data!'
                                });
                            }
                        );
                    }
                },
                reject: () => { },
            });
        } else {
            this.core._setGrwolMsg({
                severity: 'error',
                summary: 'GridClass Remove data',
                detail: 'GridClass No entity selected!'
            });
        }
    }
    public _deleteEntity1() {
        //todo problème avec les relatedEntities qui seraient pas remplies comme il fautsae
        let selectedEntities = this.gridApi.getSelectedRows()
        let selectedPromises = selectedEntities
            .map(entity => {

                return entity.delete()
            })
        if (selectedEntities) {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to delete this entity?',
                accept: () => {
                    Observable.fromPromise(Promise.all(selectedPromises)).subscribe(
                        res => {
                            this.index = 0
                            this.setMultiLines(this.index)
                            this.gridApi.refreshInfiniteCache();
                            this.core._setGrwolMsg({
                                severity: (this.browserState == "offline") ? 'warn' : 'success',
                                summary: 'Remove data',
                                detail: 'Data removed successfully!'
                            });
                        },
                        err => {
                            this.core._setGrwolMsg({
                                severity: 'error',
                                summary: 'Remove data',
                                detail: 'Could not remove data!'
                            });
                        }
                    );
                },
                reject: () => { },
            });
        } else {
            this.core._setGrwolMsg({
                severity: 'error',
                summary: 'Remove data',
                detail: 'No entity selected!'
            });
        }
    }
    _addNode(index) {
        this.gridApi.forEachNode(node => {
            if (node.rowIndex >= index) {
                node.data.ordre = node.data.ordre + 1
                node.data['changed'] = 'update'
            }
            this.gridApi.refreshCells()
        })
    }
    _arrangeNode() {
        this.gridApi.forEachNode((node, i) => {
            node.data.ordre = i
            node.data['changed'] = 'update'
            this.gridApi.refreshCells()
        })
    }
    public _add() {
        let myIndex = (this.gridApi.getSelectedNodes()[0]) ? this.gridApi.getSelectedNodes()[0].rowIndex : 0
        this.createNewRowData(myIndex)
        this._addNode(myIndex)
        //this._arrangeNode()
    }
    createNewRowData = myIndex => {

        if (!newData) {
            var newData = this.wakanda.catalog['WakandaLogin'].create(this.className, null)
                .then(newData => {
                    newData['changed'] = 'update'
                    return this._saveEntity(myIndex, newData, "add")
                })
        }
        return Promise.resolve(newData);
    }
    onCellValueChanged(params) {
        if (params.oldValue !== params.value) {
            var rowNode = params.api.getSelectedNodes()[0]
            params.data['changed'] = 'update'
            this.selectedEntity['changed'] = 'update'
            this._saveEntity(params.rowIndex, params.data)
        }
    }
    onSelectionChanged($event) {
        var selectedNodes = this.gridApi.getSelectedNodes();
        if (selectedNodes.length > 0) {
            this.index = selectedNodes[0]['rowIndex']
        }
    }
    onRowDoubleClicked($event) {
    }
    onCellContextMenu($event) {
        function myToggle(x: any) {
            if (x.style.display === "none") {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }
        }
        myToggle(this.pageGrid.nativeElement)
        myToggle(this.listGrid.nativeElement)
        this.setMultiLines($event.rowIndex);
    }


    sizeToFit() {
        this.gridApi.sizeColumnsToFit();
    }
    autoSizeAll() {
        var allColumnIds = [];
        this.gridColumnApi.getAllColumns().forEach(function (column) {
            allColumnIds.push(column.colId);
        });
        this.gridColumnApi.autoSizeColumns(allColumnIds);
    }
    countryCellRenderer = (params => {
        let flag = ''
        let $url = this.dataStoreUrl
        if (params.value) flag = `<img border='0'  height='30' style='margin-bottom: 2px' src="${$url}${params.value.uri}">`;
        return flag
    })
    onGridReady(paramsAgGrid) {

        this.gridApi = paramsAgGrid.api;
        this.gridColumnApi = paramsAgGrid.columnApi;
        // let myParams = {
        //     agGrid: params
        // }
        this.loadDataLazy(paramsAgGrid)
    }
}
function throttle(func, delay, watch) {
    if (watch) {
        clearTimeout(watch)
    }
    return setTimeout(func, delay)
}