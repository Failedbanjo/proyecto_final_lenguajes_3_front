import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Riot Games - Forjado para los jugadores' },
  { path: 'shop', loadComponent: () => import('./shop/shop.component').then(m => m.ShopComponent), title: 'Riot Games - Tienda' },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent), title: 'Riot Games - Iniciar Sesión' },
  { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent), title: 'Riot Games - Crear cuenta' },
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent), title: 'Riot Games - Mi Perfil' },
  { path: '**', redirectTo: '' }
];
