import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { blogPosts } from '../blog/blog-data';
import { FormService } from '../../services/form.service';

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

  constructor(private route: ActivatedRoute, private renderer: Renderer2, private formService: FormService) {}


  blogPost: any;

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.blogPost = blogPosts.find(post => post.id === id);
  }

  isContactOpen = false;
  contactName
  contactPhone
  successForm = false

  openContact() {
    this.isContactOpen = true;
    this.renderer.addClass(document.body, 'no-scroll');
  }

  closeContact() {
    this.isContactOpen = false;
    // Видаляємо клас, щоб дозволити скрол після закриття форми
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  sendContact(){
    this.formService.sendFormData(this.contactName, this.contactPhone).subscribe((response) => {
      this.successForm = true
      setTimeout(() => {
        this.closeContact()
        this.successForm = false
      }, 30000)
    });
 }
}
