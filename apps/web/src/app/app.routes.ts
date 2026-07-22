import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'request-access',
    loadComponent: () => import('./request-access/request-access.component').then(m => m.RequestAccessComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@broker/dashboard').then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('@broker/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'premio',
        loadComponent: () => import('@broker/dashboard').then(m => m.PremioAdministradoComponent)
      },
      {
        path: 'asistente',
        loadComponent: () => import('@broker/dashboard').then(m => m.AsistenteIaComponent)
      },
      {
        path: 'endoso',
        loadComponent: () => import('@broker/dashboard').then(m => m.EndosoFormComponent)
      },
      {
        path: 'ticket-success',
        loadComponent: () => import('@broker/dashboard').then(m => m.TicketSuccessComponent)
      },
      {
        path: 'compania',
        loadComponent: () => import('@broker/dashboard').then(m => m.CompaniaDetalleComponent)
      },
      {
        path: 'perfil',
        loadComponent: () => import('@broker/dashboard').then(m => m.PerfilComponent)
      },
      {
        path: 'seguridad',
        loadComponent: () => import('@broker/dashboard').then(m => m.SeguridadComponent)
      },
      {
        path: 'notificaciones',
        loadComponent: () => import('@broker/dashboard').then(m => m.NotificacionesComponent)
      },
      {
        path: 'siniestros',
        loadComponent: () => import('@broker/dashboard').then(m => m.SiniestrosComponent)
      },
      {
        path: 'cobranzas',
        loadComponent: () => import('@broker/dashboard').then(m => m.CobranzasComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('@broker/dashboard').then(m => m.ClientesComponent)
      },
      {
        path: 'clientes/detalle',
        loadComponent: () => import('@broker/dashboard').then(m => m.ClienteDetalleComponent)
      },
      {
        path: 'seguimiento/detalle',
        loadComponent: () => import('@broker/dashboard').then(m => m.SeguimientoDetalleComponent)
      },
      {
        path: 'ticket/seguimiento',
        loadComponent: () => import('@broker/dashboard').then(m => m.TicketSeguimientoComponent)
      },
      {
        path: 'poliza/emitida',
        loadComponent: () => import('@broker/dashboard').then(m => m.PolizaEmitidaComponent)
      },
      {
        path: 'ticketera/kanban',
        loadComponent: () => import('@broker/dashboard').then(m => m.TicketeraKanbanComponent)
      },
      {
        path: 'sancor-demo',
        loadComponent: () => import('../../../../libs/quotations/src/index').then(m => m.VehicleQuotationDemoComponent)
      }
    ]
  }
];
