import { NgModule } from '@angular/core';
import {RouterModule} from "@angular/router";
import {ProductWarrantyComponent} from "./component/product-warranty.component";

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ProductWarrantyComponent },
  ])],
  exports: [RouterModule]
})
export class ProductWarrantyAppRoutingModule { }
