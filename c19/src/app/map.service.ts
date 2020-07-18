import { Injectable } from '@angular/core';
import { MAP_API_CONFIG } from './config';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { console.log(MAP_API_CONFIG.KEY) }
}
