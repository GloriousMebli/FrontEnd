import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {
  productName: string = '';
  productPrice: number | null = null;
  productCategory: string = 'sofas';
  productDescription: string = '';
  productSize: string = '';
  productMaterials: string = '';
  productDelivery: string = '';

  mainPhotoUrl: string | ArrayBuffer | null = null;
  mainPhotoFile: File | null = null;

  smallPhotos: { url: string | ArrayBuffer | null, file: File | null }[] = [
    { url: null, file: null }
  ]; // Масив для збереження всіх маленьких фото

  constructor(private productsService: ProductsService) {}

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

  submitProduct(): void {
    if (!this.productName || this.productPrice === null || !this.productCategory || !this.productDescription || !this.productSize || !this.productMaterials || !this.productDelivery) {
      alert('Будь ласка, заповніть всі обов\'язкові поля.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.productName);
    formData.append('price', this.productPrice.toString());
    formData.append('category', this.productCategory);
    formData.append('description', this.productDescription);
    formData.append('size', this.productSize);
    formData.append('materials', this.productMaterials);
    formData.append('delivery', this.productDelivery);

    if (this.mainPhotoFile) {
      formData.append('mainImage', this.mainPhotoFile);
    }

    this.smallPhotos.forEach((smallPhoto) => {
      if (smallPhoto.file) {
        formData.append('smallImages', smallPhoto.file);
      }
    });

    this.productsService.createProduct(formData).subscribe(
      (createdProduct) => {
        alert('Продукт успішно додано!');
      },
      (error) => {
        alert('Помилка при додаванні продукту: ' + error.message);
      }
    );
  }

}
