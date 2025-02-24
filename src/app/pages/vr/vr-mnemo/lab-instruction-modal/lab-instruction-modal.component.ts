import { Component } from '@angular/core';
import { ModalHeaderComponent } from '../../../../components/modal-header/modal-header.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-lab-instruction-modal',
  imports: [ModalHeaderComponent],
  templateUrl: './lab-instruction-modal.component.html',
  styleUrl: './lab-instruction-modal.component.scss',
})
export class LabInstructionModalComponent {
  constructor(public dialogRef: MatDialogRef<LabInstructionModalComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
