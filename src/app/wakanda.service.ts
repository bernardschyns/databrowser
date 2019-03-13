import { Injectable } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { WakandaClient } from 'wakanda-client/browser/no-promise';
import { TournoiService } from './tournoi.service'
import * as util from './shared/utilitaires';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { promise } from 'selenium-webdriver';


const browserState: string = (navigator.onLine) ? "online" : "offline"
const browserStateStore = new BehaviorSubject<string>(browserState);
@Injectable()
export class Wakanda {
  private _client: WakandaClient;
  private _catalog;
  private _hostName: string;
  private location: Location;
  private browserState: string;
  browserStateStore = browserStateStore;
  browserStateStoreChanges = browserStateStore
    .asObservable()
    .distinctUntilChanged()
  constructor(
  ) {
    window.addEventListener("offline", () => {
      this.setbrowserState("offline")
      alert("offline")
    }, false);
    window.addEventListener("online", () => {
      this.setbrowserState("save")
      alert("save")
      setTimeout(() => {
        alert("re-online")
        this.setbrowserState('online');
      }, 0)
    }, false);
    this.browserStateStoreChanges.distinctUntilChanged().subscribe(
      browserState => {
        this.browserState = browserState
      }
    )
    this._hostName = location.hostname;
    this._client = new WakandaClient({ host: 'http://' + this._hostName + ':8081' });
    this._catalog = null;
  }
  setbrowserState(params) {
    this.browserStateStore.next(params);
  }
  openDataStore(params) {
    this._client = new WakandaClient({ host: params.URL });

    return Promise.resolve(this.__catalog);
  }
  get __catalog() {

    if (!this._catalog) {
      return this._client.getCatalog().then(c => {

        this._catalog = c;
        return c;
      })
    }
    return Promise.resolve(this._catalog);
  }
  get catalog() {
    return this._catalog
  }
  get hostName() {
    return Promise.resolve(this._hostName);
  }
  get directory() {
    return this._client.directory;
  }
  get wakandaClientVersion() {
    return this._client.version();
  }
  public _copySecure(source: any) {
    //todo synchroniser entre gridlist et gridClass
    //var source = source ? source : this.gridApi.getSelectedNodes()[0].data;
    
    if (source) {
      var  source2=new source.constructor(source)
      //var source2 = {}
      
      util.mergeDeep(source2, source);
      var dangerArr = {
        '_key': '_key',
        '_deferred': '_deferred',
        'save': 'save',
        'delete': 'delete',
        'fetch': 'fetch',
        'recompute': 'recompute',
        '_stamp': '_stamp',
        '_dataClass': '_dataClass',
      }
      // todo imprimer une logique 'changed' partout dans databrowser
      const nodeDataCopySecure = source2 => Promise.resolve(source2)
        .then(out => {
          let myKeys = Object.keys(source2)
          // vicieux ....ceci parce que l'objet 'dataClass' a été freeze par wakanda  
          myKeys.push('_dataClass')
          myKeys.map(key => {
            if(dangerArr[key]){
              if(key=='_dataClass'){
                Object.defineProperty(out, '_dataClass', {enumerable: true, configurable: true,writable: true });
              }
              out[key]=source[key] 
              if(key=='_dataClass'){
                Object.defineProperty(out, '_dataClass', {enumerable: false, configurable: false,writable: false });
              }           

            }
            let myAttribute = source['_dataClass'].attributes.find(attribute => attribute.name == key);
            if (myAttribute && myAttribute.kind && (myAttribute.kind == 'relatedEntity'||myAttribute.name == '_dataClass')) {
              out[key] = source[key]
            }
          })
          return out
        });
      return nodeDataCopySecure(source2)
    }
  }
  public _saveSecure(source: any) {
    //todo synchroniser entre gridlist et gridClass
    //var source = source ? source : this.gridApi.getSelectedNodes()[0].data;
    if (source) {
      var source2 = {}
      util.mergeDeep(source2, source);
      // todo imprimer une logique 'changed' partout dans databrowser
      var result
      // if (source['changed'] == 'update'||source['changed'] == 'add') {
        var dangerArr = {
          '_key': '_key',
          '_deferred': '_deferred',
          'save': 'save',
          'delete': 'delete',
          'fetch': 'fetch',
          'recompute': 'recompute',
          '_stamp': '_stamp',
          '_dataClass': '_dataClass',
        }
        const nodeDataSaveSecure = source => Promise.resolve(source.save())
          .then(out => {
            let myKeys = Object.keys(source2)
            // vicieux ....ceci parce que l'objet 'dataClass' a été freeze par wakanda  
            myKeys.push('_dataClass')
            myKeys.map(key => {
              let myAttribute = source['_dataClass'].attributes.find(attribute => attribute.name == key);
              if (myAttribute && myAttribute.kind && myAttribute.kind == 'relatedEntities') {
                out[key] = source2[key]
              }
            })
            return out
          });
        return (this.browserState == "online" || this.browserState == "save") ? nodeDataSaveSecure(source) : Promise.resolve(source)
      // }
      // else {
      //   result = throwError('Fiche non modifiée');
      //   //throw "et c'est mon essai";
      // }
    }
  }
}
