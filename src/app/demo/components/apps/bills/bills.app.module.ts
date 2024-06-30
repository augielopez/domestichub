import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BillsComponent} from "./bills.component";
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
import {BillsService} from "./service/bills.service";
import {BillsAppRoutingModule} from "./bills.app-routing.module";
import {ToolbarModule} from "primeng/toolbar";
import {TableModule} from "primeng/table";
import {FileUploadModule} from "primeng/fileupload";
import {ConfirmationService, MessageService} from "primeng/api";
import {NewEditComponent} from "./new-edit/new-edit.component";
import {CheckboxModule} from "primeng/checkbox";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {AddEntityComponent} from "./add-entity/add-entity.component";
import {EditEntityComponent} from "./edit-entity/edit-entity.component";
import {RatingModule} from "primeng/rating";



@NgModule({
    declarations: [BillsComponent, NewEditComponent, AddEntityComponent, EditEntityComponent],
    imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BillsAppRoutingModule,
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
        OverlayPanelModule, RatingModule],
    providers: [BillsService, MessageService, ConfirmationService],
})
export class BillsAppModule { }
