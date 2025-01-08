import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnergyResourcesReportMonthData } from '../../types/energy-resources-report-month-data';


@Injectable({
  providedIn: 'root',
})
export class EnergyResourcesReportMonthService {
  constructor(private http: HttpClient) {}

  getReportDataMonth(month: string): Observable<EnergyResourcesReportMonthData[]> {
    return this.http.get<EnergyResourcesReportMonthData[]>(`http://localhost:3002/api/reportRoutes/getReportDataMonth?month=${month}`);
  }

  correctReportData(modifications: any[], password: string): Observable<any> {
    return this.http.post('http://localhost:3002/api/reportRoutes/correctReportData', { modifications, password });
  }
}
