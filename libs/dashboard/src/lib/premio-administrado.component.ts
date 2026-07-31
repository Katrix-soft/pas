import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-premio-administrado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen">
      <!-- Top AppBar -->
      <header class="fixed top-0 w-full z-50 flex items-center px-container-margin h-16 bg-surface dark:bg-on-background transition-colors duration-200 ease-in-out border-b border-outline-variant">
        <button routerLink="/dashboard" class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low dark:hover:bg-inverse-surface transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-primary dark:text-primary-fixed">arrow_back</span>
        </button>
        <h1 class="ml-2 font-headline-sm text-headline-sm font-bold text-on-surface dark:text-inverse-on-surface">Premio Administrado</h1>
        <div class="ml-auto flex items-center gap-4">
          <button class="cursor-pointer">
            <span class="material-symbols-outlined text-on-surface-variant">search</span>
          </button>
          <button class="cursor-pointer">
            <span class="material-symbols-outlined text-on-surface-variant">notifications</span>
          </button>
        </div>
      </header>

      <main class="pt-20 pb-32 px-container-margin max-w-5xl mx-auto space-y-lg">
        <!-- Hero Section: Managed Premium -->
        <section class="relative overflow-hidden bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
          <div class="absolute top-0 right-0 p-4 opacity-10">
            <span class="material-symbols-outlined text-[120px]" style="font-variation-settings: 'wght' 200;">account_balance_wallet</span>
          </div>
          <div class="relative z-10 flex flex-col items-center text-center py-4">
            <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-sm">Cartera Total Vigente (312 Pólizas)</p>
            <h2 class="font-metric-xl text-metric-xl text-primary mb-xs">$18.5M</h2>
            <div class="flex items-center gap-1 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full">
              <span class="material-symbols-outlined text-[18px]">trending_up</span>
              <span class="font-label-md text-label-md">+14.8% este mes</span>
            </div>
          </div>
        </section>

        <!-- Chart Section: Monthly Evolution -->
        <section class="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
          <div class="flex justify-between items-center mb-lg">
            <div>
              <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Evolución Mensual del Premio</h3>
              <p class="text-xs text-on-surface-variant mt-0.5">Incremento sostenido de prima administrada en los últimos 6 meses</p>
            </div>
            <span class="font-label-md text-label-md text-primary font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Semestre I - 2026</span>
          </div>
          <div class="h-56 flex items-end justify-between gap-3 pt-8 pb-2 relative px-4">
            <!-- Grid Lines -->
            <div class="absolute inset-x-0 top-12 border-t border-dashed border-outline-variant/50"></div>
            <div class="absolute inset-x-0 top-28 border-t border-dashed border-outline-variant/50"></div>
            <div class="absolute inset-x-0 top-44 border-t border-dashed border-outline-variant/50"></div>

            <!-- Ene -->
            <div class="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
              <span class="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">$12.4M</span>
              <div class="w-full max-w-[48px] bg-blue-300 dark:bg-blue-900/60 rounded-t-lg transition-all group-hover:bg-primary" style="height: 48%;"></div>
              <span class="font-label-md text-xs font-semibold text-on-surface-variant">Ene</span>
            </div>
            <!-- Feb -->
            <div class="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
              <span class="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">$13.8M</span>
              <div class="w-full max-w-[48px] bg-blue-400 dark:bg-blue-800/80 rounded-t-lg transition-all group-hover:bg-primary" style="height: 58%;"></div>
              <span class="font-label-md text-xs font-semibold text-on-surface-variant">Feb</span>
            </div>
            <!-- Mar -->
            <div class="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
              <span class="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">$15.2M</span>
              <div class="w-full max-w-[48px] bg-blue-500 dark:bg-blue-700 rounded-t-lg transition-all group-hover:bg-primary" style="height: 70%;"></div>
              <span class="font-label-md text-xs font-semibold text-on-surface-variant">Mar</span>
            </div>
            <!-- Abr -->
            <div class="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
              <span class="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">$14.9M</span>
              <div class="w-full max-w-[48px] bg-blue-400 dark:bg-blue-800/80 rounded-t-lg transition-all group-hover:bg-primary" style="height: 65%;"></div>
              <span class="font-label-md text-xs font-semibold text-on-surface-variant">Abr</span>
            </div>
            <!-- May -->
            <div class="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
              <span class="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">$16.8M</span>
              <div class="w-full max-w-[48px] bg-blue-600 dark:bg-blue-600 rounded-t-lg transition-all group-hover:bg-primary" style="height: 84%;"></div>
              <span class="font-label-md text-xs font-semibold text-on-surface-variant">May</span>
            </div>
            <!-- Jun (Actual) -->
            <div class="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
              <span class="text-[11px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded shadow-xs">$18.5M</span>
              <div class="w-full max-w-[48px] bg-primary rounded-t-lg transition-all shadow-md group-hover:bg-indigo-700" style="height: 100%;"></div>
              <span class="font-label-md text-xs font-black text-primary">Jun</span>
            </div>
          </div>
        </section>

        <!-- Breakdown Section: Distribution by Branch -->
        <section class="space-y-md">
          <h3 class="font-headline-sm text-headline-sm text-on-surface px-1 font-bold">Distribución por Ramo</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
            <!-- Auto -->
            <div class="bg-surface-container-lowest border-l-4 border-primary rounded-xl border border-outline-variant p-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary">directions_car</span>
                </div>
                <div>
                  <p class="font-body-md font-bold text-on-surface">Automotor (Rama 5)</p>
                  <p class="font-label-md text-on-surface-variant">62.0% (178 pólizas)</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-headline-sm font-extrabold text-on-surface">$11.48M</p>
              </div>
            </div>
            <!-- Hogar -->
            <div class="bg-surface-container-lowest border-l-4 border-secondary-fixed-dim rounded-xl border border-outline-variant p-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-secondary">home</span>
                </div>
                <div>
                  <p class="font-body-md font-bold text-on-surface">Combinado Familiar (Rama 14)</p>
                  <p class="font-label-md text-on-surface-variant">22.0% (68 pólizas)</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-headline-sm font-extrabold text-on-surface">$4.06M</p>
              </div>
            </div>
            <!-- Motos -->
            <div class="bg-surface-container-lowest border-l-4 border-tertiary rounded-xl border border-outline-variant p-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center">
                  <span class="material-symbols-outlined text-tertiary">two_wheeler</span>
                </div>
                <div>
                  <p class="font-body-md font-bold text-on-surface">Motovehículos & Movilidad (Rama 35)</p>
                  <p class="font-label-md text-on-surface-variant">10.0% (42 pólizas)</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-headline-sm font-extrabold text-on-surface">$1.89M</p>
              </div>
            </div>
            <!-- AP / Vida -->
            <div class="bg-surface-container-lowest border-l-4 border-outline rounded-xl border border-outline-variant p-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-outline">favorite</span>
                </div>
                <div>
                  <p class="font-body-md font-bold text-on-surface">Accidentes Personales / Vida (Rama 18)</p>
                  <p class="font-label-md text-on-surface-variant">6.0% (24 pólizas)</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-headline-sm font-extrabold text-on-surface">$1.03M</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Recent Movements Section -->
        <section class="space-y-md">
          <div class="flex justify-between items-center px-1">
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Movimientos Recientes de Cartera</h3>
            <button class="font-label-md text-primary font-bold hover:underline cursor-pointer">Ver todo</button>
          </div>
          <div class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <!-- Movement 1 -->
            <div class="flex items-center p-md border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                BA
              </div>
              <div class="ml-md flex-1">
                <p class="font-body-md font-bold text-on-surface">BAHAMONDE JOSE ANTONIO</p>
                <p class="font-body-sm text-on-surface-variant text-xs">Póliza Mercantil Andina #5-894210-242193 • Automotor (Peugeot 208)</p>
              </div>
              <div class="text-right">
                <p class="font-body-md font-bold text-primary">+$64.500</p>
                <span class="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase border border-emerald-500/20">Vigente</span>
              </div>
            </div>
            <!-- Movement 2 -->
            <div class="flex items-center p-md border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-500/20">
                PR
              </div>
              <div class="ml-md flex-1">
                <p class="font-body-md font-bold text-on-surface">PEREZ CLAUDIA ROSANA</p>
                <p class="font-body-sm text-on-surface-variant text-xs">Póliza Cooperación Seguros #20027144800 • Combinado Familiar (Hogar)</p>
              </div>
              <div class="text-right">
                <p class="font-body-md font-bold text-amber-600">+$28.900</p>
                <span class="inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase border border-amber-500/20">Vigente</span>
              </div>
            </div>
            <!-- Movement 3 -->
            <div class="flex items-center p-md hover:bg-surface-container-low transition-colors cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                PR
              </div>
              <div class="ml-md flex-1">
                <p class="font-body-md font-bold text-on-surface">PEREZ DANIEL HORACIO</p>
                <p class="font-body-sm text-on-surface-variant text-xs">Póliza Mercantil Andina #5-302194-950723 • Automotor (Toyota Hilux)</p>
              </div>
              <div class="text-right">
                <p class="font-body-md font-bold text-primary">+$64.500</p>
                <span class="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase border border-emerald-500/20">Vigente</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
`,
  styles: [`
    /* Chart bar animations */
    @keyframes growUp {
        from { height: 0; }
        to { height: var(--target-height); }
    }
    .chart-bar {
        animation: growUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
`]
})
export class PremioAdministradoComponent {}
