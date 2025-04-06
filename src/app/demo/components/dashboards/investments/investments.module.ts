import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InvestmentRoutingModule} from "./investment-routing.module";
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {IndexComponent} from "./index/index.component";
import {InvestmentsComponent} from "./investments.component";
import {ConfirmationService, MessageService} from "primeng/api";
import {TagModule} from "primeng/tag";



@NgModule({
  declarations: [
      InvestmentsComponent,
      IndexComponent
  ],
  imports: [
    CommonModule,
    InvestmentRoutingModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class InvestmentsModule { }
