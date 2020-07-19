import { Component, OnInit, Inject } from '@angular/core';
import { FyrebaseService } from '../../fyrebase.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-county-dialog',
  templateUrl: './county-dialog.component.html',
  styleUrls: ['./county-dialog.component.scss']
})
export class CountyDialogComponent implements OnInit {

  public countyData: any;
  public countyTitle: string;
  public dialogLoaded: boolean;

  public currentActive: Number;
  public currentTotalCase: Number;
  public currentDeathCount: Number;

  // Graph for totalCases & totalDeath
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'Graph Title'
    }
  };
  public lineChartLegend = true;
  public lineChartType = 'line';

  constructor(private fyrebase: FyrebaseService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogLoaded = false;
    this.countyTitle = this.data.name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    this.currentActive = 0;
    this.currentTotalCase = 0;
    this.currentDeathCount = 0;
  }

  ngOnInit() {
    this.fyrebase.getCountyData(this.data.name).then(
      (val) => {
        console.log(val);

        // update counters:
        this.currentActive = val.total_active[val.total_active.length-1]
        this.currentTotalCase =  val.total_cases[val.total_cases.length-1]
        this.currentDeathCount = val.total_death[val.total_death.length-1]

        this.lineChartLabels = val.date_labels;
        this.lineChartData.push({data: val.total_cases, label: 'Total Cases'});
        this.lineChartData.push({data: val.total_death, label: 'Total Deaths'});
        this.lineChartOptions.title.text = 'Total Cases/Deaths of COVID-19 in '+this.countyTitle + ' County';
        this.dialogLoaded = true;
        console.log(this.lineChartData);
      }
    )
  }

}
