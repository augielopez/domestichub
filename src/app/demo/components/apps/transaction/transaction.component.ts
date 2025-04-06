import {Component, OnInit, ViewChild} from '@angular/core';
import {FileUpload} from "primeng/fileupload";
import {TransactionService} from "./transaction.service";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent implements OnInit{
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  transactions: any[] = [];
  allTransactions: any[] = [];
  allTags: any[] = [];
  loading = false;
  uploadedFiles: File[] = [];
  dateOptions: { label: string; value: string; color: string }[] = [];
  selectedDate: string = '';
  selectedTag: string | null = null;

  constructor(private transactionService: TransactionService) {}

  async ngOnInit() {
    this.loading = true;
    try {
      this.transactions = await this.transactionService.getTransactionView();
      this.allTransactions = this.transactions ;
      this.generateDateOptions();
      this.allTags = await this.transactionService.getAllTags(); // Load tags

      this.transactions.forEach(tx => {
        tx.editableTags = (tx.tag_names || [])
            .map((name: string) => {
              const tag = this.allTags.find(t => t.name === name);
              return tag ? { id: tag.id, name: tag.name } : null;
            })
            .filter((tag: any): tag is { id: string; name: string } => !!tag);
      });
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      this.loading = false;
    }
  }

  onFileSelect(event: any) {
    this.uploadedFiles.push(...event.files);
    console.log('Selected files:', this.uploadedFiles);
  }

  async addTagToTransaction(tx: any) {
    const tagIds = (tx.editableTags || []).map((tag: any) => tag.id);

    try {
      await this.transactionService.addTagToTransaction(tx.transaction_id, tagIds);
      tx.tag_names = (tx.editableTags || [])
          .map((tag: any) => tag?.name)
          .filter((name: string | undefined | null): name is string => !!name);
    } catch (err) {
      console.error('Failed to add tag:', err);
      alert('Error adding tag');
    }
  }

  /*onDateChange(): void {
    if (!this.selectedDate) {
      this.transactions = [...this.allTransactions];
      return;
    }

    const [month, year] = this.selectedDate.split('/').map(Number);

    // Build date strings in YYYY-MM-DD format
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0); // last day of the month

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    this.transactions = this.allTransactions.filter(tx => {
      const txDateStr = new Date(tx.date).toISOString().split('T')[0];
      return txDateStr >= startStr && txDateStr <= endStr;
    });
  }*/

  onDateChange(): void {
    this.applyFilters();
  }

  onTagChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allTransactions];

    // Filter by selected month
    if (this.selectedDate) {
      const [month, year] = this.selectedDate.split('/').map(Number);
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.date).toISOString().split('T')[0];
        return txDate >= startStr && txDate <= endStr;
      });
    }

    // Filter by selected tag
    if (this.selectedTag) {
      filtered = filtered.filter(tx =>
          tx.editableTags?.some((tag: { id: string }) => tag.id === this.selectedTag)
      );
    }

    this.transactions = filtered;
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
  }


  // Called when user hits "Upload"
  async processUploadedFiles(event: any) {
    try {
      for (const file of this.uploadedFiles) {
        const { bank, accountId } = await this.detectBankAndAccount(file.name);
        console.log(`Processing ${file.name} → Bank: ${bank}, Account ID: ${accountId}`);
        await this.transactionService.uploadAndProcessFile(file, bank, accountId);
      }

      // Clear uploadedFiles after processing
      this.uploadedFiles = [];
      this.fileUpload.clear();

      alert('Files uploaded and processed successfully.');
    } catch (err) {
      console.error('Error processing files:', err);

      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert('An unknown error occurred.');
      }
    }
  }

  async detectBankAndAccount(fileName: string): Promise<{ bank: string, accountId: string }> {
    const lower = (fileName || '').toLowerCase();


    if (lower.includes('exportedtransactions')) {
      if (lower.includes('augie')) return { bank: 'First Tech', accountId: 'a3e849f5-4cae-452b-8235-76f3f04aec7c' };
      if (lower.includes('melissa_saving')) return { bank: 'First Tech', accountId: '3ed1b5e2-104b-46ee-b31b-3f590e264850' };
      if (lower.includes('melissa')) return { bank: 'First Tech', accountId: 'ab92a2b6-9d06-45aa-bc4f-6df26679739d' };
      if (lower.includes('non_monthly')) return { bank: 'First Tech', accountId: '966df550-3fd8-4697-8978-5c18ac03496e' };
    }

    if (lower.includes('credit') && lower.includes('2448')) {
      return { bank: 'US Bank', accountId: 'c702a2a6-2e25-410d-94e5-e26dcb51cf2c' };
    }

    if (lower.includes('fidelity') || lower.includes('history_for_account')) {
      return { bank: 'Fidelity', accountId: '2ee1dc7d-e3fa-48a9-97f5-65d45b9e4b38' };
    }

    throw new Error(`Cannot determine bank/account from filename: ${fileName}`);
  }
}
