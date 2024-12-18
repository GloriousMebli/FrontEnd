import { Component, OnInit, Renderer2 } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import Product from '../../product.model';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
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
  filters: { categoryIds?: string[] } = {};
  ADD_CATEGORY = false;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private categoryService: CategoryService,
    private renderer: Renderer2,
    private formService: FormService
  ) {}
  sendContact() {
    this.formService
      .sendFormData(this.contactName, this.contactPhone)
      .subscribe((response) => {
        this.successForm = true;
        setTimeout(() => {
          this.closeContact();
          this.successForm = false;
        }, 30000);
      });
  }

  isInputVisible: boolean = false;

  inputFields: string[] = [];

  ngOnInit(): void {
    const adminToken = localStorage.getItem('adminToken');
    this.isAdmin = !!adminToken;

    this.loadCategories();
    if (typeof Storage !== 'undefined') {
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

  hasMoreProducts: boolean = true; // Чи є ще продукти для завантаження
  currentPage: number = 1; // Поточна сторінка

  // Метод для завантаження додаткових продуктів
  loadMore(): void {
    // Отримуємо параметри сортування з локального сховища
    const sortOption = localStorage.getItem('sortOption');
    const sortParams = this.getSortParams(sortOption);

    const params = {
      ...this.filters,
      ...sortParams,
      page: this.currentPage + 1, // Наступна сторінка
      limit: 6, // Ліміт на 6 продуктів
    };

    this.productsService.getProducts(params).subscribe(
      (response: any) => {
        const products = Array.isArray(response.products)
          ? response.products
          : [];

        // Додаємо нові продукти до існуючих
        products.forEach((newProduct) => {
          const isProductAlreadyAdded = this.products.some(
            (product) => product._id === newProduct._id
          );
          if (!isProductAlreadyAdded) {
            this.products.push(newProduct);
          }
        });

        // Оновлюємо стан кнопки "Load more"
        if (products.length < 6) {
          this.hasMoreProducts = false; // Приховуємо кнопку, якщо менше 6 продуктів
        } else {
          this.currentPage++; // Переходимо до наступної сторінки
        }
      },
      (error) => {
        console.error('Помилка завантаження продуктів:', error);
      }
    );
  }

  saveFiltersToLocalStorage(): void {
    if (typeof Storage !== 'undefined') {
      localStorage.setItem('filters', JSON.stringify(this.filters));
      localStorage.setItem('sortOption', this.sortOption);
    }
  }

  formatName(name: string): string {
    if (!name) return 'novyy-tovar'; // Якщо назва порожня, повертаємо стандартну

    const cyrillicToLatinMap = {
      а: 'a',
      б: 'b',
      в: 'v',
      г: 'g',
      д: 'd',
      е: 'e',
      є: 'ye',
      ж: 'zh',
      з: 'z',
      и: 'y',
      і: 'i',
      ї: 'yi',
      й: 'y',
      к: 'k',
      л: 'l',
      м: 'm',
      н: 'n',
      о: 'o',
      п: 'p',
      р: 'r',
      с: 's',
      т: 't',
      у: 'u',
      ф: 'f',
      х: 'kh',
      ц: 'ts',
      ч: 'ch',
      ш: 'sh',
      щ: 'shch',
      ю: 'yu',
      я: 'ya',
      А: 'A',
      Б: 'B',
      В: 'V',
      Г: 'G',
      Д: 'D',
      Е: 'E',
      Є: 'Ye',
      Ж: 'Zh',
      З: 'Z',
      И: 'Y',
      І: 'I',
      Ї: 'Yi',
      Й: 'Y',
      К: 'K',
      Л: 'L',
      М: 'M',
      Н: 'N',
      О: 'O',
      П: 'P',
      Р: 'R',
      С: 'S',
      Т: 'T',
      У: 'U',
      Ф: 'F',
      Х: 'Kh',
      Ц: 'Ts',
      Ч: 'Ch',
      Ш: 'Sh',
      Щ: 'Shch',
      Ю: 'Yu',
      Я: 'Ya',
      "'": '',
      '’': '',
      ʼ: '',
    };

    const transliterate = (text: string): string =>
      text
        .split('')
        .map((char) => cyrillicToLatinMap[char] || char) // Транслітерація
        .join('');

    return transliterate(name)
      .toLowerCase() // Перетворюємо на нижній регістр
      .trim() // Видаляємо зайві пробіли
      .replace(/[/\\]/g, '-') // Заміна "/" і "\" на дефіс
      .replace(/\s+/g, '-') // Заміна пробілів на дефіс
      .replace(/[^a-z0-9-]/g, ''); // Видалення інших небажаних символів
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

  applySort(): void {
    // Зберігаємо параметри сортування в локальному стані
    localStorage.setItem('sortOption', this.sortOption);

    // Отримуємо параметри сортування
    const sortParams = this.getSortParams(this.sortOption);

    // Скидаємо поточну сторінку до 1, щоб завантажити відсортовані продукти
    this.currentPage = 1;
    this.hasMoreProducts = true;

    // Запитуємо продукти з урахуванням сортування
    this.productsService
      .getProducts({
        ...this.filters,
        ...sortParams,
        page: this.currentPage,
        limit: 6,
      })
      .subscribe(
        (response: any) => {
          const newProducts = Array.isArray(response.products)
            ? response.products
            : [];

          // Оновлюємо список продуктів
          this.products = newProducts;

          // Якщо менше 6 продуктів, приховуємо кнопку "Load more"
          if (newProducts.length < 6) {
            this.hasMoreProducts = false;
          }
        },
        (error) => {
          console.error('Помилка отримання продуктів:', error);
          this.products = [];
        }
      );
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

    // Скидаємо поточну сторінку до 1 та ліміт на 6
    this.currentPage = 1;
    this.hasMoreProducts = true;

    // Зберігаємо оновлені фільтри в localStorage
    this.saveFiltersToLocalStorage();

    // Завантажуємо продукти на основі оновлених фільтрів
    this.fetchFilteredProducts();
  }

  // Fetch filtered products based on the current filters and sorting option
  fetchFilteredProducts(): void {
    const [sortBy, order] = this.sortOption.split('-'); // Розділяємо параметри сортування
    const params = {
      ...this.filters,
      page: this.currentPage, // Поточна сторінка
      limit: 6, // Ліміт на 6 продуктів
      sortBy: sortBy || 'createdAt', // Сортування за createdAt за замовчуванням
      order: order || 'desc',
    };

    this.productsService.getProducts(params).subscribe(
      (response: any) => {
        const newProducts = Array.isArray(response.products)
          ? response.products
          : [];

        // Якщо це перша сторінка, оновлюємо список продуктів
        if (this.currentPage === 1) {
          this.products = newProducts;
        } else {
          // Додаємо нові продукти лише якщо їх ще немає в масиві
          newProducts.forEach((product) => {
            if (!this.products.some((p) => p._id === product._id)) {
              this.products.push(product);
            }
          });
        }

        // Оновлюємо стан кнопки "Load more"
        if (newProducts.length < 6) {
          this.hasMoreProducts = false; // Приховуємо кнопку, якщо менше 6 продуктів
        }

        // Виведення загальної кількості продуктів
        console.log('Загальна кількість продуктів:', response.total);
      },
      (error) => {
        console.error('Помилка отримання продуктів:', error);
        this.products = [];
      }
    );
  }

  addProduct() {
    this.productsService.createProduct({}).subscribe((data: any) => {
      if (data?.data?._id) {
        this.router.navigate([`/catalog/${data?.data?._id}/new`]);
      }
    });
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

  loadCategories() {
    this.categoryService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  createCategory(event) {
    this.categoryService
      .createCategory({ label: event.target.value })
      .subscribe((data: any) => {
        this.categories.push(data?.data);
        this.ADD_CATEGORY = false;
      });
  }

  editCategory(id: string, event) {
    this.categoryService
      .updateCategory(id, { label: event?.target?.value })
      .subscribe((data: any) => {
        this.categories = this.categories.map((category: any) => {
          if (category._id === id) {
            category.label = data?.label;
          }
          return category;
        });
      });
  }

  deleteCategory(id: string) {
    if (!confirm('Ви впевнені, що хочете видалити цю категорію?')) return;
    this.categoryService.deleteCategory(id).subscribe((data: any) => {
      this.categories = this.categories.filter(
        (category: any) => category._id !== id
      );
    });
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

  logout() {
    localStorage.removeItem('adminToken');
    window.location.reload();
  }
}
