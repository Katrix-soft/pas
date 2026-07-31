import { Component, signal, computed } from '@angular/core';
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
  categoria?: string;
  fecha?: string;
}

@Component({
  selector: 'lib-ticket-seguimiento',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-background text-on-background font-body-md min-h-screen pb-24 overflow-x-hidden">
      
      <!-- Top Mobile Navigation Header -->
      <header class="w-full sticky top-0 z-40 bg-surface/95 dark:bg-on-background/95 backdrop-blur-md border-b border-outline-variant flex items-center justify-between h-14 px-4 sm:px-6">
        <div class="flex items-center gap-3">
          <button routerLink="/dashboard" class="p-2 rounded-full hover:bg-surface-container-high transition-colors active:opacity-70 cursor-pointer">
            <span class="material-symbols-outlined text-primary text-xl">arrow_back</span>
          </button>
          <div>
            <h1 class="font-bold text-base sm:text-lg text-primary tracking-tight leading-none">Mis Tickets</h1>
            <p class="text-[11px] text-on-surface-variant font-medium mt-0.5">Seguimiento interactivo de trámites</p>
          </div>
        </div>

        <button (click)="abrirNuevoTicketModal()" class="bg-primary hover:bg-primary-container text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer">
          <span class="material-symbols-outlined text-base">add</span>
          <span class="hidden sm:inline">Nuevo Ticket</span>
          <span class="sm:hidden">Nuevo</span>
        </button>
      </header>

      <!-- Main Content Container -->
      <main class="px-4 sm:px-6 py-4 max-w-7xl mx-auto space-y-6">
        
        <!-- Summary Cards Bar (Fully Responsive Grid) -->
        <section class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          
          <!-- Card 1: Tickets Vigentes -->
          <div class="bg-surface-container-lowest border-l-4 border-primary p-3.5 sm:p-4 rounded-2xl shadow-xs border border-outline-variant/60 flex items-center justify-between transition-all">
            <div>
              <p class="text-on-surface-variant text-[10px] sm:text-xs font-black uppercase tracking-wider">Tickets Vigentes</p>
              <p class="text-2xl sm:text-3xl font-black text-on-background mt-0.5">{{ totalVigentes() }}</p>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl">confirmation_number</span>
            </div>
          </div>

          <!-- Card 2: SLA Promedio -->
          <div class="bg-surface-container-lowest border-l-4 border-tertiary p-3.5 sm:p-4 rounded-2xl shadow-xs border border-outline-variant/60 flex items-center justify-between transition-all">
            <div>
              <p class="text-on-surface-variant text-[10px] sm:text-xs font-black uppercase tracking-wider">SLA Promedio</p>
              <p class="text-2xl sm:text-3xl font-black text-on-background mt-0.5">48h</p>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-tertiary-container text-tertiary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl">timer</span>
            </div>
          </div>

          <!-- Card 3: Comisiones Pendientes -->
          <div class="col-span-2 sm:col-span-1 bg-surface-container-lowest border-l-4 border-secondary p-3.5 sm:p-4 rounded-2xl shadow-xs border border-outline-variant/60 flex items-center justify-between transition-all">
            <div>
              <p class="text-on-surface-variant text-[10px] sm:text-xs font-black uppercase tracking-wider">Comisiones Pend.</p>
              <p class="text-2xl sm:text-3xl font-black text-on-background mt-0.5">$142.5k</p>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl">account_balance_wallet</span>
            </div>
          </div>
        </section>

        <!-- Segmented Filter Control (Mobile Tabs) -->
        <section class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar md:hidden">
          <button
            (click)="tabSeleccionado.set('todos')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer"
            [ngClass]="tabSeleccionado() === 'todos' ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface-container-low text-on-surface-variant border-outline-variant'"
          >
            Todos los Tickets ({{ totalVigentes() + ticketsCerrado().length }})
          </button>

          <button
            (click)="tabSeleccionado.set('por_iniciar')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer flex items-center gap-1.5"
            [ngClass]="tabSeleccionado() === 'por_iniciar' ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface-container-low text-on-surface-variant border-outline-variant'"
          >
            <span class="w-2 h-2 rounded-full bg-primary"></span>
            <span>Por Iniciar ({{ ticketsPorIniciar().length }})</span>
          </button>

          <button
            (click)="tabSeleccionado.set('en_gestion')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer flex items-center gap-1.5"
            [ngClass]="tabSeleccionado() === 'en_gestion' ? 'bg-tertiary text-white border-tertiary shadow-xs' : 'bg-surface-container-low text-on-surface-variant border-outline-variant'"
          >
            <span class="w-2 h-2 rounded-full bg-tertiary"></span>
            <span>En Gestión ({{ ticketsEnGestion().length }})</span>
          </button>

          <button
            (click)="tabSeleccionado.set('cerrados')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer flex items-center gap-1.5"
            [ngClass]="tabSeleccionado() === 'cerrados' ? 'bg-secondary text-white border-secondary shadow-xs' : 'bg-surface-container-low text-on-surface-variant border-outline-variant'"
          >
            <span class="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Cerrados ({{ ticketsCerrado().length }})</span>
          </button>
        </section>

        <!-- Responsive Kanban View (Grid on Desktop, Dynamic Columns on Mobile) -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          
          <!-- Column 1: Por Iniciar -->
          <div *ngIf="tabSeleccionado() === 'todos' || tabSeleccionado() === 'por_iniciar'" class="flex flex-col gap-3">
            <div class="flex items-center justify-between px-1 py-1">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-primary rounded-full"></span>
                <h3 class="font-extrabold text-sm text-on-background">Por Iniciar</h3>
                <span class="bg-primary/10 text-primary text-xs font-black px-2 py-0.5 rounded-full border border-primary/20">
                  {{ ticketsPorIniciar().length }}
                </span>
              </div>
            </div>
            
            <div class="space-y-3">
              <a *ngFor="let item of ticketsPorIniciar()" 
                 routerLink="/seguimiento/detalle"
                 class="block bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl shadow-xs hover:shadow-md transition-all relative border-l-4 border-l-primary group cursor-pointer">
                
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h4 class="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{{ item.title }}</h4>
                    <p class="text-xs text-on-surface-variant mt-0.5 font-medium">{{ item.client }}</p>
                  </div>
                  <span [class]="item.statusTag.containerCss + ' ' + item.statusTag.css + ' text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-tight shadow-xs shrink-0'">
                    {{ item.statusTag.text }}
                  </span>
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-outline-variant/50 mt-2">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center text-primary overflow-hidden shrink-0">
                      <span *ngIf="!item.companyLogo" class="material-symbols-outlined text-sm">business</span>
                      <img *ngIf="item.companyLogo" [src]="item.companyLogo" class="w-full h-full object-cover">
                    </div>
                    <span class="text-xs font-bold text-on-surface-variant">{{ item.company }}</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-on-surface">{{ item.value | currency:'USD':'symbol':'1.0-0' }}</span>
                    <span class="material-symbols-outlined text-primary text-base group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </div>
                </div>
              </a>

              <div *ngIf="ticketsPorIniciar().length === 0" class="p-6 text-center bg-surface-container-lowest border border-outline-variant/60 rounded-2xl text-outline text-xs">
                Sin tickets por iniciar.
              </div>
            </div>
          </div>

          <!-- Column 2: En Gestión -->
          <div *ngIf="tabSeleccionado() === 'todos' || tabSeleccionado() === 'en_gestion'" class="flex flex-col gap-3">
            <div class="flex items-center justify-between px-1 py-1">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-tertiary rounded-full"></span>
                <h3 class="font-extrabold text-sm text-on-background">En Gestión</h3>
                <span class="bg-tertiary/10 text-tertiary text-xs font-black px-2 py-0.5 rounded-full border border-tertiary/20">
                  {{ ticketsEnGestion().length }}
                </span>
              </div>
            </div>
            
            <div class="space-y-3">
              <a *ngFor="let item of ticketsEnGestion()" 
                 routerLink="/seguimiento/detalle"
                 class="block bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl shadow-xs hover:shadow-md transition-all border-l-4 border-l-tertiary group cursor-pointer">
                   
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h4 class="font-bold text-sm text-on-surface group-hover:text-tertiary transition-colors">{{ item.title }}</h4>
                    <p class="text-xs text-on-surface-variant mt-0.5 font-medium">{{ item.client }}</p>
                  </div>
                  <span [class]="item.statusTag.containerCss + ' ' + item.statusTag.css + ' text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-tight shadow-xs shrink-0'">
                    {{ item.statusTag.text }}
                  </span>
                </div>

                <!-- Progress Bar -->
                <div *ngIf="item.progress !== undefined" class="mb-3">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-[10px] font-extrabold text-on-surface-variant uppercase">Avance</span>
                    <span class="text-[10px] font-black text-tertiary">{{ item.progress }}%</span>
                  </div>
                  <div class="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div class="h-full bg-tertiary rounded-full transition-all duration-500" [style.width.%]="item.progress"></div>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-outline-variant/50 mt-2">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center text-tertiary overflow-hidden shrink-0">
                      <span *ngIf="!item.companyLogo" class="material-symbols-outlined text-sm">business</span>
                      <img *ngIf="item.companyLogo" [src]="item.companyLogo" class="w-full h-full object-cover">
                    </div>
                    <span class="text-xs font-bold text-on-surface-variant">{{ item.company }}</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-on-surface">{{ item.value | currency:'USD':'symbol':'1.0-0' }}</span>
                    <span class="material-symbols-outlined text-tertiary text-base group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </div>
                </div>
              </a>

              <div *ngIf="ticketsEnGestion().length === 0" class="p-6 text-center bg-surface-container-lowest border border-outline-variant/60 rounded-2xl text-outline text-xs">
                Sin tickets en gestión.
              </div>
            </div>
          </div>

          <!-- Column 3: Cerrados -->
          <div *ngIf="tabSeleccionado() === 'todos' || tabSeleccionado() === 'cerrados'" class="flex flex-col gap-3">
            <div class="flex items-center justify-between px-1 py-1">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-secondary rounded-full"></span>
                <h3 class="font-extrabold text-sm text-on-background">Cerrados</h3>
                <span class="bg-secondary/10 text-secondary text-xs font-black px-2 py-0.5 rounded-full border border-secondary/20">
                  {{ ticketsCerrado().length }}
                </span>
              </div>
            </div>
            
            <div class="space-y-3">
              <a *ngFor="let item of ticketsCerrado()" 
                 routerLink="/seguimiento/detalle"
                 class="block bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl shadow-xs opacity-90 hover:opacity-100 transition-all border-l-4 border-l-secondary group cursor-pointer">
                   
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h4 class="font-bold text-sm text-on-surface line-through decoration-on-surface-variant/40 group-hover:text-secondary transition-colors">{{ item.title }}</h4>
                    <p class="text-xs text-on-surface-variant mt-0.5 font-medium">{{ item.client }}</p>
                  </div>
                  <span [class]="item.statusTag.containerCss + ' ' + item.statusTag.css + ' text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-tight shadow-xs shrink-0'">
                    {{ item.statusTag.text }}
                  </span>
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-outline-variant/50 mt-2">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center text-secondary overflow-hidden opacity-80 shrink-0">
                      <span *ngIf="!item.companyLogo" class="material-symbols-outlined text-sm">business</span>
                      <img *ngIf="item.companyLogo" [src]="item.companyLogo" class="w-full h-full object-cover">
                    </div>
                    <span class="text-xs font-bold text-on-surface-variant opacity-80">{{ item.company }}</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-secondary">{{ item.value | currency:'USD':'symbol':'1.0-0' }}</span>
                    <span class="material-symbols-outlined text-secondary text-base group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </div>
                </div>
              </a>

              <div *ngIf="ticketsCerrado().length === 0" class="p-6 text-center bg-surface-container-lowest border border-outline-variant/60 rounded-2xl text-outline text-xs">
                Sin tickets cerrados.
              </div>
            </div>
          </div>
        </section>

        <!-- Footer Unificado -->
        <footer class="py-6 px-4 text-center border-t border-outline-variant/40 mt-8 mb-20 md:mb-4 space-y-1">
          <p class="text-xs text-on-surface-variant font-bold">JC Broker Platform — <span class="text-primary font-extrabold">v1.0.0</span></p>
          <p class="text-[11px] text-outline font-medium">© 2026 JC Organizadores • Operación Centralizada • Powered by <strong class="text-primary">Katrix</strong></p>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
  `]
})
export class TicketSeguimientoComponent {
  tabSeleccionado = signal<string>('todos');

  ticketsPorIniciar = signal<PasTicket[]>([
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
  ]);

  ticketsEnGestion = signal<PasTicket[]>([
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
  ]);

  ticketsCerrado = signal<PasTicket[]>([
    {
      id: '4',
      title: 'RC Profesional',
      client: 'Elena Valdés',
      company: 'Sancor Seguros',
      value: 32000,
      statusTag: { text: 'Finalizado', css: 'text-on-secondary-container', containerCss: 'bg-secondary-container' },
      isStrikethrough: true
    }
  ]);

  totalVigentes = computed(() => this.ticketsPorIniciar().length + this.ticketsEnGestion().length);

  abrirNuevoTicketModal() {
    alert('💡 Formulario para crear un nuevo Ticket de Seguimiento.');
  }
}
