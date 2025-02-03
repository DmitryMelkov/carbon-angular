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

  getLabData(id: string): Observable<LabData> {
    const url = `${environment.apiUrl}/api/lab/pech${id}/last`;
    return this.http.get<LabData>(url);
  }

  submitLabData(id: string, formData: any): Observable<any> {
    const apiUrl = `${environment.apiUrl}/api/lab/pech${id}/submit`;
    return this.http.post(apiUrl, {
      value: formData.volatileSubstances
        ? formData.volatileSubstances.replace(',', '.')
        : null,
      valuePH: formData.pH ? formData.pH.replace(',', '.') : null,
      valueSUM: formData.sum ? formData.sum.replace(',', '.') : null,
      time: formData.time,
    });
  }

  getLastDayData(vrId: string): Observable<LabLastDay[]> {
    const url = `${environment.apiUrl}/api/lab/pech${vrId}/last-day`;
    return this.http.get<LabLastDay[]>(url);
  }

  deleteLabData(vrId: string, recordId: string): Observable<any> {
    const normalizedVrId = vrId.replace(/vr/gi, 'Vr');
    const url = `${environment.apiUrl}/api/lab/delete/pech${normalizedVrId}/${recordId}`;
    return this.http.delete(url);
  }

  // Добавим метод проверки пароля
  checkPassword(password: string): Observable<boolean> {
    // Здесь должна быть реальная проверка пароля через API
    return of(password === '123').pipe(delay(500)); // Имитация запроса
  }
}
