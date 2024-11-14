import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FullCalendarModule} from "@fullcalendar/angular";
import {DialogModule} from "primeng/dialog";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {ToastModule} from "primeng/toast";
import {RippleModule} from "primeng/ripple";
import {ToolbarModule} from "primeng/toolbar";
import {TableModule} from "primeng/table";
import {FileUploadModule} from "primeng/fileupload";
import {ConfirmationService, MessageService} from "primeng/api";
import {CheckboxModule} from "primeng/checkbox";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {RatingModule} from "primeng/rating";
import {ReconComponent} from "./recon.component";
import {ReconAppRoutingModule} from "./recon.app-routing.module";
import {TagModule} from "primeng/tag";
import {MultiSelectModule} from "primeng/multiselect";
import { InputTextModule } from 'primeng/inputtext';
import {AccountsService} from "../accounts/accounts.service";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {CardModule} from "primeng/card";
import {SplitButtonModule} from "primeng/splitbutton";
import {MenubarModule} from "primeng/menubar";



@NgModule({
  declarations: [ReconComponent],
    imports: [CommonModule,
        ReconAppRoutingModule,
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
        OverlayPanelModule, RatingModule, TagModule, MultiSelectModule, ProgressSpinnerModule, CardModule, SplitButtonModule, MenubarModule],
  providers: [MessageService, ConfirmationService, AccountsService],
})
export class ReconModule { }
