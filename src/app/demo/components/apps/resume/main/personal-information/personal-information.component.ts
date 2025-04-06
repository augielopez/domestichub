import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Resume } from '../../types/resume';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent {
  @Input() personal_info!: Resume['personal_info'];
  @Output() savePersonalInfo = new EventEmitter<void>();

  onSaveClick() {
    this.savePersonalInfo.emit();
  }
}

