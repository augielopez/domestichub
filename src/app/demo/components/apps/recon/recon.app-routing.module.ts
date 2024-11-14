import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ReconComponent} from "./recon.component";

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ReconComponent },
  ])],
  exports: [RouterModule]
})
export class ReconAppRoutingModule { }
