/**
 * A single tab page. It renders the passed template
 * via the @Input properties by using the ngTemplateOutlet
 * and ngOutletContext directives.
 */

import { Component, Input,OnInit } from '@angular/core';

@Component({
  selector: 'my-tab',
  styles: [`
    .pane{
      width:14OOpx;
      padding: 1em;
    }
  `],
  template: `
    <div [hidden]="!active" class="pane">
      <ng-content></ng-content>
      <ng-container *ngIf="template"
        [ngTemplateOutlet]="template"
        [ngTemplateOutletContext]="{ className: dataContext}"
      >
      </ng-container>
    </div>
  `
})
export class TabComponent {
  @Input('tabTitle') title: string;
  @Input() id;
  @Input() active = false;
  @Input() isCloseable = false;
  @Input() template;
  @Input() dataContext;
  constructor(){
  }
  ngOnInit() {
    
  }
}
