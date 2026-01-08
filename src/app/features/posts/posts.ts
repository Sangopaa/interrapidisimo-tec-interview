import {
  Component,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  effect,
} from '@angular/core';
import { PostComponent } from './components/post/post';
import { InputComponent } from './components/input/input';
import { PostsStore } from '../../core/stores/posts.store';

@Component({
  selector: 'app-posts',
  imports: [PostComponent, InputComponent],
  providers: [PostsStore],
  templateUrl: './posts.html',
})
export class Posts implements AfterViewInit, OnDestroy {
  readonly store = inject(PostsStore);

  @ViewChild('sentinel') sentinel!: ElementRef;
  private observer?: IntersectionObserver;

  constructor() {
    effect(() => {
      const isLoading = this.store.isLoading();

      setTimeout(() => {
        if (!isLoading && this.isSentinelVisible()) {
          this.store.loadMore();
        }
      }, 100);
    });
  }

  ngAfterViewInit() {
    this.initObserver();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
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
}
