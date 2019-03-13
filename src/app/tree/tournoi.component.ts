import { Component, OnInit, AfterViewInit, NgModule, Inject, Injectable, Input, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { Wakanda } from '../wakanda.service';
import { ApiService } from '../shared/api.service';
import { AppComponent } from '../app.component';
import { AgGridClassComponent } from '../dataClass/agGridClass/agGridClass.component';
import { TreeNode, SelectItem } from 'primeng/api';

@Component({
    selector: 'app-tournoi',
    templateUrl: './tournoi.component.html',
    styleUrls: ['./tournoi.component.css']
})
export class TournoiComponent implements OnInit {

    public data: any[];
    public dataObject: {}
    public dataClasses = [];
    public selectedDataClass: any;
    public selectedID: string;
    public firstNode: any;
    public selectedNode: TreeNode;
    public selectedNodeParent: TreeNode;
    private unsubscribe: Subject<void> = new Subject();
    public className: string
    public entity: any

    //variables counter nécessaires au remplissage de l'arbre
    public counterFirst: number = 0
    public counterComplet: number = 0
    public counterSeul: number = 0
    public nodeCategorieFirstTour: any[] = []
    public nodeCategorieCompletTour: any[] = []
    public nodeCategorieSeulTour: any[] = []




    constructor(
        private wakanda: Wakanda,
        private apiService: ApiService,
        private core: AppComponent,
        public agGridClassComponent: AgGridClassComponent   
    ) {
        this.apiService.dataClasses3StoreChanges.subscribe(
            allDataClasses3 => {
                this.dataClasses = (allDataClasses3['name'] as Array<any>).map(
                    dc => {
                        return { label: dc.name, value: dc };
                    }
                );
                if (this.dataClasses && this.dataClasses.length > 0) {
                    this.selectedDataClass = this.dataClasses[0].value;
                }
                this.unsubscribe.next();
                this.unsubscribe.complete();
            },
            (error) => console.error(error),
        );
    }
    setParent = (o) => {
        if (o.children != undefined) {
            o.children.map(child => {
                child['parent'] = o
                child.children.map(o => {
                    this.setParent(o)
                })
            })
        }
    }
    expandAll() {
        this.data.forEach(node => {
            this.expandRecursive(node, true);
        });
    }
    private expandRecursive(node: TreeNode, isExpand: boolean) {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach(childNode => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }

    nodeSelect(event) {

    }
    scoreChanged(event) {
        
        let string = this.selectedNode['score']
        let tableau = string.split("-")
        tableau = tableau.filter(ligne =>
            ligne.startsWith("6")
        )
        var index = this.selectedNode['index']
        if (tableau.length >= 2) {
            //c'est le joueur 1 qui a gagné
            this.selectedNode['myParent'][`joueur${this.selectedNode['index']}`] = this.selectedNode['joueur1']
        } else {
            this.selectedNode['myParent'][`joueur${this.selectedNode['index']}`] = this.selectedNode['joueur2']
        }
    }
    ngOnInit() {
        /* !!! à garder précieusement fonctionne
        this.data = [];
        let data = { "joueur1": ``, "joueur2": ``, "score": "", "type": "match", "children": [] }
        this.dataObject = this.iterate(data, 0, 3, 0)
        this.data = [this.dataObject]
        //this.setParent(this.dataObject)       
        this.expandAll()
        */

        this.apiService.dataClassStoreChanges.pluck('name').subscribe(
            name => {
 
                this.className = (name as string);
                this.agGridClassComponent.index$.indexStoreChanges.subscribe(
                    index => {
                        let singleLine = this.agGridClassComponent.entities[index]          
                        this.counterComplet=0
                        this.counterFirst=0
                        this.counterSeul=0
                        let myCategorie = this.entity = singleLine
                        if (singleLine) {                           
                            let depth = this.entity.depth
                            let data={}
                            if (this.entity.arbre!=null) {
                                data=this.entity['arbre']['arbre']
                                this.dataObject = this.iterateImport(data, 0, depth + 1)
                             } else {
                                this.nodeCategorieFirstTour = this.entity.nodeCategorieFirstTour.nodeCategorieFirstTour
                                this.nodeCategorieCompletTour = this.entity.nodeCategorieCompletTour.nodeCategorieCompletTour
                                this.nodeCategorieSeulTour = this.entity.nodeCategorieSeulTour.nodeCategorieSeulTour
                                data = { "joueur1": ``, "joueur2": ``, "score": "", "type": "match", "children": [] }
                                this.dataObject = this.iterate(data, 0, depth + 1)
                            }                           
                            this.data = [this.dataObject]
                            this.expandAll()
                        }
                    }
                );
            });

    }
    iterateSave = (data, depth, n) => {
        depth++
        if (data['myParent']) { data['myParent'] = {} }
        Object.keys(data).map(key => {
            if (key == "children") {
                if (depth <= n) {
                    data[key].map(entity => {
                        if (entity['myParent']) { entity['myParent'] = {} }
                        this.iterateSave(entity, depth, n)
                    })
                }
                return data
            }
            return data
        })
        return data
    }
        iterateImport = (data, depth, n) => {
        depth++
        //if (data['myParent']) { data['myParent'] = data }
        Object.keys(data).map(key => {
            if (key == "children") {
                if (depth <= n) {
                    data[key].map(entity => {
                        if (entity['myParent']) { entity['myParent'] = data }
                        this.iterateImport(entity, depth, n)
                    })
                }
                return data
            }
            return data
        })
        return data
    }
    iterate = (data, depth, n) => {
        depth++
        Object.keys(data).map(key => {
            if (key == "children") {

                // let indice = Math.floor(ordonnee / (2 ** n)) * 2 ** (depth)
                if (depth < n - 2) {

                    data[key] = [{ "index": 1, "joueur1": ``, "joueur2": ``, "score": "", "myParent": data, "type": "match", "children": [] },
                    { "index": 2, "joueur1": ``, "joueur2": ``, "score": "", "myParent": data, "type": "match", "children": [] }]
                }
                if (depth == n - 2) {
                    if (this.counterComplet < this.nodeCategorieCompletTour.length) {
                        data[key] = [Object.assign({ "myParent": data, "index": 1, "indexParent": data["index"] }, this.nodeCategorieCompletTour[this.counterComplet]),
                        Object.assign({ "myParent": data, "index": 2, "indexParent": data["index"] }, this.nodeCategorieCompletTour[this.counterComplet + 1])]
                        this.counterComplet = this.counterComplet + 2
                    } else {
                        if (this.counterSeul < this.nodeCategorieSeulTour.length) {
                            data[key] = [Object.assign({ "myParent": data, "index": 1, "indexParent": data["index"], "children": [] }, this.nodeCategorieSeulTour[this.counterSeul]),
                            Object.assign({ "myParent": data, "index": 2, "indexParent": data["index"], "children": [] }, this.nodeCategorieSeulTour[this.counterSeul + 1])]
                            this.counterSeul = this.counterSeul + 2
                        }
                    }
                }
                if (depth == n - 1) {
                    
                    if ((data['joueur1'] == "") && this.counterFirst < this.nodeCategorieFirstTour.length) {
                        
                        data[key] = [Object.assign({ "myParent": data, "index": 1, "indexParent": data["index"] }, this.nodeCategorieFirstTour[this.counterFirst]),
                        { "type": "vide" }]
                        this.counterFirst++

                    }
                }
                // if (depth == n-1) {
                //     data[key] = [{ "joueur": ``, "type": "joueur" },
                //     { "joueur": ``, "type": "joueur" }]
                // }
                if (depth <= n) {
                    data[key].map(entity => {
                        this.iterate(entity, depth, n)
                    })
                }
                return data
            }
            return data
        })
        return data
    }

    submit() {
        

            if (this.entity) {
                let depth = this.entity.depth
                this.dataObject = this.iterateSave(this.data[0], 0, depth + 1)
                this.entity.descriptif="bonjour"
                //todo il semble impossible ...??? de save deux fois successivement un object dans une dataClass de Wakanda
                if(this.entity.name=="Messieurs2"){
                this.entity.arbre = {"arbre":this.dataObject}}

                this.entity.save()
                Observable.fromPromise(this.entity.save()).subscribe(
                    res => {
                        this.core._setGrwolMsg({
                            severity: 'success',
                            summary: 'Save data',
                            detail: 'Tournoi saved successful!'
                        });
                    }
                    // ,
                    // err => {
                    //     this.core._setGrwolMsg({
                    //         severity: 'error',
                    //         summary: 'Save data',
                    //         detail: 'Could not save data!'
                    //     });
                    // }
                );
            } else {
                this.core._setGrwolMsg({
                    severity: 'error',
                    summary: 'Save data',
                    detail: 'No entity selected!'
                });
            }
    }


    _getPrimaryKey(params) {
        return new Promise((resolve) => {
            const kbv = function getKeyByValue(object, value) {
                const keys = Object.keys(object);
                keys.splice(keys.indexOf('_key'), 1);
                return keys.find(key => {
                    // tslint:disable-next-line:triple-equals
                    return object[key] == value;
                });
            };
            let entity = {};
            Observable.fromPromise(params.dataClass.query({ filter: '', pageSize: 1 })).subscribe(
                res => {
                    if (res['entities'] && res['entities'].length === 1) {
                        entity = res['entities'][0];
                    }
                },
                err => {
                    this.core._setGrwolMsg({
                        severity: 'error',
                        summary: 'Start tree structure',
                        detail: 'No data class selected!'
                    });
                },
                () => {
                    const key = kbv(entity, entity['_key']);
                    resolve(key);
                }
            );
        });
    }

    loadNode(event) {
        switch (event.node.entityType) {
            case 'Entity':
                Observable.fromPromise(event.node.entity.fetch()).subscribe(
                    res => {
                        event.node.children = this.getEntityAsNode({ entity: res })['children'];
                    },
                    err => {
                        this.core._setGrwolMsg({
                            severity: 'error',
                            summary: 'Entity expansion failed!',
                            detail: 'Error: ' + err + ' !'
                        });
                    }
                );
                break;
            case 'Collection':
                Observable.fromPromise(event.node.entity.fetch()).subscribe(
                    res => {
                        event.node.children = res['entities'].map(
                            e => {
                                return this.getEntityAsNode({ entity: e });
                            }
                        );
                    },
                    err => {
                        this.core._setGrwolMsg({
                            severity: 'error',
                            summary: 'Entity expansion failed!',
                            detail: 'Error: ' + err + ' !'
                        });
                    }
                );
                break;
        }
    }

    getEntityAsNode(params) {
        const node = {
            label: params.entity._dataClass.name + ' (' + params.entity._key + ')',
            data: params.entity[params.entity._key],
            leaf: true
        };
        let nodeChildren: TreeNode[];

        nodeChildren = Object.keys(params.entity).map(
            key => {
                let _node = { entityType: "Collection", dataType: "Joueur", label: "<b>joueurCollection</b> Joueur (Collection)", leaf: false, entity: "Collection" }


                return _node;
            }
        ).filter(
            f => f !== undefined && f['entityType'] && f['entityType'] !== 'Function'
        );
        node['children'] = nodeChildren;
        return node;
    }

}
