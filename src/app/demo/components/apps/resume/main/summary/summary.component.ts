import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Resume} from "../../types/resume";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  @Input() summary!: Resume['summary'];
  @Output() saveSummary = new EventEmitter<void>();

  onSaveClick() {
    this.saveSummary.emit();
  }
}
