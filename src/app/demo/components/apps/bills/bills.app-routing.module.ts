import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {BillsComponent} from "./bills.component";
import {EditEntityComponent} from "./edit-entity/edit-entity.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: BillsComponent },
        { path: 'edit-types', data: { breadcrumb: 'Edit Types' },  component: EditEntityComponent}
    ])],
    exports: [RouterModule]
})
export class BillsAppRoutingModule {}
