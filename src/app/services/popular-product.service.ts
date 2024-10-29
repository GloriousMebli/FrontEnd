import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopularProductsService {

  private popularProducts: any[] = [];

  constructor() { }

  // Додати товар до популярних
  addProductToPopular(product: any) {
    this.popularProducts.push(product);
  }

  // Отримати всі популярні товари
  getPopularProducts() {
    return this.popularProducts;
  }

  // Видалити товар з популярних
  removeProductFromPopular(product: any) {
    this.popularProducts = this.popularProducts.filter(p => p !== product);
  }
}
