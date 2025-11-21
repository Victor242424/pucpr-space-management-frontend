import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRecordsComponent } from './access-records';

describe('AccessRecords', () => {
  let component: AccessRecordsComponent;
  let fixture: ComponentFixture<AccessRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessRecordsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
