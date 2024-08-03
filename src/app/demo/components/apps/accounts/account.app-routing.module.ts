import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {AccountsComponent} from "./accounts.component";

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: AccountsComponent },
  ])],
  exports: [RouterModule]
})
export class AccountAppRoutingModule { }
