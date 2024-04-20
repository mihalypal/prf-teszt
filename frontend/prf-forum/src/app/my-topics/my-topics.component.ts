import { Component } from '@angular/core';
import { TopicService } from '../shared/services/topic.service';
import { CommonModule } from '@angular/common';
import { Topic } from '../shared/Model/Topic';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-topics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-topics.component.html',
  styleUrl: './my-topics.component.scss'
})
export class MyTopicsComponent {
  topics?: Topic[];
  isEditMode: boolean = false;
  selectedTopicToEdit: string = '';
  editedTitle: string = '';

  constructor(private topicService: TopicService) { }

  ngOnInit() {
    this.topicService.getUserTopics().subscribe({
      next: (data) => {
        this.topics = data;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  deleteTopic(topicId: string) {
    this.topicService.deleteTopic(topicId).subscribe({
      next: (data) => {
        console.log(data);
        this.topics = this.topics!.filter(topic => topic._id !== topicId);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  editModeToggle(topicId: string) {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.selectedTopicToEdit = topicId;
      this.editedTitle = this.topics!.find(topic => topic._id === topicId)!.title;
    } else {
      this.selectedTopicToEdit = '';
      this.editedTitle = '';
    }
  }

  editModeOff() {
    this.isEditMode = false;
    this.selectedTopicToEdit = '';
    this.editedTitle = '';
  }

  editTopic(topicId: string) {
    if (this.topics!.find(topic => topic._id === topicId)!.title !== this.editedTitle) {
      this.topicService.editTopic(topicId, this.editedTitle).subscribe({
        next: (data) => {
          console.log(data);
          this.topics = this.topics!.map(topic => {
            if (topic._id === topicId) {
              topic.title = this.editedTitle;
            }
            return topic;
          });
          this.editModeOff();
        }, error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.editModeOff();
    }
  }
}
