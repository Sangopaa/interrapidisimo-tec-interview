import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);

  getPosts(page: number): Observable<Post[]> {
    return this.http.get<Post[]>(`/posts?_page=${page}&_limit=10`);
  }

  getPostByTitle(title: string): Observable<Post[]> {
    return this.http.get<Post[]>(`/posts?title_like=${title}`);
  }
}
