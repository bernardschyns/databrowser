import { Component } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";
import { AppComponent } from '../../app.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { Observable, Subject, interval, defer, BehaviorSubject, Subscription } from 'rxjs';
import { mapTo, reduce, take, tap, filter, map, share, withLatestFrom, combineLatest, takeUntil } from 'rxjs/operators'
import { subscriptionLogsToBeFn } from "rxjs/internal/testing/TestScheduler";
import { Wakanda } from '../../wakanda.service';
@Component({
    selector: 'square-cell',
    template: `
    <div *ngIf="timerReseted; else timerResetedelseBlock">
    <p-button class="add" (click)="timerReset($event)" icon="fa fa-times" iconPos="center" styleClass="ui-button-danger" style="font-size: 1em"></p-button>
    </div>
<ng-template #elseBlock>
<p-button class="add" (click)="handleCheckboxChange($event)" icon="fa fa-forward" iconPos="center" styleClass="ui-button-success" style="font-size: 1em"></p-button>
</ng-template>
<ng-template #timerResetedelseBlock>
<div *ngIf="monNode['data']['timerStarted']; else elseBlock">
<p-button class="add" (click)="handleCheckboxChange($event)" icon="fa fa-pause" iconPos="right" styleClass="ui-button-danger" style="font-size: 1em"></p-button>
</div>
</ng-template>
    `,
    styles: [`
    .add {
        padding: 0px;
        margin: 0px;
    }
`]
})
export class PauseEditorComponent implements ICellEditorAngularComp {
    public params: any;
    public checked: boolean;
    public condition: boolean;
    public timerReseted: boolean;
    public monNode: any;
    public className: string;
    public timerAttributeToExtend: string
    public timerClassToExtend: string
    public timerRelatedToExtend: string
    public timerRefCol: string

    constructor(
        public core: AppComponent,
        public confirmationService: ConfirmationService,
        public wakanda: Wakanda,
    ) { }
    agInit(params: any): void {
        // à intégrer dans une fonction unique avec le même code de aggridlist
        this.className = params.node.data._dataClass.name
        var allColumnIds = [];
        params.columnApi.getAllColumns().forEach(function (column) {
            allColumnIds.push(column.colId);
        });
        this.timerRefCol = allColumnIds.find(column => column.includes("TimerRef"))
        let words = this.timerRefCol.split('_');
        this.timerAttributeToExtend = words[0]
        this.timerClassToExtend = words[1]
        let myAttribute = this.wakanda.catalog[this.className].attributes.find(
            attribute => {
                return attribute.type == words[1]
            })
        this.timerRelatedToExtend = myAttribute.name
        var monField = params.colDef.field;
        this.checked = (params.data && params.data[monField]) ? true : false
        this.condition = (params.data && params.data[monField]) ? true : false
        if (monField == "timerReseted") this.timerReseted = true
        this.params = params;
        var rowNode = this.params.node;
        this.monNode = this.params.node
        var monField = this.params.colDef.field;
        if (monField === "timerStarted") {
        }
        if (monField === "timerStarted" && !this.monNode['data']['started'] && rowNode['data']['timerStarted']) {

            setTimeout(() => {
                this.handleCheckboxChange(null)
            }, 0)
        }
    }
    timerReset($event) {
        var monNode = this.params.node;
        if (monNode['data']['reset']) {
            monNode['data']['reset'].next(true)
        } else {
            var message = 'Are you sure that you want to init this timer counter';
            this.confirmationService.confirm({
                message: message,
                accept: () => {
                    setTimeout(() => {
                        this.monNode['data']['timerStarted'] = false
                        this.monNode.setDataValue("timer", 0)
                        this.monNode['data']['changed'] = 'update'
                    }, 0);
                },
                reject: () => { },
            })
        }
    }
    getPausableTimer(timeout: number, pause: BehaviorSubject<boolean>, reset: BehaviorSubject<boolean>, unsubscribe1: Subject<any>, seconds?: number): { stepTimer: Observable<any>, completeTimer: Observable<any> } {
        const pausableTimer$ = defer(() => {
            seconds = seconds ? seconds : 0;
            return interval(1000).pipe(
                takeUntil(unsubscribe1),
                combineLatest(pause, reset),
                filter(([v, paused, reseted]) => {
                    switch (reseted) {
                        case (true): {
                            var message = 'Are you sure that you want to init this timer counter';
                            this.confirmationService.confirm({
                                message: message,
                                accept: () => {
                                    seconds = 0
                                    reset.next(false)
                                    pause.next(true)
                                    setTimeout(() => {
                                        this.monNode['data']['timerStarted'] = false
                                        this.monNode.setDataValue("timer", seconds)
                                        this.monNode['data']['changed'] = 'update'

                                    }, 0);
                                    return false
                                },
                                reject: () => {
                                    reset.next(false)
                                    return true
                                },
                            })
                        }
                        case (false): {
                            switch (paused) {
                                case (true): {
                                    return false
                                }
                                case (false): {
                                    return true
                                }
                            }
                        }
                    }
                }),
                map(() => {
                    seconds++
                    return seconds
                }
                )
            )
        }).pipe(share());
        return { stepTimer: pausableTimer$, completeTimer: pausableTimer$.pipe(reduce((x, y) => y)) }
    }
    public handleCheckboxChange(event): void {
        var monNode = this.params.node.rowIndex;
        var monField = this.params.colDef.field;
        if (monField === "timerStarted") {
            // on va affecter un timer à chaque node de la grille
            this.params.api.forEachNode((rowNode) => {
                switch (rowNode['childIndex'] === monNode) {
                    case (true): {
                        switch (this.monNode['data']['started']) {
                            case (true): {
                                switch (rowNode['data']['timerStarted']) {
                                    case (true): {
                                        rowNode['data']['paused'].next(true)
                                        rowNode['data']['changed'] = 'update'
                                        //rowNode['data']['timerDateStopped'] = new Date().getSeconds()
                                        break
                                    }
                                    case (false): {
                                        rowNode['data']['paused'].next(false)
                                        rowNode['data']['changed'] = 'update'
                                        break
                                    }
                                }
                                break
                            }
                            case (undefined): {
                                let control = event ? true : rowNode['data']['timerStarted']
                                switch (control) {
                                    case (true): {

                                        if (rowNode['data']['timerDateStopped']) {
                                            
                                            //convertissons en secondes                                            
                                            rowNode['data']['timer'] = rowNode['data']['timer'] + (Math.round(new Date().getTime() / 1000) - Math.round(rowNode['data']['timerDateStopped'].getTime() / 1000))
                                            rowNode['data']['timerDateStopped'] = null
                                        }
                                        rowNode['data']['changed'] = 'update'
                                        rowNode['data']['started'] = true
                                        rowNode['data']['paused'] = new BehaviorSubject<boolean>(false);
                                        rowNode['data']['reset'] = new BehaviorSubject<boolean>(false);
                                        rowNode['data']['unsubscribe1'] = new Subject();
                                        rowNode['data']['notification'] = this.getPausableTimer(500, rowNode['data']['paused'], rowNode['data']['reset'], rowNode['data']['unsubscribe1'], rowNode['data']['timer'])
                                        rowNode['data']['notification'].stepTimer.subscribe(seconds => {
                                            rowNode.setDataValue("timer", seconds)
                                        })
                                        break
                                    }
                                    case (false): {
                                        break
                                    }
                                }
                                break
                            }
                        }
                        break
                    }
                    case (false): {
                        switch (rowNode['data']['timerStarted']) {
                            case (true): {
                                if (rowNode['data'][this.timerRefCol] == this.monNode['data'][this.timerRefCol]) {
                                    rowNode['data']['changed'] = 'update'
                                    rowNode['data']['paused'].next(true)
                                    rowNode.setDataValue("timerStarted", false)
                                }
                                break
                            }
                            case (false): {
                                break
                            }
                        }
                        break
                    }
                }
            });
            //if (event) this.params.node.data[monField] = this.params.data[monField] ? false : true
            if (event) {
                if (this.params.data[monField]) {
                    this.monNode.setDataValue("timerStarted", false)
                    this.monNode['data']['changed'] = 'update'

                } else {
                    this.monNode.setDataValue("timerStarted", true)
                    this.monNode['data']['changed'] = 'update'
                }
            }
            if (event) this.condition = this.condition ? false : true

        }
        // this.params.data.save().then(
        //     res => {
        //         this.core._setGrwolMsg({
        //             severity: 'success',
        //             summary: 'Save data',
        //             detail: 'PauseEditorComponent saved successful!'
        //         });
        //     },
        //     err => {
        //         this.core._setGrwolMsg({
        //             severity: 'error',
        //             summary: 'Save data',
        //             detail: 'Could not save data!'
        //         })
        //     }
        // )
    }
    refresh(): boolean {
        return false;
    }
    getValue() {
        return this.params.node.data['timerStarted'];
    }
}