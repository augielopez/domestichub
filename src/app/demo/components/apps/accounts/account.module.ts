import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import {AccountsService} from "./accounts.service";
import { DialogModule } from 'primeng/dialog';
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {ChipsModule} from "primeng/chips";

@NgModule({
    imports: [CommonModule,
        AccountAppRoutingModule,
        FormsModule,
        TableModule,
        RatingModule,
        ButtonModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        DialogModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        ToastModule,
        ConfirmPopupModule,
        OverlayPanelModule,
        InputGroupModule,
        InputGroupAddonModule,
        ChipsModule],
  declarations: [AccountsComponent],
  providers: [AccountsService, MessageService, ConfirmationService],
})
export class AccountModule { }
