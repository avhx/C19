import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GOOGLE_MAP_JS_API_KEY } from './config';

import {} from '@google/maps'; 

export interface County {
  name: string,
  concentration: string,
  countyBorder: LatLng[],
  county: google.maps.Polygon
}

export interface LatLng {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  // loadAPI: Promise<any>
  // isMapLoaded: boolean = false;
  map: any;
  counties: County[] 
  
  constructor(private httpClient: HttpClient) {
    // console.log("Map Service instantiated!");
    // this.loadAPI = new Promise((resolve) => {
    //   this.loadMapAPI();
    //   resolve(true);
    // })
  }

  // public loadMapAPI() {        
  //   var script = "https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_MAP_JS_API_KEY;
  //   console.log(script);

  //   let node = document.createElement('script');
  //   node.src = script;
  //   node.type = 'text/javascript';
  //   node.async = false;
  //   node.charset = 'utf-8';
  //   document.getElementsByTagName('head')[0].appendChild(node);
  // }

  public loadMap(id: string) {
    this.map = new google.maps.Map(document.getElementById(id), {
      center: { lat: 35.7730076, lng: -86.2820081 }, 
      zoom: 7
    });

    this.loadCounties();
  }

  public loadCounties() {
    this.counties = <County[]> this.counties;
    this.httpClient.get('./assets/TNCounties.json').subscribe(data => {
      var COUNTY_INFO = <any[]> data;

      for (var i = 0; i < COUNTY_INFO.length; i++) {
        var COUNTY_NAME = data[i][0]["name"];
        var COUNTY_BORDER = <LatLng[]> data[i][1]["points"];
        var COUNTY_CONCENTRATION = "red"

        var COUNTY_COUNTY = new google.maps.Polygon({
          paths: COUNTY_BORDER,
          strokeColor: "red",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: COUNTY_CONCENTRATION,
          fillOpacity: 0.35
        });

        var county = {
          "name": COUNTY_NAME,
          "concentration": COUNTY_CONCENTRATION,
          "countyBorder": COUNTY_BORDER,
          "county": COUNTY_COUNTY
        }

        this.counties.push(county)
        COUNTY_COUNTY.setMap(this.map) // preloads county
      }
    })
  }
}
