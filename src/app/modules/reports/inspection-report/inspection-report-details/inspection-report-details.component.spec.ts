import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionReportDetailsComponent } from './inspection-report-details.component';

describe('InspectionReportDetailsComponent', () => {
  let component: InspectionReportDetailsComponent;
  let fixture: ComponentFixture<InspectionReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectionReportDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectionReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
