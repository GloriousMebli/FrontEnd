import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        const token = localStorage.getItem('adminToken'); // Отримуємо токен з локального сховища
        
        // Якщо токен є, дозволяємо доступ, інакше перенаправляємо на сторінку входу
        if (token) {
            return true; // Дозволяємо доступ
        } else {
            this.router.navigate(['/admins/login']);
            return false; // Забороняємо доступ
        }
    }
}
