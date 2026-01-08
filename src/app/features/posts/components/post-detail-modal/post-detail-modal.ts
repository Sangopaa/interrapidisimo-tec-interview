import { Component, input, output } from '@angular/core';
import { Post } from '../../../../core/models/post.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UpperCasePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-post-detail-modal',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, UpperCasePipe, TitleCasePipe],
  templateUrl: './post-detail-modal.html',
  styleUrls: ['./post-detail-modal.css'],
})
export class PostDetailModalComponent {
  post = input.required<Post>();
  close = output<void>();

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('backdrop')) {
      this.onClose();
    }
  }
}
