import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-cliente-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-background text-on-background min-h-screen pb-24 md:pb-0 md:pl-72">
      <!-- Navigation Drawer (Desktop) -->
      <aside class="hidden md:flex flex-col h-screen py-lg h-full w-72 fixed left-0 top-0 bg-inverse-surface dark:bg-surface-container-lowest shadow-md z-50">
        <div class="px-lg mb-xl">
          <h1 class="font-headline-sm text-headline-sm text-primary-fixed">Assurance Nexus</h1>
        </div>
        <div class="px-md flex items-center gap-md mb-xl">
          <div class="w-12 h-12 rounded-full bg-primary-fixed-dim flex items-center justify-center text-on-primary-fixed font-bold">AP</div>
          <div>
            <p class="font-label-md text-label-md text-primary-fixed">Agente Profesional</p>
            <p class="text-xs text-surface-variant">ID: 4492</p>
          </div>
        </div>
        <nav class="flex-1 space-y-sm px-sm">
          <a routerLink="/dashboard" class="flex items-center gap-md px-md py-md text-surface-variant hover:text-white hover:bg-surface-variant/10 rounded-r-full transition-all duration-200 cursor-pointer">
            <span class="material-symbols-outlined">dashboard</span>
            <span class="font-label-md text-label-md">Dashboard</span>
          </a>
          <a routerLink="/clientes" class="flex items-center gap-md px-md py-md bg-primary-container text-on-primary-container rounded-r-full font-bold transition-all duration-200 cursor-pointer">
            <span class="material-symbols-outlined">group</span>
            <span class="font-label-md text-label-md">Clientes</span>
          </a>
          <a routerLink="/cobranzas" class="flex items-center gap-md px-md py-md text-surface-variant hover:text-white hover:bg-surface-variant/10 rounded-r-full transition-all duration-200 cursor-pointer">
            <span class="material-symbols-outlined">payments</span>
            <span class="font-label-md text-label-md">Cobranzas</span>
          </a>
          <a routerLink="/siniestros" class="flex items-center gap-md px-md py-md text-surface-variant hover:text-white hover:bg-surface-variant/10 rounded-r-full transition-all duration-200 cursor-pointer">
            <span class="material-symbols-outlined">report_problem</span>
            <span class="font-label-md text-label-md">Siniestros</span>
          </a>
          <a routerLink="/perfil" class="flex items-center gap-md px-md py-md text-surface-variant hover:text-white hover:bg-surface-variant/10 rounded-r-full transition-all duration-200 cursor-pointer">
            <span class="material-symbols-outlined">settings</span>
            <span class="font-label-md text-label-md">Ajustes</span>
          </a>
        </nav>
      </aside>

      <!-- Top App Bar -->
      <header class="w-full top-0 sticky z-40 bg-surface-container-lowest dark:bg-surface-dim border-b border-outline-variant dark:border-outline flex justify-between items-center px-container-margin h-16">
        <div class="flex items-center gap-md">
          <button routerLink="/clientes" class="p-2 hover:bg-surface-container-high transition-colors rounded-full active:scale-95 duration-150 cursor-pointer">
            <span class="material-symbols-outlined text-primary dark:text-primary-fixed-dim">arrow_back</span>
          </button>
          <h2 class="font-headline-sm text-headline-sm-mobile md:text-headline-sm text-on-surface">Detalle de Cliente</h2>
        </div>
        <button class="p-2 hover:bg-surface-container-high transition-colors rounded-full active:scale-95 duration-150 cursor-pointer">
          <span class="material-symbols-outlined text-on-surface-variant">more_vert</span>
        </button>
      </header>

      <main class="p-md md:p-xl max-w-5xl mx-auto space-y-lg">
        <!-- Profile Section -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col md:flex-row items-center md:items-start gap-lg shadow-sm">
          <div class="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-headline-lg text-headline-lg">
            AM
          </div>
          <div class="flex-1 text-center md:text-left space-y-xs">
            <h3 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Alejandro Morales</h3>
            <p class="font-body-md text-body-md text-on-surface-variant">DNI: 32.441.201</p>
            <div class="flex flex-wrap justify-center md:justify-start gap-sm mt-md">
              <button class="flex items-center gap-xs px-md py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all cursor-pointer">
                <span class="material-symbols-outlined text-sm">call</span> LLAMAR
              </button>
              <button class="flex items-center gap-xs px-md py-sm border border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all cursor-pointer">
                <span class="material-symbols-outlined text-sm">mail</span> MENSAJE
              </button>
              <button class="flex items-center gap-xs px-md py-sm bg-secondary text-on-secondary rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all cursor-pointer">
                <span class="material-symbols-outlined text-sm">chat</span> WHATSAPP
              </button>
            </div>
          </div>
        </section>

        <!-- Policies Grid -->
        <section class="space-y-md">
          <h4 class="font-headline-sm text-headline-sm text-on-surface px-sm">Pólizas Vigentes</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
            <!-- Primary Policy Card -->
            <div class="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="p-md border-b border-outline-variant flex justify-between items-start">
                <div>
                  <p class="font-label-md text-label-md text-primary uppercase">Automotor Platinium</p>
                  <h5 class="font-headline-sm text-headline-sm">Allianz</h5>
                </div>
                <span class="px-sm py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full">ACTIVO</span>
              </div>
              <div class="p-md space-y-sm">
                <div class="flex justify-between">
                  <span class="text-on-surface-variant font-label-md">Nro. Póliza</span>
                  <span class="font-body-sm font-semibold">#88219</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-on-surface-variant font-label-md">Vencimiento</span>
                  <span class="font-body-sm">12 Oct, 2024</span>
                </div>
                <div class="grid grid-cols-2 gap-md pt-sm border-t border-outline-variant mt-sm">
                  <div>
                    <p class="text-[10px] uppercase text-on-surface-variant font-bold">Premio</p>
                    <p class="font-headline-sm text-primary">$15.000</p>
                  </div>
                  <div>
                    <p class="text-[10px] uppercase text-on-surface-variant font-bold">Suma Asegurada</p>
                    <p class="font-headline-sm text-on-surface">$12.5M</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Secondary Policy Card -->
            <div class="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-tertiary-container rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="p-md border-b border-outline-variant flex justify-between items-start">
                <div>
                  <p class="font-label-md text-label-md text-tertiary uppercase">Hogar Integral</p>
                  <h5 class="font-headline-sm text-headline-sm">Sancor Seguros</h5>
                </div>
                <span class="px-sm py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded-full">PENDIENTE DE PAGO</span>
              </div>
              <div class="p-md space-y-sm">
                <div class="flex justify-between">
                  <span class="text-on-surface-variant font-label-md">Nro. Póliza</span>
                  <span class="font-body-sm font-semibold">#99402</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-on-surface-variant font-label-md">Vencimiento</span>
                  <span class="font-body-sm">05 Nov, 2024</span>
                </div>
                <div class="flex items-center gap-sm mt-md p-sm bg-surface-container rounded-lg">
                  <span class="material-symbols-outlined text-error">warning</span>
                  <p class="text-xs text-on-surface-variant">El cliente tiene un pago atrasado hace 3 días.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- History Section (Timeline) -->
        <section class="space-y-md">
          <h4 class="font-headline-sm text-headline-sm text-on-surface px-sm">Historial Reciente</h4>
          <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div class="space-y-lg relative">
              <!-- Vertical Line -->
              <div class="absolute left-[11px] top-2 bottom-2 w-0.5 bg-outline-variant"></div>
              <!-- Item 1 -->
              <div class="flex gap-md relative">
                <div class="w-6 h-6 rounded-full bg-secondary flex items-center justify-center z-10">
                  <span class="material-symbols-outlined text-[14px] text-on-secondary">check</span>
                </div>
                <div class="flex-1">
                  <p class="font-label-md text-label-md text-on-surface">Póliza Renovada</p>
                  <p class="text-xs text-on-surface-variant">Automotor Platinium - Allianz</p>
                  <p class="text-[10px] text-outline mt-1 uppercase">Hace 2 días</p>
                </div>
              </div>
              <!-- Item 2 -->
              <div class="flex gap-md relative">
                <div class="w-6 h-6 rounded-full bg-error flex items-center justify-center z-10">
                  <span class="material-symbols-outlined text-[14px] text-on-error">report_problem</span>
                </div>
                <div class="flex-1">
                  <p class="font-label-md text-label-md text-on-surface">Siniestros Reportado</p>
                  <p class="text-xs text-on-surface-variant">Choque en vía pública - #SIN-9021</p>
                  <p class="text-[10px] text-outline mt-1 uppercase">15 Sep, 2024</p>
                </div>
              </div>
              <!-- Item 3 -->
              <div class="flex gap-md relative">
                <div class="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center z-10">
                  <span class="material-symbols-outlined text-[14px] text-on-primary-container">mail</span>
                </div>
                <div class="flex-1">
                  <p class="font-label-md text-label-md text-on-surface">Contacto realizado</p>
                  <p class="text-xs text-on-surface-variant">Envío de cupón de pago por WhatsApp</p>
                  <p class="text-[10px] text-outline mt-1 uppercase">01 Sep, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Bottom Navigation Bar (Mobile) -->
      <nav class="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest dark:bg-surface-dim border-t border-outline-variant flex justify-around items-center px-4 pt-2 pb-safe shadow-lg z-50">
        <a routerLink="/dashboard" class="flex flex-col items-center justify-center text-on-surface-variant py-1 cursor-pointer">
          <span class="material-symbols-outlined">dashboard</span>
          <span class="font-label-md text-[10px]">Métricas</span>
        </a>
        <a routerLink="/cobranzas" class="flex flex-col items-center justify-center text-on-surface-variant py-1 cursor-pointer">
          <span class="material-symbols-outlined">payments</span>
          <span class="font-label-md text-[10px]">Cobros</span>
        </a>
        <a routerLink="/clientes" class="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-1 cursor-pointer">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">group</span>
          <span class="font-label-md text-[10px]">Clientes</span>
        </a>
        <a routerLink="/siniestros" class="flex flex-col items-center justify-center text-on-surface-variant py-1 cursor-pointer">
          <span class="material-symbols-outlined">report_problem</span>
          <span class="font-label-md text-[10px]">Siniestros</span>
        </a>
        <a routerLink="/perfil" class="flex flex-col items-center justify-center text-on-surface-variant py-1 cursor-pointer">
          <span class="material-symbols-outlined">person</span>
          <span class="font-label-md text-[10px]">Perfil</span>
        </a>
      </nav>
    </div>
  `
})
export class ClienteDetalleComponent {
}
