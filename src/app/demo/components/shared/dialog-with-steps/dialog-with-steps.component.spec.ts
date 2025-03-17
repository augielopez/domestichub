import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWithStepsComponent } from './dialog-with-steps.component';

describe('DialogWithStepsComponent', () => {
  let component: DialogWithStepsComponent;
  let fixture: ComponentFixture<DialogWithStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogWithStepsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogWithStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
