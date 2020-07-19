import { Component, OnInit, NgModule } from '@angular/core';
import { MapService, LatLng } from 'src/app/map.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import {} from '@google/maps'; 
import { CountyDialogComponent } from '../county-dialog/county-dialog.component';
import { NewsCardComponent, NewsCard } from '../news-card/news-card.component';
import { ROUTER_CONFIGURATION } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  newsTN: NewsCard[];
  default: NewsCard;
  map: any;

  centerPieceMode = "map";
  sliderConfig = {
    min: 3,
    max: 7.5,
    step: 1,
  }
  concentrationMonth = this.sliderConfig.max;

  constructor(private mapService: MapService, private httpClient: HttpClient) {
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
    this.initNews();

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
  }

  public sliderValueChange(event: any) {
    if(this.centerPieceMode == 'map') {
      this.concentrationMonth = event.value;
      //invoke change in map color:

    } else if(this.centerPieceMode == 'cases') {
      // do something for new map
    } else if(this.centerPieceMode == 'age') {

    } else {
      
    }
  }

  public setPieceMode(val) {
    this.centerPieceMode = val;
  }

  public initNews() {
    // Reads Tennessee focused news first
    // INITIALIZE...
    this.default = {
      "source": {
        "id": "0",
        "name": "0",
      },
      "author": "0",
      "title": "0",
      "description": "0",
      "url": "0",
      "urlToImage": "0",
      "publishedAt": "0",
      "content": "0"
    }
    this.newsTN = [this.default]

    this.httpClient.get('./assets/news-everything.json').subscribe(data => {
      for (var i = 0; i < data["articles"].length; i++) {
        let x = data["articles"][i];
        this.newsTN.push(x)
      }
      console.log(this.newsTN)
    })

    // Now reads more general news
  }
}