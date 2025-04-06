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
  dateOptions: { label: string; value: string; color: string }[] = [];
  selectedDate: string = '';
  //uploadedFiles: any[] = [];
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  monthly: any[] = [];
  nonmonthly: any[] = [];
  loading = false;

  constructor(private reconService: ReconService, private messageService: MessageService) {}

  async ngOnInit() {
    await this.generateDateOptions();
    await this.onDateChange();
  }

  async loadTransactions() {

    await this.reconService.getTransactionsView()
        .then(data => {
          this.monthly = data.filter(t => t.isactive && t.isincludedinmonthlypayment && t.frequencyfk === 1);
          this.nonmonthly = data.filter(t => t.isactive && t.isincludedinmonthlypayment && t.frequencyfk !== 1);
          this.transactions = data;
          this.loading = false;
        })
        .catch(error => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to load transactions'});
          this.loading = false;
        });
  }

  generateDateOptions(): void {
    const startMonth = 7; // July
    const startYear = 2024;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let year = startYear;
    let month = startMonth;
    const monthColors: { [key: number]: string } = {
      1: '#C0C0C0',  2: '#FF0000',  3: '#008000',
      4: '#FFC0CB',  5: '#00FFFF',  6: '#FFFFFF',
      7: '#800080',  8: '#FFFF00',  9: '#0000FF',
      10: '#FFA500', 11: '#8B4513', 12: '#FFD700',
    };

    const tempOptions: { label: string; value: string; color: string }[] = [];

    while (year < currentYear || (year === currentYear && month <= currentMonth)) {
      const formattedMonth = month.toString().padStart(2, '0');
      const dateStr = `${formattedMonth}/${year}`;
      tempOptions.push({
        label: dateStr,
        value: dateStr,
        color: monthColors[month] || '#000000'
      });

      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }

    // Reverse order so most recent month is at the top
    this.dateOptions = tempOptions.reverse();

    // 🔥 Logic: If the current month isn't over, select the previous one
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const isMonthOver = today.getDate() === lastDayOfMonth;

    // Pick the latest (current) or previous month
    const defaultIndex = isMonthOver ? 0 : 1;
    this.selectedDate = this.dateOptions[defaultIndex]?.value ?? '';

  }

  async onDateChange() {
    this.loading = true;

    try {
      const [monthStr, yearStr] = this.selectedDate.split('/');
      const year = Number(yearStr);
      const month = Number(monthStr);

      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);

      const bills = await this.reconService.getBills();
      const allTransactions = await this.reconService.getCombinedTransactionsBetween(start, end);

      this.monthly = bills.map(bill => {
        const matchedTransactions = allTransactions.find(tx =>
            this.reconService.matchesTransaction(tx, bill.sql)
        );

        const totalAmount = matchedTransactions.reduce(
            (sum: number, tx: any) => sum + (Number(tx.amount) || 0),
            0
        );

        const status = matchedTransactions.length === 0
            ? 'unpaid'
            : totalAmount === bill.payment
                ? 'paid'
                : totalAmount < bill.payment
                    ? 'partial'
                    : 'overpaid';

        const hasMultiple = matchedTransactions.length > 1;
        const firstMatch = matchedTransactions[0];

        return {
          billpk: bill.pk,
          bill_name: bill.transactiondescription,
          sql: bill.sql,
          transaction_desc: hasMultiple ? bill.sql : firstMatch?.description || '',
          transaction_date: hasMultiple ? 'multiple' : firstMatch?.date || '',
          transaction_id: hasMultiple ? 'multiple' : firstMatch?.id || null,
          transaction_amount: totalAmount,
          expected_amount: bill.payment,
          due_date: this.parseDueDay(bill.duedate),
          source: matchedTransactions.length > 0 ? 'auto' : '',
          status,
        };
      });

    } catch (err) {
      console.error('Error during onDateChange:', err);
    } finally {
      this.loading = false; // ✅ will ALWAYS run
    }
  }

  parseDueDay(duedate: string | null | undefined): string | null {
    if (!duedate) return null;

    // Try parsing as a full date
    const parsedDate = new Date(duedate);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.getDate().toString().padStart(2, '0');
    }

    // Try extracting a number (like "23rd" → 23)
    const dayMatch = duedate.match(/\b(\d{1,2})\b/);
    if (dayMatch) {
      const day = parseInt(dayMatch[1], 10);
      if (day >= 1 && day <= 31) {
        return day.toString().padStart(2, '0');
      }
    }

    // Fallback: not a valid date or day
    return null;
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
    this.reconService.updateTransactionSql(billpk, newSql)
        .then(() => {
          this.messageService.add({ severity: 'success', summary: 'SQL Updated', detail: 'SQL was successfully updated' });
        })
        .catch(() => {
          this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: 'Failed to update SQL' });
        });
  }

  getSeverity(transactionDesc: string | null): string {
    return transactionDesc ? 'success' : 'danger';
  }

  editTransaction(transaction: any): void {
    transaction.isediting = true;
  }

  clearInputs() {
    //this.fileUpload.clear();
    //this.uploadedFiles = [];
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
