import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-clientes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <main class="flex-1 w-full">
<!-- Search and Filter Section -->
        <section class="p-container-margin md:p-lg space-y-md">
          <div class="relative group" [class.ring-2]="isFocused" [class.ring-primary]="isFocused">
            <span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">search</span>
            <input (focus)="isFocused = true" (blur)="isFocused = false" class="w-full pl-[48px] pr-md py-md bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-0 focus:outline-none transition-all font-body-md text-on-surface" placeholder="Buscar por nombre, DNI o póliza..." type="text">
          </div>
          <div class="flex gap-sm overflow-x-auto no-scrollbar pb-sm">
            <button (click)="setActiveFilter('Todos')" [class]="activeFilter === 'Todos' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'" class="px-md py-sm rounded-full font-label-md text-label-md flex items-center gap-xs whitespace-nowrap transition-colors cursor-pointer">
              Todos los Clientes
            </button>
            <button (click)="setActiveFilter('Vida')" [class]="activeFilter === 'Vida' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'" class="px-md py-sm rounded-full font-label-md text-label-md whitespace-nowrap transition-colors cursor-pointer">
              Vida
            </button>
            <button (click)="setActiveFilter('Hogar')" [class]="activeFilter === 'Hogar' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'" class="px-md py-sm rounded-full font-label-md text-label-md whitespace-nowrap transition-colors cursor-pointer">
              Hogar
            </button>
            <button (click)="setActiveFilter('Automotor')" [class]="activeFilter === 'Automotor' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'" class="px-md py-sm rounded-full font-label-md text-label-md whitespace-nowrap transition-colors cursor-pointer">
              Automotor
            </button>
            <button (click)="setActiveFilter('Empresas')" [class]="activeFilter === 'Empresas' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'" class="px-md py-sm rounded-full font-label-md text-label-md whitespace-nowrap transition-colors cursor-pointer">
              Empresas
            </button>
          </div>
        </section>

        <!-- Client List (Bento Grid Style for Desktop, Stacked for Mobile) -->
        <section class="px-container-margin md:px-lg pb-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          <!-- Client Card 1 -->
          <div *ngIf="activeFilter === 'Todos' || activeFilter === 'Automotor'" routerLink="/clientes/detalle" class="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-[0_4px_12px_rgba(0,0,0,0.05)] client-card-accent-blue flex flex-col gap-md hover:border-primary transition-colors cursor-pointer">
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-md">
                <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold">
                  AM
                </div>
                <div>
                  <h4 class="font-headline-sm text-headline-sm text-on-surface">Alejandro Morales</h4>
                  <p class="font-label-md text-label-md text-outline">DNI: 32.441.201</p>
                </div>
              </div>
              <span class="glass-badge px-sm py-base rounded-full font-label-md text-label-md">ACTIVO</span>
            </div>
            <div class="grid grid-cols-2 gap-sm">
              <div class="p-sm bg-surface-container-low rounded-lg">
                <p class="font-label-md text-label-md text-outline mb-xs">PÓLIZA</p>
                <p class="font-body-sm text-body-sm font-bold text-on-surface">Automotor Platinium</p>
              </div>
              <div class="p-sm bg-surface-container-low rounded-lg">
                <p class="font-label-md text-label-md text-outline mb-xs">VENCIMIENTO</p>
                <p class="font-body-sm text-body-sm font-bold text-on-surface">12 Oct, 2024</p>
              </div>
            </div>
            <div class="flex items-center gap-md pt-sm border-t border-outline-variant">
              <div class="flex items-center gap-xs text-on-surface-variant">
                <span class="material-symbols-outlined text-[18px]">call</span>
                <span class="text-body-sm">+54 11 4552-1234</span>
              </div>
              <div class="flex items-center gap-xs text-on-surface-variant">
                <span class="material-symbols-outlined text-[18px]">mail</span>
                <span class="text-body-sm">a.morales&#64;mail.com</span>
              </div>
            </div>
          </div>

          <!-- Client Card 2 -->
          <div *ngIf="activeFilter === 'Todos' || activeFilter === 'Vida'" routerLink="/clientes/detalle" class="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-[0_4px_12px_rgba(0,0,0,0.05)] client-card-accent-green flex flex-col gap-md hover:border-primary transition-colors cursor-pointer">
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-md">
                <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary font-bold">
                  BR
                </div>
                <div>
                  <h4 class="font-headline-sm text-headline-sm text-on-surface">Beatriz Rodríguez</h4>
                  <p class="font-label-md text-label-md text-outline">DNI: 28.102.993</p>
                </div>
              </div>
              <span class="glass-badge px-sm py-base rounded-full font-label-md text-label-md">ACTIVO</span>
            </div>
            <div class="grid grid-cols-2 gap-sm">
              <div class="p-sm bg-surface-container-low rounded-lg">
                <p class="font-label-md text-label-md text-outline mb-xs">PÓLIZA</p>
                <p class="font-body-sm text-body-sm font-bold text-on-surface">Vida Integral</p>
              </div>
              <div class="p-sm bg-surface-container-low rounded-lg">
                <p class="font-label-md text-label-md text-outline mb-xs">VENCIMIENTO</p>
                <p class="font-body-sm text-body-sm font-bold text-on-surface">25 Nov, 2024</p>
              </div>
            </div>
            <div class="flex items-center gap-md pt-sm border-t border-outline-variant">
              <div class="flex items-center gap-xs text-on-surface-variant">
                <span class="material-symbols-outlined text-[18px]">call</span>
                <span class="text-body-sm">+54 11 5002-9876</span>
              </div>
              <div class="flex items-center gap-xs text-on-surface-variant">
                <span class="material-symbols-outlined text-[18px]">mail</span>
                <span class="text-body-sm">b.rod&#64;servicios.ar</span>
              </div>
            </div>
          </div>

          <!-- Client Card 3 -->
          <div *ngIf="activeFilter === 'Todos' || activeFilter === 'Hogar'" routerLink="/clientes/detalle" class="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-[0_4px_12px_rgba(0,0,0,0.05)] client-card-accent-purple flex flex-col gap-md hover:border-primary transition-colors cursor-pointer">
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-md">
                <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-tertiary font-bold">
                  CL
                </div>
                <div>
                  <h4 class="font-headline-sm text-headline-sm text-on-surface">Carlos López</h4>
                  <p class="font-label-md text-label-md text-outline">DNI: 35.192.448</p>
                </div>
              </div>
              <span class="bg-error-container text-on-error-container px-sm py-base rounded-full font-label-md text-label-md">PENDIENTE</span>
            </div>
            <div class="grid grid-cols-2 gap-sm">
              <div class="p-sm bg-surface-container-low rounded-lg">
                <p class="font-label-md text-label-md text-outline mb-xs">PÓLIZA</p>
                <p class="font-body-sm text-body-sm font-bold text-on-surface">Hogar Premium</p>
              </div>
              <div class="p-sm bg-surface-container-low rounded-lg">
                <p class="font-label-md text-label-md text-outline mb-xs">VENCIMIENTO</p>
                <p class="font-body-sm text-body-sm font-bold text-on-surface">02 Ago, 2024</p>
              </div>
            </div>
            <div class="flex items-center gap-md pt-sm border-t border-outline-variant">
              <div class="flex items-center gap-xs text-on-surface-variant">
                <span class="material-symbols-outlined text-[18px]">call</span>
                <span class="text-body-sm">+54 11 2231-0099</span>
              </div>
              <div class="flex items-center gap-xs text-on-surface-variant">
                <span class="material-symbols-outlined text-[18px]">mail</span>
                <span class="text-body-sm">clopez&#64;finanzas.com</span>
              </div>
            </div>
          </div>

          <!-- Client Card 4 -->
          <div *ngIf="activeFilter === 'Todos' || activeFilter === 'Empresas'" routerLink="/clientes/detalle" class="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-[0_4px_12px_rgba(0,0,0,0.05)] client-card-accent-blue flex flex-col gap-md hover:border-primary transition-colors cursor-pointer">
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-md">
                <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold">
                  DF
                </div>
                <div>
                  <h4 class="font-headline-sm text-headline-sm text-on-surface">Diana Flores</h4>
                  <p class="font-label-md text-label-md text-outline">DNI: 40.223.111</p>
                </div>
              </div>
              <span class="glass-badge px-sm py-base rounded-full font-label-md text-label-md">ACTIVO</span>
            </div>
            <div class="grid grid-cols-2 gap-sm">
              <div class="p-sm bg-surface-container-low rounded-lg">
                <p class="font-label-md text-label-md text-outline mb-xs">PÓLIZA</p>
                <p class="font-body-sm text-body-sm font-bold text-on-surface">Accidentes Pers.</p>
              </div>
              <div class="p-sm bg-surface-container-low rounded-lg">
                <p class="font-label-md text-label-md text-outline mb-xs">VENCIMIENTO</p>
                <p class="font-body-sm text-body-sm font-bold text-on-surface">15 Dic, 2024</p>
              </div>
            </div>
            <div class="flex items-center gap-md pt-sm border-t border-outline-variant">
              <div class="flex items-center gap-xs text-on-surface-variant">
                <span class="material-symbols-outlined text-[18px]">call</span>
                <span class="text-body-sm">+54 11 9901-4422</span>
              </div>
              <div class="flex items-center gap-xs text-on-surface-variant">
                <span class="material-symbols-outlined text-[18px]">mail</span>
                <span class="text-body-sm">dflores&#64;studio.net</span>
              </div>
            </div>
          </div>
        </section>

        <!-- FAB: Add New Client -->
        <button class="fixed bottom-24 md:bottom-lg right-container-margin md:right-lg w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 cursor-pointer">
          <span class="material-symbols-outlined text-[28px]">person_add</span>
        </button>
      </main>
    </div>
`,
  styles: [`
    .client-card-accent-blue { border-left: 4px solid #0058be; }
    .client-card-accent-green { border-left: 4px solid #006c49; }
    .client-card-accent-purple { border-left: 4px solid #4648d4; }
    
    .glass-badge {
        background-color: rgba(108, 248, 187, 0.15);
        color: #005236;
    }
    .glass-badge-blue {
        background-color: rgba(0, 88, 190, 0.1);
        color: #0058be;
    }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`]
})
export class ClientesComponent {
  isFocused = false;
  activeFilter = 'Todos';

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
  }
}
