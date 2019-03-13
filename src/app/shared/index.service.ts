import { Injectable, NgModuleFactory } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import { BehaviorSubject } from 'rxjs';
import { Wakanda } from '../wakanda.service';
import { pluck } from 'rxjs/operators';
import * as util from '../shared/utilitaires';

//export interface IIndex {<number>};

@Injectable()
export class IndexService {
    public index = 0
public indexStore = new BehaviorSubject<number>(this.index);
    public indexStoreChanges = this.indexStore
    .asObservable()
    //.distinctUntilChanged()
    constructor() {
    }
    public setIndex(params: number) {
        let myOldValue = this.indexStore.getValue()
        // let myNewValue = {}
        // attention à keys(myOldValue)...importer dans les autres set...
        // Object.keys(myOldValue).map(key => myNewValue[key] = myOldValue[key])
        // Object.keys(params).map(key => myNewValue[key] = params[key])
        
        this.indexStore.next(params);
        
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
