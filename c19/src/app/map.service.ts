import { Injectable } from '@angular/core';
import { GOOGLE_MAP_JS_API_KEY } from './config';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  loadAPI: Promise<any>
  isMapLoaded: boolean = false;
  
  constructor() {
    console.log("Map Service instantiated!");
    this.loadAPI = new Promise((resolve) => {
      this.loadMapAPI();
      resolve(true);
    })

    this.loadAPI.then((resolve) => {
      this.isMapLoaded = resolve;
      console.log(this.isMapLoaded);
    }).catch((message) => {
      console.log("Map failed to load!" + message);
    })
  }

  public loadMapAPI() {        
    var script = "https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_MAP_JS_API_KEY;
    console.log(script);

    let node = document.createElement('script');
    node.src = script;
    node.type = 'text/javascript';
    node.async = false;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}
