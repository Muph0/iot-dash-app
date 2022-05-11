import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeControlComponent } from './gauge-control.component';

describe('GaugeControlComponent', () => {
  let component: GaugeControlComponent;
  let fixture: ComponentFixture<GaugeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GaugeControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GaugeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
