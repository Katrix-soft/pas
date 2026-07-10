import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-seguimiento-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="font-body-md text-on-background min-h-screen bg-background pb-24 md:pb-0">
      <!-- TopAppBar -->
      <header class="w-full top-0 sticky z-50 bg-surface border-b border-outline-variant flex justify-between items-center px-md py-sm">
        <div class="flex items-center gap-md">
          <button routerLink="/dashboard" class="hover:bg-surface-container-high p-2 rounded-full transition-colors active:scale-95 duration-150 cursor-pointer">
            <span class="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 class="font-headline-sm text-headline-sm text-primary font-bold">JC Organizadores</h1>
        </div>
        <div class="flex items-center gap-sm">
          <div routerLink="/perfil" class="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container cursor-pointer">
            <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa-BE3PftFjp7iNmt70jCCevdc-Pm2Uiihq_T-RCP4bUf8HFJHm2nY8XoxepXq3_LBDHcr7CMPzXh9UF0J46EU3UoWecOyPl5DTfmgrhwWagx4-tFg0RzLYXc0VQNimXVL1ly3jaLUZV4LuM6AmurrtwdL-3Yb_uLffryf73WjFI_dABlD4-FCnz0IcQqI9mDyUFo6dPkG93oUO6QI5UI5RYOHOK2bpBn2dzOysHip6uz4A7YPl2uY9g"/>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto p-container-margin mb-24">
        <!-- Header Section -->
        <section class="mb-lg">
          <div class="flex flex-wrap justify-between items-start gap-md mb-md">
            <div>
              <h2 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-1">Renovación Integral Hogar</h2>
              <div class="flex items-center gap-sm">
                <span class="bg-error-container text-on-error-container px-3 py-1 rounded-full font-label-md text-label-md flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">priority_high</span>
                  Alta
                </span>
                <span class="text-on-surface-variant font-body-sm text-body-sm">ID: #TRK-8829-24</span>
              </div>
            </div>
            <div class="flex gap-sm">
              <button class="bg-[#25D366] text-white px-md py-sm rounded-lg flex items-center gap-2 font-bold hover:opacity-90 active:scale-95 transition-transform cursor-pointer">
                <span class="material-symbols-outlined">chat</span>
                WhatsApp
              </button>
              <button class="bg-primary text-white px-md py-sm rounded-lg flex items-center gap-2 font-bold hover:bg-primary-container active:scale-95 transition-transform cursor-pointer">
                <span class="material-symbols-outlined">call</span>
                Llamar
              </button>
            </div>
          </div>

          <!-- Stepper -->
          <div class="w-full glass-card p-md rounded-xl shadow-sm overflow-x-auto bg-white/80 backdrop-blur border border-slate-200">
            <div class="flex items-center justify-between min-w-[600px] relative px-4">
              <div class="absolute top-1/2 left-0 right-0 h-1 bg-surface-variant -translate-y-1/2 z-0 mx-8"></div>
              <div class="absolute top-1/2 left-0 w-2/3 h-1 bg-secondary -translate-y-1/2 z-0 mx-8"></div>
              
              <div class="z-10 flex flex-col items-center gap-2 group">
                <div class="stepper-circle w-10 h-10 rounded-full flex items-center justify-center bg-secondary text-white shadow-md">
                  <span class="material-symbols-outlined">check</span>
                </div>
                <span class="font-label-md text-label-md text-secondary">Lead</span>
              </div>
              <div class="z-10 flex flex-col items-center gap-2">
                <div class="stepper-circle w-10 h-10 rounded-full flex items-center justify-center bg-secondary text-white shadow-md">
                  <span class="material-symbols-outlined">check</span>
                </div>
                <span class="font-label-md text-label-md text-secondary">Cotizado</span>
              </div>
              <div class="z-10 flex flex-col items-center gap-2">
                <div class="stepper-circle w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white shadow-lg ring-4 ring-primary-fixed">
                  <span class="material-symbols-outlined">description</span>
                </div>
                <span class="font-label-md text-label-md text-primary font-bold">Pend. Docs</span>
              </div>
              <div class="z-10 flex flex-col items-center gap-2">
                <div class="stepper-circle w-10 h-10 rounded-full flex items-center justify-center bg-surface-variant text-on-surface-variant">
                  <span class="material-symbols-outlined">task_alt</span>
                </div>
                <span class="font-label-md text-label-md text-on-surface-variant">Emitido</span>
              </div>
            </div>
          </div>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <!-- Left Column: Details & Timeline -->
          <div class="md:col-span-8 flex flex-col gap-lg">
            <!-- Client Card -->
            <div class="bg-white border border-outline-variant p-lg rounded-xl flex flex-col md:flex-row justify-between gap-lg relative overflow-hidden">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
              <div class="flex gap-lg items-center">
                <div class="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-primary">
                  <span class="material-symbols-outlined text-4xl">person</span>
                </div>
                <div>
                  <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Cliente Principal</p>
                  <h3 class="font-headline-sm text-headline-sm">Roberto Gomez Sanchez</h3>
                  <p class="font-body-md text-body-md text-on-surface-variant">DNI 32.445.112 &bull; 54 9 11 5566-7788</p>
                </div>
              </div>
              <div class="flex flex-col justify-center items-start md:items-end border-t md:border-t-0 md:border-l border-outline-variant pt-md md:pt-0 md:pl-lg">
                <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tipo de Póliza</p>
                <span class="font-body-lg text-body-lg font-bold text-primary">Seguro de Hogar Premium</span>
                <p class="font-body-sm text-body-sm text-on-surface-variant">Vencimiento: 15 Oct 2024</p>
              </div>
            </div>

            <!-- Timeline Section -->
            <div class="bg-white border border-outline-variant rounded-xl overflow-hidden">
              <div class="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <h4 class="font-headline-sm text-headline-sm flex items-center gap-2">
                  <span class="material-symbols-outlined">history</span>
                  Historial de Actividad
                </h4>
                <button class="text-primary font-bold text-body-sm hover:underline cursor-pointer">Ver todo</button>
              </div>
              <div class="p-lg flex flex-col gap-lg">
                <!-- Timeline Item 1 -->
                <div class="flex gap-md">
                  <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary">
                      <span class="material-symbols-outlined text-sm">edit_note</span>
                    </div>
                    <div class="w-0.5 h-full bg-outline-variant my-1"></div>
                  </div>
                  <div class="pb-md">
                    <div class="flex justify-between items-start gap-xl">
                      <h5 class="font-body-md text-body-md font-bold">Nota Interna: Documentación incompleta</h5>
                      <span class="font-label-md text-label-md text-on-surface-variant">Hoy, 10:45 AM</span>
                    </div>
                    <p class="font-body-md text-body-md mt-1 text-on-surface-variant">Falta adjuntar el frente de la propiedad para la inspección digital. Se notificó al cliente por WhatsApp.</p>
                    <div class="mt-sm flex gap-sm items-center">
                      <img class="w-6 h-6 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb2hROSP_0cmAuDvf8-Wqs-fl0IXHx251JTrEnnOwUeo9GqjQkU_M3cUGIa7RmsADmSIMXvmub9cAyWpzx7q5J2qv7uupvg8duv_APJXQ5D9U4ir66uBxugfg9_aCOZrcV7by7_3kxobvNL-vhHCs7pOg_tLn4C3uEt497Ofzookh_nG7YhCvIStuHGsxq8BHcWiArjeza0q7JXOx1QJkozE-rJyMI45ATJ_WIAqCbjuvwOFkWUk2VEw"/>
                      <span class="font-body-sm text-body-sm font-semibold">Ana Belén (Admin)</span>
                    </div>
                  </div>
                </div>
                <!-- Timeline Item 2 -->
                <div class="flex gap-md">
                  <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                      <span class="material-symbols-outlined text-sm">sync</span>
                    </div>
                    <div class="w-0.5 h-full bg-outline-variant my-1"></div>
                  </div>
                  <div class="pb-md">
                    <div class="flex justify-between items-start gap-xl">
                      <h5 class="font-body-md text-body-md font-bold">Cambio de Estado: Lead -> Pendiente Doc.</h5>
                      <span class="font-label-md text-label-md text-on-surface-variant">Ayer, 16:20 PM</span>
                    </div>
                    <p class="font-body-md text-body-md mt-1 text-on-surface-variant">El prospecto aceptó la cotización Nro. 55421.</p>
                  </div>
                </div>
                <!-- Timeline Item 3 -->
                <div class="flex gap-md">
                  <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                      <span class="material-symbols-outlined text-sm">mail</span>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between items-start gap-xl">
                      <h5 class="font-body-md text-body-md font-bold">Correo Enviado: Cotización Hogar</h5>
                      <span class="font-label-md text-label-md text-on-surface-variant">02 Sep, 09:12 AM</span>
                    </div>
                    <p class="font-body-md text-body-md mt-1 text-on-surface-variant">Se envió el PDF con las 3 opciones de cobertura.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Actions -->
          <div class="md:col-span-4 flex flex-col gap-lg">
            <!-- Actions Panel -->
            <div class="bg-white border border-outline-variant rounded-xl p-lg shadow-sm">
              <h4 class="font-headline-sm text-headline-sm mb-lg">Acciones Rápidas</h4>
              <div class="flex flex-col gap-md">
                <button class="w-full flex items-center justify-between p-md border border-outline-variant rounded-lg hover:bg-surface-container transition-colors group cursor-pointer">
                  <div class="flex items-center gap-md">
                    <span class="material-symbols-outlined text-primary">add_notes</span>
                    <span class="font-body-md text-body-md font-semibold">Agregar Nota Interna</span>
                  </div>
                  <span class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
                <button class="w-full flex items-center justify-between p-md border border-outline-variant rounded-lg hover:bg-surface-container transition-colors group cursor-pointer">
                  <div class="flex items-center gap-md">
                    <span class="material-symbols-outlined text-primary">sync_alt</span>
                    <span class="font-body-md text-body-md font-semibold">Cambiar Estado</span>
                  </div>
                  <span class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
                <button class="w-full flex items-center justify-between p-md border border-outline-variant rounded-lg hover:bg-surface-container transition-colors group cursor-pointer">
                  <div class="flex items-center gap-md">
                    <span class="material-symbols-outlined text-primary">assignment_add</span>
                    <span class="font-body-md text-body-md font-semibold">Asignar Tarea</span>
                  </div>
                  <span class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
              </div>
              <div class="mt-xl pt-lg border-t border-outline-variant">
                <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md">Responsable Actual</p>
                <div class="flex items-center gap-md p-sm bg-surface-container-low rounded-lg border border-primary-fixed">
                  <img class="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3iJpTagm8q-uWewqSX52l18ndnktTPyRvrtfiYNXEdeKAxOTE9C_F2GOj2pZRQc29a8iJZpEExI2vx_oq60JPU155lFsKs60K8-0TaOhZKun-epl3PrLwpQYwmN0UwsAg6emrV9kCzMSQvxHYMOGdHUwzDNjP4sPYgslOmFNTpSll3QLhAEiqB-20u4QAtPaXDpPyxzfv1bVlNt9EwhdLE5pUaLJO_h7HvaDWs3OAOU17Q3YO07Um1Q"/>
                  <div class="flex-1">
                    <p class="font-body-sm text-body-sm font-bold">Carlos Mendoza</p>
                    <p class="font-label-md text-label-md text-on-surface-variant">Asesor Senior</p>
                  </div>
                  <button class="text-primary material-symbols-outlined hover:bg-surface-container rounded-full p-1 cursor-pointer">swap_horiz</button>
                </div>
              </div>
            </div>

            <!-- Stats/Brief Card -->
            <div class="bg-primary-container text-on-primary-container p-lg rounded-xl shadow-md relative overflow-hidden">
              <div class="relative z-10">
                <h5 class="font-label-md text-label-md uppercase opacity-80 mb-sm">Comisión Estimada</h5>
                <p class="font-metric-xl text-metric-xl">$12.450,00</p>
                <div class="mt-md flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                  <span class="material-symbols-outlined text-sm">trending_up</span>
                  <span class="font-label-md text-label-md">+5% vs. Renov. anterior</span>
                </div>
              </div>
              <span class="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] opacity-10 rotate-12">account_balance_wallet</span>
            </div>
          </div>
        </div>
      </main>


    </div>
  `
})
export class SeguimientoDetalleComponent {
}
