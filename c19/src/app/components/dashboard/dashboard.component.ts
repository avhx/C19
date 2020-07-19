import { Component, OnInit, NgModule } from '@angular/core';
import { MapService, LatLng } from 'src/app/map.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import {} from '@google/maps'; 
import { CountyDialogComponent } from '../county-dialog/county-dialog.component';
import { NewsCardComponent, NewsCard } from '../news-card/news-card.component';
import { ROUTER_CONFIGURATION } from '@angular/router';

import { ChartDataSets, ChartOptions, ChartData } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { FyrebaseService } from 'src/app/fyrebase.service';

import { Observable} from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  newsTN: Observable<NewsCard[]>
  newsTR: Observable<NewsCard[]>
  map: any;

  centerPieceMode = "map";
  
  activeCases: number = 0;
  deathCases: number = 0;
  recoveredCases: number = 0;
  totalCases: number = 0;

  sliderConfig = {
    min: 3,
    max: 7.5,
    step: 1,
  }

  /*
   * GRAPHING STUFF: 
   */

  public lineCasesChartData: ChartDataSets[] = [];
  public lineCasesChartLabels: Label[] = [];
  public lineCasesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: ''
    }
  };
  public lineCasesChartLegend = true;
  public lineCasesChartType = 'line';

////////////////////////////////////////////////////

  public lineAgeChartData: ChartDataSets[] = [];
  public lineAgeChartLabels: Label[] = [];
  public lineAgeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: ''
    }
  };
  public lineAgeChartLegend = true;
  public lineAgeChartType = 'line';

//////////////////////////////////////////////////////

  public lineRaceChartData: ChartDataSets[] = [];
  public lineRaceChartLabels: Label[] = [];
  public lineRaceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: ''
    }
  };
  public lineRaceChartLegend = true;
  public lineRaceChartType = 'line';

/////////////////////////////////////////////////////

  public lineSexChartData: ChartDataSets[] = [];
  public lineSexChartLabels: Label[] = [];
  public lineSexChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: ''
    }
  };
  public lineSexChartLegend = true;
  public lineSexChartType = 'line';

  // pi chart?

  /*
   * GRAPHING STUFF: 
  */

  concentrationMonth = this.sliderConfig.max;

  constructor(private mapService: MapService, private httpClient: HttpClient, private fyre: FyrebaseService) {
    // mapService.loadAPI.then((resolve) => {
    //   console.log("DONE!");
    //   var node = document.createElement("google-map");                 // Create a <li> node
    //   var textnode = document.createTextNode("Water");         // Create a text node
    //   node.appendChild(textnode);                              // Append the text to <li>
    //   document.getElementById("myList").appendChild(node);     // Append <li> to <ul> with id="myList" 
    // }).catch((message) => {
    //   console.log("Map failed to load!" + message);
    // })
  }

  ngOnInit() {
    this.mapService.loadMap("map"); // passes div id="map"
    this.newsTN = this.getNewsTN();
    this.newsTR = this.getNewsTR();

    // this.newsTN.subscribe((data) => console.log(data))

    // var TENNESSEE_BORDER = [
    //   { lng: -90.36, lat: 34.99 },
    //   { lng: -90.17, lat: 35.18 },
    //   { lng: -90.22, lat: 35.44 },
    //   { lng: -90.00, lat: 35.61 },
    //   { lng: -89.98, lat: 35.78 },
    //   { lng: -89.82, lat: 35.84 },
    //   { lng: -89.67, lat: 36.15 },
    //   { lng: -89.75, lat: 36.27 },
    //   { lng: -89.58, lat: 36.39 },
    //   { lng: -89.55, lat: 36.55 },
    //   { lng: -88.08, lat: 36.55 },
    //   { lng: -88.08, lat: 36.73 },
    //   { lng: -81.60, lat: 36.63 },
    //   { lng: -81.67, lat: 36.30 },
    //   { lng: -81.84, lat: 36.29 },
    //   { lng: -82.00, lat: 36.08 },
    //   { lng: -82.33, lat: 36.07 },
    //   { lng: -82.56, lat: 35.90 },
    //   { lng: -82.68, lat: 35.99 },
    //   { lng: -82.98, lat: 35.72 },
    //   { lng: -83.13, lat: 35.72 },
    //   { lng: -83.48, lat: 35.51 },
    //   { lng: -83.86, lat: 35.47 },
    //   { lng: -84.03, lat: 35.22 },
    //   { lng: -84.24, lat: 35.20 },
    //   { lng: -84.30, lat: 34.94 },
    //   { lng: -90.36, lat: 34.99 },
    // ]

    // var border = new google.maps.Polyline({
    //   path: TENNESSEE_BORDER,
    //   geodesic: true,
    //   strokeColor: "#FF0000",
    //   strokeOpacity: 1.0,
    //   strokeWeight: 2
    // });
  
    // border.setMap(this.map);

    /*Load graphs here:*/
    this.fyre.getStateCasesMeta().then((val) => {
      
    })

    this.fyre.getStateCases().then(
      (val) => {
        this.lineCasesChartLabels = val.date_labels;
  
        this.totalCases = val.total_cases[val.total_cases.length-1];
        this.activeCases = val.total_active[val.total_active.length-1];
        this.deathCases = val.total_death[val.total_death.length-1];
        this.recoveredCases = val.total_recovered[val.total_recovered.length-1];

        this.lineCasesChartData.push({data: val.total_cases, label:"Total Infected Cases"});
        this.lineCasesChartOptions.title.text = 'Total Number of Cases of COVID-19 in Tennessee';
      }
    )

    this.fyre._getState('/tn/age_data').then(
      (val) => {
        this.lineAgeChartLabels = val.labels;
        val.datasets.forEach(element => {
          this.lineAgeChartData.push({data: element.data, label: element.label});
        });
        this.lineAgeChartOptions.title.text = val.options.title.text;
      }
    )

    this.fyre._getState('/tn/race_data').then(
      (val) => {
        this.lineRaceChartLabels = val.labels;
        val.datasets.forEach(element => {
          this.lineRaceChartData.push({data: element.data, label: element.label});
        });
        this.lineRaceChartOptions.title.text = val.options.title.text;
      }
    )

    this.fyre._getState('/tn/sex_data').then(
      (val) => {
        this.lineSexChartLabels = val.labels;
        val.datasets.forEach(element => {
          this.lineSexChartData.push({data: element.data, label: element.label});
        });
        this.lineSexChartOptions.title.text = val.options.title.text;
      }
    )
  }

  public sliderValueChange(event: any) {
    if(this.centerPieceMode == 'map') {
      this.concentrationMonth = event.value;
      this.mapService.loadMap("map", this.concentrationMonth-3);
    } else if(this.centerPieceMode == 'cases') {
      // do something for new map
    } else if(this.centerPieceMode == 'age') {

    } else {

    }
  }

  public setPieceMode(val) {
    this.centerPieceMode = val;
  }

  public getNewsTN(): Observable<NewsCard[]> {
    return this.httpClient.get('./assets/news-everything.json').pipe(
      map(res => {
        return res["articles"].map(item => {
          return new NewsCard(
            item.source,
            item.author,
            item.title,
            item.description,
            item.url,
            item.urlToImage,
            item.publishedAt,
            item.content
          );
      });
    })
    );
  }

  public getNewsTR(): Observable<NewsCard[]> {
    return this.httpClient.get('./assets/news-top-headlines.json').pipe(
      map(res => {
        return res["articles"].map(item => {
          return new NewsCard(
            item.source,
            item.author,
            item.title,
            item.description,
            item.url,
            item.urlToImage,
            item.publishedAt,
            item.content
          );
      });
    })
    );
  }
}