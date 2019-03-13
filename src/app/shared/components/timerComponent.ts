import { Component, OnInit } from '@angular/core';
import { Observable, interval, defer, BehaviorSubject,Subscription } from 'rxjs';
import { mapTo, reduce, take, tap, filter, map, share, withLatestFrom } from 'rxjs/operators'

@Component({
    selector: 'timer',
    template: ` 
        <h1>
            {{hoursDisplay ? hoursDisplay : '00'}} : {{(minutesDisplay) && (minutesDisplay <= 59) ? minutesDisplay : '00'}} : {{(secondsDisplay) && (secondsDisplay <= 59) ? secondsDisplay : '00'}} <br/>
        </h1>
        <button (click)="paused.next(true)">Pause</button>
        <button (click)="paused.next(false)">Continue</button>
        <button (click)="dismiss()">Dimiss</button>
    `,
    styles: [`
        h1 {
            color: #57acec;
            margin-top: 24px; 
            text-align: center;   
        }    
    `]
})
export class TimerComponent implements OnInit {

    ticks = 0;

    minutesDisplay: number = 0;
    hoursDisplay: number = 0;
    secondsDisplay: number = 0;

    sub: Subscription;
    paused = new BehaviorSubject<boolean>(false);


    ngOnInit() {
        //this.startTimer();
        let notification=this.getPausableTimer(115, this.paused)
        notification.stepTimer.subscribe(()=>{})

    }

    private startTimer() {

        let timer = Observable.timer(1, 1000);
        this.sub = timer.subscribe(
            t => {
                this.ticks = t;

                this.secondsDisplay = this.getSeconds(this.ticks);
                this.minutesDisplay = this.getMinutes(this.ticks);
                this.hoursDisplay = this.getHours(this.ticks);
            }
        );
    }

    private getSeconds(ticks: number) {
        return this.pad(ticks % 60);
    }

    private getMinutes(ticks: number) {
        return this.pad((Math.floor(ticks / 60)) % 60);
    }

    private getHours(ticks: number) {
        return this.pad(Math.floor((ticks / 60) / 60));
    }

    private pad(digit: any) {
        return digit <= 9 ? '0' + digit : digit;
    }
    dismiss() {
        // this.keys = this.keys.filter(v => v !== key);
        // delete this.notifications[key];
      }
    getPausableTimer(timeout: number, pause: BehaviorSubject<boolean>):
     { stepTimer: Observable<any>, completeTimer: Observable<any> }
      {
        const pausableTimer$ = defer(() => {
            let seconds = 1;
            return interval(1000).pipe(
                withLatestFrom(pause),
                filter(([v, paused]) => !paused),
                take(timeout),
                map(() =>{
                    seconds++
                    
                    this.secondsDisplay = this.getSeconds(seconds);
                    this.minutesDisplay = this.getMinutes(seconds);
                    this.hoursDisplay = this.getHours(seconds);
                    return seconds })
            )
        }).pipe(share());

        return { stepTimer: pausableTimer$, completeTimer: pausableTimer$.pipe(reduce((x, y) => y)) }
    }
}