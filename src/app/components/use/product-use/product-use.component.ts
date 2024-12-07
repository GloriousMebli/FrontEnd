import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { products } from '../catalog-use/catalog-data';

@Component({
  selector: 'app-product-use',
  templateUrl: './product-use.component.html',
  styleUrl: './product-use.component.scss'
})
export class ProductUseComponent implements OnInit {
  product: any;  // Товар, який буде відображений
  productId!: number;  // ID продукту з URL

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Отримуємо ID товару з URL
    this.productId = +this.route.snapshot.paramMap.get('id')!;

    // Знаходимо продукт за ID
    this.product = products.find(p => p.id === this.productId);
  }
}
