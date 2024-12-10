import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import Product from '../../../product.model';
import { CategoryService } from '../../../services/category.service';
import Category from '../../../product.model';

@Component({
  selector: 'app-product-use',
  templateUrl: './product-use.component.html',
  styleUrl: './product-use.component.scss',
})
export class ProductUseComponent implements OnInit {
  products: Product[] = []; // Продукти категорії
  id: string = ''; // ID категорії з URL

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private categoriesService: CategoryService
  ) {}

  ngOnInit(): void {
    // Отримуємо ID категорії з URL
    this.id = this.route.snapshot.paramMap.get('id')!;
    // Завантажуємо всі продукти, а потім фільтруємо їх за категорією
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe((products: Product[]) => {
      // Фільтруємо продукти за категорією
      this.products = products.filter(
        (product) => product.category._id === this.id
      );
    });
  }
  trackByIndex(index: number): number {
    return index;
  }
}
