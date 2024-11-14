import { Component } from '@angular/core';

@Component({
  selector: 'app-product-warranty',
  templateUrl: './product-warranty.component.html',
  styleUrls: ['./product-warranty.component.scss']
})
export class ProductWarrantyComponent {
  product = {
    name: '',
    category: '',
    warrantyStart: null,
    warrantyPeriod: 12,
    serialNumber: ''
  };

  products: any[] = []; // This array will hold the submitted products.
  categories = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Furniture', value: 'furniture' },
    { label: 'Appliances', value: 'appliances' }
  ];

  searchValue = '';
  loading = false;

  onSubmit() {
    // Push submitted product into the products array
    this.products.push({ ...this.product });

    // Clear the form
    this.product = {
      name: '',
      category: '',
      warrantyStart: null,
      warrantyPeriod: 12,
      serialNumber: ''
    };
  }

  clear(table: any) {
    table.clear();
    this.searchValue = '';
  }
}
