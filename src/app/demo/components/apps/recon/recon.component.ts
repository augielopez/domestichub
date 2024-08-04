import { Component, OnInit } from '@angular/core';
import {TransactionDetails} from "../../../api/transactions";
import {ReconService} from "./recon.service";
import {AccountsService} from "../accounts/accounts.service";
import {Account, AccountDto} from "../accounts/account";
import {MessageService} from "primeng/api";
import {BillsService} from "../bills/service/bills.service";

@Component({
  selector: 'app-recon',
  templateUrl: './recon.component.html',
  styleUrl: './recon.component.scss'
})
export class ReconComponent implements OnInit{
  transactions: TransactionDetails[] = [];
  loading = true;
  isPasswrodDecoded = true;
  passwordHeader = "Enter Pin"
  password = "";
  inputPin: any;
  sourceOptions: any[] = [
    { label: 'Manually Entered', value: 'Manually Entered' },
    { label: 'Deposited', value: 'Deposited' }
  ];
  account: AccountDto = {
    account_pk: 0,
    account_name: '',
    url: '',
    owner_pk: 0,
    owner_name: '',
    login_pk: 0,
    username: '',
    password: '',
  };


  constructor(private reconService: ReconService, private accountService: AccountsService, private messageService: MessageService, private billService: BillsService) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading = true;
    this.reconService.getTransactionsView().then(data => {
      data.forEach(trans => {
        switch (trans.frequencyfk) {
        case 2:
          trans.expected_amount = parseFloat((trans.expected_amount / 12).toFixed(2));
          break;
        case 3:
          trans.expected_amount = parseFloat((trans.expected_amount / 4).toFixed(2));
          trans.due_date += ' (converted into monthly)';
          break;
        case 4:
          trans.expected_amount = parseFloat((trans.expected_amount / 2).toFixed(2));
          trans.due_date += ' (converted into monthly)';
          break;
        case 5:
          trans.expected_amount = parseFloat((trans.expected_amount * 2).toFixed(2));
          trans.due_date += ' (converted into monthly)';
          break;
        case 6:
          trans.expected_amount = parseFloat((trans.expected_amount / 6).toFixed(2));
          trans.due_date += ' (converted into monthly)';
          break;
        case 8:
          trans.expected_amount = parseFloat((trans.expected_amount * 4).toFixed(2));
          trans.due_date += ' (converted into monthly)';
          break;
        default:
          trans.expected_amount = parseFloat(trans.expected_amount.toFixed(2));
          break;


        }

      })
      this.transactions = data;
      this.loading = false;
    }).catch(error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load transactions' });
      this.loading = false;
    });
  }

  getSeverity(status: string) {

    if(status == null) {
      return 'danger';
    }
    else{
      return 'success';
    }
  }

  toggleOverlayPanel(event: Event, overlayPanel: any, accountpk: number): void {
    overlayPanel.toggle(event);
    this.isPasswrodDecoded = false;
    this.passwordHeader = 'Enter Pin';
    this.password = "";

    this.accountService.getAccountDto(accountpk)
        .then(account => {
          this.account = account;
        })
        .catch(error => {
          console.error('Error loading account details:', error);
        });
  }

  openUrlInNewTab(url: string): void {
    window.open(url, '_blank');
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

  decodeBase64(encodedString: string): string {
    try {
      const decodedString = atob(encodedString);
      return decodedString;
    } catch (error) {
      console.error('Failed to decode Base64 string:', error);
      return '';
    }
  }

  async updateSql(billpk: number, newSql: string) {
    const transaction = this.transactions.find(t => t.billpk === billpk);
    if (transaction) {
      transaction.loading = true;
      try {
        await this.reconService.updateTransactionSql(billpk, newSql);
        // Reload transactions to get the latest data
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SQL updated successfully' });
      } catch (error) {
        transaction.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update SQL' });
      }
    }
  }

  editTransaction(transaction: TransactionDetails) {
    transaction.isediting = true;
  }

  async saveTransaction(transaction: TransactionDetails) {
    transaction.isediting = false;
    if(transaction.transaction_desc == null || transaction.transaction_amount == null || transaction.transaction_date == null || transaction.source == null){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Must fill out all fields' });
      return;
    }
    try {
      await this.reconService.insertManualTransaction(transaction);
      // Reload transactions to get the latest data
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'INSERT into manual transaction' });
    } catch (error) {
      transaction.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to INSERT into manual transaction' });
    }
  }
}

