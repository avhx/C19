import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FyrebaseService {

  constructor(public firestore: AngularFirestore) { }
  
  public getCountyData(countyName:string):Promise<any> {
    console.log(countyName);
    return new Promise<any>((resolve, reject) => {
      const currDoc = this.firestore.doc('/county/'+countyName);
      currDoc.get().subscribe(
        (val) => {
          resolve(val.data());
        }, (err) => {
          reject(err);
        }
      )
    });
  }
}
