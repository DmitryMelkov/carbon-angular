import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ReactorData } from '../../types/reactors-data';

@Injectable({
  providedIn: 'root',
})
export class ReactorService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  // Метод для получения данных реактора K296
  getReactorK296Data(): Observable<ReactorData> {
    return this.http.get<ReactorData>(`${this.apiUrl}/reactorK296-data`).pipe(
      catchError((error) => {
        console.error('Ошибка при запросе данных для реактора K296:', error);
        return of(this.getDefaultReactorData());
      })
    );
  }

  // Метод для возврата данных по умолчанию в случае ошибки
  private getDefaultReactorData(): ReactorData {
    return {
      temperatures: {
        'Температура реактора 45/1': 0,
        'Температура реактора 45/2': 0,
        'Температура реактора 45/3': 0,
        'Температура реактора 45/4': 0,
      },
      levels: {
        'Уровень реактора 45/1': 0,
        'Уровень реактора 45/2': 0,
        'Уровень реактора 45/3': 0,
        'Уровень реактора 45/4': 0,
      },
      lastUpdated: '—',
    };
  }
}
