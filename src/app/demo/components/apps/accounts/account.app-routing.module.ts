import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {AccountsComponent} from "./accounts.component";
import {AccountListComponent} from "./account-list/account-list.component";
import {AccountFormComponent} from "./account-form/account-form.component";

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: AccountListComponent },
    { path: 'new', component: AccountFormComponent },
    { path: 'edit/:id', component: AccountFormComponent }
  ])],
  exports: [RouterModule]
})
export class AccountAppRoutingModule { }
