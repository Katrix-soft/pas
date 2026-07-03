import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'audit',
    pathMatch: 'full'
  },
  {
    path: 'audit',
    loadComponent: () => import('@broker/dashboard').then(m => m.DashboardComponent) // Reutilizando el dashboard de ejemplo para el esqueleto
  }
];
