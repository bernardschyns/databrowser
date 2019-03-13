import * as moment from 'moment';
import {
    ViewChildren, QueryList, Output, EventEmitter, Component, ViewChild, ElementRef, Renderer, OnInit, AfterViewInit, AfterViewChecked, Input, NgModule, NgModuleFactory, TemplateRef, Compiler,
} from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/observable/of'
import { Wakanda } from '../wakanda.service';
import { TournoiService } from '../tournoi.service';
import { IDataListes, IDataClasses, IDataClass2, ApiService, AdminData } from '../shared/api.service';
import { AppComponent } from '../app.component';
import { CommonModule, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabContainerModuleTempo } from '../directivesShared/tabContainerModuleTempo';
import { GridOptions } from "ag-grid";
import { AgGridModule } from 'ag-grid-angular';
//import { AgGridListModule } from '../dataClass/agGridList/agGridList.module';
import { debug } from 'util';
import { takeUntil, tap } from 'rxjs/operators';
import { DemoModule } from '../demo/module';
import { CalendarComponent } from '../calendar/calendarComponent';
import { TreeModule } from 'primeng/tree';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/primeng';
import { observable } from 'rxjs';
import { AgGridClassComponent } from '../dataClass/agGridClass/agGridClass.component';
import { AgGridListComponent } from '../dataClass/agGridList/agGridList.component';
import { AgGridClassModule } from '../dataClass/agGridClass/agGridClass.module';
import { NumberFormatterComponent } from '../dataClass/agGridSharedComponents/numberFormatterComponent';
import { TimerFormatterComponent } from '../dataClass/agGridSharedComponents/timerFormatterComponent';
import { NumericEditorComponent } from '../dataClass/agGridSharedComponents/numericEditorComponent';
import { TextEditorComponent } from '../dataClass/agGridSharedComponents/textEditorComponent';
import { BoolEditorComponent } from '../dataClass/agGridSharedComponents/boolEditorComponent';
import { PauseEditorComponent } from '../dataClass/agGridSharedComponents/pauseEditorComponent';
import { AliasEditorComponent } from '../dataClass/agGridSharedComponents/aliasEditorComponent';
import { DateEditorComponent } from '../dataClass/agGridSharedComponents/dateEditorComponent';
import { PhotoEditorComponent } from '../dataClass/agGridSharedComponents/photoEditorComponent';
import { SplitButtonModule } from 'primeng/splitbutton';
var AgGridListModule: any
var TabContainerModule: any
//nous créons le module TabContainerModuleTempo qui importera les components tabContainer et TournoiComponent

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewChecked, AfterViewInit {
    @Output()
    visitLoad: EventEmitter<string> = new EventEmitter();
    @Output()
    catalogLoad: EventEmitter<string> = new EventEmitter();
    public dataClasses: IDataClasses = {};
    public dataListes: IDataListes = {};
    public attributesToFetch: string[] = []
    public dataClasses4 = [];
    public dataClasses3 = [];
    public arrayWakanda: any
    public dataStore = {};
    public dataStoreUrl = 'http://localhost:8081';
    public myCalculateTemplatesString: string = "";
    public wakandaLogin;
    public dynamicComponent: any;
    public dynamicComponentArray: any[] = []
    public dynamicModule: NgModuleFactory<any>;
    public myScript: string[] = []
    public adminData: AdminData;

    //autocompleteData
    public liste: {}
    public queryString: string
    public attributeAutocomplete: string
    public searchID
    public selectData: any[]
    //listeselector
    public listeSelector: string[] = []
    constructor(
        public compiler: Compiler,
        public wakanda: Wakanda,
        public api: ApiService,
        public core: AppComponent,
    ) {
    }
    filterBrands(event, className, apiService) {
        this.selectData = []
        this.queryString = event.query.toLowerCase()
        this.attributeAutocomplete = "nom"
        this.api[apiService].pluck(className.name).subscribe(
            listes => {
                Observable.from(Object.keys(listes)).subscribe(key => {
                    this.selectData.push(key)
                })
                this.selectData = this.selectData.filter(selectDataFilter, { arrayWakanda: this.arrayWakanda }
                )
                function selectDataFilter(ligne) {
                    var elemFind = this.arrayWakanda['entities'].find(
                        elem => {
                            if (ligne == "factureinpage" && elem.name == "factureinpage") {

                            }
                            return (elem.name == ligne && elem.selected)
                        }
                    )
                    return (elemFind !== undefined)
                }
            })
    }
    ngAfterViewInit() {
        this.api.dataStoreURLStoreChanges.pluck('adminData').distinctUntilChanged().subscribe(adminData => {
            this.adminData = adminData as AdminData
            (this.adminData['isAdmin']) ? {} : this.loadCatalog()
            this.dynamicComponent = this.createNewComponent(`<p>mon component fonctionne,insérez du html dans wakandaLogin</p>`);
            //this.dynamicComponentArray.push(this.dynamicComponent)

        })
    }
    ngAfterViewChecked() {
    }
    ngOnInit() {

    }
    protected createTabContainerModule(dynamicComponentArray) {
        //nous créons le module TabContainerModule qui importera l'unique component tabContainer
        dynamicComponentArray
        @NgModule({
            declarations: dynamicComponentArray,
            imports: [
                TabContainerModuleTempo,
                CommonModule,
                FormsModule,
                ButtonModule,
                SplitButtonModule,
                DropdownModule,
                AgGridListModule,
                AgGridModule.withComponents([]),
                DemoModule,
                AutoCompleteModule,
                TreeModule,
            ],
            providers: [
                ApiService,
            ],
            exports: dynamicComponentArray,
            entryComponents: dynamicComponentArray,
            bootstrap: []
        })
        class TabContainerModule { }
        return TabContainerModule;
    }
    protected createAgGridListModule = (dynamicComponentArray: any) => {
        @NgModule({
            imports: [
                TabContainerModuleTempo,
                CommonModule,
                FormsModule,
                AgGridClassModule,
                AgGridModule.withComponents([
                    NumberFormatterComponent,
                    TimerFormatterComponent,
                    NumericEditorComponent,
                    TextEditorComponent,
                    BoolEditorComponent,
                    PauseEditorComponent,
                    AliasEditorComponent,
                    PhotoEditorComponent,
                    DateEditorComponent,
                ]),
                ButtonModule,
                SplitButtonModule
            ],
            declarations: [
                AgGridListComponent,
            ].concat(dynamicComponentArray),
            exports: [
                AgGridListComponent
            ].concat(dynamicComponentArray)
        })
        class AgGridListModule { }
        return AgGridListModule;
    }
    public createModalListeModule = (dynamicComponentArray: any) => {

        AgGridListModule = this.createAgGridListModule(dynamicComponentArray)
        return AgGridListModule
    }
    protected createComponentModule = (dynamicComponentArray: any) => {
        @NgModule({
            declarations: dynamicComponentArray,
            imports: [
                TabContainerModuleTempo,
                TabContainerModule,
                CommonModule,
                AgGridListModule,
                AgGridModule.withComponents([]),
            ],
            providers: [
                ApiService,
            ],
            exports: dynamicComponentArray,
            entryComponents: dynamicComponentArray,
            bootstrap: []

        })
        class RuntimeComponentModule2 {
        }
        // a module for just this Type
        return RuntimeComponentModule2;
    }
    // il faut savoir que suite à la configuration des composants dynamiques d'angular, on ne pourra passer qu'une et une seule fois dans cette fonction
    protected createNewComponent(calculateTemplatesString, calculateTextScript?: string, className?: string, templateName?: string, status?: string) {
        let template = `${calculateTemplatesString}`;
        var script = calculateTextScript ? `${calculateTextScript}` : ""
        var className = className ? `${className}` : "default"
        var templateName = templateName ? `${templateName}` : "default"
        var selector = `${className.toLowerCase()}-${templateName.toLowerCase()}`
        var status = status ? `${status}` : ""
        if (status == "page") { this.listeSelector.push(selector) }
        @Component({
            selector: selector,
            template: template,
            styleUrls: ['./dynamic.component.scss']
        })
        class DynamicComponent implements OnInit, AfterViewInit {
            public entity: any
            public index: number
            public src
            public textScriptToEval: string = script
            public className: string = className
            public templateName: string = templateName
            public status: string = status
            public selector = selector
            public dataClassPluck: string = className
            public dataClass: any = {};
            public selectData = [];
            public unsubscribe: Subject<void> = new Subject();
            public queryFilter: string
            public queryString: string
            public attributeAutocomplete: "string"
            public searchID;
            public backgroundStyle: any
            public condition: boolean = true
            public loaded: boolean = false;
            public fieldName: string
            public filterBrands(event, className?, fieldName?) {
                function throttle(func, delay, watch) {
                    if (watch) {
                        clearTimeout(watch)
                    }
                    return setTimeout(func, delay)
                }
                this.fieldName = fieldName
                this.queryString = event.query.toLowerCase()
                this.attributeAutocomplete = fieldName
                this.queryFilter = `'${fieldName}'==:1`
                this.dataClass = this.wakanda.catalog[className];
                let entity = {};

                let timeout = null;
                timeout = throttle(() =>
                    Observable.fromPromise(this.dataClass.query({ filter: this.queryFilter, params: [`*${this.queryString}*`], orderBy: this.attributeAutocomplete, pageSize: 40 })).subscribe(
                        res => {
                            if (res['entities']) {
                                this.selectData = res['entities'];
                                let insert = {}
                                insert[fieldName] = `insert new ${className}`
                                this.selectData.splice(0, 0, insert);
                            }
                        }), 500, timeout)
            }
            constructor(
                public api: ApiService,
                public wakanda: Wakanda,
                public core: AppComponent,
                public tournoiService: TournoiService,
                public el: ElementRef,
                public renderer: Renderer,
                public agGridClassComponent: AgGridClassComponent
            ) { }
            scoreChanged = (event, className?, field?) => {

                field = field ? field : undefined
                className = className ? className : undefined
                if (!newData && event[this.fieldName] && event[this.fieldName].includes("insert new") && field && className) {
                    this.entity['changed'] = 'update'
                    var newData = this.createNewWakandaData(className)
                        .then(res => {
                            res['changed'] = 'update';
                            this.entity[field] = res

                        })
                }
                setTimeout(() => {

                    this.agGridClassComponent.index$.setIndex(this.agGridClassComponent.index)
                }, 0)
            }
            public createNewWakandaData(className?: string) {
                var newData = this.wakanda.catalog['WakandaLogin'].create(className,null)
                return newData;
            }

            ngAfterViewInit() { }
            onClick(event) {
            }
            dataChanged($event) {
                this.entity['changed'] = 'update'
                this.entity.save()
            }
            ngOnInit() {
                this.backgroundColorSet(className)
                this.api.dataClassStore.takeUntil(this.unsubscribe).distinctUntilChanged().subscribe(dataClassPluck => {
                    if (dataClassPluck && dataClassPluck['pluckName']) {
                        this.dataClassPluck = dataClassPluck.pluckName as string
                    }
                    this.unsubscribe.next();
                    this.unsubscribe.complete();

                })
                this.agGridClassComponent.index$.indexStoreChanges.subscribe(
                    index => {


                        this.index = index
                        let singleLine = this.agGridClassComponent.entities[index]
                        if (this.dataClassPluck == "Commande" && this.className == "Commande") {
                        }
                        var myAttribute
                        if (this.dataClassPluck) {
                            if (this.dataClassPluck !== this.className) {
                                var myFindEntity = singleLine['_dataClass'].attributes.find(
                                    attribute => {
                                        myAttribute = attribute.name
                                        return attribute.type == this.className
                                    })
                                this.entity = this.agGridClassComponent.entities[index][myAttribute]

                                // this.entity = singleLine[myAttribute].fetch().then(NewSingleLine => {

                                //     this.entity = NewSingleLine
                                // })
                            }
                            else {
                                this.entity = this.agGridClassComponent.entities[index]
                                //this.entity = singleLine
                                if (singleLine['photo']) {
                                    this.src = `http://localhost:8081${singleLine['photo']['uri']}`
                                }
                            }
                        }
                    })

            }
            change(params) {
            }
            objectCellRenderer = (params => {
                let flag = ''
                if (params.value) flag = `${JSON.stringify(params.value)}`;
                return flag
            })
            createTournoi() {
                this.tournoiService.tournoiInit()
            }
            photoChange(event) {
                //let myelement = this.el.nativeElement
                //event.currentTarget.attributes.id.nodeValue//"Field20"
                let myFiles = event.currentTarget.files
                let file = myFiles[0];
                this.entity['photo']
                    .delete().then(res => {
                        res['photo'].upload(file).then(res => {

                            // setTimeout(()=>{
                            this.src = `http://localhost:8081${res['photo']['uri']}`
                            // },0)
                            //file is uploaded and entity is updated
                        });
                    })
            }
            submit() {
                try {
                    if (this.entity) {
                        //todo améliorer pour enregistrer les dates correctement
                        if (this.entity['dateDebut']) {
                            this.entity['dateDebut'] = new Date(this.entity['dateDebut'])
                        }
                        Observable.fromPromise(this.entity.save()).subscribe(
                            res => {
                                this.core._setGrwolMsg({
                                    severity: 'success',
                                    summary: 'Save data',
                                    detail: 'Sidebar saved successful!'
                                });
                            },
                            err => {
                                this.core._setGrwolMsg({
                                    severity: 'error',
                                    summary: 'Save data',
                                    detail: 'Could not save data!'
                                });
                            }
                        );
                    } else {

                        this.core._setGrwolMsg({
                            severity: 'error',
                            summary: 'Save data',
                            detail: 'No entity selected!'
                        });
                    }
                } catch (err) {
                    this.core._setGrwolMsg({
                        severity: 'error',
                        summary: 'Transaction failed',
                        detail: 'Error message: ' + err + '!'
                    });
                }
            }
            backgroundColorSet(className) {
                this.backgroundStyle = {
                    'width.px': 625,
                    'height.px': 840,
                    'position': 'fixed',
                    'background-color': (className == "Facture") ? '#e8ef9e' : '#bed4f7',
                };
                switch (className) {
                    case ('Commande'): {
                        this.backgroundStyle['background-color'] = '#f7f6be'
                        break
                    }
                    case ('NoteEnvoi'): {
                        this.backgroundStyle['background-color'] = '#bed4f7'
                        break
                    }
                    case ('Facture'): {
                        this.backgroundStyle['background-color'] = '#e8b2c1'
                        break
                    }

                    default: {
                        break
                    }
                }


            }
        }
        return DynamicComponent;
    }
    protected createNewComponentInPage(calculateTemplatesString, calculateTextScript?: string, className?: string, templateName?: string, status?: string) {
        let template = `${calculateTemplatesString}`;
        var script = calculateTextScript ? `${calculateTextScript}` : ""
        var className = className ? `${className}` : "default"
        var templateName = templateName ? `${templateName}` : "default"
        var selector = `${className.toLowerCase()}-${templateName.toLowerCase()}`
        var status = status ? `${status}` : ""
        if (status == "page") { this.listeSelector.push(selector) }
        @Component({
            selector: selector,
            template: template,
            styleUrls: ['./dynamic.component.scss']
        })
        class DynamicComponent implements OnInit {
            public className: string = className
            public backgroundStyle: any
            constructor(
            ) { }
            ngOnInit() {
                this.backgroundColorSet(className)

            }
            backgroundColorSet(className) {
                this.backgroundStyle = {
                    'width.px': 625,
                    'height.px': 840,
                    'position': 'fixed',
                    'background-color': (className == "Facture") ? '#e8ef9e' : '#bed4f7',
                };
                switch (className) {
                    case ('Commande'): {
                        this.backgroundStyle['background-color'] = '#f7f6be'
                        break
                    }
                    case ('NoteEnvoi'): {
                        this.backgroundStyle['background-color'] = '#bed4f7'
                        break
                    }
                    case ('Facture'): {
                        this.backgroundStyle['background-color'] = '#e8b2c1'
                        break
                    }

                    default: {
                        break
                    }
                }
            }
        }
        return DynamicComponent;
    }



    //tout ceci est fait dans l'espoir de trouver une solution pour importer dynamiquement un module dans angular
    //sans devoir se préoccuper des composants - voir onglet ngtemplateoutlet with output dans chrome
    protected createNewModal(calculateTemplatesString, calculateTextScript?: string, className?: string, templateName?: string, status?: string) {
        let template = `${calculateTemplatesString}`;
        var script = calculateTextScript ? `${calculateTextScript}` : ""
        var className = className ? `${className}` : ""
        var templateName = templateName ? `${templateName}` : ""
        var status = status ? `${status}` : ""
        var selector = `${className.toLowerCase()}-${templateName.toLowerCase()}`
        if (status == "modal") { this.listeSelector.push(selector) }
        if (selector == "modal1-modal1") {
        }
        @Component({
            selector: selector,
            template: template,
            styleUrls: ['../dataClass/modal1.css']
        })
        class DynamicComponent implements AfterViewInit {
            public className: string = className
            public selectedEntity
            public index: number
            public items: any[];
            public classNameForModal: string
            constructor(
                public api: ApiService,
                public agGridClassComponent: AgGridClassComponent,
                public wakanda: Wakanda,
            ) {
                this.api.dataClassStoreChanges.pluck('name').subscribe(
                    name => {
                        this.classNameForModal = (name as string);
                    })
                //recherche des fonctions attribuables à la dataClass
                //todo rajouter le tableau des fonctions dans un set..., pour éviter un appel à Wakanda
                let myMethods = this.wakanda.catalog[this.classNameForModal].methods
                this.items = []
                Object.keys(myMethods)
                    .filter(key => myMethods[key].length > 0)
                    .map(key => {
                        myMethods[key]
                            .map(func => {
                                this.items.push({ label: func, icon: "fa fa-angle-double-left", command: () => { this._toFacture(func); } })
                            })
                    })

            }
            next() {
                this.agGridClassComponent.next()
            }
            prev() {
                this.agGridClassComponent.prev()
            }
            first() {
                this.agGridClassComponent.first()
            }
            last() {
                this.agGridClassComponent.last()
            }
            _add() {
                this.agGridClassComponent._add()
            }
            _saveEntity() {
                //this.agGridClassComponent._saveEntity()
            }
            _deleteEntity() {
                this.agGridClassComponent._deleteEntity()
            }
            onBack() {
                this.agGridClassComponent.onBack()
            }
            _toFacture(name) {
                "use strict";
                //this.catalog[this.className].toFacture(this.selectedEntitySource)
                var action = this.wakanda.catalog[this.classNameForModal][name]
                var customAction = () => {
                    action(this.selectedEntity).then(res => {
                        this.api.setDataClass({ name: res['name'], template: res['template'], IDToFind: res['IDToFind'], freeVisit: res['freeVisit'] })
                    })
                }
                var func = new Function("action", "return function " + name + "(){ action() };")(customAction); //we call it
                func();
            }
            ngAfterViewInit() {
                setTimeout(() => {
                    this.agGridClassComponent.index$.indexStoreChanges.subscribe(
                        index => {
                            this.selectedEntity = this.agGridClassComponent.entities[index]
                        })
                }, 0)
            }
        }
        return DynamicComponent;
    }
    protected createNewModalListe(calculateTemplatesString, calculateTextScript?: string, className?: string, templateName?: string, status?: string) {

        let template = `${calculateTemplatesString}`;
        var script = calculateTextScript ? `${calculateTextScript}` : ""
        var className = className ? `${className}` : ""
        var templateName = templateName ? `${templateName}` : ""
        var status = status ? `${status}` : ""
        var selector = `${className.toLowerCase()}-${templateName.toLowerCase()}`
        //if (status == "modal") { this.listeSelector.push(selector) }
        if (selector == "modal1-modal1") {

        }
        @Component({
            selector: selector,
            template: template,
            styleUrls: ['../dataClass/modal2.css']
        })
        class DynamicComponent implements OnInit, AfterViewInit {
            public className: string = className
            public selectedEntity
            public searchID;
            public collection
            public index: number
            public anotherClassName
            public loaded: boolean = true
            public condition: boolean = true
            constructor(
                public api: ApiService,
                public agGridListComponent: AgGridListComponent
            ) { }
            next() {

                this.agGridListComponent.next()
            }
            prev() {
                this.agGridListComponent.prev()


            }
            first() {
                this.agGridListComponent.first()
            }
            last() {
                this.agGridListComponent.last()
            }
            _add() {
                this.agGridListComponent._add()
            }
            _saveEntity() {
                this.agGridListComponent._saveEntity()
            }
            async _saveEntityTest() {
                await this.agGridListComponent.entities[0].save()
                .then(res=>{
                    res
                    debugger
                })
                console.log("ne marche pas")
            }

            _deleteEntity() {
                this.agGridListComponent._deleteEntity()
            }
            // onBack() {
            //     this.agGridListComponent.onBack()
            // }
            ngOnInit() {
            }
            ngAfterViewInit() {
            }

        }
        return DynamicComponent;
    }
    loadCatalog() {
        
        //jdo creation d'un module par défaut
        //jdo creation d'un component par défaut
        this.api.setDataStoreURL({ url: this.dataStoreUrl })

        var res = this.wakanda.catalog
        Object.keys(res).map(
            key => {
                //on fait un query symbolique pour la fonction offline de notre application
                this.attributesToFetch = []
                res[key].attributes.map(attribute => {
                    switch (attribute.kind) {
                        case ('relatedEntity'):
                        case ('relatedEntities'): {
                            this.attributesToFetch.push(attribute.name)
                            break
                        }
                    }
                })
                //on affecte tout d'abord à chaque classe le component et le module par défaut
                // todo le dynamic module pourrait aussi être dépendant du contexte de la DataClass
                this.dataClasses4.push({ name: res[key], liste: 'default', page: res[key]['name'] });
                let columnDef, queryFilter, widthCols
                [columnDef, queryFilter, widthCols] = this._columnDef(this.wakanda.catalog[key], 'default')
                this.dataClasses[key] = {}
                this.dataClasses['Modal'] = {}
                this.dataListes[key] = {}
                this.dataClasses['Modal']['default'] = { 'dynamicComponent': this.dynamicComponent, 'textScriptToEval': "", 'queryFilter': queryFilter }
                this.dataClasses[key]['default'] = { 'dynamicComponent': this.dynamicComponent, 'textScriptToEval': "", 'queryFilter': queryFilter }
                this.dataListes[key]['default'] = { 'columnDef': columnDef, 'queryFilter': queryFilter, 'width': widthCols }
                this.dataClasses[key][key] = { 'dynamicComponent': this.dynamicComponent, 'textScriptToEval': "", 'queryFilter': queryFilter }
                this.dataClasses['Modal']['Modal'] = { 'dynamicComponent': this.dynamicComponent, 'textScriptToEval': "", 'queryFilter': queryFilter }
                // cette première recherche dans le but de pouvoir utiliser l'application of Line
                res[key].query({ pageSize: 100, select: this.attributesToFetch })
            })
        this._loadDataClass()
        res['WakandaLogin'].query().then(arrayWakanda => {
            this.arrayWakanda = arrayWakanda
            this.dataClasses3 = this.dataClasses4.filter(dataClasses4Filter,
            )
            function dataClasses4Filter(ligne) {
                var elemFind = arrayWakanda['entities'].find(
                    elem => {
                        if (ligne.name.name == "WakandaLogin") {
                            return true
                        } else {
                            return (elem.dataClass == ligne.name.name && elem.selected)
                        }
                    }
                )
                return (elemFind !== undefined)
            }
            this.api.setDataClasses3(this.dataClasses4);
        })
    }
    _searchHtml() {
        return Observable.fromPromise(this.wakandaLogin.query(
            { filter: `type=="page" ` }
        ))
    }
    _searchModal() {
        return Observable.fromPromise(this.wakandaLogin.query(
            { filter: `type=="modal" ` }
        ))
    }
    _searchModalListe() {
        return Observable.fromPromise(this.wakandaLogin.query(
            { filter: `type=="modalListe" ` }
        ))
    }
    _searchInPage() {
        return Observable.fromPromise(this.wakandaLogin.query(
            { filter: `type=="inPage" ` }
        ))
    }
    _searchListe() {
        return Observable.fromPromise(this.wakandaLogin.query(
            { filter: `type=="liste" ` }
        ))
    }
    _searchVisit() {
        return Observable.fromPromise(this.wakandaLogin.query(
            { filter: `type=="visit" ` }
        ))
    }
    _calculateWidthCols = (liste, listeKeys) => {

        let widthCols = 0
        listeKeys.map(key => {
            widthCols = (liste[key]['width']) ? widthCols + liste[key]['width'] : widthCols
        })
        return widthCols
    }
    _columnDef(dataClass, name?: string, liste?: {}) {
        var myClassName = dataClass.name
        if (myClassName == "Facture") {
        }
        let columndragged = false
        if (liste) {
        }
        name = (name) ? name : 'default'
        liste = (liste) ? liste['liste'] : {}
        let listeKeys = Object.keys(liste)
        let queryFilter = ""
        let widthCols = 0
        var counter = -1
        var counterFilter = 0
        var statusDetected = false
        var cols = dataClass.attributes
            .filter(
                a => {
                    if (listeKeys.length == 0) {
                        return true
                    } else {
                        widthCols = this._calculateWidthCols(liste, listeKeys)

                        if (listeKeys.indexOf(a.name) == -1) {
                            return false
                        } else {
                            return true
                        }
                    }
                })
            .filter(
                a => {
                    switch (a.kind) {
                        case ('relatedEntity'):
                        case ('relatedEntities'):
                            return false
                        default: {
                            switch (a.kind) {
                                case ('alias'): { break }
                                default: {
                                    switch (a.name) {
                                        case ('ID'): { break }
                                        default: {
                                            counter++
                                        }
                                    }
                                }
                            }
                            return true
                        }
                    }
                }
            )
            //toplace queryFilterSearch
            .map(
                (a, i) => {
                    let columnDef = {}
                    let indexKeyList = listeKeys.indexOf(a.name)
                    if (!(indexKeyList == -1)) {
                        Object.keys(liste[a.name]).map(key => columnDef[key] = liste[a.name][key])
                    }
                    if (a.name == "status") {
                        queryFilter = `${queryFilter} ${a.name} == true`
                    }
                    if (a.name == "ordre") {
                        columnDef["hide"] = true;
                    }
                    if (!columndragged) {
                        columnDef["rowDrag"] = true;
                        columndragged = true
                    }
                    if (a.kind == 'alias') {

                        columnDef["cellEditor"] = 'aliasEditorComponent';
                    }
                    if (a.kind == "calculated"
                        // || a.kind == "alias"
                    )
                        columnDef["editable"] = false
                    columnDef["headerName"] = a.name;
                    columnDef["field"] = a.name
                    switch (a.type) {
                        case 'bool': {
                            switch (a.name) {
                                case 'timerStarted':
                                case 'timerReseted':
                                    {
                                        columnDef["cellRenderer"] = "pauseEditorComponent"
                                        //columnDef["valueSetter"] = this.timerStartedValueSetter
                                        columnDef["editable"] = false

                                        break
                                    }
                                default: {
                                    columnDef["cellRenderer"] = "boolEditorComponent"
                                }
                            }
                            columnDef["width"] = 40;
                            break
                        }
                        case 'string': {
                            if (myClassName == "WakandaLogin") {
                                switch (a.name) {
                                    case 'html':
                                    case 'cssForm':
                                    case 'html':
                                    case 'cssStructure':
                                    case 'script':
                                        columnDef["cellEditor"] = "textEditorComponent"
                                        break
                                }
                            }
                            break
                        }
                        case 'number':
                        case 'long': {
                            columnDef["filter"] = "agNumberColumnFilter"
                            columnDef["filterParams"] = {
                                filterOptions: ["equals", "lessThan", "greaterThan"],
                                newRowsAction: "keep"
                            }
                            columnDef["cellEditor"] = "numericEditorComponent"

                            if (a.name == "total" || a.name == "sousTotal" || a.name == "prix" || a.name == "salary") {
                                columnDef["cellRenderer"] = "numberFormatterComponent"
                            } else {
                                columnDef["valueParser"] = this.numberParser
                            }
                            //todo transformer ceci en un switch
                            if (a.name == "timer") {
                                columnDef["cellRenderer"] = "timerFormatterComponent"
                                columnDef["editable"] = false
                            } else {
                                columnDef["valueParser"] = this.numberParser
                            }
                            break
                        }
                        case 'image': {
                            columnDef["cellRenderer"] = this.countryCellRenderer
                            columnDef["cellEditor"] = "photoEditorComponent"
                            break
                        }
                        case 'date': {
                            columnDef["cellEditor"] = "dateEditorComponent"
                            columnDef["cellRenderer"] = this.dateCellRenderer
                            columnDef["valueSetter"] = this.dateValueSetter


                            break
                        }
                        case 'object': {
                            columnDef["valueFormatter"] = this.objectCellRenderer
                            columnDef["valueSetter"] = this.valueSetter
                            columnDef["cellEditor"] = "textEditorComponent"
                            break
                        }
                    }
                    return columnDef
                }
            );
        return [cols, queryFilter, widthCols]
    }
    _loadDataClass() {


        // on cherche dans WakandaLogin (! todo c'est du hardcoding)le html - page qui correspond à la dataClass                
        this.wakandaLogin = this.wakanda.catalog["WakandaLogin"]
        var myObservableListe = this._searchListe()
        myObservableListe.subscribe(
            this.arrayListe(),
            this.errorHtml()
        )
        var myObservableVisit = this._searchVisit()
        myObservableVisit.subscribe(
            this.arrayVisits(),
            this.errorHtml()
        )
        var myObservableModalListe = this._searchModalListe()
        myObservableModalListe.subscribe(
            this.arrayModalListe(),
            this.errorHtml()
        )


        // nous verrons qu'il est important de s'interroger sur quand désamorcer les écouteurs que l'on installe dans chaque composant
        //this.subscription.unsubscribe()
    }
    public arrayVisits(): (value: {}) => void {
        return dataVisits => {
            dataVisits['entities'].map(entity => {
                this.api.setDataStoreURL({ visitScript: entity.script })
            });
        };
    }
    public arrayModals(): (value: {}) => void {
        return dataModals => {

            dataModals['entities'].map(entity => {
                // this.dataClasses[entity.dataClass] = {}
                // this.dataClasses[entity.dataClass][entity.name] = {}
                // Object.keys(this.dataClasses[entity.dataClass][entity.dataClass]).map(key => this.dataClasses[entity.dataClass][entity.name][key] = this.dataClasses[entity.dataClass][entity.dataClass][key])
                this.prepareNewComponent(entity, "modal")
            });

            // this.dynamicModule = this.compiler.compileModuleSync(this.createComponentModule(this.dynamicComponentArray));
            //pas besoin on va le faire dans la routine d'après
            //this.api.setDataClasses(this.dataClasses);
            // this.api.setDataClass({ 'dynamicModule': this.dynamicModule });
        };
    }
    public arrayModalListe(): (value: {}) => void {
        return dataModals => {

            dataModals['entities'].map(entity => {
                // this.dataClasses[entity.dataClass] = {}
                // this.dataClasses[entity.dataClass][entity.name] = {}
                // Object.keys(this.dataClasses[entity.dataClass][entity.dataClass]).map(key => this.dataClasses[entity.dataClass][entity.name][key] = this.dataClasses[entity.dataClass][entity.dataClass][key])
                this.prepareNewComponent(entity, "modalListe")
            });

            this.compiler.compileModuleSync(this.createModalListeModule(this.dynamicComponentArray));
            //pas besoin on va le faire dans la routine d'après
            //this.api.setDataClasses(this.dataClasses);
            // this.api.setDataClass({ 'dynamicModule': this.dynamicModule });
            this.dynamicComponentArray = []
            var myObservableModal = this._searchModal()
            myObservableModal.subscribe(
                this.arrayModals(),
                this.errorHtml()
            )
            var myObservableHtml = this._searchHtml()
            myObservableHtml.subscribe(
                this.arrayComponents(),
                this.errorHtml()
            )
        };
    }
    public arrayInPage(): (value: {}) => void {
        return dataModals => {

            dataModals['entities'].map(entity => {
                //this.dataClasses[entity.dataClass] = {}
                this.dataClasses[entity.dataClass][entity.name] = {}
                Object.keys(this.dataClasses[entity.dataClass][entity.dataClass]).map(key => this.dataClasses[entity.dataClass][entity.name][key] = this.dataClasses[entity.dataClass][entity.dataClass][key])
                this.prepareNewComponent(entity, "inPage")
            });

            this.dynamicModule = this.compiler.compileModuleSync(this.createComponentModule(this.dynamicComponentArray));

            this.api.setDataClasses(this.dataClasses);

            this.api.setDataListes(this.dataListes);
            this.catalogLoad.emit();
            if (this.adminData.isVisit) {
                this.visitLoad.emit();
            }
            this.api.setDataClass({ 'dynamicModule': this.dynamicModule });
        };
    }
    public arrayListe(): (value: {}) => void {
        return dataListe => {
            dataListe['entities'].map(entity => {
                this.dataListes[entity.dataClass][entity.name] = {}
                Object.keys(this.dataListes[entity.dataClass]['default']).map(key => this.dataListes[entity.dataClass][entity.name][key] = this.dataListes[entity.dataClass]['default'][key])
                let columnDef, queryFilter, widthCols
                [columnDef, queryFilter, widthCols] = this._columnDef(this.wakanda.catalog[entity.dataClass], entity.name, entity.liste)
                this.dataListes[entity.dataClass][entity.name] = { 'columnDef': columnDef, 'queryFilter': queryFilter, 'width': widthCols }
            });
        };
    }
    public arrayComponents(): (value: {}) => void {
        return dataClasses => {
            dataClasses['entities'].map(dataClass => {
                //todo gérer plusieurs templates de type "page" sur la même dataClass, pour le moment seul le dernier sera pris en compte
                //je suis en train de travailler sur cela ...fini ?
                this.prepareNewComponent(dataClass, "page")
            }
            );
            //pas besoin on va le faire dans la routine d'après
            //this.api.setDataClasses(this.dataClasses);
            TabContainerModule = this.createTabContainerModule(this.dynamicComponentArray)
            this.dynamicModule = this.compiler.compileModuleSync(TabContainerModule);
            //pas besoin on va le faire dans la routine d'après
            //this.api.setDataClass({ 'dynamicModule': dynamicModule });
            //todo gérér les Modal avec @outlet voir chrome ngtemplateoutlet with output
            this.dynamicComponentArray = []
            var myObservableInPage = this._searchInPage()
            myObservableInPage.subscribe(
                this.arrayInPage(),
                this.errorHtml()
            )
        };
    }
    public errorLoadDataClass(): (error: any) => void {
        return err => {
            this.core._setGrwolMsg({
                severity: 'error',
                summary: 'Failed to load dataclass',
                detail: 'Error message: ' + err + '!'
            });
        };
    }
    public errorHtml(): (error: any) => void {
        return err => {
            this.core._setGrwolMsg({
                severity: 'error',
                summary: 'Failed to load html',
                detail: 'Error message: ' + err + '!'
            });
        };
    }
    public prepareNewComponent(dataClass, status?): any {
        var className = dataClass['dataClass']
        var templateName = dataClass['name']
        var stringContainer = ` <tab-container  width="200px" [templateName]="templateName" [className]="className" [templates]="{'${dataClass['dataClass']}' : ${dataClass['dataClass']}}"></tab-container>`;
        //var stringContainer = ` <tab-container width="200px"  [templates]="{'Employee':Employee}"></tab-container>`
        var stringStyles = `<style #cssForm>${dataClass['cssForm']}</style><style #cssTheme>${dataClass['cssTheme']}</style><style #cssStucture>${dataClass['cssStucture']}</style> `
        var stringTemplate = `${dataClass['html']}`
        var textScriptToEval = `${dataClass['script']}`
        var position = dataClass['position']
        //insérons nos stringContainer et stringStyles à la bonne place dans le stringTemplate avec la fonction insert
        stringTemplate = stringTemplate.replace(`<ng-template #${dataClass['dataClass']}>`, `<ng-template #${dataClass['dataClass']}>${stringStyles}`)
        stringTemplate = `${stringTemplate} ${stringContainer}`

        var dynamicComponent: any
        switch (status) {
            case "page": {
                dynamicComponent = this.createNewComponent(stringTemplate, textScriptToEval, className, templateName, status)
                break
            }
            case "inPage": {
                //dynamicComponent = this.createNewComponentInPage(stringTemplate, textScriptToEval, className, templateName, status)
                dynamicComponent = this.createNewComponent(stringTemplate, textScriptToEval, className, templateName, status)

                break
            }
            case "modal": {
                dynamicComponent = this.createNewModal(stringTemplate, textScriptToEval, className, templateName, status)
                break
            }
            case "modalListe": {
                dynamicComponent = this.createNewModalListe(stringTemplate, textScriptToEval, className, templateName, status)
                break
            }
            default:
                throw "this will never happen, navigation is always on of the 4 keys above";
        }
        this.dynamicComponentArray.push(dynamicComponent)
        if (status !== "modalListe") {
            //attention pourrait un jour poser problème
            if (true && className !== templateName) { this.dataClasses[className][templateName] = {} }
            if (templateName == "modal1") {

            }
            Object.keys(this.dataClasses[className]['default']).map(key => {

                this.dataClasses[className][templateName][key] = this.dataClasses[className]['default'][key]
            })
            this.dataClasses[className][templateName]['dynamicComponent'] = dynamicComponent
            this.dataClasses[className][templateName]['template'] = stringTemplate
            if (status == "page" || status == "inPage") {
                this.dataClasses[className][templateName]['position'] = position


            }
        }


    }

    loadDataClass(name, liste?, page?) {

        (this.adminData.isAdmin) ? this.api.setDataClass({ name: name, liste: liste, template: page, filter: "", IDToFind: null, freeVisit: true }) : {};
    }
    countryCellRenderer = (params => {
        let flag = ''
        let $url = this.dataStoreUrl
        if (params.value) flag = `<img border='0'  height='30' style='margin-bottom: 2px' src="${$url}${params.value.uri}">`;
        return flag
    })
    objectCellRenderer = (params => {

        let flag = ''
        if (params.value) flag = `${JSON.stringify(params.value)}`;
        return flag
    })

    valueSetter = (params => {
        params.newValue = JSON.parse(params.newValue)
        if (params.data[params.colDef.field] !== params.newValue) {
            params.data[params.colDef.field] = params.newValue
            return true
        } else {
            return false
        }
    })
    dateCellRenderer = (params => {
        let flag = ''
        if (params.value) flag = moment(params.value).format('DD/MM/YYYY');
        return flag
    })
    dateValueSetter = (params => {
        params.newValue = new Date(params.newValue)
        if (params.data[params.colDef.field] !== params.newValue) {
            params.data[params.colDef.field] = params.newValue
            return true
        } else {
            return false
        }
    })
    timerStartedValueSetter = (params => {

        if (params.oldValue !== params.value) {
            return true
        }
        else {
            return false
        }
    })

    numberParser = (params) => {

        return Number(params.newValue);
    }
}
