import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import Product from '../../product.model';
import OpenSeadragon from 'openseadragon'
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

  product: Product

  isAdmin: boolean = false;

  EDIT_VIEW = false
  
  toggleEditView() {
    this.EDIT_VIEW = !this.EDIT_VIEW;
  }

  mainPhoto = {url: '', _id: ''}

  smallPhotos: {_id: string, url: string  }[] = []
  viewer
  viewerOptions = {
    visibilityRatio: 1,
    id: "image-viewer",
    sequenceMode: false,
    showNavigationControl: false,
    showZoomControl: false,
    maxZoomPixelRatio: 2,
    zoomPerScroll: 1.8,
    prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@2.4/build/openseadragon/images/"
  }

  constructor(private productsService: ProductsService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    const adminToken = localStorage.getItem('adminToken');
    this.isAdmin = !!adminToken; // Якщо токен існує, користувач є адміністратором

    const productId = this.route.snapshot.paramMap.get('id');
    if(productId !== 'new') {
      this.productsService.getProductById(productId || '').subscribe((data: any) => {
        this.product = data;
        this.product?.images?.map((image: any) => {
          if (image.isMain) {
            this.mainPhoto = {url: image.url, _id: image._id};
            this.viewer = OpenSeadragon({
              ...this.viewerOptions,
              tileSources:  {
                  type: 'image',
                  url: image.url
              },
          });
          }else{
            this.smallPhotos.push({_id: image._id, url: image.url})
          }
        })
      })
    }else{
      this.EDIT_VIEW = true
      this.product = {_id: 'new'}
    }
  }


  setValue(event: Event, key: string): void {
    this.product[key] = (event.target as HTMLInputElement).value
  }


  saveProduct(){
    if(this.product?._id === 'new'){
      delete this.product?._id
      this.productsService.createProduct(this.product).subscribe((data: any) => {
        this.product = data;
        this.EDIT_VIEW = false
      })
    }else{
      this.productsService.updateProduct(this.product?._id||'', this.product).subscribe((data: any) => {
        this.product = data;
        this.EDIT_VIEW = false
      })
    }
    
  }

  onPhotoClick(photoType: string, index?: number): void {
    const inputElement = document.getElementById(
      photoType === 'main' ? 'file-input-main' : `file-input-small-${index}`
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    }
  }

  onFileSelected(event: Event, isMain: boolean): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      this.productsService.uploadProductImage(this.product?._id||'', file, isMain).subscribe(res=>{
        this.smallPhotos = [];
        this.product.images = res?.images
        res.images?.map((image: any) => {
          if (image.isMain) {
            this.mainPhoto = {url: image.url, _id: image._id};
          }else{
            this.smallPhotos.push({_id: image._id, url: image.url})
          }
        })
      })

    }
  }

  deletePhoto(fileId: string): void {
    if(!confirm('Ви впевнені, що хочете видалити це зображення?')) return
    this.productsService.deleteProductImage(this.product?._id||'', fileId).subscribe((data: any) => {
      this.smallPhotos = [];
      this.mainPhoto = {url: '', _id: ''};
      data.images?.map((image: any) => {
        if (image?.isMain) {
          this.mainPhoto = {url: image.url, _id: image._id};
        }else{
          this.smallPhotos.push({_id: image._id, url: image.url})
        }
      })
    })
  }

  addToPopular(): void {
    this.product.popular = !this.product.popular
    this.saveProduct()
  }

  deleteProduct(): void {
    if(confirm('Ви впевнені, що хочете видалити цей продукт?')){
      this.productsService.deleteProduct(this.product?._id||'').subscribe((data: any) => {
        this.router.navigate(['/catalog']);
      })
    }
    
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
  currentIndex: number = 0;

  // Метод для переходу до попереднього зображення
  prevImage(): void {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.images.length - 1;
    this.viewer.open({
      type: 'image',
      url: this.product?.images?.[this.currentIndex]?.url
    })
  }

  // Метод для переходу до наступного зображення
  nextImage(): void {
    this.currentIndex = (this.currentIndex < this.images.length - 1) ? this.currentIndex + 1 : 0;
    this.viewer.open({
      type: 'image',
      url: this.product?.images?.[this.currentIndex]?.url
    })
  }

  // Метод для вибору конкретного зображення
  selectImage(index:number): void {
    this.currentIndex = index
    this.viewer.open({
      type: 'image',
      url: this.product?.images?.[this.currentIndex]?.url
    })
  }
}
