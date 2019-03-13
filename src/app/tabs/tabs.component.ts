/**
 * The main component that renders single TabComponent
 * instances.
 */
import { Component, ContentChildren, QueryList, AfterContentInit, OnInit, AfterViewInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { TabComponent } from './tab.component';
import { DynamicTabsDirective } from './dynamic-tabs.directive';
import { ApiService, AdminData } from '../shared/api.service';
import { ConfirmationService } from 'primeng/api';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
    selector: 'app-tabs',
    providers: [],
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit, OnInit, AfterViewInit {
    dynamicTabs: TabComponent[] = [];
    @ViewChild(DynamicTabsDirective)
    dynamicTabPlaceholder: DynamicTabsDirective;
    @ViewChild('dataClass') dataClassTemplate;
    @ViewChild('tree') treeTemplate;
    public data: any;
    public className = '';
    public openedDataClasses = {};
    public adminData: AdminData;
    public myScript: string[] = []
    public userSession: {}
    public userOption: {}
    public tabsInited: boolean = true
    public counterAction: number = 0
    public unsubscribe1: Subject<void> = new Subject();
    public unsubscribe2: Subject<void> = new Subject();
    public unsubscribe3: Subject<void> = new Subject();
    public unsubscribe4: Subject<void> = new Subject();
    public unsubscribe5: Subject<void> = new Subject();
    public unsubscribe6: Subject<void> = new Subject();
   /*
      Alternative approach of using an anchor directive
      would be to simply get hold of a template variable
      as follows
    */
    // @ViewChild('container', {read: ViewContainerRef}) dynamicTabPlaceholder;
    constructor(
        public _componentFactoryResolver: ComponentFactoryResolver,
        public api: ApiService,
        public confirmationService: ConfirmationService
    ) {}
    ngAfterViewInit() {}
    evalSimulation() {
        var api = this.api
        var ID = this.userSession['fullName']
        var confirm = this.confirmationService;
        var next = this.next
        var prev = this.prev
        var message = ""
        var actionArray = [
            () => {     
                          
                if (this.userOption == "option2") {
                    
                    this.api.setDataClass({ name: "Joueur", template: "Joueur3",pluckName:"Joueur",freeVisit:false });
                    message = "choisissez le nom de votre joueur, ensuite TAB pour visualiser ses données";
                    this.confirmationService.confirm({ acceptVisible: false, rejectVisible: false, message: message });
                } else {
                    this.next()
                }
            }
            ,
            () => {   
                            
                if (this.userOption == "option2") {
                    
                    this.api.setDataClass({ name: "Joueur", template: "Joueur4",pluckName:"Joueur" ,freeVisit:false });
                }
                else { this.api.setDataClass({ name: "Joueur", template: "Joueur4", filter: "ID==" + ID,pluckName:"Joueur" ,freeVisit:false }); }
                message = (this.userOption == "option2") ? "voici les données du joueur, ensuite TAB pour consulter ses horaires de jeu" : "compléter vos données de joueur, ensuite TAB pour consulter vos horaires de jeu "
                this.confirmationService.confirm({ acceptVisible: false, rejectVisible: false, message: message })
            }
            ,
            () => {
                if (this.userOption == "option1") this.api.setDataClass({ name: this.className, save: true });
                this.api.setDataClass({ name: "Joueur", template: "Joueur1" });
                message = (this.userOption == "option1") ? "ajustez vos horaires en déplaçant les blocs ou les curseurs ! Ensuite, TAB pour valider  vos modifications tout en bas de l'écran" : "consultez les horaires de votre Joueur ! Ensuite, TAB pour la suite de la visite"
                this.confirmationService.confirm({ acceptVisible: false, rejectVisible: false, message: message });
                this.api.setDataClass({ name: "Joueur", save: true });
            }
            ,
            () => {
                message = "essai de joueur4";
                this.api.setDataClass({ name: "Joueur", template: "Joueur4",pluckName:"Joueur" });
                this.confirmationService.confirm({ acceptVisible: false, rejectVisible: false, message: message });
            },
            () => {
                message = "Merci de votre visite";
                this.confirmationService.confirm({ acceptVisible: false, rejectVisible: false, message: message });
            }
        ]
        actionArray[this.counterAction]()

    }
    ngOnInit() {
        setTimeout(() => {
            this.api.dataStoreURLStoreChanges.pluck('userOption').distinctUntilChanged().takeUntil(this.unsubscribe1).subscribe(userOption => {
                if(userOption){
                    
                    this.userOption = userOption as string
                    this.unsubscribe1.next()
                }

            })
            this.api.dataStoreURLStoreChanges.pluck('userSession').distinctUntilChanged().takeUntil(this.unsubscribe2).subscribe(userSession => {
                this.userSession = userSession as {}
                if (this['myScript'] && this.userOption && this.userSession && this.userSession['fullName']) {
                    var api = this.api
                    var ID = this.userSession['fullName']
                    var confirm = this.confirmationService;
                    var next = this.next
                    var prev = this.prev
                    var message=""
                    var userOption=this.userOption                   
                    //eval(this.myScript[this.counterAction])
                    //todo faire très attention indispensable pour la visite guidée
                    //this.evalSimulation()
                    this.unsubscribe2.next()
                }
            })
            this.api.dataStoreURLStoreChanges.pluck('adminData').distinctUntilChanged().takeUntil(this.unsubscribe3).subscribe(adminData => {
                this.adminData = (adminData as AdminData)
                this.unsubscribe3.next()
            })
            this.api.dataStoreURLStore.pluck('visitScript').distinctUntilChanged().takeUntil(this.unsubscribe4).subscribe(
                visitScript => {
                    if (visitScript) {
                        let myString = (visitScript as string)
                        this.myScript = JSON.parse(myString)
                        this.unsubscribe4.next()
                    }
                });
            this.api.dataClassStoreChanges.pluck('filter').distinctUntilChanged().subscribe(
                filter => {
                    if (filter) {
                        setTimeout(() => {
                            this.tabsInited = false
                        }, 0)
                        setTimeout(() => {
                            this.tabsInited = true
                        }, 0)
                    }
                })
            this.api.dataClassStoreChanges.pluck('name').distinctUntilChanged().takeUntil(this.unsubscribe6).subscribe(
                name => {
                    this.className = name.toString();
                    this._openTab();
                    let myTab
                    if (this.dynamicTabs) {
                        this.dynamicTabs.forEach(_tab => {
                            if (_tab.title == this.className) {
                                myTab = _tab
                            }
                        })
                    }
                    this.selectTab(myTab)
                });
                //this.unsubscribe6.next()
        }, 0)
    }
    next() {
        //this.api.setDataClass({ name: this.className, save: true })
        var action = this.counterAction++
        var api = this.api
        var ID = this.userSession['fullName']
        var confirm = this.confirmationService;
        var next = this.next
        var prev = this.prev
        var message=""
        var userOption=this.userOption
        
        //eval(this.myScript[this.counterAction])
        this.evalSimulation()
    }
    prev() {
        //this.api.setDataClass({ name: this.className, save: true })
        var action=this.counterAction--
        var api = this.api
        var ID = this.userSession['fullName']
        var confirm = this.confirmationService;
        var next = this.next
        var prev = this.prev
        var message=""
        var userOption=this.userOption
        
        //eval(this.myScript[this.counterAction])
        this.evalSimulation()
    }
    selectTab(tab: TabComponent) {
        setTimeout(() => {
            this.dynamicTabs.forEach(_tab => _tab.active = false);
            // activate the tab the user has clicked on.
            if (tab) {
                tab.active = true;
                if (tab.title !== "Tree") {
                    
                    (this.adminData.isAdmin) ? this.api.setDataClass({ name: tab.dataContext,pluckName:tab.dataContext }) : {};
                }
            }
        }, 0)
    }
    // contentChildren are set
    ngAfterContentInit() {

        this.openTab(this.dynamicTabs.length, 'Tree', this.treeTemplate, {}, false);
    }
    _openTab() {

        if (this.className.length > 0) {
            if (!this.openedDataClasses[this.className] || this.openedDataClasses[this.className] === false) {
                this.openTab(this.dynamicTabs.length, this.className, this.dataClassTemplate, this.className, true);
                this.openedDataClasses[this.className] = true;
            }
        }
    }
    openTab(id: number, title: string, template, data, isCloseable = false) {

        // get a component factory for our TabComponent
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(TabComponent);
        // fetch the view container reference from our anchor directive
        const viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
        // alternatively...
        // let viewContainerRef = this.dynamicTabPlaceholder;
        // create a component instance
        const componentRef = viewContainerRef.createComponent(componentFactory);
        // set the according properties on our component instance
        const instance: TabComponent = componentRef.instance as TabComponent;
        instance.id = id;
        instance.title = title;
        instance.template = template;
        instance.dataContext = data;
        instance.isCloseable = isCloseable;
        // remember the dynamic component for rendering the
        // tab navigation headers
        this.dynamicTabs.push(componentRef.instance as TabComponent);
        // set it active
        this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
    }
    closeTab(tab: TabComponent) {
        this.openedDataClasses[tab.title] = false;
        for (let i = 0; i < this.dynamicTabs.length; i++) {
            if (this.dynamicTabs[i] === tab) {
                // remove the tab from our array
                this.dynamicTabs.splice(i, 1);
                // destroy our dynamically created component again
                const viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
                // let viewContainerRef = this.dynamicTabPlaceholder;
                viewContainerRef.remove(i);
                // set tab index to 1st one
                break;
            }
        }
    }
    closeActiveTab() {
        const activeTabs = this.dynamicTabs.filter((tab) => tab.active);
        if (activeTabs.length > 0) {
            // close the 1st active tab (should only be one at a time)
            this.closeTab(activeTabs[0]);
        }
    }
}
