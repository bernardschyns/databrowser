import { Input, Directive, HostListener, TemplateRef, ViewContainerRef, ElementRef, Renderer, OnInit } from '@angular/core';
import { Wakanda } from '../wakanda.service';
import { Observable, Subject } from 'rxjs';
import { ApiService, AdminData } from '../shared/api.service';
import { AppComponent } from '../app.component';
@Directive({
    selector: '[count]'
})
export class MoveInputDirective implements OnInit {
    myImage: any
    condition: boolean;
    numClicks = 0;
    numClicksWindow = 0;
    private timeout = null
    private selector: string = ""
    private unsubscribe6: Subject<void> = new Subject();
    private className: string = ""
    private entity: any
    private departX = 0
    private departY = 0
    private arriveeX = 0
    private arriveeY = 0
    private translationX = 0
    private translationY = 0


    @HostListener("keydown", ["$event"])
    onKeyDown = event => {
        // setTimeout(event => {
        if (event.key == "Alt") {
            event.stopPropagation();
            //event.currentTarget.style.backgroundColor = "aquamarine"
            
            this.departX = this.el.nativeElement.offsetLeft
            this.departY = this.el.nativeElement.offsetTop

            this.moveElement(this.myImage)

        }
        // }, 1000)
    }
    @HostListener('keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.key == "Alt") {
            event.stopPropagation();
            this.arriveeX = this.el.nativeElement.offsetLeft
            this.arriveeY = this.el.nativeElement.offsetTop
            this.translationX = this.departX - this.arriveeX
            this.translationY = this.departY - this.arriveeY
            this.adaptPosition(this.translationX, this.translationY)
            // elmnt.onmousedown = null
            // elmnt.onmouseup = null;
            // elmnt.onmousemove = null;
            // document.onmousedown = null
            // document.onmouseup = null;
            // document.onmousemove = null;
        }
    }
    constructor(
        // private templateRef: TemplateRef<any>,
        // private viewContainer: ViewContainerRef,
        private el: ElementRef,
        private renderer: Renderer,
        private wakanda: Wakanda,
        private api: ApiService,
        private core: AppComponent,
    ) {
        renderer.setElementStyle(el.nativeElement, 'position', 'absolute');
        this.selector = this.el.nativeElement.tagName.toLowerCase();

        this.api.dataClassStoreChanges.pluck('name').distinctUntilChanged().takeUntil(this.unsubscribe6).subscribe(
            name => {
                this.className = name.toString();
            });
        this.unsubscribe6.next()
    }
    onKeyDown2 = (event) => {
        if (event.key == "Alt") {

            this.timeout = throttle(event =>
                setTimeout(() => {
                    event.stopPropagation();
                    // this.myImage=event.currentTarget.parentElement.parentElement.parentElement.querySelector('img')
                    // this.myImage.style.display='block'
                    // this.myImage.style.opacity=0.2
                    // this.myImage.style.width="595px"
                    // this.myImage.style.zIndex="100"
                    event.currentTarget.style.backgroundColor = "aquamarine"
                    this.moveElement(this.myImage)
                }, 5000)
                , 5000, this.timeout)
        }
        function throttle(func, delay, watch) {
            if (watch) {
                clearTimeout(watch)
            }
            return setTimeout(func, delay)
        }
    }
    ngOnInit() {

    }
    adaptPosition(translationX, translationY) {
        
        this.wakanda.catalog['WakandaLogin'].query({ filter: `'dataClass'==${this.className} AND 'type'=='inPage'` }).then(res => {
            this.entity = res['entities'][0]
            this.entity['position'][this.selector]['posX'] = `${parseInt(this.entity.position[this.selector]["posX"]) - translationX}px`
            this.entity['position'][this.selector]['posY'] = `${parseInt(this.entity.position[this.selector]["posY"]) - translationY}px`
            this.entity.save().then(
                res => {
                    
                    this.entity=res
                    this.core._setGrwolMsg({
                        severity: 'success',
                        summary: 'Save data',
                        detail: 'MoveInput saved successful!'
                    });
                },
                err => {
                    this.core._setGrwolMsg({
                        severity: 'error',
                        summary: 'Save data',
                        detail: 'Could not save data!'
                    })
                }
            )
        })
        

    }
    moveElement(myImage) {
        // Make the DIV element draggable:
        dragElement(event.currentTarget);
        function dragElement(elmnt) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, departX = 0, departY = 0, arriveeX = 0, arriveeY = 0, translationX = 0, translationY = 0;
            // otherwise, move the DIV from anywhere inside the DIV: 
            elmnt.onmousedown = dragMouseDown;
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                departX = pos3 = e.clientX;
                departY = pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:

                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }
            function closeDragElement() {
                arriveeX = pos3
                arriveeY = pos4
                translationX = departX - arriveeX
                translationY = departY - arriveeY
                //this.adaptPosition(translationX,translationY)               
                let mesPos = [pos1, pos2, pos3, pos4]
                // stop moving when mouse button is released:
                elmnt.onmousedown = null
                //elmnt.onmouseup = null;
                elmnt.onmousemove = null;
                document.onmousedown = null
                //document.onmouseup = null;
                document.onmousemove = null;

                // myImage.style.display='none'

            }
        }
    }
}