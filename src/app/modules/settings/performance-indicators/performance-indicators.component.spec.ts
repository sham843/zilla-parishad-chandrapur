import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceIndicatorsComponent } from './performance-indicators.component';

describe('PerformanceIndicatorsComponent', () => {
  let component: PerformanceIndicatorsComponent;
  let fixture: ComponentFixture<PerformanceIndicatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceIndicatorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
