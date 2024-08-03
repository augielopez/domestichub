import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import {AccountsService} from "./accounts.service";
import {Account, AccountDto} from "./account";
import {TypeService} from "../bills/service/type.service";
import {parentType} from "../bills/models/bill";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent implements OnInit {
  accounts: AccountDto[] = [];
  loading: boolean = true;

  members = [
    { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
  ];

  @ViewChild('filter') filter!: ElementRef;

  types: parentType[] = [];
  isPasswrodDecoded = true;
  passwordHeader = "Enter Pin"
  password = "";
  inputPin: any;

  constructor(private accountsService: AccountsService, private typeService: TypeService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  async ngOnInit() {

    this.accountsService.getAccounts().then((accounts) => {
      this.accounts = accounts;
      this.loading = false;
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
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
}
