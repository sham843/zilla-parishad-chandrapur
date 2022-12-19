import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRightAccessComponent } from './page-right-access.component';

describe('PageRightAccessComponent', () => {
  let component: PageRightAccessComponent;
  let fixture: ComponentFixture<PageRightAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageRightAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageRightAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
