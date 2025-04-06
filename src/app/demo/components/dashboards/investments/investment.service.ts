import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import {FmpAsset} from "../../../api/fmp-asset";

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private apiKey = 'SDxWs7bbU6ECH0TuQh3xY4z23p9VZL61'; // 🔑 Replace with your actual FMP API key
  private apiUrl = 'https://financialmodelingprep.com/api/v3/quote';

  constructor(private http: HttpClient) {}

  // Fetch multiple cryptos in one request
  getCryptoInvestments(): Observable<FmpAsset[]> {
    const symbols = 'BTCUSD,ETHUSD,ADAUSD,SOLUSD,XRPUSD';  // Add more if needed
    return this.http.get<FmpAsset[]>(`${this.apiUrl}/${symbols}?apikey=${this.apiKey}`).pipe(
        catchError(error => {
          console.error('Error fetching crypto investments:', error);
          return of([]); // Return empty array if API fails
        })
    );
  }

  // Fetch multiple index investments in one request
  getIndexInvestments(): Observable<FmpAsset[]> {
    const symbols = 'VTI,VXUS,BTCUSD,ETHUSD,ADAUSD,SOLUSD,XRPUSD';  // S&P 500 and Nasdaq 100
    return this.http.get<FmpAsset[]>(`${this.apiUrl}/${symbols}?apikey=${this.apiKey}`).pipe(
        catchError(error => {
          console.error('Error fetching index investments:', error);
          return of([]); // Return empty array if API fails
        })
    );
  }
}
