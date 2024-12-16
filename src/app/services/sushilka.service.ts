import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SushilkaService {
  private apiUrl1 = 'http://localhost:3002/api/sushilka1-data';
  private apiUrl2 = 'http://localhost:3002/api/sushilka2-data';

  constructor(private http: HttpClient) {}

  getSushilka1Data(): Observable<any> {
    return this.http.get(this.apiUrl1);
  }

  getSushilka2Data(): Observable<any> {
    return this.http.get(this.apiUrl2);
  }
}
