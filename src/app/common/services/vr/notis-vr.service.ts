import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotisData } from '../../types/notis-data';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotisVrService {
  constructor(private http: HttpClient) {}

  getNotisData(id: string): Observable<NotisData> {
    // Форматируем ID для запроса (например, "notis1-data")
    const formattedId = id.startsWith('notis') ? id : `notis${id.replace('vr', '')}`;

    return this.http.get<NotisData>(`${environment.apiUrl}/api/${formattedId}-data`).pipe(
      catchError((error) => {
        console.error(`Ошибка при запросе нотисов для ${formattedId}:`, error);
        return of(this.getDefaultNotisData());
      })
    );
  }

  private getDefaultNotisData(): NotisData {
    return {
      _id: '',
      data: {}, // Нотисы находятся в поле `data`
      status: 'unknown',
      lastUpdated: '—',
      __v: 0,
    };
  }
}
