import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Topic } from '../shared/Model/Topic';
import { TopicService } from '../shared/services/topic.service';
import { CommonModule } from '@angular/common';
import { catchError, map, of } from 'rxjs';
import { authGuard } from '../shared/guards/auth.guard';
import { InputFieldsComponent } from './input-fields/input-fields.component';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [CommonModule, InputFieldsComponent],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.scss'
})
export class TopicsComponent {
  topics?: Topic[];
  isAuthenticated?: boolean;
  isAdmin?: boolean;

  constructor(private topicService: TopicService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.topicService.getAll().subscribe({
      next: (data) => {
        this.topics = data;
      }, error: (err) => {
        console.log(err);
      }
    });

    this.authService.checkAuth().subscribe({
      next: (data) => {
        this.isAuthenticated = data;
      }, error: (err) => {
        console.log('You are currently not logged in.');
      }
    });

    this.authService.isAdmin().subscribe({
      next: (data) => {
        this.isAdmin = data;
      }, error: (err) => {
        console.log('You are not an admin.');
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigateByUrl('/login');
      }, error: (error) => {
        console.log(error);
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

  recieveTopic(event: any) {
    this.topics?.push(event);
  }

  navigate(to: string) {
    to = '/topic/' + to;
    this.router.navigateByUrl(to);
  }
}
