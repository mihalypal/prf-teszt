import { Component } from '@angular/core';
import { TopicService } from '../shared/services/topic.service';
import { Topic } from '../shared/Model/Topic';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Comment } from '../shared/Model/Comment';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { User } from '../shared/Model/User';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-topic-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, FormsModule],
  templateUrl: './topic-view.component.html',
  styleUrl: './topic-view.component.scss'
})
export class TopicViewComponent {
  topic?: Topic;
  comments?: Comment[];
  commentText: string = '';
  currentUser?: User;

  constructor(private authService: AuthService, private topicService: TopicService, private route: ActivatedRoute) { }
  topicSubscription = 
  this.topicService.getTopic(this.route.snapshot.paramMap.get('id')!).subscribe(
    (data) => { this.topic = data; this.comments = data.comments as unknown as Comment[]; console.log(data);
    }, (err) => { console.log(err); }
  );

  ngOnInit() {
    this.authService.whoAmI().subscribe({
      next: (data) => {
        this.currentUser = data;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  updateTopic() {
    const id = this.route.snapshot.paramMap.get('id');
    this.topicService.getTopic(id!).subscribe({
      next: (data) => {
        this.topic = data;
        this.comments = data.comments as unknown as Comment[];
        console.log(data);
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  addComment() {
    if (this.commentText.length > 0) {
      this.topicService.addComment(this.topic!._id, this.commentText).subscribe({
        next: (data) => {
          console.log(data);
          this.comments?.push(data as any as Comment);
          this.commentText = '';
        }, error: (err) => {
          console.log(err);
        }
      });
    }
  }

  deleteComment(commentId: string) {
    this.topicService.deleteComment(this.topic!._id, commentId).subscribe({
      next: (data) => {
        console.log(data);
        this.comments = this.comments?.filter(c => c._id !== commentId);
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  likeComment(commentId: string) {
    this.topicService.likeComment(this.topic!._id, commentId).subscribe({
      next: (data) => {
        console.log(data);
        if (data) {
          this.topic = data;
          this.updateTopic();
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  dislikeComment(commentId: string) {
    this.topicService.dislikeComment(this.topic!._id, commentId).subscribe({
      next: (data) => {
        console.log(data);
        if (data) {
          this.topic = data;
          this.updateTopic();
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  hasUserLiked(comment: Comment): boolean {
    return comment.usersLikesComment.some(user => user.username === this.currentUser?.email);
  }

}
