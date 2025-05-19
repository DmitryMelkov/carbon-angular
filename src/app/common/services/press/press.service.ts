// src/app/common/services/press/press.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PressData } from '../../types/press-data';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PressService {
  constructor(private http: HttpClient) {}

  getPressData(id: string): Observable<PressData> {
    const formattedId = id.startsWith('press') ? id : `press${id}`;

    return this.http.get<PressData>(`${environment.apiUrl}/api/${formattedId}-data`).pipe(
      catchError((error) => {
        console.error(`Ошибка при запросе данных для пресса ${formattedId}:`, error);
        return of({
          controllerData: {
            "Статус работы": false,
            "Кол-во наработанных часов": 0,
          },
          termodatData: {
            "Температура масла": 0,
            "Давление масла": 0,
          },
          lastUpdated: '—',
        });
      })
    );
  }
}