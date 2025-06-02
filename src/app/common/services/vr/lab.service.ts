import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {delay, Observable, of} from 'rxjs';
import { LabData, LabLastDay } from '../../types/lab-data';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { LabPasswordDialogComponent } from '../../../components/laboratory/lab-password-dialog/lab-password-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class LabService {
  constructor(private http: HttpClient, private dialog: MatDialog) {}

  getLabData(id: string): Observable<LabData> {
    const url = `${environment.apiUrl}/api/lab/pech${id}/last`;
    console.log(url);
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

  getLastDayData(id: string): Observable<LabLastDay[]> {
    const url = `${environment.apiUrl}/api/lab/pech${id}/last-day`;
    return this.http.get<LabLastDay[]>(url);
  }

  deleteLabData(id: string, recordId: string): Observable<any> {
    const url = `${environment.apiUrl}/api/lab/delete/pech${id}/${recordId}`;
    return this.http.delete(url);
  }

  checkPassword(password: string): Observable<boolean> {
    return of(password === '123').pipe(delay(500)); // Имитация запроса
  }
}
