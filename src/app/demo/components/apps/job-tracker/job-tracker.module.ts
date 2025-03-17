import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {JobTrackerComponent} from "./job-tracker.component";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {TagModule} from "primeng/tag";
import {JobTrackerAppRoutingModule} from "./job-tracker.app-routing.module";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {CalendarModule} from "primeng/calendar";



@NgModule({
  declarations: [
      JobTrackerComponent
  ],
    imports: [
        CommonModule,
        JobTrackerAppRoutingModule,
        TagModule,
        FormsModule, // ✅ Fix for ngModel
        ReactiveFormsModule, // ✅ Fix for form handling
        TableModule, // ✅ PrimeNG Table
        DialogModule, // ✅ PrimeNG Dialog
        DropdownModule, // ✅ Fix for <p-dropdown>
        ButtonModule, // ✅ Fix for PrimeNG Buttons
        InputTextModule,
        CalendarModule,
        // ✅ Fix for <input pInputText>
    ]
})
export class JobTrackerModule { }
