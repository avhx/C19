import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBarComponent } from './report-bar.component';

describe('ReportBarComponent', () => {
  let component: ReportBarComponent;
  let fixture: ComponentFixture<ReportBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
