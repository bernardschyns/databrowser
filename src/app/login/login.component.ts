import { Component } from '@angular/core';
import { AuthenticationService, User } from '../authentication.service'
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NewsletterService } from "../services/newsletter.service";
import { SwPush, SwUpdate } from "@angular/service-worker";
import { Wakanda } from '../wakanda.service';
import { Observable, Subject } from 'rxjs/Rx';


@Component({
    selector: 'login-form',
    providers: [AuthenticationService],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public wakandaLogin;
    public user = new User('', '', 'option1');
    public errorMsg = '';
    public loginLoaded: boolean = false;
    readonly VAPID_PUBLIC_KEY = "BBYpvbQyS9-f-SowHgHtRKv3nxxv_3LVTdSAgaMhOJSUJqY9Fl7XawHA1ZM4ES_tuxjpPatXh5c3wlN_N6XQjLw";
    public dataStoreUrl = 'http://localhost:8081';

    sub: PushSubscription;
    constructor(
        public wakanda: Wakanda,
        private authService: AuthenticationService,
        private router: Router,
        private api: ApiService,
        public location: Location,
        private swPush: SwPush,
        private newsletterService: NewsletterService,
        private swUpdate: SwUpdate
    ) { }
    ngOnInit() {
        // si l'application est offline, c'est ici que l'on devrait tenter de
        //directement charger l' "app" sans redemander le login
        const browserState: string = (navigator.onLine) ? "online" : "offline"
        if (browserState == "offline") {
            this.wakanda.__catalog
            this.api.setDataStoreURL({ url: this.dataStoreUrl })

            let adminData =
                {
                    isAdmin: true,
                    isVisit: false,
                }

            this.api.setDataStoreURL({ 'adminData': adminData })
            this.loginLoaded = true
            this.router.navigate(['app']);
        }
        if (this.swUpdate.isEnabled) {
            this.swUpdate.available.subscribe(() => {
                if (confirm("New version available. Load New Version?")) {
                    window.location.reload();
                }
            });
        }
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
    login() {
        //désactivons pour Piet, la fonctionnalité de base du login
        // this.loginLoaded = true
        // this.router.navigate(['app']);      
        this.authService.login(this.user).then(result => {
            if (result) {
                this.authService.getCurrentUserBelongsTo().then(result => {

                    let adminData = (result) ?
                        {
                            isAdmin: true,
                            isVisit: false,
                        } :
                        {
                            //isAdmin: false,
                            isAdmin: true,
                            isVisit: false,
                            //isVisit: true,
                        }
                    this.api.setDataStoreURL({ 'adminData': adminData })
                    this.authService.getCurrentUser(this.user).then(result => {
                    })
                })
            }
            this.loginLoaded = true
            this.router.navigate(['app']);
        }).catch((errorMessage) => {
            this.errorMsg = errorMessage;
        });
    }
    subscribeToNotifications() {
        console.log("on y passe")
        this.swPush.requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC_KEY
        })
            .then(sub => {
                this.sub = sub;
                console.log("Notification Subscription: ", sub);
                this.newsletterService.addPushSubscriber(sub).subscribe(

                    () => {

                        console.log('Sent push subscription object to server.')
                    },
                    err => console.log('Could not send subscription object to server, reason: ', err)
                );
            })
            .catch(err => console.error("Could not subscribe to notifications", err));
    }
    sendNewsletter() {

        console.log("Sending Newsletter to all Subscribers ...");
        this.newsletterService.send().subscribe();
    }
}

