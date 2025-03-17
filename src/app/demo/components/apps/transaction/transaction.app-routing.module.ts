import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {JobTrackerComponent} from "../job-tracker/job-tracker.component";
import {TransactionComponent} from "./transaction.component";

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', redirectTo: 'transaction', pathMatch: 'full' },
    { path: 'transaction', component: TransactionComponent }
  ])],
  exports: [RouterModule]
})
export class TransactionAppRoutingModule { }
