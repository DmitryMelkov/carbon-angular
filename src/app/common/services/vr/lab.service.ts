import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable, of } from 'rxjs';
import { LabData, LabLastDay } from '../../types/lab-data';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { LabPasswordDialogComponent } from '../../../pages/vr/vr-mnemo/lab-password-dialog/lab-password-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class LabService {
  constructor(private http: HttpClient, private dialog: MatDialog) {}

  private normalizeId(id: string): string {
    return id.toLowerCase().includes('vr') ? id : `vr${id}`;
  }

  private normalizeIdForDelete(id: string): string {
    // Если уже есть "vr" в любом регистре, заменяем на "Vr", иначе добавляем "Vr"
    return id.toLowerCase().includes('vr') ? id.replace(/vr/gi, 'Vr') : `Vr${id}`;
  }

  getLabData(id: string): Observable<LabData> {
    const normalizedId = this.normalizeId(id);
    const url = `${environment.apiUrl}/api/lab/pech${normalizedId}/last`;
    console.log(url);
    return this.http.get<LabData>(url);
  }

  submitLabData(id: string, formData: any): Observable<any> {
    const normalizedId = this.normalizeId(id);
    const apiUrl = `${environment.apiUrl}/api/lab/pech${normalizedId}/submit`;
    return this.http.post(apiUrl, {
      value: formData.volatileSubstances
        ? formData.volatileSubstances.replace(',', '.')
        : null,
      valuePH: formData.pH ? formData.pH.replace(',', '.') : null,
      valueSUM: formData.sum ? formData.sum.replace(',', '.') : null,
      time: formData.time,
    });
  }

  getLastDayData(id: string): Observable<LabLastDay[]> {
    const normalizedId = this.normalizeId(id);
    const url = `${environment.apiUrl}/api/lab/pech${normalizedId}/last-day`;
    return this.http.get<LabLastDay[]>(url);
  }

  deleteLabData(id: string, recordId: string): Observable<any> {
    const normalizedId = this.normalizeIdForDelete(id);
    const url = `${environment.apiUrl}/api/lab/delete/pech${normalizedId}/${recordId}`;
    return this.http.delete(url);
  }

  // Добавим метод проверки пароля
  checkPassword(password: string): Observable<boolean> {
    // Здесь должна быть реальная проверка пароля через API
    return of(password === '123').pipe(delay(500)); // Имитация запроса
  }
}
