import { Component } from '@angular/core';
import { products } from './catalog-data';
import { CategoryService } from '../../../services/category.service';
import { ProductsService } from '../../../services/products.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-catalog-use',
  templateUrl: './catalog-use.component.html',
  styleUrl: './catalog-use.component.scss',
})
export class CatalogUseComponent {
  products: any[] = [];
  categories: any[] = [];
  firstProductsByCategory: { category: string; product: any }[] = [];
  category: string = ''; // ID категорії з URL

  constructor(
    private categoryService: CategoryService,
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    // Отримуємо ID категорії з URL
    this.category = this.route.snapshot.paramMap.get('id')!;
    // Завантажуємо продукти цієї категорії
    this.loadProductsByCategory(this.category);
  }

  loadProductsByCategory(category: string): void {
    // Завантажуємо продукти з бекенду по категорії
    this.productsService
      .getProductsByCategory(category)
      .subscribe((products) => {
        this.products = products;
      });
  }

  loadProducts() {
    this.productsService.getProducts().subscribe((data) => {
      this.products = data;
      this.extractFirstProductsByCategory();
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
      this.extractFirstProductsByCategory();
    });
  }

  extractFirstProductsByCategory() {
    if (this.products.length && this.categories.length) {
      // Очистимо список перед заповненням
      this.firstProductsByCategory = this.categories.map((category) => {
        // Фільтруємо продукти для поточної категорії
        const productsInCategory = this.products.filter(
          (product) => product.category._id === category._id
        );

        // Сортуємо продукти в категорії за датою створення (за зростанням)
        const sortedProducts = productsInCategory.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Беремо перший продукт після сортування
        const firstProduct = sortedProducts[0] || null;

        console.log(firstProduct);

        return {
          category: category.label,
          product: firstProduct, // Повертаємо null, якщо продуктів немає
        };
      });
    }
  }
}
