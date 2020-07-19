import { Component, OnInit, Inject } from '@angular/core';
import { FyrebaseService } from '../../fyrebase.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ChartDataSets, ChartOptions, ChartData } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-county-dialog',
  templateUrl: './county-dialog.component.html',
  styleUrls: ['./county-dialog.component.scss']
})
export class CountyDialogComponent implements OnInit {

  public countyData: any;
  public countyTitle: string;
  public dialogBarrier: number = 2;

  public currentActive: Number;
  public currentTotalCase: Number;
  public currentDeathCount: Number;

  public mobilityTable = [
    {'grocery_pharmacy': 0},
    {'park_pct': 0},
    {'retail_recreation_pct': 0},
    {'transit_pct': 0},
    {'workplace_pct': 0}
  ]

  displayedColumns: string[] = ['grocery_pharmacy', 'park_pct', 'retail_recreation_pct','transit_pct', 'workplace_pct'];

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

  // Graph for just Knoxville: Age distribution
  public lineChartAgeData: ChartDataSets[] = [];
  public lineChartAgeLabels: Label[] = [];
  public lineChartAgeOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'Knox County COVID-19 Age Demographics Trend'
    }
  }

  // Bar chart for current Knoxville Age Distributions:
  public barChartAgeData: ChartDataSets[] = [];
  public barChartAgeLabels: Label[] = [];
  public barChartAgeOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'Knox County COVID-19 Age Demographics'
    }
  };
  public barChartType = 'bar';

  constructor(private fyrebase: FyrebaseService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogBarrier = 2;
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
        this.dialogBarrier -= 1;
      }
    )

    this.fyrebase.getCountyDataExtended(this.data.name).then(
      (val) => {
        this.lineChartAgeLabels = val.labels;
        let latestValues = [];
        let ageLabels = [];

        val.datasets.forEach(element => {
          latestValues.push(element.data[element.data.length-1])
          ageLabels.push(element.label);
          this.lineChartAgeData.push({data: element.data, label: element.label, fill: element.fill});
        });

        // bar chart:
        this.barChartAgeData.push({data: latestValues, label: "Infected Cases"})
        this.barChartAgeLabels = ageLabels;
        this.dialogBarrier -= 1;
      }, (err) => {
        console.log('not knox.. ignoring extra fetch...');
        this.dialogBarrier -= 1;
      }
    )
  }

}
