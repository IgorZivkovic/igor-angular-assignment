import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersPageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
