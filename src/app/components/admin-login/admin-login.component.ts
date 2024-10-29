import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private adminService: AdminService, private router: Router) {}

  login(form: NgForm) {
    if (form.valid) {
      this.adminService.loginAdmin(this.email, this.password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          localStorage.setItem('adminToken', response.token); // Зберігаємо токен у Local Storage

          // Перевірка, чи токен збігається
          const storedToken = localStorage.getItem('adminToken');
          if (storedToken === response.token) {
            this.router.navigate(['/admins']); // Перенаправлення на маршрут /admins
          }

          this.resetForm(form); // Скидаємо форму після успішного входу
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Неправильний email або пароль'; // Виводимо повідомлення про помилку
        }
      });
    } else {
      this.errorMessage = 'Будь ласка, заповніть всі поля.';
    }
  }

  // Метод для скидання форми
  resetForm(form: NgForm) {
    form.resetForm(); // Скидає всі поля форми
    this.email = '';
    this.password = '';
    this.errorMessage = ''; // Очищує повідомлення про помилку
  }
}
