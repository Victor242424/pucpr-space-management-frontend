import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpacesComponent } from './spaces';

describe('Spaces', () => {
  let component: SpacesComponent;
  let fixture: ComponentFixture<SpacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpacesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
