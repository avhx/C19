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

  public getCountyDataExtended(countyName:string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if(countyName != 'knox') {
        reject('not knox!');
      } else {
        const currDoc = this.firestore.doc('/county/knox/knoxdata/age_data');
        currDoc.get().subscribe(
          (val) => {
            resolve(val.data());
          }, (err) => {
            reject(err);
          }
        )
      }
    });
  }

  public getCountyConcentrations(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const currDoc = this.firestore.doc('/tn/concentration')
      currDoc.get().subscribe(
        (val) => {
          resolve(val.data());
        }, (err) => {
          reject(err);
        }
      )
    })
  }

  public getStateCases(): Promise<any> {
    return new Promise((resolve, reject) => {
      const currDoc = this.firestore.doc('/tn/general_cases');
      currDoc.get().subscribe(
        (val) => {
          resolve(val.data())
        }, (err) => {
          reject(err);
        }
      )
    })
  }

  public getStateCasesMeta(): Promise<any> {
    return new Promise((resolve, reject) => {
      const currDoc = this.firestore.doc('/tn/general_cases_meta');
      currDoc.get().subscribe(
        (val) => {
          resolve(val.data())
        }, (err) => {
          reject(err);
        }
      )
    })
  }

  public _getState(url:string): Promise<any> {
    return new Promise((resolve, reject) => {
      const currDoc = this.firestore.doc(url);
      currDoc.get().subscribe(
        (val) => {
          resolve(val.data())
        }, (err) => {
          reject(err);
        }
      )
    })
  }
}
