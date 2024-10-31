import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import Product from '../../product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {

  isAdmin: boolean = false;

  products: Product[] = []; // Типізуйте products як масив Product

  constructor(private productsService: ProductsService, private router: Router) {}

  isInputVisible: boolean = false; // змінна для відображення інпуту

  inputFields: string[] = []; // масив для зберігання значень інпутів

  ngOnInit(): void {
    const adminToken = localStorage.getItem('adminToken');
    this.isAdmin = !!adminToken; // Якщо токен існує, користувач є адміністратором
    
    this.loadProducts();
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
    this.productsService.getProducts({withNameAndImage: this.isAdmin ? false :true}).subscribe(
      (data: Product[]) => {
        this.products = data;
      },
      (error) => {
        console.error('Error loading products', error);
      }
    );
  }

  addProduct(){
    this.productsService.createProduct({}).subscribe((data: any) => {
      if(data?.data?._id){
        this.router.navigate([`/catalog/${data?.data?._id}`]);
      }
    })
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
