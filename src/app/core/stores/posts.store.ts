import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject, computed } from '@angular/core';
import { pipe, tap, switchMap, filter, map } from 'rxjs';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { tapResponse } from '@ngrx/operators';

type PostsState = {
  posts: Post[];
  users: User[];
  searchResults: Post[];
  query: string;
  currentPage: number;
  isLoading: boolean;
};

const initialState: PostsState = {
  posts: [],
  users: [],
  searchResults: [],
  query: '',
  currentPage: 1,
  isLoading: false,
};

export const PostsStore = signalStore(
  withState(initialState),

  withComputed(({ posts, users, searchResults, query }) => ({
    visiblePosts: computed(() => {
      const currentPosts = query() ? searchResults() : posts();

      return currentPosts.map((post) => ({
        ...post,
        author: users().find((u) => u.id === post.userId),
      }));
    }),
  })),

  withMethods((store, postService = inject(PostService), userService = inject(UserService)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        switchMap(() => userService.getUsers()),
        tap((users) => patchState(store, { users }))
      )
    ),

    loadMore: rxMethod<void>(
      pipe(
        filter(() => !store.isLoading() && !store.query() && store.currentPage() <= 10),
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          postService.getPosts(store.currentPage()).pipe(
            tapResponse({
              next: (newPosts) =>
                patchState(store, {
                  posts: [...store.posts(), ...newPosts],
                  currentPage: store.currentPage() + 1,
                  isLoading: false,
                }),
              error: () => patchState(store, { isLoading: false }),
            })
          )
        )
      )
    ),

    updateQuery: rxMethod<string>(
      pipe(
        tap((query) => patchState(store, { query })),
        filter((query) => !!query),
        tap(() => patchState(store, { isLoading: true })),
        switchMap((query) =>
          postService.getPostByTitle(query).pipe(
            tapResponse({
              next: (results) => patchState(store, { searchResults: results, isLoading: false }),
              error: () => patchState(store, { isLoading: false }),
            })
          )
        )
      )
    ),
  }))
);
