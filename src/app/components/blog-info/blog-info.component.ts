import { Component } from '@angular/core';

@Component({
  selector: 'app-blog-info',
  templateUrl: './blog-info.component.html',
  styleUrl: './blog-info.component.scss'
})
export class BlogInfoComponent {
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
