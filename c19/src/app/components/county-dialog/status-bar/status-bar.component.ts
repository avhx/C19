import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit {
  
  @Input()
  countyName: string;

  @Input()
  pointData: any; // 4 items: [x1,y1, x2,y2)]; run is the days spent  apart!
  
  public status_class: string;
  public status_string: string;
  public status_icon: string;
  public html: HTMLElement;

  constructor() {
  }

  ngOnInit() {
    this.status_class = 'warn';
    this.status_string = this.countyName + ' County is not containing the virus!'
    this.status_icon = 'sentiment_very_dissatisfied'
    this.html = window.document.getElementById('parent');
    console.log(this.pointData);
    this.makeDecision();
  }

  public makeDecision() {
    const x1 = this.pointData[0];
    const y1 = this.pointData[1];
    const x2 = this.pointData[2];
    const y2 = this.pointData[3];
    let slope = (y2-y1)/((x2-x1)/(86400000));
    console.log((x2-x1)/(86400000));
    console.log(slope);
    this.html.classList.remove(this.status_class);
    if(slope > 2) {
      //really terrible!
      this.status_class = 'warn';
      this.status_icon = 'sentiment_very_dissatisfied'
      this.status_string = this.countyName + ' County is not containing the virus!'
      this.html.classList.add(this.status_class);
    } else if(slope < 2 && slope > 0) {
      this.status_class = 'meh';
      this.status_icon = 'sentiment_dissatisfied'
      this.status_string = this.countyName + ' County is fairing okay but can lose control of the virus quickly!'
      this.html.classList.add(this.status_class);
    } else if(slope < 0) {
      this.status_class = 'good';
      this.status_icon = 'sentiment_satisfied_alt'
      this.status_string = this.countyName + ' County is containing the virus!'
      this.html.classList.add(this.status_class);
    } else {
      this.status_class = 'normal'; // normal == 'cannot compute right now'
      this.status_icon = 'sentiment_satisfied'
      this.status_string = 'N/A'
      this.html.classList.add(this.status_class);
    }
  }

}
