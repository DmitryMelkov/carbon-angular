import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { VrTime } from '../../types/vr-data';

@Injectable({
  providedIn: 'root',
})
export class VrTimeService {
  constructor(private http: HttpClient) {}

  getVrTime(id: string): Observable<VrTime> {
    const formattedId = id.startsWith('vr') ? id : `vr${id}`;

    return this.http.get<VrTime>(`${environment.apiUrl}/api/${formattedId}-time`).pipe(
      catchError((error) => {
        console.error(`Ошибка при запросе времени для VR ${formattedId}:`, error);
        return of(this.getDefaultVrTime());
      })
    );
  }

  private getDefaultVrTime(): VrTime {
    return {
      currentTime: '—',
      lastUpdated: '—'
    };
  }
}