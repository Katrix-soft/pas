import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-cobranzas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-background text-on-surface font-body-md overflow-x-hidden">
      <!-- Mobile Top Bar -->
      <header class="md:hidden sticky top-0 z-40 bg-surface border-b border-outline-variant flex justify-between items-center px-md py-sm w-full">
        <div class="flex items-center gap-sm">
          <button aria-label="Open Menu" class="p-xs text-primary">
          </button>
          <h1 class="font-headline-sm-mobile text-headline-sm-mobile font-black text-primary">Métricas de Gestión</h1>
        </div>
        <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
          <span class="material-symbols-outlined text-[18px]">person</span>
        </div>
      </header>

      <div class="flex min-h-screen">
        <!-- Main Content Area -->
        <main class="flex-1 px-container-margin md:px-xl pb-xl">
          <!-- Header -->
          <div class="mb-lg">
            <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-md">
              <div>
                <h2 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Gestión de Cobranzas</h2>
                <p class="font-body-md text-body-md text-on-surface-variant">Resumen de pagos pendientes y pólizas en riesgo.</p>
              </div>
              <div class="flex gap-sm">
                <button class="px-md py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:shadow-md transition-shadow flex items-center gap-xs cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">download</span> Exportar PDF
                </button>
              </div>
            </div>
          </div>

          <!-- Bento Summary Metrics -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-md mb-xl">
            <div class="col-span-1 md:col-span-2 bg-surface-container-lowest border border-outline-variant border-l-[4px] border-l-error p-md rounded-xl shadow-sm">
              <div class="flex justify-between items-start">
                <div>
                  <span class="font-label-md text-label-md text-on-surface-variant">TOTAL MOROSIDAD</span>
                  <div class="font-metric-xl text-metric-xl text-error mt-xs">$ 1.245.800</div>
                </div>
                <div class="bg-error-container text-on-error-container px-sm py-xs rounded-full font-label-md text-label-md flex items-center gap-xs">
                  <span class="material-symbols-outlined text-[14px]">trending_up</span> +12%
                </div>
              </div>
              <p class="font-body-sm text-body-sm text-on-surface-variant mt-sm">24 pólizas pendientes de pago hoy.</p>
            </div>
            <div class="col-span-1 bg-surface-container-lowest border border-outline-variant border-l-[4px] border-l-primary p-md rounded-xl shadow-sm">
              <span class="font-label-md text-label-md text-on-surface-variant">RECHAZADAS POR DÉBITO</span>
              <div class="font-headline-md text-headline-md text-primary mt-xs">12 Pólizas</div>
              <p class="font-body-sm text-body-sm text-on-surface-variant mt-sm">Pendientes de reintento automático.</p>
            </div>
            <div class="col-span-1 bg-surface-container-lowest border border-outline-variant border-l-[4px] border-l-secondary p-md rounded-xl shadow-sm">
              <span class="font-label-md text-label-md text-on-surface-variant">DEUDA EN EFECTIVO</span>
              <div class="font-headline-md text-headline-md text-secondary mt-xs">10 Pólizas</div>
              <div class="mt-sm h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div class="h-full bg-secondary w-[33%]"></div>
              </div>
            </div>
          </div>

          <!-- Detailed List / Cards -->
          <div class="space-y-xl">
            <!-- Section: Débito -->
            <div>
              <div class="flex items-center gap-sm mb-md">
                <div class="p-xs bg-primary-fixed rounded-lg">
                  <span class="material-symbols-outlined text-primary">credit_card</span>
                </div>
                <h3 class="font-headline-sm text-headline-sm text-on-surface">Pendientes Débito Automático</h3>
                <span class="ml-auto font-label-md text-label-md bg-surface-container-high px-sm py-xs rounded-full text-on-surface-variant">14 Casos</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                <!-- Debit Item 1 -->
                <div class="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex items-center gap-md hover:border-primary transition-colors cursor-pointer group">
                  <div class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                    <span class="material-symbols-outlined">person</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-headline-sm text-[16px] text-on-surface group-hover:text-primary transition-colors">Carlos Alberto Mendez</h4>
                    <p class="font-body-sm text-body-sm text-on-surface-variant">Póliza: AUTO-49502 | Vto: 12/10</p>
                  </div>
                  <div class="text-right">
                    <div class="font-headline-sm text-[16px] text-error font-bold">$ 45.200</div>
                    <span class="text-[10px] uppercase font-bold text-outline">Rechazo: Fondos</span>
                  </div>
                </div>
                <!-- Debit Item 2 -->
                <div class="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex items-center gap-md hover:border-primary transition-colors cursor-pointer group">
                  <div class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                    <span class="material-symbols-outlined">person</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-headline-sm text-[16px] text-on-surface group-hover:text-primary transition-colors">Lucía Fernandez</h4>
                    <p class="font-body-sm text-body-sm text-on-surface-variant">Póliza: VIDA-22104 | Vto: 15/10</p>
                  </div>
                  <div class="text-right">
                    <div class="font-headline-sm text-[16px] text-error font-bold">$ 12.800</div>
                    <span class="text-[10px] uppercase font-bold text-outline">Rechazo: Vencimiento</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section: Efectivo -->
            <div>
              <div class="flex items-center gap-sm mb-md">
                <div class="p-xs bg-secondary-fixed rounded-lg">
                  <span class="material-symbols-outlined text-secondary">payments</span>
                </div>
                <h3 class="font-headline-sm text-headline-sm text-on-surface">Cobranza en Efectivo</h3>
                <span class="ml-auto font-label-md text-label-md bg-surface-container-high px-sm py-xs rounded-full text-on-surface-variant">10 Casos</span>
              </div>
              <div class="overflow-x-auto border border-outline-variant rounded-xl bg-surface-container-lowest">
                <table class="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr class="bg-surface-container-low">
                      <th class="p-md font-label-md text-label-md text-on-surface-variant">CLIENTE</th>
                      <th class="p-md font-label-md text-label-md text-on-surface-variant">ESTADO</th>
                      <th class="p-md font-label-md text-label-md text-on-surface-variant text-right">MONTO</th>
                      <th class="p-md font-label-md text-label-md text-on-surface-variant text-center">ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline-variant">
                    <tr class="hover:bg-surface-container transition-colors cursor-pointer" (click)="rowClick($event)">
                      <td class="p-md">
                        <div class="font-headline-sm text-[15px]">Roberto Gomez</div>
                        <div class="text-[12px] text-on-surface-variant">Hogar Integral - Póliza 8849</div>
                      </td>
                      <td class="p-md">
                        <span class="px-sm py-xs bg-error-container text-on-error-container text-[11px] font-bold rounded-full">VENCIDO 15 DÍAS</span>
                      </td>
                      <td class="p-md text-right font-bold text-on-surface">$ 18.400</td>
                      <td class="p-md flex justify-center items-center gap-2">
                        <button class="p-xs text-primary hover:bg-primary-fixed rounded-full transition-all cursor-pointer">
                          <span class="material-symbols-outlined">call</span>
                        </button>
                        <button class="p-xs text-secondary hover:bg-secondary-fixed rounded-full transition-all cursor-pointer">
                          <span class="material-symbols-outlined text-[20px]">chat</span>
                        </button>
                      </td>
                    </tr>
                    <tr class="hover:bg-surface-container transition-colors cursor-pointer" (click)="rowClick($event)">
                      <td class="p-md">
                        <div class="font-headline-sm text-[15px]">Marta Sanchez</div>
                        <div class="text-[12px] text-on-surface-variant">Auto Premium - Póliza 3302</div>
                      </td>
                      <td class="p-md">
                        <span class="px-sm py-xs bg-surface-container-highest text-on-surface-variant text-[11px] font-bold rounded-full">VENCIDO 2 DÍAS</span>
                      </td>
                      <td class="p-md text-right font-bold text-on-surface">$ 34.500</td>
                      <td class="p-md flex justify-center items-center gap-2">
                        <button class="p-xs text-primary hover:bg-primary-fixed rounded-full transition-all cursor-pointer">
                          <span class="material-symbols-outlined">call</span>
                        </button>
                        <button class="p-xs text-secondary hover:bg-secondary-fixed rounded-full transition-all cursor-pointer">
                          <span class="material-symbols-outlined text-[20px]">chat</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Empty Space for Bottom Nav on Mobile -->
          <div class="h-20 md:hidden"></div>
        </main>
      </div>



      <!-- Floating Action Button for specific contexts -->
      <button class="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-40 cursor-pointer">
        <span class="material-symbols-outlined">add</span>
      </button>
    </div>
`,
  styles: [`
    .glass-card {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(8px);
    }
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
`]
})
export class CobranzasComponent {
  rowClick(event: Event) {
    const row = event.currentTarget as HTMLElement;
    row.style.backgroundColor = 'rgba(0, 88, 190, 0.05)';
    setTimeout(() => {
        row.style.backgroundColor = '';
    }, 200);
  }
}
