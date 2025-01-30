// validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function atLeastOneFieldValidator(fields: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isAnyFieldFilled = fields.some(field => control.get(field)?.value !== '');
    return isAnyFieldFilled ? null : { atLeastOneField: true };
  };
}

export function numberValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;
  if (value === null || value === '') {
    return null; // Поле пустое, валидация не требуется
  }
  const regex = /^\d{1,2}(\.\d{1,2})?$/;
  if (!regex.test(value)) {
    return { 'invalidNumber': true };
  }
  const numericValue = parseFloat(value);
  if (numericValue < 0 || numericValue > 30) {
    return { 'outOfRange': true };
  }
  return null;
}
