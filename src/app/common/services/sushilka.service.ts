import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { SushilkiData } from '../types/sushilki-data';

@Injectable({
  providedIn: 'root',
})
export class SushilkiService {
  constructor(private http: HttpClient) {}

  getSushilkaData(id: string): Observable<SushilkiData> {
    return this.http.get<SushilkiData>(`http://localhost:3002/api/${id}-data`).pipe(
      catchError((error) => {
        console.error(`Ошибка при запросе данных для сушилки ${id}:`, error);

        // Возвращаем объект с прочерками
        return of({
          temperatures: {
            "Температура в топке": NaN,
            "Температура в камере смешения": NaN,
            "Температура уходящих газов": NaN,
          },
          vacuums: {
            "Разрежение в топке": '—',
            "Разрежение в камере выгрузки": '—',
            "Разрежение воздуха на разбавление": '—',
          },
          gorelka: {
            "Мощность горелки №1": NaN,
            "Сигнал от регулятора №1": NaN,
            "Задание температуры №1": NaN,
          },
          im: {
            "Индикация паротушения": false,
            "Индикация сбрасыватель": false,
          },
          lastUpdated: '—',
        });
      })
    );
  }
}
