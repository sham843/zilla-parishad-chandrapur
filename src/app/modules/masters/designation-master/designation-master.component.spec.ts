import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationMasterComponent } from './designation-master.component';

describe('DesignationMasterComponent', () => {
  let component: DesignationMasterComponent;
  let fixture: ComponentFixture<DesignationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignationMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
