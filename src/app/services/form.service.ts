import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  baseUrl = environment.apiUrl
  private apiUrl = this.baseUrl + '/submit-form';

  constructor(private http: HttpClient) {}

  sendFormData(name: string, phone: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { name, phone };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
