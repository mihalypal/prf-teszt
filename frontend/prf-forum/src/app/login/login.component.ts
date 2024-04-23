import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,
            CommonModule,
            RouterModule,
            MatProgressSpinnerModule,
            MatIconModule,
            MatButtonModule,
            MatFormFieldModule,
            MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading = false;
  showPassword = false;

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    this.isLoading = true;
    if (this.email && this.password) {
      this.errorMessage = '';
      this.authService.login(this.email, this.password).subscribe({
        next: (data) => {
          if (data) {
            // navigation
            console.log(data);
            this.authService.changeAuthStatus(true);
            this.authService.changeAdminStatus(data.isAdmin);
            this.isLoading = false;
            this.navigate('/topics');
          }
        }, error: (err) => {
          console.log(err);
        },
      })
    } else {
      this.errorMessage = 'Form is empty';
      this.isLoading = false;
    }
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

  togglePassword() {

  }

}
