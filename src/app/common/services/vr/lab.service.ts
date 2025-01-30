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
}
