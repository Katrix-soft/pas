import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav *ngIf="breadcrumbs.length > 0" class="flex items-center gap-1 text-on-surface-variant mb-xs" aria-label="Breadcrumb">
      <ng-container *ngFor="let crumb of breadcrumbs; let last = last; let first = first">
        <!-- Render arrow if not first -->
        <span *ngIf="!first" class="text-outline-variant font-bold select-none text-sm">/</span>
        
        <!-- Render link -->
        <a [routerLink]="crumb.url" 
           class="font-label-md text-label-md px-3 py-1.5 rounded-md hover:bg-surface-container-high transition-colors cursor-pointer uppercase tracking-wider flex items-center justify-center"
           [class.font-bold]="last"
           [class.text-primary]="last"
           [class.hover:text-primary]="!last">
          {{ crumb.label }}
        </a>
      </ng-container>
    </nav>
  `
})
export class BreadcrumbsComponent {
  private router = inject(Router);
  
  breadcrumbs: Array<{label: string, url: string}> = [];

  // Mapeo de segmentos técnicos de URL a nombres legibles para el usuario
  private routeNameMap: Record<string, string> = {
    'kanban': 'Mesa Operativa',
    'ticketera': 'Ticketera',
    'detalle': 'Detalle',
    'seguimiento': 'Seguimiento',
    'ticket': 'Ticket',
    'asistente': 'Asistente IA',
    'poliza': 'Póliza',
    'emitida': 'Emitida'
  };

  // Mapeo de URLs intermedias (que no tienen ruta real) a vistas válidas
  private routeUrlOverride: Record<string, string> = {
    '/seguimiento': '/siniestros',
    '/ticket': '/ticketera/kanban',
    '/ticketera': '/dashboard',
    '/poliza': '/dashboard'
  };

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.buildBreadcrumbs();
    });
    
    // Initial build
    this.buildBreadcrumbs();
  }

  private buildBreadcrumbs() {
    const url = this.router.url.split('?')[0]; // Remove query params
    const parts = url.split('/').filter(p => p);
    
    // If we are at root or dashboard, maybe don't show or just show Dashboard
    if (parts.length === 0 || (parts.length === 1 && parts[0] === 'dashboard')) {
      this.breadcrumbs = [];
      return;
    }

    let currentUrl = '';
    this.breadcrumbs = parts.map(part => {
      currentUrl += `/${part}`;
      
      // Buscar en el mapa, o capitalizar por defecto
      const mappedName = this.routeNameMap[part.toLowerCase()];
      const label = mappedName ? mappedName : this.capitalize(part.replace(/-/g, ' '));
      
      // Aplicar override de URL si existe (para evitar links rotos en segmentos intermedios)
      const finalUrl = this.routeUrlOverride[currentUrl] || currentUrl;
      
      return {
        label: label,
        url: finalUrl
      };
    });
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
