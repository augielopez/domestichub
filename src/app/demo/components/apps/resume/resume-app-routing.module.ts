import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {JobTrackerComponent} from "../job-tracker/job-tracker.component";
import {ResumeComponent} from "./resume.component";



@NgModule({
  imports: [RouterModule.forChild([
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'main', component: ResumeComponent }
  ])],
  exports: [RouterModule]
})
export class ResumeAppRoutingModule { }
