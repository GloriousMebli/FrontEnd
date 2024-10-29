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
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogInfoComponent } from './components/blog-info/blog-info.component';
import { ErrorComponent } from './components/error/error.component';
import { PopularProductsService } from './services/popular-product.service';

@NgModule({
  imports: [
    RouterOutlet,
    BrowserModule,
    HttpClientModule,
    CommonModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [ RouterModule ],
  declarations: [
    AppComponent,
    MainComponent,
    CatalogComponent,
    ProductComponent,
    AdminLoginComponent,
    AdminPanelComponent,
    TermsOfUseComponent,
    BlogComponent,
    BlogInfoComponent,
    ErrorComponent
   ],
  providers: [ ProductsService, AdminService, PopularProductsService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule {

}

