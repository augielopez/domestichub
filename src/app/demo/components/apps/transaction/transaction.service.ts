import { Injectable } from '@angular/core';
import {AuthSession, createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private supabase: SupabaseClient;
  private _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  async uploadAndProcessFile(file: File, bank: string, accountId: string) {
    const rawData = await this.readCsv(file);

    switch (bank.toLowerCase()) {
      case 'first tech':
        await this.loadToRawTable('raw_transactions_first_tech', rawData, file.name);
        await this.transformFirstTech(accountId, file.name);
        break;
      case 'us bank':
        await this.loadToRawTable('raw_transactions_us_bank_credit', rawData, file.name);
        await this.transformUsBank(accountId, file.name);
        break;
      case 'fidelity':
        await this.loadToRawTable('raw_transactions_fidelity_cash', rawData, file.name);
        await this.transformFidelity(accountId, file.name);
        break;
      default:
        throw new Error('Unsupported bank type');
    }
  }

  async getTransactionView(): Promise<any[]> {
    const { data, error } = await this.supabase
        .from('v_all_transactions_with_tags')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transaction view:', error);
      throw error;
    }

    return data || [];
  }

  async getAllTags(): Promise<any[]> {
    const { data, error } = await this.supabase.from('tags').select('*').order('name', { ascending: true });  // Sort A → Z;
    if (error) throw error;
    return data ?? [];
  }

  async addTagToTransaction(transactionId: string, newTagIds: string[]): Promise<void> {
    // 1. Fetch existing tags for this transaction
    const { data: existingTags, error: fetchError } = await this.supabase
        .from('transaction_tags')
        .select('tag_id')
        .eq('transaction_id', transactionId);

    if (fetchError) throw fetchError;

    const existingTagIds = existingTags?.map(t => t.tag_id) || [];

    // 2. Figure out tags to add and remove
    const tagsToAdd = newTagIds.filter(id => !existingTagIds.includes(id));
    const tagsToRemove = existingTagIds.filter(id => !newTagIds.includes(id));

    // 3. Add new tags
    if (tagsToAdd.length > 0) {
      const insertPayload = tagsToAdd.map(tagId => ({
        transaction_id: transactionId,
        tag_id: tagId,
      }));
      const { error: insertError } = await this.supabase
          .from('transaction_tags')
          .insert(insertPayload);
      if (insertError) throw insertError;
    }

    await this.logTagChange(transactionId, tagsToAdd, 'added');

    // 4. Remove old tags
    if (tagsToRemove.length > 0) {
      const { error: deleteError } = await this.supabase
          .from('transaction_tags')
          .delete()
          .eq('transaction_id', transactionId)
          .in('tag_id', tagsToRemove);
      if (deleteError) throw deleteError;
    }

    await this.logTagChange(transactionId, tagsToRemove, 'removed');
  }

  async logTagChange(transactionId: string, tagIds: string[], action: 'added' | 'removed') {
    if (!tagIds.length) return;

    const historyEntries = tagIds.map(tagId => ({
      transaction_id: transactionId,
      tag_id: tagId,
      action,
      changed_by: '032e1f2b-a094-473b-86cf-5f24913f2429'
    }));

    const { error } = await this.supabase
        .from('transaction_tag_history')
        .insert(historyEntries);

    if (error) throw error;
  }



  private async loadToRawTable(table: string, rows: any[], fileName: string) {
    // Clear the table
    await this.supabase.from(table).delete().neq('id', 0);

    // Insert with filename attached
    const enriched = rows.map(row => ({
      ...row,
      source_file_name: fileName
    }));
    const { error } = await this.supabase.from(table).insert(enriched);
    if (error) throw error;
  }

  private async readCsv(file: File): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').filter(line => line.trim() !== '');
        const headers = rows[0].split(',').map(h => h.trim().replace(/\r/g, ''));
        const data = rows.slice(1).map(row => {
          const values = row.split(',').map(val => val.trim().replace(/\r/g, ''));
          const entry: any = {};
          headers.forEach((h, i) => entry[h] = values[i]);
          return entry;
        });
        resolve(data);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  // TRANSFORMATION FUNCTIONS:
  private async transformFirstTech(accountId: string, fileName: string) {
    const { data, error } = await this.supabase.from('raw_transactions_first_tech').select('*');
    if (error) throw error;

    if (data) {
      const normalized = data.map(row => ({
        account_id: accountId,
        date: row['posting_date'],
        amount: Number(row['amount']),
        description: row['description'],
        source_file_name: fileName,
      }));

      await this.insertWithDeduplication(normalized);
    }
  }

  private async transformUsBank(accountId: string, fileName: string) {
    const { data, error } = await this.supabase.from('raw_transactions_us_bank_credit').select('*');
    if (error) throw error;

    if (data) {
      const normalized = data.filter(row => row['amount']).map(row => ({
        account_id: accountId,
        date: row['date'],
        amount: Number(row['amount']),
        description: row['name'],
        source_file_name: fileName,
      }));

      await this.insertWithDeduplication(normalized);
    }
  }

  private async transformFidelity(accountId: string, fileName: string) {
    const { data, error } = await this.supabase.from('raw_transactions_fidelity_cash').select('*');
    if (error) throw error;

    if (data) {
      const normalized = data.filter(row => row['amount']).map(row => ({
        account_id: accountId,
        date: row['run_date'],
        amount: Number(row['amount']),
        description: row['action'],
        source_file_name: fileName,
      }));

      await this.insertWithDeduplication(normalized);
    }
  }

  private async insertWithDeduplication(transactions: any[]) {
    for (const tx of transactions) {
      const { data: existing, error: checkError } = await this.supabase
          .from('combined_transactions')
          .select('id')
          .match({
            date: tx.date,
            amount: tx.amount,
            description: tx.description,
            account_id: tx.account_id,
          });

      if (checkError) throw checkError;
      if (!existing || existing.length === 0) {
        const { error } = await this.supabase.from('combined_transactions').insert([tx]);
        if (error) throw error;
      }
    }
  }
}
