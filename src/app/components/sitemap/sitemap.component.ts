import { Component, OnInit } from '@angular/core';
import { SitemapService } from '../../services/sitemap.service';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.scss',
})
export class SitemapComponent implements OnInit {
  sitemapLinks: { loc: string; changefreq: string; priority: string }[] = [];
  errorMessage = '';

  constructor(private sitemapService: SitemapService) {}

  ngOnInit(): void {
    this.loadSitemap();
  }

  loadSitemap() {
    this.sitemapService.fetchSitemap().subscribe({
      next: (data) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const urls = xmlDoc.getElementsByTagName('url');
        this.sitemapLinks = Array.from(urls).map((url) => ({
          loc: url.getElementsByTagName('loc')[0]?.textContent || '',
          changefreq: url.getElementsByTagName('changefreq')[0]?.textContent || '',
          priority: url.getElementsByTagName('priority')[0]?.textContent || '',
        }));
      },
      error: (err) => {
        this.errorMessage = 'Error loading sitemap.';
        console.error(err);
      },
    });
  }
}
