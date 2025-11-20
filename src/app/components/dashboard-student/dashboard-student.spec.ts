import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStudentComponent } from './dashboard-student';

describe('DashboardStudent', () => {
  let component: DashboardStudentComponent;
  let fixture: ComponentFixture<DashboardStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardStudentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
