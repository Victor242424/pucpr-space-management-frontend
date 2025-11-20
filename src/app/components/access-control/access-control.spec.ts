import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessControlComponent } from './access-control';

describe('AccessControl', () => {
  let component: AccessControlComponent;
  let fixture: ComponentFixture<AccessControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessControlComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
