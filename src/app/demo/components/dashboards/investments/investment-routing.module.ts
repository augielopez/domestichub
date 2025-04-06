import { NgModule } from '@angular/core';
import {RouterModule} from "@angular/router";
import {InvestmentsComponent} from "./investments.component";



@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: InvestmentsComponent }])],
  exports: [RouterModule]
})
export class InvestmentRoutingModule { }
