import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { EnergyResourceData } from '../../types/energy-resources-data';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnergyResourcesService {
  private apiUrl = `${environment.apiUrl}/api/uzliUchetaCarbon`;

  constructor(private http: HttpClient) {}

  getEnergyResourceData(): Observable<Record<string, EnergyResourceData>> {
    return this.http.get<Record<string, EnergyResourceData>>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Ошибка при запросе данных энергетических ресурсов:', error);

        // Возвращаем структуру с полями по умолчанию на случай ошибки
        return of({
          "defaultResource": {
            device: "Неизвестный ресурс",
            data: {
              "Гкал/ч": 0,
              "Температура": 0,
              "Давление": 0,
              "Куб/ч": 0,
              "Тонн/ч": 0,
              "Накопленно тонн": 0,
            },
            lastUpdated: '—',
            outdated: true,
          }
        });
      })
    );
  }
}
