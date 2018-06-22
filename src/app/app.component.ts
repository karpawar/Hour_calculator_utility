import { Component, OnInit } from '@angular/core';

interface TimeDay {
  full: any;
  hrs: any;
  mins: any;
}

interface SingleDay {
  date: any;
  startTime: any;
  endTime: any;
  workHours: TimeDay;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  allDayTime: SingleDay[] = [];
  title = 'app';
  content: any = '';
  hours = [];
  mins = [];
  dayCount = 0;
  sumHours = 0;
  sumMins = 0;
  reqHours = 0;
  finHours = 0;
  message = '';
  message2 = '';
  messageLeaveBy = '';
  monthWorkingDays = 0;
  monthWorkingHours = 0;

  finHoursInMINS = 0;
  reqHoursInMINS = 0;
  finHoursMins: any = 0;

  ngOnInit() {
    this.monthWorkingDays = this.weekdaysInMonth(new Date().getFullYear(), new Date().getMonth());
    this.monthWorkingHours = this.monthWorkingDays * 8;
  }

  OnCalculate() {
    const contentArray = this.content.split('\n');

    for (let i = 0; i < contentArray.length; i++) {
      let oneDay: SingleDay = { date: null, startTime: null, endTime: null, workHours: null };

      if (contentArray[i].startsWith('Net Hrs : ')) {

        const tempTime = contentArray[i - 1]; // has string : 09:28 -	19:05

        oneDay['startTime'] = tempTime.split('-')[0];
        oneDay['endTime'] = tempTime.split('-')[1].replace('\t', '');

        this.reqHours += 8;
        this.dayCount += 1;

        const tempArray: any = contentArray[i].split(' ');
        const hrs: string = tempArray[3].split(':')[0];
        const min: string = tempArray[3].split(':')[1];
        this.hours.push(hrs);
        this.mins.push(min);

        oneDay['workHours'] = { full: '', hrs: '', mins: '' };
        oneDay['workHours']['full'] = tempArray[3];
        oneDay['workHours']['hrs'] = hrs;
        oneDay['workHours']['mins'] = min;

        this.sumHours += parseInt(hrs, 10);
        this.sumMins += parseInt(min, 10);

        console.log('oneDay : ' + JSON.stringify(oneDay));
        this.allDayTime.push(oneDay);
      }
    }
    console.log('hours : ' + this.hours);
    console.log('Total Hours => ' + this.sumHours);
    console.log('mins : ' + this.mins);
    console.log('Toltal Mins => ' + this.sumMins);

    let mintoHours = this.sumMins / 60;
    mintoHours = parseInt(mintoHours.toFixed(2), 10);
    console.log('min to hours => ' + mintoHours);

    let endMin = this.sumMins % 60;
    console.log('KP END min to hours => ' + endMin);

    const finalHours = this.sumHours + mintoHours;

    console.log('==============================================================================');
    this.finHours = finalHours;
    console.log('Total Hours :: ' + this.finHours);
    console.log('Required Hours :: ' + this.reqHours);

    this.finHoursInMINS = (this.finHours * 60) + endMin;
    this.reqHoursInMINS = this.reqHours * 60;

    this.finHoursMins = this.finHoursInMINS / 60;
    var tempModMin = this.finHoursInMINS % 60;
    this.finHoursMins = parseInt(this.finHoursMins.toString(), 10) + ':' + tempModMin;

    console.log('Total Hours & Mins :: ' + this.finHoursMins);

    console.log('==============================================================================');

    if (finalHours > this.reqHours) {
      console.log(this.finHoursInMINS + '  >  ' + this.reqHoursInMINS);
      const res = finalHours - this.reqHours;
      this.message = 'You have Extra ' + res + ' Hours !!';

      const val2 = (res * 60) / (this.monthWorkingDays - this.dayCount);
      this.message2 = 'Leave Early By ' + val2 + ' Mins for Next ' + (this.monthWorkingDays - this.dayCount) + ' Days To match !';


    } else if (finalHours < this.reqHours) {
      console.log(this.finHoursInMINS + '  <  ' + this.reqHoursInMINS);
      var resValue = this.reqHoursInMINS - this.finHoursInMINS;

      var resValueHR = resValue / 60;
      var resValueMin = resValue % 60;

      const res = this.reqHours - finalHours;
      const lastEndTime = new Date();
      lastEndTime.setHours(this.allDayTime[this.allDayTime.length - 1].endTime.split(':')[0]);
      lastEndTime.setMinutes(this.allDayTime[this.allDayTime.length - 1].endTime.split(':')[1]);
      console.log(lastEndTime);
      lastEndTime.setHours(lastEndTime.getHours() + res);
      console.log(lastEndTime);
      const hh = lastEndTime.getHours() % 12;
      this.message = 'You Need More ' + res + ' Hours !! (' + resValueHR.toFixed(0) + ':' + resValueMin + ')';
      console.log('--- you need more ' + resValueHR.toFixed(0) + ' Hours & ' + resValueMin + ' Mins');
      this.messageLeaveBy = 'Leave by ' + hh + ':' + lastEndTime.getMinutes() + ' PM';
      if (res > 8) {
        const val = res - 8;
        const val2 = (val * 60) / (this.monthWorkingDays - this.dayCount);
        this.message2 = 'Spend ' + val2 + ' Mins more for ' + (this.monthWorkingDays - this.dayCount) + ' Days To match !';
      } else {

      }

    } else {
      const res = this.reqHours - finalHours;
      this.message = 'Yoooo ' + res + ' Hours !!';
    }
    console.log(this.message);
  }

  OnReset() {
    this.content = '';
    this.hours = [];
    this.mins = [];
    this.dayCount = 0;
    this.sumHours = 0;
    this.sumMins = 0;
    this.reqHours = 0;
    this.finHours = 0;
    this.message = '';
    this.message2 = '';
    this.messageLeaveBy = '';
  }

  weekdaysInMonth(year, month) {
    return new Array(32 - new Date(year, month, 32).getDate())
      .fill(1)
      .filter(
        (id, index) =>
          [0, 6].indexOf(
            new Date(year, month, index + 1).getDay()) === -1
      ).length;
  }

}
