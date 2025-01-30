import { Component, Inject } from '@angular/core';
import { ModalHeaderComponent } from '../../../../components/modal-header/modal-header.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ControlButtonComponent } from '../../../../components/control-button/control-button.component';
import { LabService } from '../../../../common/services/vr/lab.service';
import { LabFormData } from '../../../../common/types/lab-data';
import {
  atLeastOneFieldValidator,
  numberValidator,
} from '../../../../common/validators/lab-validators';

@Component({
  selector: 'app-lab-modal',
  imports: [
    ModalHeaderComponent,
    CommonModule,
    ReactiveFormsModule,
    ControlButtonComponent,
  ],
  templateUrl: './lab-modal.component.html',
  styleUrls: ['./lab-modal.component.scss'],
})
export class LabModalComponent {
  labForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<LabModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private labService: LabService
  ) {
    this.labForm = this.fb.group(
      {
        volatileSubstances: ['', [numberValidator]], 
        pH: ['', [numberValidator]],
        sum: ['', [numberValidator]],
        time: ['', Validators.required],
        password: ['', Validators.required],
      },
      {
        validators: atLeastOneFieldValidator([
          'volatileSubstances',
          'pH',
          'sum',
        ]),
      }
    ); // Используем валидатор
  }

  onSubmit(): void {
    if (this.labForm.invalid) {
      return;
    }

    const formData: LabFormData = this.labForm.value;

    if (formData.password !== '123') {
      this.labForm.get('password')?.setErrors({ incorrectPassword: true });
      this.labForm.get('password')?.markAsTouched();
      this.snackBar.open('Неверный пароль', 'Закрыть', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    this.labService.submitLabData(this.data.vrId, formData).subscribe(
      (response) => {
        this.isLoading = false;
        this.snackBar.open('Данные успешно отправлены', 'Закрыть', {
          duration: 3000,
        });
        this.dialogRef.close();
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open('Ошибка при отправке данных', 'Закрыть', {
          duration: 3000,
        });
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
