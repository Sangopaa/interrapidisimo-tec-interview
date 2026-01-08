import { Component, input } from '@angular/core';
import { Post as PostModel } from '../../../../core/models/post.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UpperCasePipe } from '@angular/common';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-post',
  imports: [MatCardModule, MatButtonModule, MatIconModule, UpperCasePipe],
  templateUrl: './post.html',
})
export class PostComponent {
  post = input.required<PostModel>();
  user = input.required<User>();
}
