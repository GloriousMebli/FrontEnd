import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  apiUrl = environment.apiUrl
  private baseUrl = this.apiUrl + '/admins';  // URL бекенду

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('adminToken')}`);
  }

  loginAdmin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  verifyAdmin(token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-token`, {}, { headers: this.getHeaders() });
  }
}
