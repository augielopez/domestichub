import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {AccountsComponent} from "./accounts.component";
import {AccountListComponent} from "./account-list/account-list.component";
import {AccountFormComponent} from "../../shared/account-form/account-form.component";
import {WarrantyFormComponent} from "../../shared/warranty-form/warranty-form.component";
import {LoginFormComponent} from "../../shared/login-form/login-form.component";
import {BillFormComponent} from "../../shared/bill-form/bill-form.component";
import {CreditCardFormComponent} from "../../shared/credit-card-form/credit-card-form.component";

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: AccountListComponent,
      children: [
        { path: '', redirectTo: 'account-form', pathMatch: 'full' },
        { path: 'account-form', component: AccountFormComponent },
        { path: 'login-form', component: LoginFormComponent },
        { path: 'bill-form', component: BillFormComponent },
        { path: 'credit-card-form', component: CreditCardFormComponent },
        { path: 'warranty-form', component: WarrantyFormComponent}
      ]
    },
    { path: 'new', component: AccountFormComponent },
    { path: 'edit/:id', component: AccountFormComponent },
  ])],
  exports: [RouterModule]
})
export class AccountAppRoutingModule { }
