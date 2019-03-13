import { Input, ViewChildren, QueryList, Component, Inject, Injectable, ViewChild, ViewRef, ElementRef, SecurityContext, NgModuleFactory, AfterViewInit, OnInit, Query, OnDestroy } from '@angular/core';
import { Observable, Subject, interval, defer, BehaviorSubject, Subscription } from 'rxjs';
import { mapTo, reduce, take, tap, filter, map, share, withLatestFrom } from 'rxjs/operators'
import { Wakanda } from '../../wakanda.service';
import { ApiService, AdminData } from '../../shared/api.service';
import { IndexService } from '../../shared/index.service';
import { AppComponent } from '../../app.component';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/components/table/table';
import { SelectItem } from 'primeng/api';
import * as util from '../../shared/utilitaires';
import { RowNode } from "ag-grid";
import { NumberFormatterComponent } from '../agGridSharedComponents/numberFormatterComponent';
import { TimerFormatterComponent } from '../agGridSharedComponents/timerFormatterComponent';
import { NumericEditorComponent } from '../agGridSharedComponents/numericEditorComponent';
import { TextEditorComponent } from '../agGridSharedComponents/textEditorComponent';
import { BoolEditorComponent } from '../agGridSharedComponents/boolEditorComponent';
import { PauseEditorComponent } from '../agGridSharedComponents/pauseEditorComponent';
import { AliasEditorComponent } from '../agGridSharedComponents/aliasEditorComponent';
import { DateEditorComponent } from '../agGridSharedComponents/dateEditorComponent';
import { PhotoEditorComponent } from '../agGridSharedComponents/photoEditorComponent';
import { AgGridClassComponent } from '../agGridClass/agGridClass.component';
@Component({
    selector: 'app-ag-grid-list',
    templateUrl: './agGridList.component.html',
    styleUrls: ['./agGridList.component.scss'],
    providers: [
        { provide: IndexService, useClass: IndexService },

    ]
})
export class AgGridListComponent implements OnInit, OnDestroy {
    @Input() ready: boolean
    public adminData: AdminData;
    agStyles = {}
    gridStyles = {}
    pageStyles = {}
    //variables pour agGrid
    public gridApi;
    public gridColumnApi;
    public columnDefs: any = {}
    public totalRecords = 0;
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
    public entitiestoRemove: any[] = [];
    public dataStoreUrl
    public selectedEntitySource;
    public myComponentLoaded: boolean = false
    //public agGridInited: boolean = false
    @ViewChild('ag') listGrid: ElementRef
    @ViewChild('page') pageGrid: ElementRef
    //pour implémenter un arrêt intelligent des plucks
    public unsubscribe1: Subject<void> = new Subject();
    public unsubscribe2: Subject<void> = new Subject();
    public unsubscribe3: Subject<void> = new Subject();
    public unsubscribe5: Subject<void> = new Subject();
    public templateName: string;
    public className: string;
    public liste: string;
    public source: string;
    public agGridListStyle: any
    public rowData: any = {}
    public collection: string
    public collectionClass: string = ''
    public nodeNumber: number
    public width: number
    //public gridLoaded:boolean = false
    public agGridListTotal: number = 0
    public agGridListTVA: number = 0
    public agGridListTotalTVA: number = 0
    public totalAttribute: boolean = false
    public attributesToFetch: string[] = []
    // collection: any = {};
    index: number = 0;
    indexGridClass: number;
    // relatifs à la fonction timer
    public timerAttributeToExtend: string
    public timerClassToExtend: string
    public timerRelatedToExtend: string
    public timerRefCol: string
    public timerRefColValue: string = ""

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
    public browserState: string
    constructor(
        public wakanda: Wakanda,
        public api: ApiService,
        public core: AppComponent,
        public confirmationService: ConfirmationService,
        public el: ElementRef,
        private agGridClassComponent: AgGridClassComponent,
    ) {
        //affectations pour agGrid
        this.getRowHeight = function (params) {
            return (params.data['changed'] && params.data['changed'] == "delete") ? 0 : 25
        };
        this.rowClassRules = {
            "sick-days-warning": function (params) {
                return (params.data['changed'] && params.data['changed'] == "delete") ? true : false
            },
            // "sick-days-breach": "data.qte > 8"
        };
        this.defaultColDef = { editable: true };
        this.rowSelection = "single";
        this.rowModelType = "infinite";
        this.cacheOverflowSize = 0;
        this.maxConcurrentDatasourceRequests = 1;
        this.infiniteInitialRowCount = 1000;
        this.maxBlocksInCache = 0;
    }
    ngOnDestroy() {

        //on doit pauser les timers autres que monNode dans toute la base
        // à intégrer dans une fonction unique avec le même code de aggridlist
        var allColumnIds = [];
        let myCounterDestroy = 0
        this.gridColumnApi.getAllColumns().forEach(function (column) {
            allColumnIds.push(column.colId);
        });
        this.timerRefCol = allColumnIds.find(column => column.includes("timerStarted"))
        if (this.timerRefCol) {
            this.agGridClassComponent.entities
                .map(entitySource => {
                    if (entitySource[this.collection]['entities']) {
                        entitySource[this.collection]['entities']
                            .map((entity, index) => {

                                switch (entity['timerStarted']) {
                                    case false: {
                                        break
                                    }
                                    case true: {
                                        entity['timerDateStopped'] = new Date()
                                        entity['changed'] = 'update'
                                        myCounterDestroy++
                                        this._saveEntity(index, entity)

                                        break
                                    }
                                    default:
                                        throw "this will never happen, timerStarted est toujours vrai ou faux";
                                }
                            })
                        let message = `vous avez ${myCounterDestroy} timer(s) de tâche qui tourne(nt) pour vous offline`
                        this.confirmationService.confirm({ acceptVisible: false, rejectVisible: false, message: message });
                    }
                })
        }
    }
    ngOnInit() {
        this.wakanda.browserStateStoreChanges.distinctUntilChanged().subscribe(
            browserState => {
                this.browserState = browserState
            }
        )
        this.api.dataClassStoreChanges.takeUntil(this.unsubscribe1).distinctUntilChanged().subscribe(
            dataClass => {
                this.className = (dataClass.name) ? (dataClass.name as string) : ""
                this.templateName = (dataClass.template) ? (dataClass.template as string) : 'default'
                this.unsubscribe1.next();
                this.unsubscribe1.complete();

            }
        )
        this.api.dataStoreURLStore.pluck('url').takeUntil(this.unsubscribe2).distinctUntilChanged().subscribe(url => {
            this.dataStoreUrl = url
            this.unsubscribe2.next();
            this.unsubscribe2.complete();

        })
        setTimeout(() => {
            this.agGridClassComponent.index$.indexStoreChanges
                .subscribe(
                    indexGridClass => {
                        this.indexGridClass = indexGridClass as number
                        //affectations pour entity
                        this.selectedEntitySource = this.agGridClassComponent.entities[this.indexGridClass]
                        this.selectedEntitySource['_dataClass'].attributes.map(attribute => {
                            switch (attribute.kind) {
                                case ('relatedEntity'):
                                case ('relatedEntities'): {
                                    this.attributesToFetch.push(attribute.name)
                                    break
                                }
                            }
                            if (attribute.name == "total") {
                                this.totalAttribute = true
                            }
                        })
                        this.collection = this.el.nativeElement.attributes['data-collection'].value
                        this.liste = this.el.nativeElement.attributes['data-dataliste'].value
                        this.source = this.el.nativeElement.attributes['data-source'].value
                        this.collectionClass = this.el.nativeElement.attributes['data-dataclass'].value
                        setTimeout(() => {

                            this.entities = this.rowData[this.collectionClass] =
                                this.selectedEntitySource[this.collection]["entities"]
                                    .sort(function (a, b) {
                                        return a.ordre - b.ordre;
                                    });
                            if (this.entities.length > 0) {
                                this.nodeNumber = this.entities.length
                                this.index = 0
                                this.setMultiLines(this.index);
                            }

                        }, 0)
                        this.api.dataListesStoreChanges.pluck(this.collectionClass).pluck(this.liste).takeUntil(this.unsubscribe5).subscribe(
                            dataColumnDef => {

                                this.columnDefs[this.collectionClass] = dataColumnDef['columnDef']
                                this.width = dataColumnDef['width']
                                this.agGridListStyle = {
                                    'width.px': this.width,
                                    'height.px': 200,
                                };
                                this.unsubscribe5.next()
                                this.unsubscribe5.complete()

                            })
                    })
        }, 0)

    }
    public first() {
        //this._saveEntity();
        (this.index > 0) ? this.navigateModal("top") : {}
    }
    public last() {
        //this._saveEntity();
        (this.index < this.nodeNumber - 1) ? this.navigateModal("bottom") : {}
    }
    public prev() {
        //this._saveEntity();
        (this.index > 0) ? this.navigateModal("up") : {}
    }
    public next() {
        //this._saveEntity();
        (this.index < this.nodeNumber - 1) ? this.navigateModal("down") : {}
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
        //todo mieux gérer ceci
        // let colId = myCell['column']['colId'];
        // this.gridApi.setFocusedCell(params['target'], colId, null);
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
    public setMultiLines(index: number) {
        this.gridApi.forEachNode((node) => {
            if (node.rowIndex == index) {
                node.setSelected(true)
                //this.gridApi.setFocusedCell(index, "firstName", null);
            }
        });
        //this.index$.setIndex(index)
    }
    onCellValueChanged(params) {
        if (params.column.colId !== "timer") {
            
            if (params.oldValue !== params.value) {

                if (params.column.colId == "timerStarted" // ne faire que si on touche à l'état du timerStarted
                    && params.value == true  // et qu'on le démarre
                ) {
                    //on doit pauser les timers autres que monNode dans toute la base
                    // à intégrer dans une fonction unique avec le même code de aggridlist
                    var allColumnIds = [];
                    params.columnApi.getAllColumns().forEach(function (column) {
                        allColumnIds.push(column.colId);
                    });
                    this.timerRefCol = allColumnIds.find(column => column.includes("TimerRef"))

                    this.timerRefColValue = params['data'][this.timerRefCol]
                    //et ce seulement si notre timer définit une référence
                    if (this.timerRefCol) {

                        let words = this.timerRefCol.split('_');
                        this.timerAttributeToExtend = words[0]
                        this.timerClassToExtend = words[1]
                        let myAttribute = this.wakanda.catalog[this.collectionClass].attributes.find(
                            attribute => {
                                return attribute.type == this.timerClassToExtend
                            })
                        this.timerRelatedToExtend = myAttribute.name
                        this.agGridClassComponent.entities
                            //on ne doit pas opérer au sein de l'index en cours
                            .filter(entitySource => this.agGridClassComponent.entities.indexOf(entitySource) !== this.indexGridClass)
                            .map(entitySource => {
                                if (entitySource[this.collection]['entities']) {
                                    entitySource[this.collection]['entities']
                                        .map(entity => {
                                            if (entity[this.timerRefCol] == this.timerRefColValue) {

                                                switch (entity['timerStarted']) {
                                                    case false: {
                                                        break
                                                    }
                                                    case true: {
                                                        switch (entity['notification']) {
                                                            case undefined: {
                                                                entity['timerStarted'] = false
                                                                entity['changed'] = 'update'
                                                                break
                                                            }
                                                            default: {
                                                                // c'est donc le cas où il est défini, et on doit le mettre en pause

                                                                entity['timerStarted'] = false
                                                                entity['paused'].next(true)
                                                                entity['changed'] = 'update'
                                                            }
                                                        }
                                                        break
                                                    }
                                                    default:
                                                        throw "this will never happen, timerStarted est toujours vrai ou faux";
                                                }
                                            }
                                        })
                                }
                            })
                    }
                }

                params.node.data['changed'] = params.node.data['changed']? params.node.data['changed'] :'update'
                this._saveEntity(params.rowIndex, params.node.data)
            }
        }
    }
    onSelectionChanged($event) {
        var selectedNodes = this.gridApi.getSelectedNodes();
        if (selectedNodes.length > 0) {
            this.index = selectedNodes[0]['rowIndex']
        }
    }
    public async _saveEntity(index?, nodeData?, mode?) {        
        var rowNode = this.gridApi.getSelectedNodes()[0]
        mode = mode ? mode : "update"
        index = index ? index : this.index
        nodeData = nodeData ? nodeData : this.gridApi.getSelectedNodes()[0]['data'];
        //nodeData.save().then(
        await this.wakanda._saveSecure(nodeData).then(
            res => {
                
                switch (mode) {
                    case "update": {
                        this.entities[index] = res
                        this.entities[index]['changed'] = (this.browserState == "offline") ? this.entities[index]['changed'] : undefined
                        var res = this.gridApi.updateRowData({
                            update: [res],
                        });
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
                    summary: 'GridList - Save data',
                    detail: 'GridList saved successful!'
                });
            }, err => {
                this.core._setGrwolMsg({
                    severity: 'error',
                    summary: 'GridList - Save problem',
                    detail: err
                });
            })
    }

    calculateTotal() {

        this.agGridListTotal = 0
        this.gridApi.forEachNode(node => {
            this.agGridListTotal = this.agGridListTotal + node.data.sousTotal
        })
        this.agGridListTVA = 0.21 * this.agGridListTotal
        this.agGridListTVA.toFixed(2)
        this.agGridListTotalTVA = this.agGridListTotal + this.agGridListTVA
        this.agGridListTotalTVA.toFixed(2)
    }
    onRowDoubleClicked($event) {
    }
    onRowDataChanged($event) {
        this.calculateTotal()
        this.gridApi.refreshCells()

        // let colTimer = this.gridColumnApi.getColumn("timer")
        // if (colTimer !== null) {
        //     // on va affecter un timer à chaque node de la grille
        //     this.gridApi.forEachNode((rowNode) => {
        //         let paused = new BehaviorSubject<boolean>(false);
        //         let notification = this.getPausableTimer(115, paused)
        //         notification.stepTimer.subscribe(seconds => {

        //             rowNode.setDataValue("timer", seconds)
        //             this.gridApi.refreshCells()

        //         })
        //     });
        // }
    }
    onGridReady(params) {

        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        //this.gridApi.setColumnDefs()


    }
    getPausableTimer(timeout: number, pause: BehaviorSubject<boolean>): { stepTimer: Observable<any>, completeTimer: Observable<any> } {
        const pausableTimer$ = defer(() => {
            let seconds = 1;
            return interval(1000).pipe(
                withLatestFrom(pause),
                filter(([v, paused]) => !paused),
                take(timeout),
                map(() => {
                    seconds++
                    return seconds
                })
            )
        }).pipe(share());

        return { stepTimer: pausableTimer$, completeTimer: pausableTimer$.pipe(reduce((x, y) => y)) }
    }
    countryCellRenderer = (params => {
        let flag = ''
        let $url = this.dataStoreUrl
        if (params.value) flag = `<img border='0'  height='30' style='margin-bottom: 2px' src="${$url}${params.value.uri}">`;
        return flag
    })
    _addNode(index) {
        this.gridApi.forEachNode(node => {
            if (node.rowIndex >= index) {
                node.data.ordre = node.data.ordre + 1
                //node.data['changed'] = 'update'
            }
            this.gridApi.refreshCells()
        })
    }
    _arrangeNode() {
        this.gridApi.forEachNode((node, i) => {
            node.data.ordre = i
            //node.data['changed'] = 'update'
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
            var newData: Promise<any>
            if (this.browserState == "offline") {
                // pas d'accès à Wakanda, nous devons donc créer une parfaite copie de la ligne sélectionnée
                // créons une routine copySecure dans WakandaService
                let selectedEntity = this.entities[this.index]
                
                newData = this.wakanda._copySecure(selectedEntity)
                .then(newData => {
                    newData['changed'] = 'add'
                    newData[this.source] = this.selectedEntitySource
                    newData['ordre'] = myIndex
                    return this._saveEntity(myIndex, newData, "add")
                })
            }
            else {
                newData = this.wakanda.catalog['WakandaLogin'].create(this.collectionClass,null)
                    .then(newData => {
                        newData['changed'] = 'update'
                        newData[this.source] = this.selectedEntitySource
                        newData['ordre'] = myIndex
                        return this._saveEntity(myIndex, newData, "add")
                    })
            }
        }
        return Promise.resolve(newData);
    }
    _deleteEntity() {
        let selectedEntity = this.entities[this.index]
        //let selectedEntity = this.gridApi.getSelectedRows()[0];
        var rowNode = this.gridApi.getSelectedNodes()[0]
        if (selectedEntity) {
            const gridListRefreshOnDelete = () => {
                this.gridApi.updateRowData({ remove: [selectedEntity] });
                this.nodeNumber--;
                this.entities.splice(this.index, 1);
                this.index = 0;
                setTimeout(() => {
                    this.setMultiLines(this.index);
                }, 0);
                //this.gridApi.refreshInfiniteCache();
                this.core._setGrwolMsg({
                    severity: 'success',
                    summary: 'GridList Remove data',
                    detail: 'GridList Data removed successfully!'
                });
            };
            this.confirmationService.confirm({
                message: 'Are you sure that you want to delete this entity?',
                accept: () => {
                    if (this.browserState == "offline") {
                        selectedEntity['changed'] = 'delete'
                        rowNode.setDataValue('deleted', true)
                        //rowNode.setRowHeight(0)
                        // this.gridApi.refreshCells() pas plus
                        this.core._setGrwolMsg({
                            severity: (this.browserState == "offline") ? 'warn' : 'success',
                            summary: 'GridList Remove data',
                            detail: 'GridList Data removed successfully!'
                        });
                    }
                    else {
                        selectedEntity.delete().then(
                            gridListRefreshOnDelete,
                            err => {
                                this.core._setGrwolMsg({
                                    severity: 'error',
                                    summary: 'GridList Remove data',
                                    detail: 'GridList Could not remove data!'
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
                summary: 'GridList Remove data',
                detail: 'GridList No entity selected!'
            });
        }
    }
    onRowDragEnd = e => {
        this._arrangeNode()
    }
    onRowDragEnter(e) {
        //this.dragFrom = e.overIndex
    }
}
