import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VrData } from '../../types/vr-data';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VrService {
  constructor(private http: HttpClient) {}

  getVrData(id: string): Observable<VrData> {
    const formattedId = id.startsWith('vr') ? id : `vr${id}`;

    return this.http.get<VrData>(`${environment.apiUrl}/api/${formattedId}-data`).pipe(
      catchError((error) => {
        console.error(`Ошибка при запросе данных для VR ${formattedId}:`, error);
        return of(this.getDefaultVrData(formattedId));
      })
    );
  }

  private getDefaultVrData(id: string): VrData {
    const suffix = id.replace('vr', '');
    return {
      temperatures: {},
      levels: {},
      pressures: {},
      vacuums: {},
      im: {},
      gorelka: {},
      lastUpdated: '—',
    };
  }
}
