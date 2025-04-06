import {Component, OnInit} from '@angular/core';
import {FmpAsset} from "../../../../api/fmp-asset";
import {InvestmentService} from "../investment.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit {
  indexes: FmpAsset[] = [];
  loading = true;

  constructor(private investmentService: InvestmentService) {}

  ngOnInit(): void {
    this.investmentService.getIndexInvestments().subscribe(data => {
      this.indexes = data;
      this.loading = false;
    });
  }
}
