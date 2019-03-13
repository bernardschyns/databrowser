import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { Wakanda } from '../wakanda.service';
import { ApiService ,AdminData} from '../shared/api.service';
import { Observable, Subject } from 'rxjs';
import { AppComponent } from '../app.component';
import { AgGridClassComponent } from '../dataClass/agGridClass/agGridClass.component';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#62f442',
    secondary: '#62f442'
  }
};

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['styles.css'],
  templateUrl: 'calendarComponent.html'
})
export class CalendarComponent implements AfterViewInit {
  public adminData: AdminData;
  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  className: string
  entity: any
  constructor(
    private modal: NgbModal,
    private wakanda: Wakanda,
    private api: ApiService,
    private core: AppComponent,
    public agGridClassComponent: AgGridClassComponent
  ) {
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }
  handleEvent(action: string, event: CalendarEvent): void {
    
    (action=='Dropped or resized')?this.entity['horaireCollection']['changed']=true:{}
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }
  ngAfterViewInit() {
    // setTimeout(() => {
      this.api.dataStoreURLStoreChanges.pluck('adminData').distinctUntilChanged().subscribe(adminData => {  
        this.adminData=(adminData as AdminData)        
      })
    this.api.dataClassStoreChanges.pluck('name').subscribe(
      name => {        
        this.className = (name as string);
        
        
        this.agGridClassComponent.index$.indexStoreChanges.subscribe(
          index => {    
            let singleLine = this.agGridClassComponent.entities[index]          
              let myJoueur = this.entity = singleLine           
              if (singleLine) {
                this.entity['horaireCollection'].fetch().then(horaires => {
                  this.events = []
                  horaires['fetched']=true
                  if (horaires.entities.length !== 0) {
                    horaires.entities.map(horaire => {
                      horaire.event.events.map(event => {
                        let start = event.start
                        let end = event.end
                        let title = event.title
                        event.start=new Date(start)
                        event.end=new Date(end)
                        this.events.push(event)
                      })
                    })
                    this.refresh.next();
                  }
                })
              }
          }
        );
      });
    // }, 0)
  }
  submit() {
    try {
      if (this.entity) {        
        this.entity['horaireCollection']['entities'].map(horaire => {
            horaire.event = { 'events': this.events }
            horaire.save()
            Observable.fromPromise(this.entity.save()).subscribe(
              res => {
                this.core._setGrwolMsg({
                  severity: 'success',
                  summary: 'Save data',
                  detail: 'Calendar saved successful!'
                });
              },
              err => {
                this.core._setGrwolMsg({
                  severity: 'error',
                  summary: 'Save data',
                  detail: 'Could not save data!'
                });
              }
            );
          })
      } else {
        this.core._setGrwolMsg({
          severity: 'error',
          summary: 'Save data',
          detail: 'No entity selected!'
        });
      }
    } catch (err) {
      this.core._setGrwolMsg({
        severity: 'error',
        summary: 'Transaction failed',
        detail: 'Error message: ' + err + '!'
      });
    }
  }
  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }
}
