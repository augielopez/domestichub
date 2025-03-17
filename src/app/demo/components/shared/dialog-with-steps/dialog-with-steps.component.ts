import { Component, Input, Output, EventEmitter } from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-dialog-with-steps',
  templateUrl: './dialog-with-steps.component.html',
  styleUrls: ['./dialog-with-steps.component.scss']
})
export class DialogWithStepsComponent {
  @Input() operation: string = 'New';
  @Input() selectedAccount: any;
  @Input() selectedBill: any;
  @Output() accountChange = new EventEmitter<any>();
  @Output() billChange = new EventEmitter<any>();
  @Output() dialogClose = new EventEmitter<void>();
  @Output() saveData = new EventEmitter<void>();

  visible: boolean = false;
  activeStep: number = 0;
  isBillStepEnabled: boolean = false;
  routeItems: MenuItem[] = [];

  ngOnInit() {
    this.routeItems = [
      { label: 'Account', routerLink: 'account-form' },
      { label: 'Login', routerLink: 'login-form' },
      { label: 'Bill', routerLink: 'bill-form' },
      { label: 'Credit Card', routerLink: 'credit-card-form'},
      { label: 'Warranty', routerLink: 'warranty-form' },
    ];
  }

  closeDialog()
  {
    this.dialogClose.emit();
    this.visible = false;
  }
}
