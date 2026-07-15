import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-siniestros',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-surface font-body-md text-on-surface min-h-screen pb-24 overflow-x-hidden">
      <main class="px-container-margin pt-sm space-y-lg">
        <!-- Search Bar -->
        <section class="relative">
          <div class="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
            <span class="material-symbols-outlined text-outline" data-icon="search">search</span>
          </div>
          <input class="w-full pl-10 pr-md py-md bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-on-surface placeholder-on-surface-variant transition-all" placeholder="Buscar por número o cliente..." type="text">
        </section>

        <!-- Filter Chips -->
        <section class="flex gap-sm overflow-x-auto custom-scrollbar pb-xs">
          <button (click)="setActiveFilter('Todos')" [class]="activeFilter === 'Todos' ? 'active-chip border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary'" class="whitespace-nowrap px-md py-xs rounded-full border font-label-md transition-colors cursor-pointer">Todos</button>
          <button (click)="setActiveFilter('Pendientes')" [class]="activeFilter === 'Pendientes' ? 'active-chip border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary'" class="whitespace-nowrap px-md py-xs rounded-full border font-label-md transition-colors cursor-pointer">Pendientes</button>
          <button (click)="setActiveFilter('En Inspección')" [class]="activeFilter === 'En Inspección' ? 'active-chip border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary'" class="whitespace-nowrap px-md py-xs rounded-full border font-label-md transition-colors cursor-pointer">En Inspección</button>
          <button (click)="setActiveFilter('Liquidados')" [class]="activeFilter === 'Liquidados' ? 'active-chip border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary'" class="whitespace-nowrap px-md py-xs rounded-full border font-label-md transition-colors cursor-pointer">Liquidados</button>
        </section>

        <!-- Siniestros Listing -->
        <section class="space-y-md">
          <!-- Card 1: En Inspección -->
          <div *ngIf="activeFilter === 'Todos' || activeFilter === 'En Inspección'" class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row relative transition-all duration-500 opacity-100 translate-y-0">
            <div class="w-1 h-full absolute left-0 top-0 bg-primary"></div>
            <div class="p-md flex-grow space-y-sm">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-headline-sm text-headline-sm text-on-surface">María Belén Ortega</h3>
                  <p class="font-body-sm text-on-surface-variant">SIN-2024-8821</p>
                </div>
                <span class="px-sm py-xs rounded-full bg-surface-container-high text-primary font-label-md flex items-center gap-xs">
                  <span class="w-2 h-2 rounded-full bg-primary"></span>
                  En Inspección
                </span>
              </div>
              <div class="grid grid-cols-2 gap-sm pt-sm">
                <div>
                  <p class="text-on-surface-variant font-label-md uppercase tracking-wider">Tipo</p>
                  <p class="font-body-md font-semibold text-on-surface">Robo Parcial - Auto</p>
                </div>
                <div>
                  <p class="text-on-surface-variant font-label-md uppercase tracking-wider">Fecha</p>
                  <p class="font-body-md text-on-surface">12 Oct, 2024</p>
                </div>
              </div>
              <div class="pt-md">
                <button routerLink="/seguimiento/detalle" class="w-full py-sm bg-primary text-on-primary font-headline-sm rounded-lg hover:bg-primary-container transition-colors flex items-center justify-center gap-sm cursor-pointer">
                  Ver Detalle
                  <span class="material-symbols-outlined text-base" data-icon="arrow_forward">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Card 2: Liquidado -->
          <div *ngIf="activeFilter === 'Todos' || activeFilter === 'Liquidados'" class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row relative transition-all duration-500 opacity-100 translate-y-0">
            <div class="w-1 h-full absolute left-0 top-0 bg-secondary"></div>
            <div class="p-md flex-grow space-y-sm">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-headline-sm text-headline-sm text-on-surface">Juan Carlos Rossi</h3>
                  <p class="font-body-sm text-on-surface-variant">SIN-2024-7742</p>
                </div>
                <span class="px-sm py-xs rounded-full bg-secondary-container text-on-secondary-container font-label-md flex items-center gap-xs">
                  <span class="w-2 h-2 rounded-full bg-secondary"></span>
                  Liquidado
                </span>
              </div>
              <div class="grid grid-cols-2 gap-sm pt-sm">
                <div>
                  <p class="text-on-surface-variant font-label-md uppercase tracking-wider">Tipo</p>
                  <p class="font-body-md font-semibold text-on-surface">Incendio Total - Hogar</p>
                </div>
                <div>
                  <p class="text-on-surface-variant font-label-md uppercase tracking-wider">Fecha</p>
                  <p class="font-body-md text-on-surface">05 Oct, 2024</p>
                </div>
              </div>
              <div class="pt-md">
                <button routerLink="/seguimiento/detalle" class="w-full py-sm border border-primary text-primary font-headline-sm rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-sm cursor-pointer">
                  Ver Detalle
                  <span class="material-symbols-outlined text-base" data-icon="arrow_forward">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Card 3: Pendiente -->
          <div *ngIf="activeFilter === 'Todos' || activeFilter === 'Pendientes'" class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row relative transition-all duration-500 opacity-100 translate-y-0">
            <div class="w-1 h-full absolute left-0 top-0 bg-error"></div>
            <div class="p-md flex-grow space-y-sm">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-headline-sm text-headline-sm text-on-surface">Elena Sofia Méndez</h3>
                  <p class="font-body-sm text-on-surface-variant">SIN-2024-9103</p>
                </div>
                <span class="px-sm py-xs rounded-full bg-error-container text-on-error-container font-label-md flex items-center gap-xs">
                  <span class="w-2 h-2 rounded-full bg-error"></span>
                  Pendiente
                </span>
              </div>
              <div class="grid grid-cols-2 gap-sm pt-sm">
                <div>
                  <p class="text-on-surface-variant font-label-md uppercase tracking-wider">Tipo</p>
                  <p class="font-body-md font-semibold text-on-surface">Responsabilidad Civil</p>
                </div>
                <div>
                  <p class="text-on-surface-variant font-label-md uppercase tracking-wider">Fecha</p>
                  <p class="font-body-md text-on-surface">15 Oct, 2024</p>
                </div>
              </div>
              <div class="pt-md">
                <button routerLink="/seguimiento/detalle" class="w-full py-sm border border-primary text-primary font-headline-sm rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-sm cursor-pointer">
                  Ver Detalle
                  <span class="material-symbols-outlined text-base" data-icon="arrow_forward">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty Space at bottom for FAB -->
          <div class="h-16"></div>
        </section>
      </main>

      <!-- FAB (Floating Action Button) -->
      <button class="fixed right-md bottom-24 w-14 h-14 bg-primary text-on-primary rounded-xl shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 cursor-pointer">
        <span class="material-symbols-outlined text-[32px]" data-icon="add">add</span>
      </button>


    </div>
`,
  styles: [`
    .active-chip {
        background-color: #0058be;
        color: #ffffff;
    }
    .custom-scrollbar::-webkit-scrollbar {
        height: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #c2c6d6;
        border-radius: 10px;
    }
`]
})
export class SiniestrosComponent {
  activeFilter = 'Todos';

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
  }
}
