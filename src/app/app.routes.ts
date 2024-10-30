import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { ProductComponent } from './components/product/product.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminGuard } from '../guards/admin.guard';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogInfoComponent } from './components/blog-info/blog-info.component';
import { ErrorComponent } from './components/error/error.component';

export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'catalog', component: CatalogComponent },
    { path: 'catalog/:id', component: ProductComponent },
    { path: 'admins/login', component: AdminLoginComponent },
    { path: 'terms-of-use', component: TermsOfUseComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'blog/:id', component: BlogInfoComponent },
    { path: '**', component: ErrorComponent }
];
