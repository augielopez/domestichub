import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ReconService } from './recon.service';

@Component({
  selector: 'app-recon',
  templateUrl: './recon.component.html',
  styleUrls: ['./recon.component.scss']
})
export class ReconComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  uploadedFiles: any[] = [];
  transactions: any[] = [];
  monthly: any[] = [];
  nonmonthly: any[] = [];
  loading = false;

  constructor(private reconService: ReconService, private messageService: MessageService) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading = true;
    this.reconService.getTransactionsView()
        .then(data => {
          this.monthly = data.filter(t => t.isactive && t.isincludedinmonthlypayment && t.frequencyfk === 1);
          this.nonmonthly = data.filter(t => t.isactive && t.isincludedinmonthlypayment && t.frequencyfk !== 1);
          this.transactions = data;
          this.loading = false;
        })
        .catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load transactions' });
          this.loading = false;
        });
  }

  onFileSelect(event: any) {
    this.uploadedFiles = event.files;
    console.log('Selected files:', this.uploadedFiles);
  }

  async importFiles(event: any): Promise<void> {
    this.loading = true;
    const files: File[] = event.files;

    for (const file of files) {
      const selectedFileType = this.getFileType(file.name);

      if (!selectedFileType) {
        this.messageService.add({ severity: 'error', summary: 'Unsupported file', detail: `File ${file.name} is not supported` });
        continue;
      }

      try {
        const csvData = await this.reconService.readCsvFile(file, selectedFileType);
        await this.processFile(csvData, selectedFileType);

        this.messageService.add({ severity: 'success', summary: 'File Processed', detail: `File ${file.name} processed successfully` });
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'File Error', detail: `Error processing file ${file.name}` });
      }
    }

    this.loading = false;
    this.clearInputs();
  }

  getFileType(fileName: string): string | null {
    if (fileName.includes('Credit')) return 'tb_us_bank_transactions';
    if (fileName.includes('History')) return 'tb_fidelity_transactions';
    if (fileName.includes('Augie')) return 'tb_first_tech_augie';
    if (fileName.includes('Melissa')) return 'tb_first_tech_melissa';
    if (fileName.includes('NonMonthly')) return 'tb_first_tech_non_monthly';
    return null;
  }

  readCsvFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => resolve(event.target.result);
      reader.onerror = () => reject('Error reading file');
      reader.readAsText(file);
    });
  }

  async processFile(csvData: any, selectedFileType: string) {
    switch (selectedFileType) {
      case 'tb_fidelity_transactions':
        await this.reconService.getCompareInsertFidelityHistory(csvData);
        break;
      case 'tb_us_bank_transactions':
        await this.reconService.getCompareInsertUsBankHistory(csvData);
        break;
      default:
        if (selectedFileType.startsWith('tb_first_tech')) {
          await this.reconService.getCompareInsertFirstTechHistory(csvData, selectedFileType);
        } else {
          throw new Error('Unsupported file type');
        }
    }
    await this.reconService.refreshMaterializedView();
  }

  updateSql(billpk: number, newSql: string): void {
    const transaction = this.transactions.find(t => t.billpk === billpk);
    if (transaction) {
      transaction.loading = true;
      this.reconService.updateTransactionSql(billpk, newSql)
          .then(() => {
            transaction.loading = false;
            this.messageService.add({ severity: 'success', summary: 'SQL Updated', detail: 'SQL was successfully updated' });
          })
          .catch(() => {
            transaction.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: 'Failed to update SQL' });
          });
    }
  }

  getSeverity(transactionDesc: string | null): string {
    return transactionDesc ? 'success' : 'danger';
  }

  editTransaction(transaction: any): void {
    transaction.isediting = true;
  }

  clearInputs() {
    this.fileUpload.clear();
    this.uploadedFiles = [];
  }

  // Newly added method to handle saving the reconciliation history
  saveReconHistory(): void {
    this.reconService.getCompareInsertReconHistory(this.transactions)
        .then(() => {
          this.messageService.add({ severity: 'success', summary: 'Recon History Saved', detail: 'Reconciliation history saved successfully' });
        })
        .catch(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save reconciliation history' });
        });
  }
}
