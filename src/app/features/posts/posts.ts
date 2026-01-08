import { Component, inject, signal, HostListener } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { PostService } from '../../core/services/post.service';
import { Post } from '../../core/models/post.model';
import { map, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { PostComponent } from './components/post/post';
import { InputComponent } from './components/input/input';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-posts',
  imports: [AsyncPipe, PostComponent, InputComponent],
  templateUrl: './posts.html',
})
export class Posts {
  private postService = inject(PostService);
  private userService = inject(UserService);

  searchTerm = signal('');
  private allPosts = signal<Post[]>([]);
  private allUsers = signal<User[]>([]);
  private allPosts$ = toObservable(this.allPosts);
  private currentPage = 1;
  private isLoading = false;

  posts$: Observable<Post[]> = toObservable(this.searchTerm).pipe(
    switchMap((term) => {
      if (term) return this.postService.getPostByTitle(term);
      return this.allPosts$;
    })
  );

  constructor() {
    this.loadUsers();
    this.loadMore();
  }

  private loadUsers() {
    this.userService.getUsers().subscribe((users) => {
      this.allUsers.set(users);
    });
  }

  getUserById(userId: number): User | undefined {
    return this.allUsers().find((user) => user.id === userId);
  }

  @HostListener('window:scroll')
  onScroll() {
    const scrollPosition =
      window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;

    if (scrollPosition + clientHeight >= scrollHeight - 50) {
      this.loadMore();
    }
  }

  private loadMore() {
    if (this.isLoading || this.currentPage > 10) return;

    this.isLoading = true;
    this.postService.getPosts(this.currentPage).subscribe((posts) => {
      this.allPosts.update((current) => [...current, ...posts]);
      this.currentPage++;
      this.isLoading = false;

      // Verify if we still need to load more (e.g. large screen or zoom out)
      setTimeout(() => this.onScroll(), 0);
    });
  }
}
