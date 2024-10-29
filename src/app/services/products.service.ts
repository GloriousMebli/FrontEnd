// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl = 'http://localhost:3313/api/products'; // Базовий URL

  constructor(private http: HttpClient) {}

  // Отримати всі продукти
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Отримати продукт за ID
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Створити новий продукт
  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, productData);
  }

  // Оновити продукт
  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}`, productData);
  }

  // Видалити продукт
  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // Фільтрувати продукти за категорією
  getProductsByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?category=${category}`);
  }

  // Завантажити зображення для продукту
  uploadProductImage(id: string, file: File, side: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('side', side);
    return this.http.post<any>(`${this.baseUrl}/${id}/image`, formData);
  }
}
