import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import Product from '../../product.model';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {

  isAdmin: boolean = false;

  products: Product[] = []; // Типізуйте products як масив Product
  categories

  filters: {categoryIds?: string[]} = {}

  ADD_CATEGORY = false

  constructor(private productsService: ProductsService, private router: Router,private categoryService: CategoryService) {}

  isInputVisible: boolean = false; // змінна для відображення інпуту

  inputFields: string[] = []; // масив для зберігання значень інпутів

  ngOnInit(): void {
    const adminToken = localStorage.getItem('adminToken');
    this.isAdmin = !!adminToken; // Якщо токен існує, користувач є адміністратором
    
    this.loadProducts();
    this.loadCategories()
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


  trackByIndex(index: number): number {
    return index;
  }

  removeInputField(index: number): void {
    this.inputFields.splice(index, 1);
  }

  loadProducts(): void {
    this.productsService.getProducts({withNameAndImage: this.isAdmin ? false :true, ...this.filters}).subscribe(
      (data: Product[]) => {
        this.products = data;
      },
      (error) => {
        console.error('Error loading products', error);
      }
    );
  }

  setFilter(key: string, value: string): void {
    if(key === 'categoryIds'){
      this.filters.categoryIds = this.filters.categoryIds || []
      this.filters[key]?.includes(value) ? this.filters[key].splice(this.filters[key].indexOf(value), 1) : this.filters[key].push(value)
    }else{
      this.filters[key] = value
    }
    this.loadProducts();
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


  loadCategories(){
    this.categoryService.getCategories().subscribe((data: any) => {
      this.categories = data;
    })
  }


  createCategory(event){
    this.categoryService.createCategory({label: event.target.value}).subscribe((data: any) => {
      this.categories.push(data?.data)
      this.ADD_CATEGORY = false
    })
  }

  editCategory(id: string, event){
    this.categoryService.updateCategory(id, {label: event?.target?.value}).subscribe((data: any) => {
      this.categories = this.categories.map((category: any) => {
        if(category._id === id){
          category.label = data?.label
        }
        return category
      })
    })
  }

  deleteCategory(id: string){
    if(!confirm('Ви впевнені, що хочете видалити цю категорію?')) return
    this.categoryService.deleteCategory(id).subscribe((data: any) => {
      this.categories = this.categories.filter((category: any) => category._id !== id)
    })
  }
}
