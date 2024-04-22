import { Component } from '@angular/core';
import { TopicService } from '../shared/services/topic.service';
import { Topic } from '../shared/Model/Topic';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Comment } from '../shared/Model/Comment';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-topic-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './topic-view.component.html',
  styleUrl: './topic-view.component.scss'
})
export class TopicViewComponent {
  topic?: Topic;
  comments?: Comment[];

  constructor(private topicService: TopicService, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.topicService.getTopic(id!).subscribe({
      next: (data) => {
        this.topic = data;
        this.comments = data.comments as unknown as Comment[]; // Update the type of comments
        console.log(data);
        console.log(this.comments);
        
        
      }, error: (err) => {
        console.log(err);
      }
    });
  }

}
