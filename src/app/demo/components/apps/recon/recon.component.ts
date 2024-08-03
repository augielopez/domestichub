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
    this.reconService.getReconTransactionDetails().subscribe({
      next: (data) => {
        this.transactions = data;
        this.loading = false;  // Data loaded, stop loading indicator
      },
      error: (error) => {
        console.error('There was an error!', error);
        this.loading = false;  // Stop loading indicator on error
      }
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

  updateSql(billPk: number, sql: string): void {
    const transaction = this.transactions.find(t => t.billpk === billPk);

    if (transaction) {
      transaction.loading = true;
      this.billService.updateSqlField(billPk, sql)
          .then(() => {
            transaction.loading = false;
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Saved'});
          })
          .catch(error => {
            transaction.loading = false;
            console.error('Error updating SQL:', error);
          });
    }
  }
}

