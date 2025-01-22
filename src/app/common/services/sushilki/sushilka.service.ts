import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { SushilkiData } from '../../types/sushilki-data';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class SushilkiService {
  constructor(private http: HttpClient) {}

  getSushilkaData(id: string): Observable<SushilkiData> {
    const formattedId = id.startsWith('sushilka') ? id : `sushilka${id}`;


    return this.http.get<SushilkiData>(`${environment.apiUrl}/api/${formattedId}-data`).pipe(
      catchError((error) => {
        console.error(`Ошибка при запросе данных для сушилки ${formattedId}:`, error);

        // Формируем номер сушилки на основе ID
        const suffix = formattedId.replace('sushilka', ''); // Получаем номер сушилки
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
            [`Мощность горелки №${suffix}`]: NaN,
            [`Сигнал от регулятора №${suffix}`]: NaN,
            [`Задание температуры №${suffix}`]: NaN,
          },
          im: {
            "Индикация паротушения": false,
            "Индикация сбрасыватель": false,
          },
          lastUpdated: '—',
        } as SushilkiData); // Приводим объект к типу SushilkiData
      })
    );
  }
}
