import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductWarrantyComponent} from "./component/product-warranty.component";
import {ReconAppRoutingModule} from "../recon/recon.app-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FullCalendarModule} from "@fullcalendar/angular";
import {DialogModule} from "primeng/dialog";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {ToastModule} from "primeng/toast";
import {RippleModule} from "primeng/ripple";
import {ToolbarModule} from "primeng/toolbar";
import {TableModule} from "primeng/table";
import {FileUploadModule} from "primeng/fileupload";
import {CheckboxModule} from "primeng/checkbox";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {RatingModule} from "primeng/rating";
import {TagModule} from "primeng/tag";
import {MultiSelectModule} from "primeng/multiselect";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {CardModule} from "primeng/card";
import {SplitButtonModule} from "primeng/splitbutton";
import {MenubarModule} from "primeng/menubar";
import {ProductWarrantyAppRoutingModule} from "./product-warranty.app-routing.module";



@NgModule({
  declarations: [ProductWarrantyComponent],
  imports: [
    CommonModule,
    ProductWarrantyAppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    DialogModule,
    InputTextareaModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    RippleModule,
    ToolbarModule,
    TableModule,
    FileUploadModule,
    CheckboxModule,
    InputGroupModule,
    InputGroupAddonModule,
    ConfirmDialogModule,
    OverlayPanelModule,
    RatingModule,
    TagModule,
    MultiSelectModule,
    ProgressSpinnerModule,
    CardModule,
    SplitButtonModule,
    MenubarModule
  ]
})
export class ProductWarrantyModule { }
