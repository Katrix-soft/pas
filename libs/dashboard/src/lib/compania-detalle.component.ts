import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-compania-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="font-body-md text-on-surface bg-surface min-h-screen">
      <!-- TopAppBar -->
      <header class="docked full-width top-0 z-40 bg-surface border-b border-outline-variant flex justify-between items-center px-md py-sm w-full fixed">
        <div class="flex items-center gap-md">
          <button routerLink="/dashboard" class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors duration-200 cursor-pointer">
            <span class="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 class="font-headline-md text-headline-md text-primary font-bold">Allianz</h1>
        </div>
        <div class="flex items-center gap-sm">
          <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
            <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6OJPZ-O7azNik1d_0fX-Jqhy4bSCRokTDFJkVzns70LYx5uMsZJUeDF8Zrg9kPACdwvXRB266fghemKdAE6ZYIaEzh9TGAauGVHsQ2r43wPGgdkjycVbPij3ypwyvNrn6IZLL_fjI65VlZ8GaqxX5-C4k_ub1j_E8cW6s4u0w3cKd6l3HNJqco-jzF8JFgxg-rl4YvyypSrVjiDql_cR48R1zPCkChL2YiZ48vWTQDdrsw59NBuY4wGvU5_jNX3rujmZOxzEeCPXw">
          </div>
        </div>
      </header>

      <!-- Main Content Canvas -->
      <main class="pt-24 pb-24 px-container-margin max-w-7xl mx-auto space-y-lg">
        <!-- Company Hero Card -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col md:flex-row items-center md:items-start gap-lg shadow-sm hover:shadow-md transition-shadow">
          <div class="w-24 h-24 bg-surface-container flex items-center justify-center rounded-lg border border-outline-variant p-sm shrink-0">
            <img class="w-full h-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDEGJG0jxqzrxBqvPB0bs1awtSuZtXDYGPuPdHRv6MUevhJ3OChTXutYt__NMH275ey5YkjKNI2GwbuSuXzZRYtWiemhC-YWxKT8-4cGvJPAQuQJmtF3-8CKMJBHsPrsLheVRIiyufm27OR0754BKluI1-NYVSLuFuKi0ak3FaFNtL2fo4x-bKECKb-iF58YOwhYr66cwHaEkq33iLxVNv9MVdrIkHj1eponUZW3zZlTFsfjCibXNAmj2iqdsd9t2j4eunJhaGBpF4">
          </div>
          <div class="flex-grow text-center md:text-left">
            <h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">Allianz Seguros</h2>
            <p class="font-body-md text-on-surface-variant mb-md">Compañía Líder en Riesgos Patrimoniales</p>
            <div class="flex flex-wrap justify-center md:justify-start gap-md">
              <div class="flex flex-col">
                <span class="font-label-md text-label-md text-on-surface-variant uppercase">Pólizas Totales</span>
                <span class="font-headline-md text-headline-md text-primary">42</span>
              </div>
              <div class="w-px h-10 bg-outline-variant hidden md:block"></div>
              <div class="flex flex-col">
                <span class="font-label-md text-label-md text-on-surface-variant uppercase">Prima Administrada</span>
                <span class="font-headline-md text-headline-md text-secondary">$3.2M</span>
              </div>
            </div>
          </div>
          <div class="flex gap-sm">
            <!-- Boton de accion placeholder original estaba vacio -->
            <button class="bg-primary text-on-primary font-bold px-lg py-sm rounded-lg transition-colors hover:bg-primary-container hover:text-on-primary-container">Contactar</button>
          </div>
        </section>

        <!-- KPI Bento Grid -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-md">
          <!-- Retention Rate -->
          <div class="bg-surface-container-lowest border-l-4 border-primary border-t border-r border-b border-outline-variant rounded-lg p-md shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-sm">
              <span class="material-symbols-outlined text-primary bg-primary-container p-xs rounded-full">loop</span>
              <span class="font-label-md text-label-md text-secondary">+2.4%</span>
            </div>
            <span class="font-metric-xl text-metric-xl text-on-surface">92%</span>
            <p class="font-body-sm text-on-surface-variant">Retention Rate</p>
          </div>
          <!-- Loss Ratio -->
          <div class="bg-surface-container-lowest border-l-4 border-error border-t border-r border-b border-outline-variant rounded-lg p-md shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-sm">
              <span class="material-symbols-outlined text-error bg-error-container p-xs rounded-full">trending_up</span>
              <span class="font-label-md text-label-md text-error">-5.1%</span>
            </div>
            <span class="font-metric-xl text-metric-xl text-on-surface">45%</span>
            <p class="font-body-sm text-on-surface-variant">Loss Ratio (Siniestralidad)</p>
          </div>
          <!-- New Business -->
          <div class="bg-surface-container-lowest border-l-4 border-secondary border-t border-r border-b border-outline-variant rounded-lg p-md shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-sm">
              <span class="material-symbols-outlined text-secondary bg-secondary-container p-xs rounded-full">add_business</span>
              <span class="font-label-md text-label-md text-secondary">Target Met</span>
            </div>
            <span class="font-metric-xl text-metric-xl text-on-surface">08</span>
            <p class="font-body-sm text-on-surface-variant">Nuevos Negocios (Mes)</p>
          </div>
        </section>

        <!-- Charts and Details Grid -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <!-- Policy Distribution by Branch -->
          <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 class="font-headline-sm text-headline-sm text-on-surface mb-lg">Distribución por Ramo</h3>
            <div class="space-y-md">
              <!-- Auto -->
              <div class="space-y-xs">
                <div class="flex justify-between font-label-md text-label-md">
                  <span class="">Automotor</span>
                  <span class="text-on-surface">25 Pólizas</span>
                </div>
                <div class="w-full bg-surface-container rounded-full h-2">
                  <div class="bg-primary h-2 rounded-full" style="width: 60%"></div>
                </div>
              </div>
              <!-- Home -->
              <div class="space-y-xs">
                <div class="flex justify-between font-label-md text-label-md">
                  <span class="">Hogar / Combinado Familiar</span>
                  <span class="text-on-surface">10 Pólizas</span>
                </div>
                <div class="w-full bg-surface-container rounded-full h-2">
                  <div class="bg-secondary h-2 rounded-full" style="width: 24%"></div>
                </div>
              </div>
              <!-- Life -->
              <div class="space-y-xs">
                <div class="flex justify-between font-label-md text-label-md">
                  <span class="">Vida Individual</span>
                  <span class="text-on-surface">7 Pólizas</span>
                </div>
                <div class="w-full bg-surface-container rounded-full h-2">
                  <div class="bg-tertiary h-2 rounded-full" style="width: 16%"></div>
                </div>
              </div>
            </div>
            <button class="mt-lg w-full py-sm text-primary font-bold border border-primary rounded-lg hover:bg-primary-container transition-colors cursor-pointer">
              Ver Informe Completo
            </button>
          </div>

          <!-- Recent Renewals -->
          <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <h3 class="font-headline-sm text-headline-sm text-on-surface mb-lg">Próximas Renovaciones</h3>
            <div class="flex-grow space-y-sm overflow-y-auto pr-sm max-h-[300px]">
              <!-- Item 1 -->
              <div class="flex items-center justify-between p-sm hover:bg-surface-container-low rounded-lg transition-colors border border-transparent hover:border-outline-variant cursor-pointer">
                <div class="flex items-center gap-md">
                  <div class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary">person</span>
                  </div>
                  <div>
                    <p class="font-body-md font-semibold text-on-surface">Eduardo Martínez</p>
                    <p class="font-body-sm text-on-surface-variant">Pol: 0092-334912</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="bg-secondary-container text-on-secondary-container text-xs px-sm py-xs rounded-full font-bold">12 JUN</span>
                </div>
              </div>
              <!-- Item 2 -->
              <div class="flex items-center justify-between p-sm hover:bg-surface-container-low rounded-lg transition-colors border border-transparent hover:border-outline-variant cursor-pointer">
                <div class="flex items-center gap-md">
                  <div class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary">person</span>
                  </div>
                  <div>
                    <p class="font-body-md font-semibold text-on-surface">Logística Sur S.A.</p>
                    <p class="font-body-sm text-on-surface-variant">Pol: 0092-441029</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="bg-secondary-container text-on-secondary-container text-xs px-sm py-xs rounded-full font-bold">15 JUN</span>
                </div>
              </div>
              <!-- Item 3 -->
              <div class="flex items-center justify-between p-sm hover:bg-surface-container-low rounded-lg transition-colors border border-transparent hover:border-outline-variant cursor-pointer">
                <div class="flex items-center gap-md">
                  <div class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary">person</span>
                  </div>
                  <div>
                    <p class="font-body-md font-semibold text-on-surface">María Belén Ortega</p>
                    <p class="font-body-sm text-on-surface-variant">Pol: 0092-882190</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="bg-error-container text-on-error-container text-xs px-sm py-xs rounded-full font-bold">HOY</span>
                </div>
              </div>
              <!-- Item 4 -->
              <div class="flex items-center justify-between p-sm hover:bg-surface-container-low rounded-lg transition-colors border border-transparent hover:border-outline-variant cursor-pointer">
                <div class="flex items-center gap-md">
                  <div class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary">person</span>
                  </div>
                  <div>
                    <p class="font-body-md font-semibold text-on-surface">Carlos D'Amico</p>
                    <p class="font-body-sm text-on-surface-variant">Pol: 0092-110022</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="bg-secondary-container text-on-secondary-container text-xs px-sm py-xs rounded-full font-bold">18 JUN</span>
                </div>
              </div>
              <!-- Item 5 -->
              <div class="flex items-center justify-between p-sm hover:bg-surface-container-low rounded-lg transition-colors border border-transparent hover:border-outline-variant cursor-pointer">
                <div class="flex items-center gap-md">
                  <div class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary">person</span>
                  </div>
                  <div>
                    <p class="font-body-md font-semibold text-on-surface">Inmobiliaria Central</p>
                    <p class="font-body-sm text-on-surface-variant">Pol: 0092-557612</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="bg-secondary-container text-on-secondary-container text-xs px-sm py-xs rounded-full font-bold">20 JUN</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Actions / Additional Stats -->
        <section class="bg-surface-container-low rounded-xl p-lg flex flex-wrap gap-md justify-around items-center">
          <div class="flex flex-col items-center">
            <span class="font-label-md text-label-md text-on-surface-variant mb-xs">Crecimiento Anual</span>
            <span class="font-headline-sm text-headline-sm text-secondary">+12.5%</span>
          </div>
          <div class="h-8 w-px bg-outline-variant"></div>
          <div class="flex flex-col items-center">
            <span class="font-label-md text-label-md text-on-surface-variant mb-xs">Comisiones Pendientes</span>
            <span class="font-headline-sm text-headline-sm text-primary">$124.500</span>
          </div>
          <div class="h-8 w-px bg-outline-variant"></div>
          <div class="flex flex-col items-center">
            <span class="font-label-md text-label-md text-on-surface-variant mb-xs">Siniestros Abiertos</span>
            <span class="font-headline-sm text-headline-sm text-error">4</span>
          </div>
        </section>
      </main>

      <!-- BottomNavBar -->
      <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-surface border-t border-outline-variant px-container-margin pb-safe h-16 shadow-lg md:hidden">
        <button routerLink="/dashboard" class="flex flex-col items-center justify-center text-on-surface-variant px-md py-xs hover:text-primary transition-colors duration-150 cursor-pointer">
          <span class="material-symbols-outlined">dashboard</span>
          <span class="font-label-md text-label-md">Dashboard</span>
        </button>
        <button class="flex flex-col items-center justify-center text-on-surface-variant px-md py-xs hover:text-primary transition-colors duration-150 cursor-pointer">
          <span class="material-symbols-outlined">group</span>
          <span class="font-label-md text-label-md">Clients</span>
        </button>
        <!-- ACTIVE TAB: Company (Métricas context within company) -->
        <button class="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-md py-xs scale-100 transition-transform duration-150 cursor-pointer">
          <span class="material-symbols-outlined">business</span>
          <span class="font-label-md text-label-md">Company</span>
        </button>
        <button class="flex flex-col items-center justify-center text-on-surface-variant px-md py-xs hover:text-primary transition-colors duration-150 cursor-pointer">
          <span class="material-symbols-outlined">description</span>
          <span class="font-label-md text-label-md">Policies</span>
        </button>
      </nav>
    </div>
`,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .bento-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
    }
    @media (max-width: 768px) {
        .bento-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
`]
})
export class CompaniaDetalleComponent {}
