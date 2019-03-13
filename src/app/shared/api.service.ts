import { Injectable, NgModuleFactory } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import { BehaviorSubject } from 'rxjs';
import { Wakanda } from '../wakanda.service';
import { pluck } from 'rxjs/operators';
import * as util from '../shared/utilitaires';
// pour rassembler les données de allDataClasses et celles de 
//var sayings = new Map();
//var arr : { [key:string]:number; } = {};
// const SERVICES: Record<string, IDataClass2> = { 
//     doorToDoor: {"textScriptToEval":"bonjur"},
// };
export interface IDataListes { [key: string]: IDataList1; }
export interface IDataList1 { [key: string]: IDataList2; }
export interface IDataList2 {
    columnDef?: Array<any>,
    queryFilter?: string,
    width?:number,
}
const dataListes = {}

export interface IDataClasses { [key: string]: IDataClass1; }
export interface IDataClass1 { [key: string]: IDataClass2; }
export interface IDataClass2 {
    textScriptToEval?: string,
    calculateTemplatesString?: string,
    dynamicComponent?: any,
    queryFilter?: string,
    position?:{ [key: string]: any },
}
const dataClasses = {}
interface IDataClasses3 {
    [index: number]: { name?: any; liste?: string; page?: string };
}
const dataClasses3: IDataClasses3 = [];
interface IDataClass {
    name?: string,
    template?: string,
    liste?: string,
    pluckName?: string,
    filter?: string,
    save?: boolean,
    dynamicModule?: NgModuleFactory<any>,
    freeVisit?:boolean,
    IDToFind?:number
}
const dataClass: IDataClass = {
    name: '',
    template: '',
    liste:'',
    pluckName: '',
    filter: '',
    save: false,
    freeVisit:true,
    IDToFind:1
};

export interface AdminData {
    isAdmin: boolean,
    isVisit: boolean
}
interface IDataStoreURL {
    url?: string,
    visitScript?: string,
    adminData?: AdminData,
    userSession?: {},
    userOption?: string
}
const dataStoreURL: IDataStoreURL = {
    url: '',
    visitScript: '',
    adminData: {
        'isAdmin': true,
        'isVisit': false
    },
    userSession: {},
    userOption: ''
};

const dataListesStore = new BehaviorSubject<IDataListes>(dataListes);
const dataClassesStore = new BehaviorSubject<IDataClasses>(dataClasses);
const dataClasses3Store = new BehaviorSubject<IDataClasses3>(dataClasses3);
const dataClassStore = new BehaviorSubject<IDataClass>(dataClass);
const dataStoreURLStore = new BehaviorSubject<IDataStoreURL>(dataStoreURL);

@Injectable()
export class ApiService {
    dataListesStore = dataListesStore;
    dataListesStoreChanges = dataListesStore
        .asObservable()
        .distinctUntilChanged()
    dataClassesStore = dataClassesStore;
    dataClassesStoreChanges = dataClassesStore
        .asObservable()
        .distinctUntilChanged()
    dataClasses3Store = dataClasses3Store;
    dataClasses3StoreChanges = dataClasses3Store
        .asObservable()
        .distinctUntilChanged()
    dataClassStore = dataClassStore;
    dataClassStoreChanges = dataClassStore
        .asObservable()
        .distinctUntilChanged()
    dataStoreURLStore = dataStoreURLStore;
    dataStoreURLStoreChanges = dataStoreURLStore
        .asObservable()
        .distinctUntilChanged()
    //.do(dataStoreURLStoreChanges => console.log('new dataStoreURL', dataStoreURLStoreChanges));
    constructor() {
    }
    setDataListes(params: IDataListes) {
        let myOldValue = this.dataListesStore.getValue()
        const myNewValue = util.mergeDeep(myOldValue, params);
        this.dataListesStore.next(myNewValue);
    }
    setDataClasses(params: IDataClasses) {
        let counter: number = -1
        counter++
        let myOldValue = this.dataClassesStore.getValue()

        //ceci pose problème la librairie deepmerge perd certains type....pas possible de
        //travailler avec node_module de manière classique voir stack overflow à ce sujet
        // let result:IDataClasses={}
        //  result = deepmerge (myNewValue,params)

        const myNewValue = util.mergeDeep(myOldValue, params);
        this.dataClassesStore.next(myNewValue);
    }
    setDataClasses3(params: IDataClasses3) {
        // let myOldValue = this.dataClasses3Store.getValue()
        // let myNewValue = { allDataClasses3: [] }
        // Object.keys(params).map(key => myNewValue[key] = myOldValue[key])
        // Object.keys(params).map(key => myNewValue[key] = params[key])
        this.dataClasses3Store.next(params);
    }
    setDataClass(params: IDataClass) {

        let myOldValue = this.dataClassStore.getValue()
        let myNewValue = { name: "" }
        Object.keys(myOldValue).map(key => myNewValue[key] = myOldValue[key])
        Object.keys(params).map(key => myNewValue[key] = params[key])

        this.dataClassStore.next(myNewValue);
    }
    setDataStoreURL(params) {

        //permet dans angular de faire setDataStoreURL uniquement des parametres qui ont été modifiés
        let myOldValue = this.dataStoreURLStore.getValue()
        let myNewValue = {}
        Object.keys(myOldValue).map(key => myNewValue[key] = myOldValue[key])
        Object.keys(params).map(key => myNewValue[key] = params[key])

        this.dataStoreURLStore.next(myNewValue);
    }
}
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */


/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
