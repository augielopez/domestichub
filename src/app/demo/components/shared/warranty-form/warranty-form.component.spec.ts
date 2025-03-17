import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyFormComponent } from './warranty-form.component';

describe('WarrantyFormComponent', () => {
  let component: WarrantyFormComponent;
  let fixture: ComponentFixture<WarrantyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarrantyFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarrantyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
