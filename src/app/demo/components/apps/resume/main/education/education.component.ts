import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Education} from "../../types/education";


@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent {
  @Input() education: Education[] = [];
  @Output() educationChange = new EventEmitter<Education[]>();
  @Output() add = new EventEmitter<void>();
  @Output() remove = new EventEmitter<number>();

  editIndex: number | null = null;
  private updateEducation: any;
  private savedEducations: Education[] = [];

  addEducation() {
    this.add.emit();
  }

  removeEducation(index: number) {
    this.remove.emit(index);
  }

  saveEducation(index: number) {
    this.educationChange.emit([...this.education]); // emit a copy
    this.editIndex = null;
  }

  onSave() {
    this.updateEducation.emit(this.savedEducations);
  }
}

