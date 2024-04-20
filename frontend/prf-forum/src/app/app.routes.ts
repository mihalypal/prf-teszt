import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';
import { authChildGuard } from './shared/guards/auth-child.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then((c) => c.SignupComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: 'topics', loadComponent: () => import('./topics/topics.component').then((c) => c.TopicsComponent) },
    { path: 'my-topics', loadComponent: () => import('./my-topics/my-topics.component').then((c) => c.MyTopicsComponent), canActivate: [authGuard] },
    { path: 'user-management', loadComponent: () => import('./user-management/user-management.component').then((c) => c.UserManagementComponent), canActivate: [authGuard, adminGuard] },
    { path: '**', redirectTo: 'login' }
];
