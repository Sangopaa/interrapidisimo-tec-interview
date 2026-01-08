import {
  Component,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  effect,
  signal,
} from '@angular/core';
import { PostComponent } from './components/post/post';
import { InputComponent } from './components/input/input';
import { PostsStore } from '../../core/stores/posts.store';
import { Post } from '../../core/models/post.model';
import { PostDetailModalComponent } from './components/post-detail-modal/post-detail-modal';

@Component({
  selector: 'app-posts',
  imports: [PostComponent, InputComponent, PostDetailModalComponent],
  providers: [PostsStore],
  templateUrl: './posts.html',
})
export class Posts implements AfterViewInit, OnDestroy {
  readonly store = inject(PostsStore);
  selectedPost = signal<Post | null>(null);

  @ViewChild('sentinel') sentinel!: ElementRef;
  private observer?: IntersectionObserver;

  constructor() {
    this.store.loadUsers();

    effect(() => {
      const isLoading = this.store.isLoading();

      setTimeout(() => {
        if (!isLoading && this.isSentinelVisible()) {
          this.store.loadMore();
        }
      }, 100);
    });

    effect(() => {
      if (this.selectedPost()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  ngAfterViewInit() {
    this.initObserver();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    document.body.style.overflow = '';
  }

  private initObserver() {
    if (!this.sentinel) return;

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.store.isLoading()) {
        this.store.loadMore();
      }
    });

    this.observer.observe(this.sentinel.nativeElement);
  }
  private isSentinelVisible(): boolean {
    if (!this.sentinel?.nativeElement) return false;

    const rect = this.sentinel.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    return rect.top <= windowHeight && rect.bottom >= 0;
  }

  onSearch(query: string) {
    this.store.updateQuery(query);
  }

  openPost(post: Post) {
    this.selectedPost.set(post);
  }

  closePost() {
    this.selectedPost.set(null);
  }
}
