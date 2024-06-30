import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-add-entity',
  templateUrl: './add-entity.component.html',
  styleUrl: './add-entity.component.scss'
})
export class AddEntityComponent {
    newEntity: string = '';

    @Output() addEntity = new EventEmitter<string>();

    onSubmit() {
        if (this.newEntity.trim() !== '') {
            this.addEntity.emit(this.newEntity);
            this.newEntity = '';
        }
    }

}
