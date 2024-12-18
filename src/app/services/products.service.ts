// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiUrl = environment.apiUrl;
  private baseUrl = this.apiUrl + '/products'; // Базовий URL
  headers;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('adminToken'); // Replace 'token' with your actual token key

    // Set up the headers with the Bearer token
    this.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  getProducts(filters?: {
    page?: number;
    limit?: number;
    popular?: boolean;
    withNameAndImage?: boolean;
    categoryIds?: string[];
    sortBy?: string;
    order?: string;
  }): Observable<any> {
    let httpParams = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach((key) => {
        let value = filters[key];
        if (value !== '' && value !== null && value !== undefined) {
          // Перевіряємо і конвертуємо типи параметрів
          if (key === 'page' || key === 'limit') {
            value = value.toString(); // Перетворюємо page та limit в рядки
          } else if (key === 'categoryIds' && Array.isArray(value)) {
            // Якщо це масив, конкатенуємо елементи через кому
            value = value.join(',');
          }

          // Додаємо параметри до запиту
          httpParams = httpParams.set(key, value); // Використовуємо set для заміни параметрів
        }
      });
    }
    return this.http.get<any>(this.baseUrl, { params: httpParams });
  }

  // Функція для отримання першого продукту з кожної категорії
  getFirstProductFromEachCategory(products: any[]): any[] {
    const categories = new Set();
    const firstProducts: any[] = [];

    products.forEach((product) => {
      // Перевіряємо, чи вже є продукт для цієї категорії
      if (!categories.has(product.category._id)) {
        categories.add(product.category._id);
        firstProducts.push(product); // Додаємо перший продукт цієї категорії
      }
    });

    return firstProducts;
  }

  // Отримати продукт за ID
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Створити новий продукт
  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, productData, {
      headers: this.headers,
    });
  }

  // Оновити продукт
  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}`, productData, {
      headers: this.headers,
    });
  }

  // Видалити продукт
  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, {
      headers: this.headers,
    });
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
    return this.http.post<any>(`${this.baseUrl}/${id}/image`, formData, {
      headers: this.headers,
    });
  }

  deleteProductImage(id: string, fileId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}/image/${fileId}`, {
      headers: this.headers,
    });
  }
}
