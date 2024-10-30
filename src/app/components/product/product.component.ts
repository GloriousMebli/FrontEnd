import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import Product from '../../product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

  product: Product | undefined 

  isAdmin: boolean = false;

  EDIT_VIEW = false
  
  toggleEditView() {
    this.EDIT_VIEW = !this.EDIT_VIEW;
  }

  mainPhotoUrl: string | ArrayBuffer | null = null;
  mainPhotoFile: File | null = null;

  smallPhotos: { url: string | ArrayBuffer | null, file: File | null }[] = [
    { url: null, file: null }
  ]; // Масив для збереження всіх маленьких фото

  onPhotoClick(photoType: string, index?: number): void {
    const inputElement = document.getElementById(
      photoType === 'main' ? 'file-input-main' : `file-input-small-${index}`
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    }
  }

  onFileSelected(event: Event, photoType: string, index?: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      this.productsService.uploadProductImage('670e6fccedcc21d7cdab7f00', file, 'main').subscribe(res=>{
        console.log(res);
      })

    }
  }
  

  constructor(private productsService: ProductsService, private route: ActivatedRoute){}

  ngOnInit(): void {
    const adminToken = localStorage.getItem('adminToken');
    this.isAdmin = !!adminToken; // Якщо токен існує, користувач є адміністратором

    const productId = this.route.snapshot.paramMap.get('id');
    this.productsService.getProductById(productId || '').subscribe((data: any) => {
      this.product = data;
    })
  }

  addToPopular(): void {
    // Отримуємо вже існуючі популярні товари з localStorage
    const popularProducts = JSON.parse(localStorage.getItem('popularProducts') || '[]');

    // Перевіряємо, чи товар вже є в популярних
    const isAlreadyPopular = popularProducts.some((p: any) => p._id === this.product?._id);

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
