import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWarrantyComponent } from './product-warranty.component';

describe('ProductWarrantyComponent', () => {
  let component: ProductWarrantyComponent;
  let fixture: ComponentFixture<ProductWarrantyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductWarrantyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
