import { Injectable } from '@angular/core';
import { GOOGLE_MAP_JS_API_KEY } from './config';

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
  
  constructor() {
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

  public loadMap() {
    
  }
}
