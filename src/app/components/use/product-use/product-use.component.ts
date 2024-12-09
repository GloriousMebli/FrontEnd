import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { products } from '../catalog-use/catalog-data';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-product-use',
  templateUrl: './product-use.component.html',
  styleUrl: './product-use.component.scss',
})
export class ProductUseComponent implements OnInit {
  products: any[] = []; // Продукти категорії
  categoryId: string = ''; // ID категорії з URL

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    // Отримуємо ID категорії з URL
    this.categoryId = this.route.snapshot.paramMap.get('categoryId')!;
    // Завантажуємо продукти цієї категорії
    this.loadProductsByCategory(this.categoryId);
  }

  loadProductsByCategory(categoryId: string): void {
    // Завантажуємо продукти з бекенду по категорії
    this.productService
      .getProductsByCategory(categoryId)
      .subscribe((products) => {
        this.products = products;
      });
  }
}
