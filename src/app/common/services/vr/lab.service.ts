import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LabData } from '../../types/lab-data';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LabService {
  constructor(private http: HttpClient) {}

  getLabData(id: string): Observable<LabData> {
    const url = `${environment.apiUrl}/api/lab/pech${id}/last`;
    return this.http.get<LabData>(url);
  }

  submitLabData(id: string, formData: any): Observable<any> {
    const apiUrl = `${environment.apiUrl}/api/lab/pech${id}/submit`;
    return this.http.post(apiUrl, {
      value: formData.volatileSubstances ? formData.volatileSubstances.replace(',', '.') : null,
      valuePH: formData.pH ? formData.pH.replace(',', '.') : null,
      valueSUM: formData.sum ? formData.sum.replace(',', '.') : null,
      time: formData.time
    });
  }
}
