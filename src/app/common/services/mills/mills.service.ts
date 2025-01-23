import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MillData } from '../../types/mills-data';

@Injectable({
  providedIn: 'root',
})
export class MillsService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getMill1Data(): Observable<MillData> {
    return this.http.get<MillData>(`${this.apiUrl}/mill1-data`).pipe(
      catchError((error) => {
        console.error('Ошибка при запросе данных для Mill 1:', error);
        return of({
          data: {
            'Фронтальное Мельница 1': 0,
            'Поперечное Мельница 1': 0,
            'Осевое Мельница 1': 0,
          },
          lastUpdated: '—',
          __v: 0,
          _id: 'defaultMill1',
        });
      })
    );
  }

  getMill2Data(): Observable<MillData> {
    return this.http.get<MillData>(`${this.apiUrl}/mill2-data`).pipe(
      catchError((error) => {
        console.error('Ошибка при запросе данных для Mill 2:', error);
        return of({
          data: {
            'Фронтальное Мельница 2': 0,
            'Поперечное Мельница 2': 0,
            'Осевое Мельница 2': 0,
          },
          lastUpdated: '—',
          __v: 0,
          _id: 'defaultMill2',
        });
      })
    );
  }

  getMill10bData(): Observable<MillData> {
    return this.http.get<MillData>(`${this.apiUrl}/mill10b-data`).pipe(
      catchError((error) => {
        console.error('Ошибка при запросе данных для Mill 10b:', error);
        return of({
          data: {
            'Осевое ШБМ3': 0,
            'Вертикальное ШБМ3': 0,
            'Поперечное ШБМ3': 0,
            'Фронтальное YGM9517': 0,
            'Осевое YGM9517': 0,
            'Поперечное YGM9517': 0,
            'Фронтальное YCVOK130': 0,
            'Поперечное YCVOK130': 0,
            'Осевое YCVOK130': 0,
          },
          lastUpdated: '—',
          __v: 0,
          _id: 'defaultMill10b',
        });
      })
    );
  }
}
