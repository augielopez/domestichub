import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CheckboxChangeEvent} from "primeng/checkbox";

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.scss'
})
export class AccountFormComponent implements OnInit {

  isBillEnabled: boolean = false;

  // Emit the checkbox state to the parent
  @Output() billStepToggle = new EventEmitter<boolean>();

  async ngOnInit() {
    this.isBillEnabled = false;

  }

  toggleBillStep(): void {
    console.log('Checkbox state:', this.isBillEnabled); // Logs the current bound state
    this.billStepToggle.emit(this.isBillEnabled); // Emit the updated state to the parent
  }
}
