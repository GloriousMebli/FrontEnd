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
  id: string = ''; // ID категорії з URL

  constructor(
    private categoryService: CategoryService,
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    // Отримуємо ID категорії з URL
    this.id = this.route.snapshot.paramMap.get('categoryId')!;
    // Завантажуємо продукти цієї категорії
    this.loadProductsByCategory(this.id);
  }

  loadProductsByCategory(id: string): void {
    // Завантажуємо продукти з бекенду по категорії
    this.productsService
      .getProductsByCategory(id)
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
        // Знаходимо перший продукт в категорії
        const firstProduct = this.products.find(
          (product) => product.category._id === category._id
        );
        console.log(firstProduct);

        return {
          category: category.label,
          product: firstProduct || null, // Повертаємо null, якщо продуктів немає
        };
      });
    }
  }
}
