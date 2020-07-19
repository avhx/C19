import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit {
  
  @Input()
  countyName: string;
  
  public status_class: string;
  public status_string: string;
  public status_icon: string;

  constructor() {
  }

  ngOnInit() {
    this.status_class = 'warn';
    this.status_string = this.countyName + ' County is not containing the virus!'
    this.status_icon = 'sentiment_very_dissatisfied'
  }

}
