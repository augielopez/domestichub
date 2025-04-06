import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TransactionAppRoutingModule} from "./transaction.app-routing.module";
import {TransactionComponent} from "./transaction.component";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {FileUploadModule} from "primeng/fileupload";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {MultiSelectModule} from "primeng/multiselect";
import {ToolbarModule} from "primeng/toolbar";



@NgModule({
  declarations: [TransactionComponent],
    imports: [
        CommonModule,
        TransactionAppRoutingModule,
        TableModule,
        ToastModule,
        ProgressSpinnerModule,
        FileUploadModule,
        DropdownModule,
        FormsModule,
        MultiSelectModule,
        ToolbarModule,
    ]
})
export class TransactionModule { }
