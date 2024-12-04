import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SitemapService {
  private sitemapUrl = 'https://backend-production-5fe1.up.railway.app/sitemap.xml'; // Ваша URL-адреса

  constructor(private http: HttpClient) {}

  fetchSitemap(): Observable<string> {
    return this.http.get(this.sitemapUrl, { responseType: 'text' });
  }
}
