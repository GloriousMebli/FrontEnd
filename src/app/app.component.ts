import { Component, OnInit } from '@angular/core';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  constructor(private adminService: AdminService) {}

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
  }
}
