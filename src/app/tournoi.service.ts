import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Wakanda } from './wakanda.service';
import {tournoiCreate} from './tournoiCreate'
// import * as format from 'date-fns/format';
// import * as addHours from 'date-fns/add_hours';
// import * as addDays from 'date-fns/add_days';
// import * as startOfDay from 'date-fns/start_of_day';
// import * as startOfHour from 'date-fns/start_of_hour';
// const moment = extendMoment(moment2);
// import * as moment2 from 'moment';
// import { extendMoment } from 'moment-range';

@Injectable()
export class TournoiService {
    //variables amont
    public ds;
    constructor(
        private wakanda: Wakanda
    ) { }



    tournoiInit() {
        Observable.fromPromise(this.wakanda.catalog).subscribe(
            ds => {
                
                tournoiCreate(ds)
            }
        )
    }
    
}

