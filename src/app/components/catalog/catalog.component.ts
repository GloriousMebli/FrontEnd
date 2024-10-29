import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../product.model';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {

  isAdmin: boolean = false;

  products: Product[] = []; // Типізуйте products як масив Product

  constructor(private productsService: ProductsService) {}

  isInputVisible: boolean = false; // змінна для відображення інпуту

  inputFields: string[] = []; // масив для зберігання значень інпутів

  ngOnInit(): void {
    this.loadProducts();

    const adminToken = localStorage.getItem('adminToken');
    this.isAdmin = !!adminToken; // Якщо токен існує, користувач є адміністратором
  }

   // Метод для навігації
   navigateToAdmin(): void {
    if (this.isAdmin) {
      // Перенаправлення на адмін-панель
      window.location.href = '/admins';
    } else {
      // Інша логіка, наприклад, прокрутка до секції
      this.scrollToSection('contact');
    }
  }

  addInputField(): void {
    this.inputFields.push(''); 
  }

  trackByIndex(index: number): number {
    return index;
  }

  removeInputField(index: number): void {
    this.inputFields.splice(index, 1);
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
      },
      (error) => {
        console.error('Error loading products', error);
      }
    );
  }
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Метод для показу/приховування інпуту
  toggleInputVisibility(): void {
    this.isInputVisible = !this.isInputVisible;
  }
}
