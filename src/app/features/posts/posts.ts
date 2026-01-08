import { Component, inject, HostListener } from '@angular/core';
import { PostComponent } from './components/post/post';
import { InputComponent } from './components/input/input';
import { PostsStore } from '../../core/stores/posts.store';

@Component({
  selector: 'app-posts',
  imports: [PostComponent, InputComponent],
  providers: [PostsStore],
  templateUrl: './posts.html',
})
export class Posts {
  readonly store = inject(PostsStore);

  constructor() {
    this.store.loadUsers();
    this.store.loadMore();
  }

  @HostListener('window:scroll')
  onScroll() {
    const scrollPosition =
      window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;

    if (scrollPosition + clientHeight >= scrollHeight - 50) {
      this.store.loadMore();
    }
  }
  onSearch(query: string) {
    this.store.updateQuery(query);
  }
}
