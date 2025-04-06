import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ResumeAppRoutingModule} from "./resume-app-routing.module";
import {MainComponent} from "./main/main.component";
import {ResumeComponent} from "./resume.component";
import {PanelModule} from "primeng/panel";
import {ChipsModule} from "primeng/chips";
import {MultiSelectModule} from "primeng/multiselect";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ChipModule} from "primeng/chip";
import {TableModule} from "primeng/table";
import {DividerModule} from "primeng/divider";
import {MenuModule} from "primeng/menu";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {AccordionModule} from "primeng/accordion";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {PersonalInformationComponent} from "./main/personal-information/personal-information.component";
import {SummaryComponent} from "./main/summary/summary.component";
import {SkillsComponent} from "./main/skills/skills.component";
import {ToastModule} from "primeng/toast";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {ConfirmationService, MessageService} from "primeng/api";
import {EducationComponent} from "./main/education/education.component";



@NgModule({
    declarations: [
        ResumeComponent,
        MainComponent,
        PersonalInformationComponent,
        SummaryComponent,
        SkillsComponent,
        EducationComponent],
    imports: [
        CommonModule,
        FormsModule,
        ResumeAppRoutingModule,
        PanelModule,
        ChipsModule,
        MultiSelectModule,
        InputNumberModule,
        ButtonModule,
        ScrollPanelModule,
        CalendarModule,
        InputTextModule, InputTextareaModule, ChipModule, TableModule, DividerModule, MenuModule, AccordionModule, CheckboxModule, DropdownModule, ToastModule, ConfirmPopupModule,
    ],
    providers: [
        ConfirmationService, MessageService
    ]
})
export class ResumeModule { }
