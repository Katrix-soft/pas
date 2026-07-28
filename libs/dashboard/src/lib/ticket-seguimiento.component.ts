import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface PasTicket {
  id: string;
  title: string;
  client: string;
  company: string;
  companyLogo?: string;
  value: number;
  statusTag: { text: string; css: string; containerCss: string };
  progress?: number;
  isStrikethrough?: boolean;
}

@Component({
  selector: 'lib-ticket-seguimiento',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-background text-on-background font-body-md min-h-screen pb-24 custom-scrollbar">
      <!-- Main Content Canvas -->
      <main class="px-container-margin pt-sm space-y-lg max-w-7xl mx-auto">
        <!-- Header & Filters -->
        <section class="flex flex-col md:flex-row md:items-center justify-between gap-md">
          <div>
            <div class="flex items-center gap-sm text-on-surface-variant mb-xs">
              <span class="material-symbols-outlined text-[18px]">confirmation_number</span>
              <span class="font-label-md text-label-md uppercase tracking-wider">Gestión</span>
            </div>
            <h2 class="font-headline-lg-mobile text-headline-lg-mobile md:text-headline-lg text-on-background">Mis Tickets</h2>
            <p class="text-on-surface-variant font-body-sm">Tablero interactivo de seguimiento de trámites y pólizas</p>
          </div>
        </section>

        <!-- Summary Bar -->
        <section class="grid grid-cols-1 sm:grid-cols-3 gap-md">
          <div class="bg-surface-container-lowest border-l-4 border-primary p-md rounded-lg shadow-sm flex items-center justify-between hover:shadow-md transition-all cursor-default">
            <div>
              <p class="text-on-surface-variant font-label-md uppercase tracking-wider">Tickets Vigentes</p>
              <p class="font-metric-xl text-metric-xl text-on-background">14</p>
            </div>
            <div class="p-sm bg-surface-container rounded-full">
              <span class="material-symbols-outlined text-primary">confirmation_number</span>
            </div>
          </div>
          <div class="bg-surface-container-lowest border-l-4 border-tertiary p-md rounded-lg shadow-sm flex items-center justify-between hover:shadow-md transition-all cursor-default">
            <div>
              <p class="text-on-surface-variant font-label-md uppercase tracking-wider">SLA Promedio</p>
              <p class="font-metric-xl text-metric-xl text-on-background">48h</p>
            </div>
            <div class="p-sm bg-tertiary-container rounded-full text-tertiary">
              <span class="material-symbols-outlined">timer</span>
            </div>
          </div>
          <div class="bg-surface-container-lowest border-l-4 border-secondary p-md rounded-lg shadow-sm flex items-center justify-between hover:shadow-md transition-all cursor-default">
            <div>
              <p class="text-on-surface-variant font-label-md uppercase tracking-wider">Comisiones Pend.</p>
              <p class="font-metric-xl text-metric-xl text-on-background">$142.5k</p>
            </div>
            <div class="p-sm bg-secondary-container rounded-full text-secondary">
              <span class="material-symbols-outlined">account_balance_wallet</span>
            </div>
          </div>
        </section>

        <!-- Kanban View -->
        <section class="flex flex-col md:grid md:grid-cols-3 gap-lg pb-md">
          
          <!-- Column: Nuevos -->
          <div class="flex flex-col gap-md">
            <div class="flex items-center justify-between px-xs">
              <div class="flex items-center gap-xs">
                <span class="w-3 h-3 bg-primary rounded-full"></span>
                <h3 class="font-headline-sm text-headline-sm">Por Iniciar</h3>
                <span class="bg-surface-container text-on-surface-variant px-sm rounded-full font-label-md">{{ticketsPorIniciar.length}}</span>
              </div>
            </div>
            
            <div class="kanban-column flex flex-col gap-md pb-xl transition-colors rounded-lg border-2 border-transparent">
              
              <div *ngFor="let item of ticketsPorIniciar" 
                   class="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm hover:shadow-md transition-all relative group" 
                   [class]="'border-l-4 ' + (item.statusTag.css.includes('error') ? 'border-l-error' : 'border-l-primary')">
                
                <div class="flex justify-between items-start mb-4 pointer-events-none">
                  <div>
                    <h4 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors" [class.line-through]="item.isStrikethrough" [class.decoration-on-surface-variant]="item.isStrikethrough">{{item.title}}</h4>
                    <p class="text-on-surface-variant font-body-sm">{{item.client}}</p>
                  </div>
                  <span [class]="item.statusTag.containerCss + ' ' + item.statusTag.css + ' text-[10px] px-sm py-[2px] rounded-full font-bold uppercase tracking-tight shadow-sm'">{{item.statusTag.text}}</span>
                </div>

                <div class="flex items-center justify-between mt-auto pt-md border-t border-outline-variant/50 pointer-events-none">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-primary overflow-hidden">
                       <span *ngIf="!item.companyLogo" class="material-symbols-outlined text-[16px]">business</span>
                       <img *ngIf="item.companyLogo" [src]="item.companyLogo" class="w-full h-full object-cover">
                    </div>
                    <div class="flex flex-col">
                      <span class="font-label-md">{{item.company}}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-label-md text-on-surface font-bold">{{item.value | currency:'USD':'symbol':'1.0-0'}}</p>
                  </div>
                </div>

                <!-- Hover Overlay Action -->
                <a routerLink="/seguimiento/detalle" class="absolute inset-0 z-10 flex items-center justify-center bg-inverse-surface/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-[1px] cursor-pointer">
                  <span class="bg-primary text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg">
                    Ver Detalle
                    <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </span>
                </a>

              </div>
            </div>
          </div>

          <!-- Column: En Gestión -->
          <div class="flex flex-col gap-md">
            <div class="flex items-center justify-between px-xs">
              <div class="flex items-center gap-xs">
                <span class="w-3 h-3 bg-tertiary rounded-full"></span>
                <h3 class="font-headline-sm text-headline-sm">En Gestión</h3>
                <span class="bg-surface-container text-on-surface-variant px-sm rounded-full font-label-md">{{ticketsEnGestion.length}}</span>
              </div>
            </div>
            
            <div class="kanban-column flex flex-col gap-md pb-xl transition-colors rounded-lg border-2 border-transparent">
                 
              <div *ngFor="let item of ticketsEnGestion" 
                   class="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 border-l-tertiary relative group">
                   
                <div class="flex justify-between items-start mb-4 pointer-events-none">
                  <div>
                    <h4 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-tertiary transition-colors" [class.line-through]="item.isStrikethrough" [class.decoration-on-surface-variant]="item.isStrikethrough">{{item.title}}</h4>
                    <p class="text-on-surface-variant font-body-sm">{{item.client}}</p>
                  </div>
                  <span [class]="item.statusTag.containerCss + ' ' + item.statusTag.css + ' text-[10px] px-sm py-[2px] rounded-full font-bold uppercase tracking-tight shadow-sm'">{{item.statusTag.text}}</span>
                </div>

                <div *ngIf="item.progress !== undefined" class="mb-4 pointer-events-none">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-[10px] font-bold text-on-surface-variant uppercase">Avance</span>
                    <span class="text-[10px] font-bold text-tertiary">{{item.progress}}%</span>
                  </div>
                  <div class="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div class="h-full bg-tertiary rounded-full transition-all duration-500" [style.width.%]="item.progress"></div>
                  </div>
                </div>

                <div class="flex items-center justify-between mt-auto pt-md border-t border-outline-variant/50 pointer-events-none">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-tertiary overflow-hidden">
                       <span *ngIf="!item.companyLogo" class="material-symbols-outlined text-[16px]">business</span>
                       <img *ngIf="item.companyLogo" [src]="item.companyLogo" class="w-full h-full object-cover">
                    </div>
                    <div class="flex flex-col">
                      <span class="font-label-md">{{item.company}}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-label-md text-on-surface font-bold">{{item.value | currency:'USD':'symbol':'1.0-0'}}</p>
                  </div>
                </div>

                <!-- Hover Overlay Action -->
                <a routerLink="/seguimiento/detalle" class="absolute inset-0 z-10 flex items-center justify-center bg-inverse-surface/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-[1px] cursor-pointer">
                  <span class="bg-tertiary text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg">
                    Ver Progreso
                    <span class="material-symbols-outlined text-[18px]">trending_up</span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <!-- Column: Cerrado -->
          <div class="flex flex-col gap-md">
            <div class="flex items-center justify-between px-xs">
              <div class="flex items-center gap-xs">
                <span class="w-3 h-3 bg-secondary rounded-full"></span>
                <h3 class="font-headline-sm text-headline-sm">Cerrados</h3>
                <span class="bg-surface-container text-on-surface-variant px-sm rounded-full font-label-md">{{ticketsCerrado.length}}</span>
              </div>
            </div>
            
            <div class="kanban-column flex flex-col gap-md pb-xl transition-colors rounded-lg border-2 border-transparent">
                 
              <div *ngFor="let item of ticketsCerrado" 
                   class="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm opacity-80 hover:opacity-100 transition-all border-l-4 border-l-secondary relative group">
                   
                <div class="flex justify-between items-start mb-4 pointer-events-none">
                  <div>
                    <h4 class="font-headline-sm text-headline-sm text-on-surface line-through decoration-on-surface-variant/40 group-hover:text-secondary transition-colors">{{item.title}}</h4>
                    <p class="text-on-surface-variant font-body-sm">{{item.client}}</p>
                  </div>
                  <span [class]="item.statusTag.containerCss + ' ' + item.statusTag.css + ' text-[10px] px-sm py-[2px] rounded-full font-bold uppercase tracking-tight shadow-sm'">{{item.statusTag.text}}</span>
                </div>

                <div class="flex items-center justify-between mt-auto pt-md border-t border-outline-variant/50 pointer-events-none">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-secondary overflow-hidden opacity-80">
                       <span *ngIf="!item.companyLogo" class="material-symbols-outlined text-[16px]">business</span>
                       <img *ngIf="item.companyLogo" [src]="item.companyLogo" class="w-full h-full object-cover">
                    </div>
                    <div class="flex flex-col">
                      <span class="font-label-md opacity-80">{{item.company}}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-label-md text-secondary font-bold">{{item.value | currency:'USD':'symbol':'1.0-0'}}</p>
                  </div>
                </div>

                <!-- Hover Overlay Action -->
                <a routerLink="/seguimiento/detalle" class="absolute inset-0 z-10 flex items-center justify-center bg-inverse-surface/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-[1px] cursor-pointer">
                  <span class="bg-secondary text-on-secondary-container font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg">
                    Ver Archivo
                    <span class="material-symbols-outlined text-[18px]">history</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .kanban-column {
      min-height: 120px;
    }
    @media (min-width: 768px) {
      .kanban-column {
        min-height: calc(100vh - 280px);
      }
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(194, 198, 214, 0.5);
      border-radius: 10px;
    }
    .custom-scrollbar:hover::-webkit-scrollbar-thumb {
      background: rgba(114, 119, 133, 0.8);
    }
  `]
})
export class TicketSeguimientoComponent {
  ticketsPorIniciar: PasTicket[] = [
    {
      id: '1',
      title: 'Renovación Integral',
      client: 'Carlos Martínez',
      company: 'Allianz Partner',
      value: 12400,
      statusTag: { text: 'Requiere Acción', css: 'text-on-error-container', containerCss: 'bg-error-container' }
    },
    {
      id: '2',
      title: 'Cotización Automotor',
      client: 'Silvia Rodriguez',
      company: 'Sancor Seguros',
      value: 8200,
      statusTag: { text: 'Nuevo', css: 'text-on-surface-variant', containerCss: 'bg-surface-container' }
    }
  ];

  ticketsEnGestion: PasTicket[] = [
    {
      id: '3',
      title: 'Siniestro Hogar',
      client: 'Daniel Torres',
      company: 'Mercantil Andina',
      value: 45000,
      statusTag: { text: 'Análisis Técnico', css: 'text-white', containerCss: 'bg-tertiary' },
      progress: 65
    },
    {
      id: '5',
      title: 'Emisión Vida',
      client: 'Laura Gómez',
      company: 'Allianz Partner',
      value: 2300,
      statusTag: { text: 'Pend. Docs', css: 'text-tertiary', containerCss: 'bg-tertiary-container' },
      progress: 30
    }
  ];

  ticketsCerrado: PasTicket[] = [
    {
      id: '4',
      title: 'RC Profesional',
      client: 'Elena Valdés',
      company: 'Sancor Seguros',
      value: 32000,
      statusTag: { text: 'Finalizado', css: 'text-on-secondary-container', containerCss: 'bg-secondary-container' },
      isStrikethrough: true
    }
  ]
}
