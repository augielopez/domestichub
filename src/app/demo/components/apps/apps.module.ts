import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppsRoutingModule } from './apps-routing.module';
import {MessageService} from "primeng/api";

@NgModule({
    imports: [CommonModule, AppsRoutingModule],
    declarations: [],
    providers: [MessageService]
})
export class AppsModule {}
