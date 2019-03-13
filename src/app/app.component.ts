import { Component, OnInit, ViewEncapsulation,AfterViewInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { GrowlModule, Message } from 'primeng/primeng';
import { ApiService,AdminData } from './shared/api.service';
import {ComponentCanDeactivate} from './can-deactivate/component-can-deactivate';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export   class AppComponent  extends ComponentCanDeactivate implements OnInit, AfterViewInit {
  public msgs: Message[] = [];
  public adminData:AdminData
  public isVisitLoad = false;
  public isCatalogLoad = false;
  constructor(
    public location: Location,
    private api: ApiService
  ) {super()
  }
  ngOnInit() {
  }
  canDeactivate() {
    //todo return false pour réactiver ce service et attirer l'attention 
    //de l'utilisateur d'enregistrer ses données
    return true
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.api.dataStoreURLStoreChanges.pluck('adminData').distinctUntilChanged().subscribe(adminData => {
        this.adminData=(adminData as AdminData)        
        if (this.adminData['isAdmin']) {         
          this.isVisitLoad = false
        }
      })
    }, 0)
  }
  visitLoad($event) {
    setTimeout(() => {
      this.isVisitLoad = false
    }, 0)
  }
  catalogLoad($event) {
    
    setTimeout(() => {
      this.isCatalogLoad = true
    }, 0)
  }
  isMap(path) {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice(1);
    if (path === titlee) {
      return false;
    }
    else {
      return true;
    }
  }
  _setGrwolMsg(params) {
    this.msgs=[]
    this.msgs.push({
      severity: params.severity,
      summary: params.summary,
      detail: params.detail
    });
  }
}
