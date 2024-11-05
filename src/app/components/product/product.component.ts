import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import Product from '../../product.model';
import OpenSeadragon from 'openseadragon'
import { CategoryService } from '../../services/category.service';
import { AdminService } from '../../services/admin.service';
import { FormService } from '../../services/form.service';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

  contactName
  contactPhone
  successForm = false

  product: Product

  categories

  isAdmin: boolean = false;

  EDIT_VIEW = false

  isContactOpen = false;
  
  popularProducts

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

  constructor(private productsService: ProductsService,private renderer: Renderer2, private adminService: AdminService, private categoryService: CategoryService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef, private formService: FormService ){}

  sendContact(){
    this.formService.sendFormData(this.contactName, this.contactPhone).subscribe((response) => {
      this.successForm = true
      setTimeout(() => {
        this.closeContact()
        this.successForm = false
      }, 30000)
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

  ngOnInit(): void {
    const adminToken = localStorage.getItem('adminToken');
    if(adminToken){
      this.adminService.verifyAdmin(adminToken).subscribe((data: any) => {
        if(data?.valid){ 
          this.isAdmin = true
          this.categoryService.getCategories().subscribe((data: any) => {
            this.categories = data;
          })
        }else{
          localStorage.removeItem('adminToken')
        }
      }, (error) => {
        localStorage.removeItem('adminToken')
      })
    }

    const productId = this.route.snapshot.paramMap.get('id');
    if(productId !== 'new') {
      this.productsService.getProductById(productId || '').subscribe((data: any) => {
        this.product = data;
        this.product?.images.sort( (data1, data2) => data1.isMain ? -1 : 1)?.map((image: any) => {
          if (image.isMain) {
            this.mainPhoto = {url: image.url, _id: image._id};
            this.initViewer(image.url)
          }else{
            this.smallPhotos.push({_id: image._id, url: image.url})
          }
        })
      }, (err)=>{
        this.router.navigate(['/catalog'])
      })
    }else{
      this.EDIT_VIEW = true
      this.product = {_id: 'new'}
    }

  }


  setValue(event: Event, key: string): void {
    this.product[key] = (event.target as HTMLInputElement).value

    this.saveProduct()
  }

  setCategory(event){
    this.product.category = this.categories.find((category) => category._id === event.target.value)
    this.saveProduct()
  }

  initViewer(url){
    this.viewer = OpenSeadragon({
      ...this.viewerOptions,
      tileSources:  {
          type: 'image',
          url: url
      },
    })
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
      })
    }
    
  }

  toggleEditView() {
    this.EDIT_VIEW = !this.EDIT_VIEW;
    if(this.EDIT_VIEW) return
    setTimeout(() => {
      if(!this?.mainPhoto?.url) return
      this.initViewer(this?.mainPhoto?.url )
    }, 100);
    
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

  logout(){
    localStorage.removeItem('adminToken')
    window.location.reload()
  }
}
