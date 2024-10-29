import { Component, OnInit } from '@angular/core';
import { PopularProductsService } from '../../services/popular-product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

  constructor(private popularProductsService: PopularProductsService) {}
  product = { id: 1, name: 'ДЖЕК 160', image: '../../../assets/sofa-list.png' }; // Поточний товар

  isAdmin: boolean = false;

  ngOnInit(): void {
    const adminToken = localStorage.getItem('adminToken');
    this.isAdmin = !!adminToken; // Якщо токен існує, користувач є адміністратором
  }

  addToPopular(): void {
    // Отримуємо вже існуючі популярні товари з localStorage
    const popularProducts = JSON.parse(localStorage.getItem('popularProducts') || '[]');

    // Перевіряємо, чи товар вже є в популярних
    const isAlreadyPopular = popularProducts.some((p: any) => p.id === this.product.id);

    if (!isAlreadyPopular) {
      // Додаємо товар у список популярних
      popularProducts.push(this.product);

      // Оновлюємо localStorage
      localStorage.setItem('popularProducts', JSON.stringify(popularProducts));

      console.log("Товар додано до популярних");
    } else {
      console.log("Товар вже є в популярних");
    }
  }

  deleteProduct(): void {
    // Логіка для видалення товару
    console.log("Товар видалено");
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Массив зображень
  images: string[] = [
    '../../../assets/sofa-list.png',
    '../../../assets/123.jpg',
    '../../../assets/sofa.png'
  ];

  // Поточне зображення
  currentImage: string = this.images[0];
  currentIndex: number = 0;

  // Метод для переходу до попереднього зображення
  prevImage(): void {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.images.length - 1;
    this.currentImage = this.images[this.currentIndex];
  }

  // Метод для переходу до наступного зображення
  nextImage(): void {
    this.currentIndex = (this.currentIndex < this.images.length - 1) ? this.currentIndex + 1 : 0;
    this.currentImage = this.images[this.currentIndex];
  }

  // Метод для вибору конкретного зображення
  selectImage(image: string): void {
    this.currentImage = image;
    this.currentIndex = this.images.indexOf(image);
  }
}
