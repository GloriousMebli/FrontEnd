import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import Product from '../../../product.model';

@Component({
  selector: 'app-product-use',
  templateUrl: './product-use.component.html',
  styleUrls: ['./product-use.component.scss'],
})
export class ProductUseComponent implements OnInit {
  products: Product[] = []; // Продукти категорії
  categoryId: string = ''; // ID категорії з URL
  totalProducts: number = 0; // Загальна кількість продуктів у категорії
  currentPage: number = 1; // Поточна сторінка
  limit: number = 6; // Ліміт на кількість товарів на сторінку

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    // Отримуємо ID категорії з URL
    this.categoryId = this.route.snapshot.paramMap.get('id')!;

    // Завантажуємо продукти для цієї категорії
    this.loadProducts();
  }

  // Завантажуємо продукти для вибраної категорії
  loadProducts(): void {
    this.productsService
      .getProducts({
        page: this.currentPage,
        limit: this.limit, // Встановлюємо ліміт на 6 продуктів
        categoryIds: [this.categoryId], // Фільтруємо за категорією
      })
      .subscribe((response: any) => {
        // Фільтруємо продукти за категорією (якщо потрібно)
        const filteredProducts = response.products.filter(
          (product: Product) => product.category._id === this.categoryId
        );

        if (this.currentPage === 1) {
          this.products = filteredProducts; // Якщо це перша сторінка, просто оновлюємо продукти
        } else {
          this.products = [...this.products, ...filteredProducts]; // Додаємо нові продукти до існуючих
        }

        this.totalProducts = response.totalProducts; // Загальна кількість продуктів у категорії
      });
  }

  // Трекер для оптимізації рендерингу
  trackByIndex(index: number): number {
    return index;
  }

  // Завантажуємо наступні продукти (пагінація)
  loadMore(): void {
    // Збільшуємо номер сторінки на 1
    this.currentPage++;

    // Завантажуємо продукти для нової сторінки
    this.loadProducts();
  }

  // Перевірка, чи є ще продукти для завантаження
  hasMoreProducts(): boolean {
    return this.products.length < this.totalProducts;
  }
}
