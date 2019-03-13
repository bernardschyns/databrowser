import {
    Directive, HostListener, ComponentFactoryResolver, ComponentFactory, ViewContainerRef, ComponentRef, ElementRef, Renderer, OnInit, Input
} from '@angular/core';
import { TextEditorPageComponent } from '../dataClass/agGridSharedComponents/textEditorPageComponent';
import { PhotoEditorPageComponent } from '../dataClass/agGridSharedComponents/photoEditorPageComponent';
import { AgGridClassComponent } from '../dataClass/agGridClass/agGridClass.component';
import { takeUntil} from 'rxjs/operators';
import 'rxjs/add/operator/distinctUntilChanged';



@Directive({
    selector: '[appSubMenu]',
})
export class SubMenuDirective implements OnInit {

    private open: boolean = false;
    private textEditorPageRef: ComponentRef<TextEditorPageComponent>;
    private editorPageRef: ComponentRef<any>;
    private textEditorPageCpntFactory: ComponentFactory<TextEditorPageComponent>;
    private editorPageCpntFactory: ComponentFactory<any>;
    private catalog: any
    private className:string
    private selectedEntity:any
    private model:string
    private dataStoreUrl:string
    private oldSrc:string
    private attributeType:string
    private oldValue:any
    private myAttribute:any


    @Input() condition: any
    // Trigger click on the Host of the Directive
    @HostListener('click') toggleSubMenu() {

        if (this.open) { // Based on the flag, the click will open or close the SubMenu
            this.closeSubMenu();
        } else {
            this.openSubMenu();
        }
    }
    constructor(
        private el: ElementRef,
        private renderer: Renderer,
        private resolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef,
        private agGridClassComponent: AgGridClassComponent,
    ) {
        // Create the Factory building SubMenuComponent
        
        this.model=this.el.nativeElement.name
        //this.catalog=agGridClassComponent.catalog
        this.className=agGridClassComponent.className
        agGridClassComponent.index$.indexStoreChanges.subscribe(index=>{
            this.selectedEntity=agGridClassComponent.entities[index]
            if (this.selectedEntity['photo']) {
                this.oldSrc = `http://localhost:8081${this.selectedEntity['photo']['uri']}`
            }
        })

        this.dataStoreUrl=(agGridClassComponent.dataStoreUrl)?agGridClassComponent.dataStoreUrl:`http://localhost:8081`
        this.myAttribute = this.selectedEntity['_dataClass'].attributes.find(
            attribute => {
                return attribute.name == this.model
            })
            
            this.attributeType=(this.myAttribute.type)? this.myAttribute.type:"string"
            switch (this.attributeType) {
                case ('image'):              
                {
                    
                this.editorPageCpntFactory = this.resolver.resolveComponentFactory(PhotoEditorPageComponent);
                this.oldSrc=`${this.dataStoreUrl}${this.selectedEntity[this.myAttribute.name]['uri']}`
                break                   
                }
                case ('string'):
                default:
                {
                    this.editorPageCpntFactory = this.resolver.resolveComponentFactory(TextEditorPageComponent);
                    break
                }
            }
    }
    ngOnInit() {      
    }
    private openSubMenu() {

        // Make sure the container reference is empty
        this.viewContainerRef.clear();
        // Make the container reference instanciate the component from the Factory
        this.editorPageRef = this.viewContainerRef.createComponent(this.editorPageCpntFactory);
        const instance = this.editorPageRef.instance;
        instance.model = this.el.nativeElement.name
        instance.entity = this.agGridClassComponent.selectedEntity
        instance.value = instance.entity[instance.model]
        this.oldValue=instance.value
        instance.src = this.oldSrc
        this.open = true;
        // Subscribe to 'close' Subject to handle the component desctruction
        // Using this allow to trigger this destruction from either the directive or the component
        this.editorPageRef.instance.close.subscribe(res => {
            
            if(res!==this.oldValue){
                this.selectedEntity['changed']='update'
            }
            if(res && res['src']){ 
                if(res['src']!==this.oldSrc){
                    this.el.nativeElement['src']=res['src']
                    this.selectedEntity['changed']='update'
                }              
            }
            if(this.attributeType=="object"){               
                    this.selectedEntity[this.model] = JSON.parse(res)
            }           
            // Unsubsribe to avoid memory leak
            this.editorPageRef.instance.close.unsubscribe();
            // Destroy the compoenent from its reference
            this.editorPageRef.destroy();
            // Clear the container reference as well
            this.viewContainerRef.clear();
            this.open = false;
        });
    }
    private closeSubMenu() {
        
        switch (this.attributeType) {
            case ('image'):              
            {
                this.editorPageRef.instance.close.next(this.editorPageRef.instance.src);

            break                   
            }
            case ('string'):
            default:
            {
                this.editorPageRef.instance.close.next(this.editorPageRef.instance.value);
                break
            }
        }



        // this.el.nativeElement.value = this.textEditorPageRef.instance.textInput.nativeElement.value
        // let event = new Event('change');
        // this.el.nativeElement.dispatchEvent(event)
        // this.el.nativeElement['ng-reflect-model'] = this.textEditorPageRef.instance.textInput.nativeElement.value

        // Trigger the destruction
    }
}