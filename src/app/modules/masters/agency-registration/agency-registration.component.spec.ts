import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyRegistrationComponent } from './agency-registration.component';

describe('AgencyRegistrationComponent', () => {
  let component: AgencyRegistrationComponent;
  let fixture: ComponentFixture<AgencyRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
