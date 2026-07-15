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
    <nav *ngIf="breadcrumbs.length > 0" class="flex items-center gap-xs text-on-surface-variant mb-xs">
      <ng-container *ngFor="let crumb of breadcrumbs; let last = last; let first = first">
        <!-- Render arrow if not first -->
        <span *ngIf="!first" class="material-symbols-outlined text-[16px]">chevron_right</span>
        
        <!-- Render link or text -->
        <a *ngIf="!last" [routerLink]="crumb.url" class="font-label-md text-label-md hover:text-primary transition-colors cursor-pointer">
          {{ crumb.label }}
        </a>
        <span *ngIf="last" class="font-label-md text-label-md font-bold text-primary">
          {{ crumb.label }}
        </span>
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
      
      return {
        label: label,
        url: currentUrl
      };
    });
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
