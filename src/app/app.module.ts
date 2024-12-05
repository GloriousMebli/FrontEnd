import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ProductsService } from './services/products.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { routes } from './app.routes';
import { ProductComponent } from './components/product/product.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from './services/admin.service';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogInfoComponent } from './components/blog-info/blog-info.component';
import { ErrorComponent } from './components/error/error.component';
import { AutoGrowDirective } from './directives/auto-gorw.directive';
import { CategoryService } from './services/category.service';
import { FormService } from './services/form.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollDirective  } from 'ngx-infinite-scroll';
import { ProductUseComponent } from './components/use/product-use/product-use.component';
import { CatalogUseComponent } from './components/use/catalog-use/catalog-use.component';

@NgModule({
  imports: [
    RouterOutlet,
    BrowserModule,
    HttpClientModule,
    CommonModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    InfiniteScrollDirective,
  ],
  exports: [ RouterModule ],
  declarations: [
    AppComponent,
    MainComponent,
    CatalogComponent,
    ProductComponent,
    AdminLoginComponent,
    TermsOfUseComponent,
    BlogComponent,
    BlogInfoComponent,
    ErrorComponent,
    AutoGrowDirective,
    ProductUseComponent,
    CatalogUseComponent,
   ],
  providers: [ ProductsService, AdminService, CategoryService, FormService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule {

}

