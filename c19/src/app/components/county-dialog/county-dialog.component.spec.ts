import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountyDialogComponent } from './county-dialog.component';

describe('CountyDialogComponent', () => {
  let component: CountyDialogComponent;
  let fixture: ComponentFixture<CountyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
