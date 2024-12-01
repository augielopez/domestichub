import { Component, Input, Output, EventEmitter } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
  providers: [MessageService]
})
export class DataTableComponent {
  @Input() data: any[] = []; // Input data for the table
  private _selectedData: any[] = []; // Internal property for selected rows

  @Input()
  get selectedData(): any[] {
    return this._selectedData;
  }
  set selectedData(value: any[]) {
    this._selectedData = value;
    this.selectedDataChange.emit(this._selectedData); // Emit changes to the parent
  }
  @Input() columns: { field: string; header: string; width?: string; filterable?: boolean; filterType?: string }[] = []; // Column configuration
  @Input() globalFilterFields: string[] = []; // Fields for global search
  @Input() title: string = ""; // Show/hide action buttons
  @Input() showPasswordButton: boolean = false; // Toggle for showing password button
  @Input() showActions: boolean = true; // Show/hide action buttons
  @Input() displayField: string = ''; // Field to display in notifications


  @Output() selectedDataChange = new EventEmitter<any[]>(); // For two-way binding
  @Output() rowSelected = new EventEmitter<any>(); // Emits when a row is selected
  @Output() rowUnselected = new EventEmitter<any>(); // Emits when a row is unselected
  @Output() dialogAction = new EventEmitter<{ item: any | null; isEdit: boolean }>(); // Emits when adding/editing an item
  @Output() deleteAction = new EventEmitter<any>(); // Emits when an item is deleted

  // Password management variables
  isPasswrodDecoded: boolean = false;
  passwordHeader: string = 'Enter PIN';
  password: string = '';
  searchValue: string = '';

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService) {}

  onGlobalFilter(dt: any, event: Event): void {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(dt: any): void {
    this.searchValue = ''; // Clear the input field
    dt.clear(); // Reset the table filter
  }

  onRowSelect(event: any): void {
    const displayValue = this.displayField && event.data[this.displayField]
        ? event.data[this.displayField]
        : JSON.stringify(event.data); // Fallback to stringify the row

    this.rowSelected.emit(event.data);
    this.messageService.add({
      severity: 'info',
      summary: 'Row Selected',
      detail: `Selected: ${displayValue}`
    });
  }

  onRowUnselect(event: any): void {
    const displayValue = this.displayField && event.data[this.displayField]
        ? event.data[this.displayField]
        : JSON.stringify(event.data); // Fallback to stringify the row

    this.rowUnselected.emit(event.data);
    this.messageService.add({
      severity: 'warn',
      summary: 'Row Unselected',
      detail: `Unselected: ${displayValue}`
    });
  }

  showDialog(item: any | null, isEdit: boolean): void {
    this.dialogAction.emit({ item, isEdit });
  }

  deleteSelected(item: any): void {
    this.deleteAction.emit(item);
    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: `Deleted: ${item}` });
  }

  deleteMultipleSelected() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.data = this.data.filter((val) => !this._selectedData?.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }

  toggleOverlayPanel(event: Event, overlayPanel: any): void {
    overlayPanel.toggle(event);
    this.isPasswrodDecoded = false;
    this.passwordHeader = 'Enter PIN';
    this.password = '';
  }

  openUrlInNewTab(url: string): void {
    window.open(url, '_blank');
  }

  copyToClipboard(inputElement: HTMLInputElement): void {
    inputElement.select();
    document.execCommand('copy');
    this.messageService.add({ severity: 'info', summary: 'Copied', detail: 'Copied to clipboard' });
  }

  showPassword(input: HTMLInputElement, password: string): void {
    if (input.value === '1027') { // Example PIN
      this.password = atob(password); // Decode Base64 password
      this.isPasswrodDecoded = true;
      this.passwordHeader = 'Password';
      this.messageService.add({ severity: 'info', summary: 'PIN Verified', detail: 'Password Decoded' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Invalid PIN', detail: 'PIN is incorrect' });
    }
  }
}
