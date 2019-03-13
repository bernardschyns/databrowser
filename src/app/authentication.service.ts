import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Wakanda } from './wakanda.service';
import { IDataClasses, ApiService,AdminData } from './shared/api.service';

export class User {


  constructor(
    public logon: string,
    public password: string,
  public userOption:string) { }
}

@Injectable()
export class AuthenticationService {

  constructor(
    private wakanda: Wakanda,
    private api: ApiService
  ) { }

  logout() {
    return new Promise((resolve, reject) => {
      this.wakanda.directory.logout().then(result => {
        resolve(result);
      }).catch((error) => {
        reject(error.message);
      });
    });
  }

  login(user) {
    return new Promise((resolve, reject) => {
      
      this.wakanda.directory.login(user.logon, user.password, 60).then(result => {

        resolve(result);
      }).catch((error) => {
        reject(error.message);
      });
    });
  }
  getCurrentUser(user) {
    
    return new Promise((resolve, reject) => {
      this.wakanda.directory.getCurrentUser().then(result => {
        
        
        Observable.fromPromise(this.wakanda.__catalog).subscribe(
          catalog => {
            let dataClass = catalog['WakandaLogin'];
            let entity = {};
            Observable.fromPromise(dataClass.find(result['fullName'])).subscribe(
              res => {
                
                this.api.setDataStoreURL({ 'userSession': res['userSession'],'userOption':user.userOption })
              }
            )
          }
        )
        return resolve(result)
      }).catch((error) => {
        reject(error.message);
      });
    })
  }
  getCurrentUserBelongsTo() {
    return new Promise((resolve, reject) => {
      this.wakanda.directory.getCurrentUserBelongsTo("Admin").then(result => {
        resolve(result);
      }).catch((error) => {
        reject(error.message);
      });
    });
  }

  checkCredentials() {
    return new Promise((resolve, reject) => {
      this.wakanda.directory.getCurrentUser().then((user) => {
        resolve(user);
      }).catch((error) => {
        reject(error.message);
      });
    });
  }
}
