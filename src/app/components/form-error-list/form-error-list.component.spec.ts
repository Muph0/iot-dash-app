import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormErrorListComponent } from './form-error-list.component';

describe('FormErrorListComponent', () => {
  let component: FormErrorListComponent;
  let fixture: ComponentFixture<FormErrorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormErrorListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormErrorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
