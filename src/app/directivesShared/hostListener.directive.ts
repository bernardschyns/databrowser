import { Input, Directive, HostListener, TemplateRef, ViewContainerRef, ElementRef, Renderer, OnInit } from '@angular/core';
import {IDataListes, IDataClasses, IDataClass2, ApiService,AdminData } from '../shared/api.service';
import { Observable, Subject } from 'rxjs/Rx';
@Directive({
    selector: '[appMoveTemplate]'
})
export class HostListenerDirective implements OnInit {
    myImage:any
    numClicks = 0;
    numClicksWindow = 0;
    @Input() appMoveTemplate: boolean;

    private unsubscribe1: Subject<void> = new Subject();
    private unsubscribe3: Subject<void> = new Subject();

    private className:string
    private templateName:string
    private selector:string
    private posX:string
    private posY:string
    private position : any

    constructor(
        private el: ElementRef,
        private renderer: Renderer,
        private api: ApiService,
    ) {
    }
    ngOnInit(){
        this.api.dataClassStoreChanges.takeUntil(this.unsubscribe1).distinctUntilChanged().subscribe(
            dataClass => {
                this.className = (dataClass.name) ? (dataClass.name as string) : ""
                this.templateName=(dataClass.template)?(dataClass.template as string):'default'
                this.unsubscribe1.next();
            }
        )
        this.api.dataClassesStoreChanges.pluck(this.className).distinctUntilChanged().pluck(this.templateName).distinctUntilChanged().pluck('position').takeUntil(this.unsubscribe3).subscribe(
            position  => {
                this.position=position as any

                this.unsubscribe3.next()
            })
        
        this.selector = this.el.nativeElement.tagName.toLowerCase();
        // this.posX=this.appMoveTemplate.position["TennisClassement-TennisClassement"].posX
        // this.posY=this.appMoveTemplate.position["TennisClassement-TennisClassement"].posY
        this.posX=this.position[this.selector].posX
        this.posY=this.position[this.selector].posY
        this.renderer.setElementStyle(this.el.nativeElement, 'position', 'absolute');  
        this.renderer.setElementStyle(this.el.nativeElement, 'left', this.posX);            
        this.renderer.setElementStyle(this.el.nativeElement, 'top', this.posY);     
  

    }
}