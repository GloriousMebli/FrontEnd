import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseUrl = environment.apiUrl
  private apiUrl = this.baseUrl + '/categories';

  constructor(private http: HttpClient) { }

  // Headers for authentication, adjust as needed
  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('adminToken')}`);
  }

  // Create Category
  createCategory(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload, { headers: this.getHeaders() });
  }

  // Get Categories
  getCategories(category?: string): Observable<any[]> {
    const url = category ? `${this.apiUrl}?category=${category}` : this.apiUrl;
    return this.http.get<any[]>(url);
  }

  // Update Category
  updateCategory(id: string, updates: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, updates, { headers: this.getHeaders() });
  }

  // Delete Category
  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}