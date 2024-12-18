import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-catalog-use',
  templateUrl: './catalog-use.component.html',
  styleUrls: ['./catalog-use.component.scss'],
})
export class CatalogUseComponent implements OnInit {
  products: any[] = []; // Список всіх продуктів
  categories: any[] = []; // Список категорій
  firstProductsByCategory: { category: string; product: any }[] = [];
  category: string = ''; // ID категорії з URL
  allLoaded: boolean = false; // Позначка, чи всі продукти завантажені
  pagesToLoad: number = 6; // Кількість категорій, які потрібно завантажити при кожному натисканні кнопки
  currentCategoryIndex: number = 0; // Індекс категорії для завантаження

  constructor(
    private categoryService: CategoryService,
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories(); // Завантажуємо категорії
    this.category = this.route.snapshot.paramMap.get('id')!;
  }

  // Завантажуємо продукти для поточної сторінки
  loadProducts() {
    if (this.allLoaded) return; // Якщо всі продукти вже завантажені, припиняємо завантаження

    // Завантажуємо кілька категорій (3 категорії)
    let categoriesToLoad = this.categories.slice(
      this.currentCategoryIndex,
      this.currentCategoryIndex + this.pagesToLoad
    );

    categoriesToLoad.forEach((category) => {
      this.productsService
        .getProducts({ categoryIds: [category._id] })
        .subscribe((data) => {
          const productsInCategory = data.products;
          if (productsInCategory.length > 0) {
            this.products = [...this.products, ...productsInCategory]; // Додаємо продукти до вже існуючих
            this.extractFirstProductByCategory(); // Оновлюємо перші продукти для кожної категорії
          }
        });
    });

    this.currentCategoryIndex += this.pagesToLoad; // Оновлюємо індекс для наступних категорій

    if (this.currentCategoryIndex >= this.categories.length) {
      this.allLoaded = true; // Якщо всі категорії завантажено, припиняємо завантаження
    }
  }

  // Завантажуємо категорії
  loadCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
      this.loadProducts(); // Завантажуємо продукти для перших категорій
    });
  }

  // Обробка перших продуктів для кожної категорії
  extractFirstProductByCategory() {
    if (this.products.length && this.categories.length) {
      // Оновлюємо перші продукти для кожної категорії
      this.firstProductsByCategory = this.categories
        .slice(0, this.currentCategoryIndex) // Беремо стільки категорій, скільки вже завантажено
        .map((category) => {
          const productsInCategory = this.products.filter(
            (product) => product.category._id === category._id
          );

          const sortedProducts = productsInCategory.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          const firstProduct = sortedProducts[0] || null;

          return {
            category: category.label,
            product: firstProduct,
          };
        });
    }
  }

  // Завантажуємо більше категорій при натисканні кнопки
  loadMore() {
    this.loadProducts(); // Завантажуємо наступні категорії
  }

  // Перевірка, чи потрібно показувати кнопку "Load More"
  shouldShowLoadMore(): boolean {
    return (
      !this.allLoaded && this.currentCategoryIndex < this.categories.length
    );
  }

  // Метод trackBy для оптимізації рендерингу списків
  trackByFn(index: number, item: any): string {
    return item.product?._id || index.toString(); // Використовуємо унікальний ідентифікатор або індекс
  }
}
