import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {parentType} from "../../bills/models/bill";
import {AccountsService} from "../services/accounts.service";
import {TypeService} from "../../bills/service/type.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {Table} from "primeng/table";
import {VwAccount} from "../models/account.model";
import {ToolbarConfig} from "../../../shared/models/toolbar-config";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {
  accounts: VwAccount[] = []; // Data for accounts table
  accounts$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  selectedAccounts: any[] = []; // Selected rows in the table
  showPasswordButton: boolean = true; // Control visibility of the password button
  title = "Accounts";
  loading: boolean = true;
  productDialog: boolean = false;
  submitted: boolean = false; // To check if the form is submitted


  types: parentType[] = [];
  isPasswrodDecoded = true;
  passwordHeader = "Enter Pin"
  password = "";
  inputPin: any;
  accountsColumns = [
    { field: 'accountName', header: 'Account Name', width: '15rem', filterable: true },
    { field: 'ownerName', header: 'Owner Name', width: '15rem', filterable: true },
    { field: 'isBill', header: 'Has Bill', width: '8rem', filterable: true },
    { field: 'hasactivebill', header: 'Is Bill Active', width: '8rem', filterable: true}
  ];

  toolbarConfig: ToolbarConfig = {
    buttons: [
      {
        label: 'New',
        icon: 'pi pi-plus',
        position: 'left',
        severity: 'info',
        visible: true,
        type: 'button',
        action: () => this.showDialog(null, false)
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        position: 'right',
        severity: 'danger',
        visible: true,
        type: 'button',
        action: () => this.deleteMultipleSelected()
      },
      {
        label: 'Separator',
        position: 'right',
        severity: 'info',
        visible: false,
        type: 'fileUpload'
      },
      {
        label: 'Import',
        position: 'right',
        severity: 'info',
        visible: false,
        type: 'fileUpload'
      },
      {
        label: 'Export',
        icon: 'pi pi-upload',
        position: 'right',
        severity: 'help',
        visible: false,
        type: 'button',
        action: () => this.exportData()
      }
    ]
  };

  constructor(private accountsService: AccountsService, private typeService: TypeService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  async ngOnInit() {
    this.accountsService.getAccounts().then((accounts) => {
      this.accounts = accounts;
      this.loading = false;
      this.accounts$.next(accounts);
    });
  }

  onAccountSelected(account: any): void {
    this.messageService.add({ severity: 'info', summary: 'Selected', detail: `Selected Account: ${account.accountName}` });
  }

  onAccountUnselected(account: any): void {
    this.messageService.add({ severity: 'warn', summary: 'Unselected', detail: `Unselected Account: ${account.accountName}` });
  }

  handleDialogAction(event: { item: any | null; isEdit: boolean }): void {
    if (event.isEdit) {
      console.log('Editing Account:', event.item);
      // Logic to open a dialog with account details for editing
    } else {
      console.log('Adding New Account');
      // Logic to open a dialog with an empty form for a new account
    }
  }

  deleteAccount(account: any): void {
    this.accounts = this.accounts.filter(a => a.accountpk !== account.account_pk); // Remove account from data
    this.accounts$.next(this.accounts); // Emit updated accounts
    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: `Deleted Account: ${account.accountName}` });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // Open New Account Dialog
  selectedAccount: any;
  openNewAccount() {
    this.submitted = false;
    this.productDialog = true;
  }

  toggleOverlayPanel(event: Event, overlayPanel: any): void {
    overlayPanel.toggle(event);
    this.isPasswrodDecoded = false;
    this.passwordHeader = 'Enter Pin';
    this.password = "";
  }

  showPassword(input: HTMLInputElement, password: string) {
    if (input.value === '1027') {
      this.password = this.decodeBase64(password);
      this.isPasswrodDecoded = true;
      this.passwordHeader = "Password";
      this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Correct PIN', life: 3000 });
      this.inputPin = ""; // Reset or manage state as needed after use
    } else {
      this.messageService.add({ severity: 'error', summary: 'Wrong PIN', detail: 'Incorrect PIN entered', life: 3000 });
    }
  }

  openUrlInNewTab(url: string): void {
    window.open(url, '_blank');
  }

  decodeBase64(encodedString: string): string {
    try {
      const decodedString = atob(encodedString);
      return decodedString;
    } catch (error) {
      console.error('Failed to decode Base64 string:', error);
      return '';
    }
  }

  confirm(event: Event) {
    this.inputPin = "";
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Please confirm to proceed moving forward.',
      icon: 'pi pi-exclamation-circle',
      acceptIcon: 'pi pi-check mr-1',
      rejectIcon: 'pi pi-times mr-1',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-outlined p-button-sm',
      acceptButtonStyleClass: 'p-button-sm',
      accept: () => {
        // Ensure inputPin is managed correctly
        if (this.inputPin === '1027') {
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
          this.inputPin = ""; // Reset or manage state as needed after use
        } else {
          this.messageService.add({ severity: 'error', summary: 'Wrong PIN', detail: 'Incorrect PIN entered', life: 3000 });
        }
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        this.inputPin = ""; // Ensure cleanup on reject as well
      }
    });
  }

  updateInputPin(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inputPin = target.value;
  }

  copyToClipboard(inputElement: HTMLInputElement): void {
    inputElement.select();  // Select the text
    const successful = document.execCommand('copy');  // Try to copy text
    inputElement.setSelectionRange(0, 0);  // Deselect text

    // Check if the copy was successful
    if (successful) {
      this.messageService.add({
        severity: 'info',
        summary: 'Confirmed',
        detail: 'Text copied successfully!',
        life: 3000
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'No Copy',
        detail: 'Failed to copy text',
        life: 3000
      });
    }
  }

  handleFormSubmit($event: VwAccount) {

  }

  private showDialog(param: any, b: boolean) {
    return undefined;
  }

  private deleteMultipleSelected() {
    return undefined;
  }

  private exportData() {
    return undefined;
  }
}
