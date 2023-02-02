import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionReportComponent } from './inspection-report.component';

describe('InspectionReportComponent', () => {
  let component: InspectionReportComponent;
  let fixture: ComponentFixture<InspectionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
