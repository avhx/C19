import { Injectable } from '@angular/core';
import { GOOGLE_MAP_JS_API_KEY } from './config';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor() { console.log(GOOGLE_MAP_JS_API_KEY) }
}
