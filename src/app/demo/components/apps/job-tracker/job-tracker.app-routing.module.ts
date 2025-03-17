import { NgModule } from '@angular/core';
import {RouterModule} from "@angular/router";

import {JobTrackerComponent} from "./job-tracker.component";


@NgModule({
  imports: [RouterModule.forChild([
    { path: '', redirectTo: 'job-application', pathMatch: 'full' },
    { path: 'job-application', component: JobTrackerComponent }
  ])],
  exports: [RouterModule]
})
export class JobTrackerAppRoutingModule { }
