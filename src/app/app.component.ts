import { Component, OnInit } from '@angular/core';
import { AdminService } from './services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  isMainPage: boolean = false;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    const adminToken = localStorage.getItem('adminToken');
    if(adminToken){
      this.adminService.verifyAdmin(adminToken).subscribe((data: any) => {
        if(!data?.valid){ 
          localStorage.removeItem('adminToken')
        }
      }, (error) => {
        localStorage.removeItem('adminToken')
      })
    }
    this.isMainPage = this.router.url === '/';
    this.router.events.subscribe(() => {
      this.isMainPage = this.router.url === '/';
    });
  }

  isAdmin: boolean = false;

  logout(){
    localStorage.removeItem('adminToken')
    window.location.reload()
  }
}
