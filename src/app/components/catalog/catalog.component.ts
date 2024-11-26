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

  contactName
  contactPhone
  successForm = false

  isAdmin: boolean = false;

  menuOpened = false;

  isContactOpen = false;

  products: Product[] = []; // Типізуйте products як масив Product
  categories

  filters: {categoryIds?: string[]} = {}

  ADD_CATEGORY = false
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

  isInputVisible: boolean = false; // змінна для відображення інпуту

  inputFields: string[] = []; // масив для зберігання значень інпутів

  ngOnInit(): void {
    const adminToken = localStorage.getItem('adminToken');
    this.isAdmin = !!adminToken; // Якщо токен існує, користувач є адміністратором
    
    this.loadProducts();
    this.loadCategories();

    this.fetchProducts();
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

  displayedProducts: any[] = []; // Список для відображення
  itemsPerPage: number = 3; // Кількість товарів на сторінку
  currentPage: number = 0; // Поточна сторінка

  fetchProducts(): void {
    const [sortBy, order] = this.sortOption.split('-'); // Розбиваємо опцію сортування
    this.productsService.getProducts({ sortBy, order }).subscribe((data) => {
      this.products = data; // Оновлюємо список продуктів
    });
    this.productsService.getProducts({}).subscribe((data) => {
      this.products = data; // Отримуємо всі товари
      this.loadMoreProducts(); // Завантажуємо першу порцію товарів
    });
  }

  ngAfterViewInit(): void {
    // Відновлюємо прокручування після завантаження
    const scrollPosition = localStorage.getItem('scrollPosition');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
    }
  }

  loadMoreProducts(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const newProducts = this.products.slice(startIndex, endIndex);

    if (newProducts.length > 0) {
      this.displayedProducts = [...this.displayedProducts, ...newProducts];
      this.currentPage++;
    }
  }

  applySort(): void {
    const sortParams = this.getSortParams(this.sortOption);
    this.productsService.getProducts(sortParams).subscribe((data) => {
      this.products = data;
      this.loadMoreProducts(); // Завантажуємо першу порцію товарів після сортування
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
