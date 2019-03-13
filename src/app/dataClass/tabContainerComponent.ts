import { Output, EventEmitter,Component, Input, Injectable, TemplateRef, OnInit,AfterViewInit } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
    selector: 'tab-container',
    template: `
<ng-template #defaultTabButtons>
    <div class="default-tab-buttons">
        ...entrez un template pour cette Classe
    </div>
</ng-template>
<ng-container 
  *ngTemplateOutlet="templates[indice] ? templates[indice]: defaultTabButtons">
</ng-container>
`,
styleUrls: ['./tabContainer.scss']
})
export class TabContainerComponent implements OnInit,AfterViewInit {
    @Output()
    deleteDynamic: EventEmitter<string> = new EventEmitter();
    @Input()
    className: string;
    @Input()
    templateName: string;
    @Input()
    templates: TemplateRef<any>[];
    public indice: string
    constructor(
        private apiService: ApiService
    ) { }
    ngOnInit() {
        this.indice = this.className
    }
    ngAfterViewInit() {
    }
}
