import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import {AccountAppRoutingModule} from "./account.app-routing.module";
import {AccountsComponent} from "./accounts.component";
import {ConfirmationService, MessageService} from "primeng/api";
import { DialogModule } from 'primeng/dialog';
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {ChipsModule} from "primeng/chips";
import {AccountsService} from "./services/accounts.service";
import {AccountListComponent} from "./account-list/account-list.component";
import {AccountFormComponent} from "../../shared/account-form/account-form.component";
import {CheckboxModule} from "primeng/checkbox";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToolbarModule} from "primeng/toolbar";
import {FileUploadModule} from "primeng/fileupload";
import {DataTableComponent} from "../../shared/datatable/datatable.component";
import {MenuModule} from "primeng/menu";
import {DialogWithStepsComponent} from "../../shared/dialog-with-steps/dialog-with-steps.component";
import {StepsModule} from "primeng/steps";
import {TagModule} from "primeng/tag";


@NgModule({
    imports: [CommonModule,
        AccountAppRoutingModule,
        TableModule,
        RatingModule,
        FormsModule,            // Add FormsModule here
        ReactiveFormsModule,     // Add ReactiveFormsModule here
        DialogModule,             // PrimeNG DialogModule if not already imported
        ButtonModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        ToastModule,
        ConfirmPopupModule,
        OverlayPanelModule,
        InputGroupModule,
        InputGroupAddonModule,
        ChipsModule, CheckboxModule, ConfirmDialogModule, ToolbarModule, FileUploadModule, MenuModule, StepsModule, TagModule],
    declarations: [AccountListComponent, AccountFormComponent, AccountsComponent, DataTableComponent, DialogWithStepsComponent],
  providers: [AccountsService, MessageService, ConfirmationService],
})
export class AccountModule { }
