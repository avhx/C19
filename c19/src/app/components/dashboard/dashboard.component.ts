import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/map.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private mapService: MapService) { }

  ngOnInit() {

  }

}
