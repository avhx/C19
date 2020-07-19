import { Component, OnInit, Inject } from '@angular/core';
import { FyrebaseService } from '../../fyrebase.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-county-dialog',
  templateUrl: './county-dialog.component.html',
  styleUrls: ['./county-dialog.component.scss']
})
export class CountyDialogComponent implements OnInit {

  public countyData: any;
  public countyTitle: string;
  public dialogLoaded: boolean;
  constructor(private fyrebase: FyrebaseService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogLoaded = false;
    this.countyTitle = this.data.name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  }

  ngOnInit() {
    this.fyrebase.getCountyData(this.data.name).then(
      (val) => {
        console.log(val);
        this.countyData = val;
        this.dialogLoaded = true;
      }
    )
  }

}
