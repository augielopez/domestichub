import {Injectable} from '@angular/core';
import {AuthSession, createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import * as Papa from 'papaparse';
import {
  FidelityTransaction,
  FirstTechTransactions,
  HistoryFirstTechTransactions,
  ReconTransaction,
  UsBankTransactions
} from "../../../api/transactions";

@Injectable({
  providedIn: 'root'
})
export class ReconService {
  private supabase: SupabaseClient;
  private _session: AuthSession | null = null;
  transactions: ReconTransaction[] = [];
  historyReconTransaction: ReconTransaction[] = [];

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  // Supabase Operations

  async getReconTransactions() {
    try {
      const { data, error } = await this.supabase.from('vw_recon').select('*');
      if (error) throw error;
      console.log('Data updated successfully:', data);
      return data; // Ensure a value is always returned
    } catch (error) {
      this.handleSupabaseError(error);
      return []; // Return an empty array or handle it as per your application's requirements
    }
  }

  getReconTransactionDetails(): Observable<ReconTransaction[]> {
    return new Observable<ReconTransaction[]>((observer) => {
      this.supabase.from('vw_recon').select('*')
          .then(({ data, error }) => {
            if (error) {
              observer.error(error);
            } else {
              observer.next(data as ReconTransaction[]);
              observer.complete();
            }
          });
    });
  }

  async getTransactionsView(): Promise<ReconTransaction[]>  {
    try {
      const { data, error } = await this.supabase.rpc('recon_query_function');
      if (error) throw error;
      this.transactions = data || [];
      return this.transactions; // Ensure a value is always returned
    } catch (error) {
      this.handleSupabaseError(error);
      return []; // Return an empty array or handle it as per your application's requirements
    }
  }

  async updateTransactionSql(billpk: number, newSql: string | null) {
    try {
      const { data, error } = await this.supabase
          .from('tb_bills')
          .update({ sql: newSql || null })
          .eq('pk', billpk)
          .select();

      if (error) throw error;
      return data; // Ensure a value is always returned
    } catch (error) {
      this.handleSupabaseError(error);
      return null; // Return null or handle it as per your application's requirements
    }
  }

  async insertManualTransaction(transaction: ReconTransaction) {
    try {
      const { data, error } = await this.supabase
          .from('tb_manual_transactions')
          .insert([{
            date: transaction.transaction_date,
            name: transaction.transaction_desc,
            amount: transaction.transaction_amount,
            source: transaction.source
          }])
          .select();

      if (error) throw error;
      return data; // Ensure a value is always returned
    } catch (error) {
      this.handleSupabaseError(error);
      return null; // Return null or handle it as per your application's requirements
    }
  }

  async getCompareInsertReconHistory(currentReconlist: ReconTransaction[]) {
    try {
      const { data: history_recon, error: history_error } = await this.supabase
          .from('history_recon')
          .select('*');

      if (history_error) throw history_error;

      const reconTransactions: ReconTransaction[] = history_recon as ReconTransaction[] || [];
      this.historyReconTransaction = reconTransactions;

      // Use multiple keys: 'transaction_date', 'transaction_desc', and 'transaction_amount'
      currentReconlist = this.removeDuplicates(
          currentReconlist,
          this.historyReconTransaction,
          ['transaction_date', 'transaction_desc', 'transaction_amount']
      );

      if (currentReconlist && currentReconlist.length > 0) {
        await this.insertHistoryRecon(currentReconlist);
      } else {
        console.log('The list is empty or undefined.');
      }

      return currentReconlist; // Ensure a value is always returned
    } catch (error) {
      this.handleSupabaseError(error);
      return []; // Return an empty array or handle it as per your application's requirements
    }
  }

  async getCompareInsertUsBankHistory(csvData: UsBankTransactions[]) {
    try {
      const { data: history_transactions, error: history_error } = await this.supabase
          .from('history_tb_us_bank_transactions')
          .select('*');

      if (history_error) throw history_error;

      let historyData: UsBankTransactions[] = (history_transactions || []).map(transaction => ({
        date: this.parseDate(this.cleanValue(transaction.date)),
        transaction: this.cleanValue(transaction.transaction),
        name: this.cleanValue(transaction.name),
        memo: this.cleanValue(transaction.memo),
        amount: transaction.amount
      }));

      if (csvData && csvData.length > 0) {
        await this.insertHistoryUsBank(historyData);
        await this.deleteUsBankTrans();
        await this.insertUsBank(csvData);
      } else {
        console.log('The list is empty or undefined.');
      }

      return csvData; // Ensure a value is always returned
    } catch (error) {
      this.handleSupabaseError(error);
      return []; // Return an empty array or handle it as per your application's requirements
    }
  }

  async getCompareInsertFidelityHistory(csvData: FidelityTransaction[]) {
    try {
      const { data: history_transactions, error: history_error } = await this.supabase
          .from('history_tb_fidelity_transactions')
          .select('*');

      if (history_error) throw history_error;

      let historyData: FidelityTransaction[] = (history_transactions || []).map(transaction => ({
        run_date: this.parseNullableDate(this.cleanValue(transaction.run_date)), // Ensure run_date is parsed correctly
        action: this.cleanValue(transaction.action),
        symbol: this.cleanValue(transaction.symbol),
        description: this.cleanValue(transaction.description),
        type: this.cleanValue(transaction.type),
        quantity: parseFloat(this.cleanValue(transaction.quantity.toString())),
        price: this.parseNullableNumber(transaction.price),
        commission: this.parseNullableNumber(transaction.commission),
        fees: this.parseNullableNumber(transaction.fees),
        accrued_interest: this.parseNullableNumber(transaction.accrued_interest),
        amount: parseFloat(this.cleanValue(transaction.amount.toString())),
        cash_balance: parseFloat(this.cleanValue(transaction.cash_balance.toString())),
        settlement_date: this.parseNullableDate(transaction.settlement_date)
      }));

      if (csvData && csvData.length > 0) {
        await this.insertHistoryFidelity(historyData);
        await this.deleteFidelityTrans();
        await this.insertFidelity(csvData);
      } else {
        console.log('The list is empty or undefined.');
      }

      return csvData; // Ensure a value is always returned
    } catch (error) {
      this.handleSupabaseError(error);
      return []; // Return an empty array or handle it as per your application's requirements
    }
  }

  async getCompareInsertFirstTechHistory(csvData: FirstTechTransactions[], selectedFileType: string) {
    try {
      const { data: history_transactions, error: error } = await this.supabase
          .from('history_tb_first_tech_transactions')
          .select('*');

      if (error) throw error;

      let historyData: FirstTechTransactions[] = (history_transactions || []).map(transaction => ({
        transaction_id: transaction.transaction_id,
        posting_date: transaction.posting_date,
        effective_date: transaction.effective_date,
        transaction_type: transaction.transaction_type,
        amount: transaction.amount,
        check_number: transaction.check_number,
        reference_number: transaction.reference_number,
        description: transaction.description,
        transaction_category: transaction.transaction_category,
        type: transaction.type,
        balance: transaction.balance,
        memo: transaction.memo,
        extended_description: transaction.extended_description
      }));

      if (csvData && csvData.length > 0) {
        await this.insertHistoryFirstTech(historyData, selectedFileType);
        await this.deleteFirstTechTrans(selectedFileType);
        await this.insertFirstTech(csvData, selectedFileType);
      } else {
        console.log('The list is empty or undefined.');
      }

      return csvData; // Ensure a value is always returned
    } catch (error) {
      this.handleSupabaseError(error);
      return []; // Return an empty array or handle it as per your application's requirements
    }
  }

  async insertHistoryRecon(currentReconlist: ReconTransaction[]) {
    try {
      const { data, error } = await this.supabase
          .from('history_recon')
          .insert(currentReconlist)
          .select();

      if (error) throw error;
      console.log('Inserted transaction details:', data);
    } catch (error) {
      this.handleSupabaseError(error);
    }
  }

  private async insertHistoryFirstTech(historyFirstTechTransaction: FirstTechTransactions[], selectedFileType: string) {
    try {

      let { data: current_data, error: select_error } = await this.supabase
          .from(selectedFileType)
          .select('*')

      if (current_data && current_data.length > 0) {
        // Step 2: Convert fetched data to UsBankTransactions[] and clean each entry
        let currentData: FirstTechTransactions[] = (current_data || []).map(transaction => ({
          transaction_id: this.cleanValue(transaction.transaction_id),
          posting_date: this.parseNullableDate(transaction.posting_date),
          effective_date: this.parseNullableDate(transaction.effective_date),
          transaction_type: this.cleanValue(transaction.transaction_type),
          amount: parseFloat(this.cleanValue(transaction.amount)),
          check_number: this.cleanValue(transaction.check_number),
          reference_number: this.cleanValue(transaction.reference_number),
          description: this.cleanValue(transaction.description),
          transaction_category: this.cleanValue(transaction.transaction_category),
          type: this.cleanValue(transaction.type),
          balance: parseFloat(this.cleanValue(transaction.balance)),
          memo: this.cleanValue(transaction.memo),
          extended_description: this.cleanValue(transaction.extended_description)
        }));

        currentData = this.removeDuplicates(
            currentData,
            historyFirstTechTransaction,
            ['posting_date', 'amount', 'description']
        );

        const currentDataReady: HistoryFirstTechTransactions[] = currentData.map(transaction => ({
          ...transaction,  // Spread the existing properties
          source: selectedFileType  // Add the source property
        }));

        const { data, error } = await this.supabase
            .from('history_tb_first_tech_transactions')
            .insert(currentDataReady)
            .select();

        if (error) throw error;
        console.log('Inserted transaction details:', data);
      }
    } catch (error) {
      this.handleSupabaseError(error);
    }
  }

  private async deleteFirstTechTrans(selectedFileType: string) {
    try {
      const { error } = await this.supabase
          .from(selectedFileType)
          .delete()
          .not('transaction_id', 'is', null);

      if (error) throw error;
      console.log('Transactions have been deleted from tb_us_bank_transactions');
    } catch (error) {
      this.handleSupabaseError(error);
    }
  }

  private async insertFirstTech(currentFirstTechTransList: FirstTechTransactions[], selectedFileType: string) {
    try {
      const { data, error } = await this.supabase
          .from(selectedFileType)
          .insert(currentFirstTechTransList)
          .select();

      if (error) throw error;
      console.log('Inserted transaction details:', data);
    } catch (error) {
      this.handleSupabaseError(error);
    }
  }

  private async insertHistoryUsBank(historyData: UsBankTransactions[]) {
    try {
      // Step 1: Fetch data from 'tb_us_bank_transactions' table
      let { data: tb_us_bank_transactions, error: select_error } = await this.supabase
          .from('tb_us_bank_transactions')
          .select('*');

      // Handle any errors from the select operation
      if (select_error) throw select_error;

      // Step 2: Convert fetched data to UsBankTransactions[] and clean each entry
      let currentData: UsBankTransactions[] = (tb_us_bank_transactions || []).map(transaction => ({
        date: this.parseDate(this.cleanValue(transaction.date)),
        transaction: this.cleanValue(transaction.transaction),
        name: this.cleanValue(transaction.name),
        memo: this.cleanValue(transaction.memo),
        amount: transaction.amount
      }));

      // Step 3: Remove duplicates
      currentData = this.removeDuplicates(
          currentData,
          historyData,
          ['date', 'name', 'amount']
      );

      // Step 4: Insert cleaned and deduplicated transactions into the history table
      const { data, error } = await this.supabase
          .from('history_tb_us_bank_transactions')
          .insert(currentData)  // Make sure to insert the cleaned and deduplicated data
          .select();

      // Handle any errors from the insert operation
      if (error) throw error;

      console.log('Inserted transaction details:', data);
    } catch (error) {
      this.handleSupabaseError(error);
    }
  }

  async deleteUsBankTrans(){
    try {
      const { error } = await this.supabase
          .from('tb_us_bank_transactions')
          .delete()
          .not('date', 'is', null);

      if (error) throw error;
      console.log('Transactions have been deleted from tb_us_bank_transactions');
    } catch (error) {
      this.handleSupabaseError(error);
    }
  }

  async insertUsBank(transactions: UsBankTransactions[]) {
    try {
      const { data, error } = await this.supabase
          .from('tb_us_bank_transactions')
          .insert(transactions)
          .select();

      if (error) throw error;
      console.log('Inserted transaction details:', data);
    } catch (error) {
      this.handleSupabaseError(error);
    }
  }

  private async insertHistoryFidelity(historyData: FidelityTransaction[]) {
    try {
      let { data: current, error: select_error } = await this.supabase
          .from('tb_fidelity_transactions')
          .select('*')

      if (select_error) throw select_error;

      let currentData: FidelityTransaction[] = (current || []).map(transaction => ({
        run_date: this.parseNullableDate(this.cleanValue(transaction.run_date)), // Ensure run_date is parsed correctly
        action: this.cleanValue(transaction.action),
        symbol: this.cleanValue(transaction.symbol),
        description: this.cleanValue(transaction.description),
        type: this.cleanValue(transaction.type),
        quantity: parseFloat(this.cleanValue(transaction.quantity.toString())),
        price: this.parseNullableNumber(transaction.price),
        commission: this.parseNullableNumber(transaction.commission),
        fees: this.parseNullableNumber(transaction.fees),
        accrued_interest: this.parseNullableNumber(transaction.accrued_interest),
        amount: parseFloat(this.cleanValue(transaction.amount.toString())),
        cash_balance: parseFloat(this.cleanValue(transaction.cash_balance.toString())),
        settlement_date: this.parseNullableDate(transaction.settlement_date)
      }));

      currentData = this.removeDuplicatesTest(
          currentData,
          historyData,
          ['run_date', 'action', 'amount']
      );

      const { data, error } = await this.supabase
          .from('history_tb_fidelity_transactions')
          .insert(currentData)
          .select();

      if (error) throw error;
      console.log('Inserted transaction details:', data);
    } catch (error) {
      this.handleSupabaseError(error);
    }
  }

  async deleteFidelityTrans(){
    try {
      const { error } = await this.supabase
          .from('tb_fidelity_transactions')
          .delete()
          .not('run_date', 'is', null);

      if (error) throw error;
      console.log('Transactions have been deleted from tb_fidelity_transactions');
    } catch (error) {
      this.handleSupabaseError(error);
    }
  }

  async insertFidelity(transactions: FidelityTransaction[]) {
    try {
      const { data, error } = await this.supabase
          .from('tb_fidelity_transactions')
          .insert(transactions)
          .select();

      if (error) throw error;
      console.log('Inserted transaction details:', data);
    } catch (error) {
      this.handleSupabaseError(error);
    }
  }

  async refreshMaterializedView(): Promise<void> {
    try {
      const { data, error } = await this.supabase.rpc('refresh_vw_all_transaction_materialized_view');

      if (error) {
        throw error;
      }

      console.log('Materialized view refreshed successfully:', data);
    } catch (error) {
      console.error('Error refreshing materialized view:', error);
    }
  }

  // CSV File Operations

  readCsvFile(file: File, selectedFileType: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const csvContent = event.target?.result as string;
        let transactions;
        switch (selectedFileType) {
          case 'tb_fidelity_transactions':
            transactions = this.parseCsvToTransactionFidelity(csvContent);
            break;
          case 'tb_us_bank_transactions':
            transactions = this.parseCsvToTransactionUsBank(csvContent);
            break;
          default:
            transactions = this.parseCsvToTransactionFirstTech(csvContent);
            break;
        }

        resolve(transactions);
      };

      reader.onerror = () => reject(new Error(`Error reading file: ${reader.error?.message}`));
      reader.readAsText(file);
    });
  }

  private parseCsvToTransactionUsBank(csvContent: string): UsBankTransactions[] {
    return this.parseCsv(csvContent, (columns) => ({
      date: this.parseDate(this.cleanValue(columns[0])),
      transaction: this.cleanValue(columns[1]),
      name: this.cleanValue(columns[2]),
      memo: this.cleanValue(columns[3]),
      amount: parseFloat(this.cleanValue(columns[4]).replace(/[^0-9.-]+/g, ''))
    }));
  }

  private parseCsvToTransactionFidelity(csvContent: string): FidelityTransaction[] {

    const result: FidelityTransaction[] = [];
    try {
      Papa.parse(csvContent, {
        header: true, // Assumes the first line is the header
        skipEmptyLines: true, // Skip empty lines
        complete: (parsedResult) => {
          parsedResult.data.forEach((row: any) => {
            const disclaimerText = "The data and information in this spreadsheet";
            const check = row['Run Date'];

            if (check && check.toLowerCase().includes(disclaimerText.toLowerCase())) {
              throw new Error('BreakLoop');
            }
            const transaction: FidelityTransaction = {
              run_date: this.parseNullableDate(this.cleanValue(row['Run Date'])),
              action: this.cleanValue(row['Action']),
              symbol: this.cleanValue(row['Symbol']),
              description: this.cleanValue(row['Description']),
              type: this.cleanValue(row['Type']),
              quantity: parseFloat(this.cleanValue(row['Quantity'])),
              price: this.parseNullableNumber(row['Price ($)']),
              commission: this.parseNullableNumber(row['Commission ($)']),
              fees: this.parseNullableNumber(row['Fees ($)']),
              accrued_interest: this.parseNullableNumber(row['Accrued Interest ($)']),
              amount: parseFloat(this.cleanValue(row['Amount ($)'])),
              cash_balance: parseFloat(this.cleanValue(row['Cash Balance ($)'])),
              settlement_date: this.parseNullableDate(row['Settlement Date'])
            };

            result.push(transaction);
          });
        },
        error: (error: any) => {
          console.error("Error parsing CSV: ", error.message);
        }
      });
    }
    catch (e) {
      if (e instanceof Error && e.message !== 'BreakLoop') {
        throw e;  // Re-throw other errors
      }
    }

    return result;
  }

  private parseCsvToTransactionFirstTech(csvContent: string): FirstTechTransactions[] {
    const result: FirstTechTransactions[] = [];

    Papa.parse(csvContent, {
      header: true, // Assumes the first line is the header
      skipEmptyLines: true, // Skip empty lines
      complete: (parsedResult) => {
        parsedResult.data.forEach((row: any) => {
          const transaction: FirstTechTransactions = {
            transaction_id: this.cleanValue(row['Transaction ID']),
            posting_date: this.parseNullableDate(row['Posting Date']),
            effective_date: this.parseNullableDate(row['Effective Date']),
            transaction_type: this.cleanValue(row['Transaction Type']),
            amount: parseFloat(this.cleanValue(row['Amount'])),
            check_number: this.cleanValue(row['Check Number']),
            reference_number: this.cleanValue(row['Reference Number']),
            description: this.cleanValue(row['Description']),
            transaction_category: this.cleanValue(row['Transaction Category']),
            type: this.cleanValue(row['Type']),
            balance: parseFloat(this.cleanValue(row['Balance'])),
            memo: this.cleanValue(row['Memo']),
            extended_description: this.cleanValue(row['Extended Description'])
          };

          result.push(transaction);
        });
      },
      error: (error: any) => {
        console.error("Error parsing CSV: ", error.message);
      }
    });

    return result;
  }

  // Helper Methods

  private parseCsv<T>(csvContent: string, rowParser: (columns: string[]) => T, startDataIndex: number = 1): T[] {
    const lines = csvContent.split('\n');
    const result: T[] = [];

    let endDataIndex = lines.length;
    for (let i = startDataIndex; i < lines.length; i++) {
      if (lines[i].trim() === "") {
        endDataIndex = i;
        break;
      }
    }

    for (let i = startDataIndex; i < endDataIndex; i++) {
      const line = lines[i].trim();
      if (line) {
        const columns = line.split(',');
        if (columns) {
          try {
            result.push(rowParser(columns));
          } catch (error: unknown) {
            if (error instanceof Error) {
              console.error(`Error parsing row ${i}: ${error.message}`);
            } else {
              console.error(`Unknown error parsing row ${i}`);
            }
          }
        }
      }
    }

    return result;
  }

  private cleanValue(value: string | null | undefined): string {
    if (value == null) {
      return '';  // Return an empty string if the input is null or undefined
    }

    return value.replace(/[";]/g, '').trim();
  }


  private parseDate(dateString: string): Date {
    dateString = dateString.trim();
    if (!dateString) {
      throw new Error('Invalid date string');
    }

    let date: Date;
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-').map(part => parseInt(part, 10));
      date = new Date(year, month - 1, day);
    } else if (dateString.includes('/')) {
      const [month, day, year] = dateString.split('/').map(part => parseInt(part, 10));
      date = new Date(year, month - 1, day);
    } else {
      throw new Error('Unknown date format');
    }

    date.setHours(0, 0, 0, 0);
    return date;
  }

  private parseNullableNumber(value: string): number | null {
    const cleanedValue = this.cleanValue(value);
    return cleanedValue ? parseFloat(cleanedValue) : null;
  }

  private parseNullableDate(dateString: string): Date | null {
    const cleanedValue = this.cleanValue(dateString);
    return cleanedValue ? this.parseDate(cleanedValue) : null;
  }

  private removeDuplicates<T>(list: T[], referenceList: T[], uniqueKeys: (keyof T)[]): T[] {
    return list.filter((listItem) => {
      return !referenceList.some((refItem) =>
          uniqueKeys.every((key) => refItem[key] === listItem[key])
      );
    });
  }

  private removeDuplicatesTest<T>(list: T[], referenceList: T[], uniqueKeys: (keyof T)[]): T[] {
    return list.filter((listItem) => {
      return !referenceList.some((refItem) => {
        return uniqueKeys.every((key) => {
          const listValue = listItem[key];
          const refValue = refItem[key];

          // Handle different types of comparisons
          if (key === 'run_date') {
            // Convert to date objects for comparison
            return new Date(listValue as unknown as string).getTime() === new Date(refValue as unknown as string).getTime();
          } else if (key === 'amount') {
            // Round the amount for precision comparison
            return Math.round((listValue as unknown as number) * 100) / 100 === Math.round((refValue as unknown as number) * 100) / 100;
          } else {
            // Standard comparison for other fields
            return listValue === refValue;
          }
        });
      });
    });
  }


  private handleSupabaseError(error: unknown): void {
    if (error instanceof Error) {
      console.error('Supabase error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}
