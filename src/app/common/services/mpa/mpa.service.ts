import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { MpaData } from '../../types/mpa-data';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class MpaService {
  constructor(private http: HttpClient) {}

  getMpaData(id: string): Observable<MpaData> {
    // Проверяем, начинается ли id с "mpa", если нет, добавляем
    const formattedId = id.startsWith('mpa') ? id : `mpa${id}`;

    return this.http.get<MpaData>(`${environment.apiUrl}/api/${formattedId}-data`).pipe(
      catchError((error) => {
        console.error(`Ошибка при запросе данных для мпа ${formattedId}:`, error);

        // Формируем номер МПА на основе ID
        const suffix = formattedId.replace('mpa', ''); // Получаем номер МПа
        return of({
          temperatures: {
            [`Температура верх регенератора левый МПА${suffix}`]: NaN,
            [`Температура верх ближний левый МПА${suffix}`]: NaN,
            [`Температура верх дальний левый МПА${suffix}`]: NaN,
            [`Температура середина ближняя левый МПА${suffix}`]: NaN,
            [`Температура середина дальняя левый МПА${suffix}`]: NaN,
            [`Температура низ ближний левый МПА${suffix}`]: NaN,
            [`Температура низ дальний левый МПА${suffix}`]: NaN,
            [`Температура верх регенератора правый МПА${suffix}`]: NaN,
            [`Температура верх ближний правый МПА${suffix}`]: NaN,
            [`Температура верх дальний правый МПА${suffix}`]: NaN,
            [`Температура середина ближняя правый МПА${suffix}`]: NaN,
            [`Температура середина дальняя правый МПА${suffix}`]: NaN,
            [`Температура низ ближний правый МПА${suffix}`]: NaN,
            [`Температура низ дальний правый МПА${suffix}`]: NaN,
            [`Температура камера сгорания МПА${suffix}`]: NaN,
            [`Температура дымовой боров МПА${suffix}`]: NaN,
          },
          pressures: {
            [`Разрежение дымовой боров МПА${suffix}`]: '—',
            [`Давление воздух левый МПА${suffix}`]: '—',
            [`Давление воздух правый МПА${suffix}`]: '—',
            [`Давление низ ближний левый МПА${suffix}`]: '—',
            [`Давление низ ближний правый МПА${suffix}`]: '—',
            [`Давление середина ближняя левый МПА${suffix}`]: '—',
            [`Давление середина ближняя правый МПА${suffix}`]: '—',
            [`Давление середина дальняя левый МПА${suffix}`]: '—',
            [`Давление середина дальняя правый МПА${suffix}`]: '—',
            [`Давление верх дальний левый МПА${suffix}`]: '—',
            [`Давление верх дальний правый МПА${suffix}`]: '—',
          },
          lastUpdated: '—',
        } as MpaData); // Приводим объект к типу MpaData
      })
    );
  }
}
