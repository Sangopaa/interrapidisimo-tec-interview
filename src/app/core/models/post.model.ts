import { User } from './user.model';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  author?: User;
}
