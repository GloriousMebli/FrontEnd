import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { blogPosts } from '../blog/blog-data';

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

  constructor(private route: ActivatedRoute) {}

  blogPost: any;

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.blogPost = blogPosts.find(post => post.id === id);
  }
}
