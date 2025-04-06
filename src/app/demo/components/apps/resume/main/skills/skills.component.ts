import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Skill} from "../../types/skill";
import {Tag} from "../../types/tag";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {
  @Input() savedSkills: Skill[] = [];
  @Input() availableTags: Tag[] = [];

  @Output() updateSkills = new EventEmitter<Skill[]>();

  skill: Skill = {
    id: '',
    user_id: '',
    name: '',
    proficiency_level: '',
    created_at: '',
    created_by: '',
    updated_at: '',
    updated_by: ''
  };
  showTable = true;
  isEdit = false;
  editIndex: number | null = null;

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}


  onSave() {
    this.updateSkills.emit(this.savedSkills);
  }

  toggleShowTable() {
    this.showTable = !this.showTable;
  }

  addSkill() {
    if (this.isEdit && this.editIndex !== null) {
      // Update the skill at the original index
      this.savedSkills[this.editIndex] = { ...this.skill };

      // Reset edit mode
      this.isEdit = false;
      this.editIndex = null;
    } else {
      // Add new skill
      this.savedSkills.push({ ...this.skill });
    }

    this.showTable = true;

    // Reset form
    this.skill = {
      id: '',
      user_id: '',
      name: '',
      proficiency_level: '',
      created_at: '',
      created_by: '',
      updated_at: '',
      updated_by: ''
    };
  }


  editSkill(skill: any) {
    console.log('Editing skill:', skill);

    this.editIndex = this.savedSkills.findIndex(s => s.name === skill.name);
    if (this.editIndex > -1) {
      this.skill = this.savedSkills[this.editIndex]
      this.isEdit = true;
    }

    this.showTable = false;
  }

  deleteSkill(skill: any) {
    console.log('Deleting skill:', skill);
    const index = this.savedSkills.findIndex(s => s.name === skill.name);
    if (index > -1) {
      this.savedSkills.splice(index, 1);
      //this.updateSkills.emit(this.savedSkills); // Optional: notify parent
    }
  }

  confirm(event: Event, skill: any) {
    this.confirmationService.confirm({
      key: 'confirm',
      target: event.target || new EventTarget(),
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteSkill(skill);
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }

}
