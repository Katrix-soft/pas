import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-clientes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-background text-on-surface font-body-md min-h-screen flex">
      <!-- NavigationDrawer (Mobile Hidden, Desktop Fixed) -->
      <nav class="hidden md:flex flex-col h-screen overflow-y-auto bg-inverse-surface dark:bg-on-surface h-full w-72 fixed left-0 top-0 shadow-lg border-r border-outline-variant z-50">
        <!-- Profile Header -->
        <div class="p-lg flex flex-col items-start gap-sm">
          <div class="w-12 h-12 rounded-full bg-surface-variant overflow-hidden">
            <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxV_Lny2jpCwVQBom8G8WALyyFWXRsd5XoQcy30SPjHS-L2jfpq1olCRjKTOjF-Na9AcDOha_U_-bVBMluwLTEcqBs-h4ZvSKzlF0pp2ahBkfX16mcEKfowEUeB-3XoUglBcDvaERaUXmvwlBTwNGOaVnQj2pyfkpk3ge-oVFlRfgwswC3BpLPTC2D45laAVqc4uY9wfgAOvEV4G_PZXKuNIuYp7TF2QAxUGtKSXwhioXES8uT9ZMl3bY5yIvjnZisQ83F3Bh2tCF1">
          </div>
          <div class="mt-sm">
            <h3 class="font-headline-sm text-headline-sm font-bold text-surface-lowest">Agente Profesional</h3>
            <p class="font-label-md text-label-md text-secondary-fixed">Seguros Globales</p>
            <p class="font-body-sm text-body-sm text-surface-variant opacity-70">ID: 28491</p>
          </div>
        </div>
        <div class="mt-md px-sm space-y-xs">
          <!-- Nav Item: Dashboard -->
          <a routerLink="/dashboard" class="flex items-center gap-md text-surface-variant hover:text-on-primary-fixed-variant p-md m-sm hover:bg-surface-variant/10 transition-colors rounded-lg cursor-pointer">
            <span class="material-symbols-outlined">dashboard</span>
            <span class="font-label-md text-label-md">Dashboard</span>
          </a>
          <!-- Nav Item: Cobranzas -->
          <a routerLink="/cobranzas" class="flex items-center gap-md text-surface-variant hover:text-on-primary-fixed-variant p-md m-sm hover:bg-surface-variant/10 transition-colors rounded-lg cursor-pointer">
            <span class="material-symbols-outlined">payments</span>
            <span class="font-label-md text-label-md">Cobranzas</span>
          </a>
          <!-- Nav Item: Clientes (Active) -->
          <a routerLink="/clientes" class="flex items-center gap-md bg-primary-container text-on-primary-container rounded-lg p-md m-sm scale-[0.98] duration-150 ease-in-out cursor-pointer">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">groups</span>
            <span class="font-label-md text-label-md">Clientes</span>
          </a>
          <!-- Nav Item: Siniestros -->
          <a routerLink="/siniestros" class="flex items-center gap-md text-surface-variant hover:text-on-primary-fixed-variant p-md m-sm hover:bg-surface-variant/10 transition-colors rounded-lg cursor-pointer">
            <span class="material-symbols-outlined">report_problem</span>
            <span class="font-label-md text-label-md">Siniestros</span>
          </a>
        </div>
        <div class="p-lg mt-auto border-t border-white/10">
          <div routerLink="/perfil" class="flex items-center gap-sm text-surface-variant hover:text-white cursor-pointer transition-colors">
            <span class="material-symbols-outlined">settings</span>
            <span class="font-label-md text-label-md">Configuración</span>
          </div>
        </div>
      </nav>

      <!-- Main Content Canvas -->
      <main class="flex-1 md:ml-72 flex flex-col min-h-screen pb-24">
        <!-- TopAppBar (Sticky) -->
        <header class="flex justify-between items-center px-md py-sm w-full bg-surface dark:bg-on-background docked full-width top-0 sticky z-40 border-b border-outline-variant">
          <div class="flex items-center gap-md">
            <h1 class="font-headline-sm-mobile md:font-headline-sm text-headline-sm-mobile md:text-headline-sm font-black text-primary">Clientes</h1>
          </div>
          <div class="flex items-center gap-md">
            <button class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-all cursor-pointer">
              <span class="material-symbols-outlined text-on-surface-variant">search</span>
            </button>
            <div routerLink="/perfil" class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden cursor-pointer">
              <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9wY4cWCYQc9iUwgLx6CH0fBfVtMldr_fBY7BUrJu227DhckASGIJ89DYM1iTBr-tctaSB2RVzhtl2GLQvEr_fk5zExTSK82VW-vLqrgwxLZhz9ualAk5n6jhFRMpEcQmpaK-bPf3BmoDam1obU-uftLpIrh1JF9bRSdcpkzVEd_zg16MMZ23kgFdVMuIhTxLkKbPKJRiqWSyvXquscQg_YJkfEz9xRhqC-O7E5x62BsiFpCNeCTMKcGKLsMQisYnoDc7q-oZae5Js">
            </div>
          </div>
        </header>

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

      <!-- BottomNavBar (Mobile Only) -->
      <nav class="md:hidden flex justify-around items-center h-20 w-full px-container-margin fixed bottom-0 z-50 bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-safe">
        <a routerLink="/dashboard" class="flex flex-col items-center justify-center flex-1 py-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span class="material-symbols-outlined">dashboard</span>
          <span class="text-label-md font-label-md">Métricas</span>
        </a>
        <a routerLink="/cobranzas" class="flex flex-col items-center justify-center flex-1 py-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span class="material-symbols-outlined">payments</span>
          <span class="text-label-md font-label-md">Cobros</span>
        </a>
        <a routerLink="/clientes" class="flex flex-col items-center justify-center flex-1 py-sm bg-primary-container text-on-primary-container rounded-lg mx-xs cursor-pointer scale-105">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">groups</span>
          <span class="text-label-md font-label-md">Clientes</span>
        </a>
        <a routerLink="/siniestros" class="flex flex-col items-center justify-center flex-1 py-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span class="material-symbols-outlined">report_problem</span>
          <span class="text-label-md font-label-md">Siniestros</span>
        </a>
        <a routerLink="/perfil" class="flex flex-col items-center justify-center flex-1 py-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span class="material-symbols-outlined">account_circle</span>
          <span class="text-label-md font-label-md">Perfil</span>
        </a>
      </nav>
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
