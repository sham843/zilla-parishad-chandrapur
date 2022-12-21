import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAgencyComponent } from './register-agency.component';

describe('RegisterAgencyComponent', () => {
  let component: RegisterAgencyComponent;
  let fixture: ComponentFixture<RegisterAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterAgencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
