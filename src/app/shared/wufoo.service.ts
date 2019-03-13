import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import { BehaviorSubject } from 'rxjs';
import { Wakanda } from '../wakanda.service';
import { pluck } from 'rxjs/operators';
import { ApiService} from '../shared/api.service';
interface ITemplate {
    template?: string,
    dataClass?: string,
    templateName?: string,
    listeSelector?: string[],
    dataClasses?: any
}
const template: ITemplate = {
    template: '',
    dataClass: '',
    templateName: '',
    listeSelector: [],
    dataClasses: {}
};
const templateStore = new BehaviorSubject<ITemplate>(template);
@Injectable()
export class WufooService {
    templateStore = templateStore;
    templateStoreChanges = templateStore
        .asObservable()
        .distinctUntilChanged()
    constructor(
        private apiService: ApiService
    ) {
        this.templateStoreChanges.subscribe(
        )
    }
    setTemplateInPage = (template: ITemplate) => {
        let collectionToFetch: any = {}
        let selfAttributesToFetch: Array<string> = []
        let selectDataToFetch: any = {}
        if (template.listeSelector) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(template['template'], "text/html");
            template.listeSelector.map(selector => {
                let mesElementsCollection = doc.querySelectorAll(selector);
                // on devrait travailler avec un type "Set" pour être sûr de ne pas avoir de doublons dans cette procédure
                if (mesElementsCollection.length > 0) {
                    var words = selector.split('-');
                    var newTemplate = words[1]
                    var newClass = words[0]
                    if (newClass == template.dataClass.toLowerCase()) {
                        if (selector == "facture-facture") {
                            
                        }
                        if (template.dataClasses[template.dataClass][newTemplate] && template.dataClasses[template.dataClass][newTemplate]['collectionToFetch']) {
                            Object.keys(template.dataClasses[template.dataClass][newTemplate]['collectionToFetch']).map(
                                key => collectionToFetch[key] = template.dataClasses[template.dataClass][newTemplate]['collectionToFetch'][key]
                            )
                        }
                        if (template.dataClasses[template.dataClass][newTemplate] && template.dataClasses[template.dataClass][newTemplate]['selfAttributesToFetch']) {

                            Object.keys(template.dataClasses[template.dataClass][newTemplate]['selfAttributesToFetch']).map(
                                key => selfAttributesToFetch[key] = template.dataClasses[template.dataClass][newTemplate]['collectionToFetch']
                            )
                        }
                        if (template.dataClasses[template.dataClass][newTemplate] && template.dataClasses[template.dataClass][newTemplate]['selectDataToFetch']) {

                            Object.keys(template.dataClasses[template.dataClass][newTemplate]['selectDataToFetch']).map(
                                key => selectDataToFetch[key] = template.dataClasses[template.dataClass][newTemplate]['selectDataToFetch'][key]
                            )
                        }
                    }
                }
            })
        }
        return [collectionToFetch]
    }
    setTemplate = (template: ITemplate) => {
        if (template['template'] !== '') {
            let parser = new DOMParser();
            let doc = parser.parseFromString(template['template'], "text/html");
            //let paragraphs = doc.querySelectorAll('ng-template');

            let mesElementsCollection = doc.querySelectorAll("ag-grid-angular[data-collection],app-ag-grid-list[data-collection]");
            let mesElementsInput = doc.querySelectorAll("input[pinputtext]");
            let mesElementsSelect = doc.querySelectorAll("p-autoComplete[pinputtext]");

            let collectionToFetch = {}
            for (let i = 0; i < mesElementsCollection.length; i++) {
                let item = mesElementsCollection[i];
                var myDataCollection = item.getAttribute("data-collection")
                // incroyable todo le let passe sur collection mais pas sur myDataClass ?
                var myDataClass = item.getAttribute("data-dataClass")
                var myDataListe = item.getAttribute("data-dataListe")
                var mySource = item.getAttribute("data-source")
                if (template['templateName'] == 'companyliste') {

                }

                let stringToFetchObject= { collection: myDataCollection, liste: myDataListe, source: mySource }
                collectionToFetch[myDataClass] = stringToFetchObject
            }
            let selfAttributesToFetch: Array<string> = []
            for (let i = 0; i < mesElementsInput.length; i++) {
                let item = mesElementsInput[i];
                let ngModelValue: string = item.getAttribute("[(ngmodel)]")
                let stringsOfAttributeToFetch = ngModelValue.split(".")
                if (stringsOfAttributeToFetch.length >= 3) {
                    selfAttributesToFetch.push(stringsOfAttributeToFetch[1])
                }
            }
            selfAttributesToFetch = selfAttributesToFetch.filter(onlyUnique)

            let selectDataToFetch = {}
            for (let i = 0; i < mesElementsSelect.length; i++) {
                let stringData = ""
                let item = mesElementsSelect[i];
                // let ngModelValue: string = item.getAttribute("data-related")
                // let stringsOfDataToFetch = ngModelValue.split(".")
                // if (stringsOfDataToFetch.length >= 3) {
                //     stringData=stringsOfDataToFetch[2]
                // }
                stringData = item.getAttribute("field")
                var myDataClass = item.getAttribute("data-dataClass")
                selectDataToFetch[myDataClass] = stringData
            }
            return [collectionToFetch]
        }

    }
    setTemplate2(template: ITemplate) {
        let myOldValue = this.templateStore.getValue()
        let myNewValue = { template: '', dataClass: '', templateName: '' }
        Object.keys(template).map(key => myNewValue[key] = myOldValue[key])
        Object.keys(template).map(key => myNewValue[key] = template[key])
        this.templateStore.next(myNewValue);
    }
    analyseAttributes(template: string) {
    }
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

