import { Component, OnInit, Renderer2 } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import Product from '../../product.model';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})

export class CatalogComponent implements OnInit {

  contactName;
  contactPhone;
  successForm = false;
  isAdmin: boolean = false;
  menuOpened = false;
  isContactOpen = false;
  products: Product[] = [];
  categories;
  filters: {categoryIds?: string[]} = {};
  ADD_CATEGORY = false
  page: number = 1;
  limit: number = 10;
  loading: boolean = false;
  
  constructor(private productsService: ProductsService, private router: Router,private categoryService: CategoryService, private renderer: Renderer2,private formService: FormService) {
  }
  sendContact(){
    this.formService.sendFormData(this.contactName, this.contactPhone).subscribe((response) => {
      this.successForm = true
      setTimeout(() => {
        this.closeContact()
        this.successForm = false
      }, 30000)
    });
 }

  isInputVisible: boolean = false;

  inputFields: string[] = [];

  ngOnInit(): void {
    const adminToken = localStorage.getItem('adminToken');
    this.isAdmin = !!adminToken;
    
    this.loadCategories();
    if (typeof Storage !== "undefined") {
      const savedFilters = localStorage.getItem('filters');
      const savedSortOption = localStorage.getItem('sortOption');
      if (savedFilters) {
        this.filters = JSON.parse(savedFilters);
      }
      if (savedSortOption) {
        this.sortOption = savedSortOption;
      }
    }
    this.fetchFilteredProducts();
    }
  saveFiltersToLocalStorage(): void {
    if (typeof Storage !== "undefined") {
      localStorage.setItem('filters', JSON.stringify(this.filters));
      localStorage.setItem('sortOption', this.sortOption); 
    }
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

  sortOption: string = '';

  fetchProducts(): void {
    const [sortBy, order] = this.sortOption.split('-'); // Розбиваємо опцію сортування
    this.productsService.getProducts({ sortBy, order }).subscribe((data) => {
      this.products = data;
    });
  }

  // Apply sorting based on the selected sort option
  applySort(): void {
    // Save the sort option to localStorage
    localStorage.setItem('sortOption', this.sortOption);

    // Get the sort parameters and fetch the sorted products
    const sortParams = this.getSortParams(this.sortOption);
    this.productsService.getProducts({ ...this.filters, ...sortParams }).subscribe((data) => {
      this.products = data;
    });
  }
  
  getSortParams(option: string): any {
    let sortParams = {};
    switch (option) {
      case 'price-asc':
        sortParams = { sortBy: 'price', order: 'asc' };
        break;
      case 'price-desc':
        sortParams = { sortBy: 'price', order: 'desc' };
        break;
      case 'createdAt-asc':
        sortParams = { sortBy: 'createdAt', order: 'asc' };
        break;
      case 'createdAt-desc':
        sortParams = { sortBy: 'createdAt', order: 'desc' };
        break;
      default:
        sortParams = {};
        break;
    }
    return sortParams;
  }

  trackByIndex(index: number): number {
    return index;
  }

  removeInputField(index: number): void {
    this.inputFields.splice(index, 1);
  }

  // Method to set the filter for category
  setFilter(key: string, value: string): void {
    if (key === 'categoryIds') {
      this.filters.categoryIds = this.filters.categoryIds || [];
      const categoryIds = this.filters[key];
      if (categoryIds?.includes(value)) {
        categoryIds.splice(categoryIds.indexOf(value), 1);
      } else {
        categoryIds.push(value);
      }
    } else {
      this.filters[key] = value;
    }

    // Save the updated filters to localStorage
    this.saveFiltersToLocalStorage();

    // Fetch the products based on the updated filters
    this.fetchFilteredProducts();
  }
  
  // Fetch filtered products based on the current filters and sorting option
  fetchFilteredProducts(): void {
    const [sortBy, order] = this.sortOption.split('-'); // Split sorting option into sortBy and order
    const params = {
      ...this.filters,
      sortBy: sortBy || 'createdAt', // Default to sorting by price if no sort option is provided
      order: order || 'desc',     // Default to ascending order if no order is provided
    };

    this.productsService.getProducts(params).subscribe((data: Product[]) => {
      this.products = data;
    });
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

  openContact() {
    this.isContactOpen = true;
    this.renderer.addClass(document.body, 'no-scroll');
  }

  closeContact() {
    this.isContactOpen = false;
    // Видаляємо клас, щоб дозволити скрол після закриття форми
    this.renderer.removeClass(document.body, 'no-scroll');
  }


  logout(){
    localStorage.removeItem('adminToken')
    window.location.reload()
  }

}
