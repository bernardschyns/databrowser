import { Component} from '@angular/core';
@Component({
    selector: 'timer',
    template: ` 
        <h1>
         {{monNode['data']['timerStarted']?' ':'('}}  
          {{hoursDisplay ? hoursDisplay : '00'}} : {{(minutesDisplay) && (minutesDisplay <= 59) ? minutesDisplay : '00'}} :
           {{(secondsDisplay) && (secondsDisplay <= 59) ? secondsDisplay : '00'}}
           {{monNode['data']['timerStarted']?' ':')'}}
            <br/>
        </h1>
    `,
    styles: [`
        h1 {
            color: #57acec;
            margin-top: 4px; 
            text-align: center;  
            font-size: 12px; 
        }    
    `]
})
export class TimerFormatterComponent  {
    params: any;
    minutesDisplay: number = 0;
    hoursDisplay: number = 0;
    secondsDisplay: number = 0;
    public monNode: any;
    agInit(params: any): void {
        this.params = params;
        this.monNode = this.params.node       
        //params=11
        // let notification=this.getPausableTimer(115, this.paused)
        // notification.stepTimer.subscribe(()=>{})
        this.secondsDisplay = this.getSeconds(params.value);
        this.minutesDisplay = this.getMinutes(params.value);
        this.hoursDisplay = this.getHours(params.value);
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
}