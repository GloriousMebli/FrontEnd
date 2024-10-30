// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl = 'http://localhost:3313/api/products'; // Базовий URL
  headers 
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('adminToken'); // Replace 'token' with your actual token key

    // Set up the headers with the Bearer token
    this.headers = {
      Authorization: `Bearer ${token}`
    };
  }

  // Отримати всі продукти
  getProducts(filters?: {popular?: boolean}): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { params: filters });
  }

  // Отримати продукт за ID
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Створити новий продукт
  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, productData, { headers: this.headers });
  }

  // Оновити продукт
  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}`, productData, { headers: this.headers });
  }

  // Видалити продукт
  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers: this.headers });
  }

  // Фільтрувати продукти за категорією
  getProductsByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?category=${category}`);
  }

  // Завантажити зображення для продукту
  uploadProductImage(id: string, file: File, isMain: boolean): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isMain', isMain.toString());
    return this.http.post<any>(`${this.baseUrl}/${id}/image`, formData, { headers: this.headers });
  }
}
