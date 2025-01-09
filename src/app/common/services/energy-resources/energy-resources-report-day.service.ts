import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnergyResourcesReportData } from '../../types/energy-resources-report-day-data';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EnergyResourcesReportDayService {
  private apiUrl = `${environment.apiUrl}/api/reportRoutes/getReportDataDay`;

  constructor(private http: HttpClient) {}

  getReportData(date: string): Observable<EnergyResourcesReportData[]> {
    return this.http.get<EnergyResourcesReportData[]>(`${this.apiUrl}?date=${date}`);
  }
}
