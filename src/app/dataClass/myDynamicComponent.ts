import {
    EventEmitter, Output, Component, OnInit, OnDestroy, AfterViewInit, AfterViewChecked, Input, NgModule, NgModuleFactory, TemplateRef, Compiler, CUSTOM_ELEMENTS_SCHEMA, ViewChild
} from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, AdminData } from '../shared/api.service';
import { TabContainerComponent } from '../dataClass/tabContainerComponent';
import { Observable, Subject } from 'rxjs';
import "rxjs/add/operator/takeWhile";
import { takeUntil, tap } from 'rxjs/operators';
import { GridOptions } from "ag-grid";
@Component({
    selector: 'my-component',
    template: `
        <ng-container  *ngComponentOutlet="dynamicComponent;
                              ngModuleFactory: dynamicModule;">                                      
        </ng-container>`,
        styleUrls: ['./my.component.css']
})
export class MyComponent implements OnInit, OnDestroy {
    public dynamicComponent: any;
    public dynamicModule: NgModuleFactory<any>;
    @Input()
    context: string
    private className: string;
    private classTemplate: string;
    private dataClasses = {}
    private adminData: AdminData
    private unsubscribe1: Subject<void> = new Subject();
    private unsubscribe2: Subject<void> = new Subject();
    private unsubscribe3: Subject<void> = new Subject();
    private unsubscribe4: Subject<void> = new Subject();
    constructor(
        private apiService: ApiService
    ) {
    }
    ngOnDestroy() {
    }
    ngOnInit() {
        setTimeout(() => {
            if (this.context) {
                if (this.context == "dataclass") {
                    
                }
                this.apiService.dataStoreURLStoreChanges.pluck('adminData').distinctUntilChanged().takeUntil(this.unsubscribe4).subscribe(adminData => {
                    if (adminData) {
                        this.adminData = (adminData as AdminData)
                        this.unsubscribe4.next();
                    }
                })
                this.apiService.dataClassesStoreChanges.takeUntil(this.unsubscribe1).distinctUntilChanged().subscribe(
                    dataClasses => {
                        // todo le modal dynamique n'est pas implémenté
                        // if (this.context == "modal1") {
                        //     this.dynamicComponent = dataClasses["modal1"]["modal1"]["dynamicComponent"]
                        //     this.dynamicModule = dataClasses["modal1"]["modal1"]["dynamicModule"]
                        // }
                        //if (this.context == "dataclass") {

                        if (dataClasses) {
                            this.dataClasses = dataClasses
                        }
                        //}
                        if (this.dataClasses) this.unsubscribe1.next();
                    })
                    // todo combiner les deux dataClassStoreChanges with .doWhile(function (x) { return ++i < 2; })
                    // pour ne plucker que si le template change à name égal
                this.apiService.dataClassStoreChanges.takeUntil(this.unsubscribe2).subscribe(
                    dataClass => {
                        if (dataClass) {                           
                            this.className = (dataClass.name as string);
                            this.classTemplate = (dataClass && dataClass.template) ? dataClass.template : 'default'
                            this.dynamicModule = dataClass.dynamicModule as NgModuleFactory<any>
                            this.dynamicComponent = this.dataClasses[this.className][this.classTemplate]["dynamicComponent"]
                            this.unsubscribe2.next();
                        }
                    })
                this.apiService.dataClassStoreChanges.pluck('template').distinctUntilChanged().takeUntil(this.unsubscribe3).subscribe(
                    classTemplate => {
                        if (classTemplate) {                          
                            this.classTemplate = (classTemplate as string)
                            if (this.classTemplate && this.dataClasses) {
                                if (this.classTemplate == "Joueur4") {
                                }
                                this.dynamicComponent = this.dataClasses[this.className][this.classTemplate]["dynamicComponent"]
                                //this.dynamicModule = this.dataClasses[this.className][this.classTemplate]["dynamicModule"]
                                //if (this.adminData && this.adminData.isAdmin) this.unsubscribe3.next();
                            }
                            if (this.classTemplate){
                                 this.unsubscribe3.next();
                                 this.unsubscribe3.complete();
                                }
                        }
                    })
            }
        }, 0)
    }
}

