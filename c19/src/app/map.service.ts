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
  countyMap: any;
  
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
    var styledMapType = new google.maps.StyledMapType([
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#242f3e"
          }
        ]
      },
      {
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#746855"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#242f3e"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d59563"
          }
        ]
      },
      {
        "featureType": "administrative.neighborhood",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d59563"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#263c3f"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#6b9a76"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#38414e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#212a37"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9ca5b3"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#746855"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#1f2835"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#f3d19c"
          }
        ]
      },
      {
        "featureType": "transit",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#2f3948"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d59563"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#17263c"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#515c6d"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#17263c"
          }
        ]
      }
    ]);

    this.map = new google.maps.Map(document.getElementById(id), {
      center: { lat: 35.7730076, lng: -86.2820081 }, 
      zoom: 7,
      minZoom: 6,
      gestureHandling: 'cooperative',
      disableDefaultUI: true
    });

    this.map.mapTypes.set('styled_map', styledMapType)
    this.map.setMapTypeId('styled_map')

    this.loadCounties();
  }

  public loadCounties() {
    this.countyMap = new Map<google.maps.Polygon, string>();

    this.httpClient.get('./assets/TNCounties.json').subscribe(data => {
      var COUNTY_INFO = <any[]> data;

      for (var i = 0; i < COUNTY_INFO.length; i++) {
        var COUNTY_NAME = data[i][0]["name"];
        var COUNTY_BORDER = <LatLng[]> data[i][1]["points"];
        var COUNTY_CONCENTRATION = "white"

        var COUNTY_COUNTY = new google.maps.Polygon({
          paths: COUNTY_BORDER,
          strokeColor: "aliceblue",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: COUNTY_CONCENTRATION,
          fillOpacity: 0.35
        });

        this.countyMap.set(COUNTY_COUNTY, COUNTY_NAME);

        // Add in event listeners
        var _self = this
        google.maps.event.addListener(COUNTY_COUNTY, 'click', function() {
          // console.log(this)
          console.log(_self.countyMap.get(this))
        });

        google.maps.event.addListener(COUNTY_COUNTY, 'mouseover', function() {
          this.setOptions({fillOpacity: "0.5"})
        });

        google.maps.event.addListener(COUNTY_COUNTY, 'mouseout', function() {
          this.setOptions({fillOpacity: "0.35"})
        });

        COUNTY_COUNTY.setMap(this.map) // preloads county
      }
    })
  }
}
