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
            <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-sm">Cartera Total Vigente</p>
            <h2 class="font-metric-xl text-metric-xl text-primary mb-xs">$13.5M</h2>
            <div class="flex items-center gap-1 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full">
              <span class="material-symbols-outlined text-[18px]">trending_up</span>
              <span class="font-label-md text-label-md">+4.2% este mes</span>
            </div>
          </div>
        </section>

        <!-- Chart Section: Monthly Evolution -->
        <section class="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
          <div class="flex justify-between items-center mb-lg">
            <h3 class="font-headline-sm text-headline-sm text-on-surface">Evolución Mensual</h3>
            <span class="font-label-md text-label-md text-primary font-bold">Últimos 6 Meses</span>
          </div>
          <div class="h-48 flex items-end justify-between gap-2 pt-4 relative">
            <!-- Grid Lines -->
            <div class="absolute inset-x-0 top-4 border-t border-surface-container-high"></div>
            <div class="absolute inset-x-0 top-1/2 border-t border-surface-container-high"></div>
            <!-- Bars -->
            <div class="flex-1 flex flex-col items-center gap-2 group">
              <div class="chart-bar w-full max-w-[40px] bg-primary-fixed rounded-t-lg transition-all group-hover:bg-primary-container" style="--target-height: 40%; height: 40%;"></div>
              <span class="font-label-md text-label-md text-on-surface-variant">Ene</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2 group">
              <div class="chart-bar w-full max-w-[40px] bg-primary-fixed rounded-t-lg transition-all group-hover:bg-primary-container" style="--target-height: 55%; height: 55%;"></div>
              <span class="font-label-md text-label-md text-on-surface-variant">Feb</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2 group">
              <div class="chart-bar w-full max-w-[40px] bg-primary-fixed rounded-t-lg transition-all group-hover:bg-primary-container" style="--target-height: 70%; height: 70%;"></div>
              <span class="font-label-md text-label-md text-on-surface-variant">Mar</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2 group">
              <div class="chart-bar w-full max-w-[40px] bg-primary-fixed rounded-t-lg transition-all group-hover:bg-primary-container" style="--target-height: 65%; height: 65%;"></div>
              <span class="font-label-md text-label-md text-on-surface-variant">Abr</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2 group">
              <div class="chart-bar w-full max-w-[40px] bg-primary-fixed rounded-t-lg transition-all group-hover:bg-primary-container" style="--target-height: 85%; height: 85%;"></div>
              <span class="font-label-md text-label-md text-on-surface-variant">May</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2 group">
              <div class="chart-bar w-full max-w-[40px] bg-primary-container rounded-t-lg transition-all" style="--target-height: 100%; height: 100%;"></div>
              <span class="font-label-md text-label-md text-primary font-bold">Jun</span>
            </div>
          </div>
        </section>

        <!-- Breakdown Section: Distribution by Branch -->
        <section class="space-y-md">
          <h3 class="font-headline-sm text-headline-sm text-on-surface px-1">Distribución por Ramo</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
            <!-- Auto -->
            <div class="bg-surface-container-lowest border-l-4 border-primary rounded-xl border border-outline-variant p-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary">directions_car</span>
                </div>
                <div>
                  <p class="font-body-md font-bold text-on-surface">Automotor</p>
                  <p class="font-label-md text-on-surface-variant">54.8% del total</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-headline-sm font-extrabold text-on-surface">$7.4M</p>
              </div>
            </div>
            <!-- Hogar -->
            <div class="bg-surface-container-lowest border-l-4 border-secondary-fixed-dim rounded-xl border border-outline-variant p-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-secondary">home</span>
                </div>
                <div>
                  <p class="font-body-md font-bold text-on-surface">Hogar</p>
                  <p class="font-label-md text-on-surface-variant">24.4% del total</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-headline-sm font-extrabold text-on-surface">$3.3M</p>
              </div>
            </div>
            <!-- Vida -->
            <div class="bg-surface-container-lowest border-l-4 border-tertiary rounded-xl border border-outline-variant p-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center">
                  <span class="material-symbols-outlined text-tertiary">favorite</span>
                </div>
                <div>
                  <p class="font-body-md font-bold text-on-surface">Vida</p>
                  <p class="font-label-md text-on-surface-variant">14.8% del total</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-headline-sm font-extrabold text-on-surface">$2.0M</p>
              </div>
            </div>
            <!-- Otros -->
            <div class="bg-surface-container-lowest border-l-4 border-outline rounded-xl border border-outline-variant p-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-outline">more_horiz</span>
                </div>
                <div>
                  <p class="font-body-md font-bold text-on-surface">Otros</p>
                  <p class="font-label-md text-on-surface-variant">6.0% del total</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-headline-sm font-extrabold text-on-surface">$0.8M</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Recent Movements Section -->
        <section class="space-y-md">
          <div class="flex justify-between items-center px-1">
            <h3 class="font-headline-sm text-headline-sm text-on-surface">Movimientos Recientes</h3>
            <button class="font-label-md text-primary font-bold hover:underline cursor-pointer">Ver todo</button>
          </div>
          <div class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <!-- Movement 1 -->
            <div class="flex items-center p-md border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
              <div class="w-12 h-12 rounded-lg overflow-hidden bg-surface-container">
                <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB10euZ-YETDnw_wOWxgpzlSNUvQOIhHo1ZZz4m-_6vVAqB5n7TolHp5aWnaXFVyxe5voFWT3yBE8rbLkyojMqqW9zsd006Mz9CTmlIG00eFP7Uhu4lns8Fiwyw8zilPKxi11JK-RvIHoTitj7AoVDkbdllL4qlHBQgf52obJdx1HH-U4iMBd7EJKc1gMiuE0Fs_CileTDMDdW3EdGA_eK84q3Osg_7i2nJUf-tjPHdc1SCgEt68YZqgQ"/>
              </div>
              <div class="ml-md flex-1">
                <p class="font-body-md font-bold text-on-surface">Emisión: Carlos Méndez</p>
                <p class="font-body-sm text-on-surface-variant">Ramo: Automotor • Hoy, 10:24 AM</p>
              </div>
              <div class="text-right">
                <p class="font-body-md font-bold text-secondary">+$145,200</p>
                <span class="inline-block px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase">Éxito</span>
              </div>
            </div>
            <!-- Movement 2 -->
            <div class="flex items-center p-md border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
              <div class="w-12 h-12 rounded-lg overflow-hidden bg-surface-container">
                <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc0syjNsDTZPaX3lQCvIJWmcHLRD9py663qajqHSfmWKo-AxHVdelR57Hj55h31aA0__ALwmX1tNdVmfEo34xv7FUaAtVD26D-89Kd_h15Wav3qnHTkrlkGXbcuk20viWs2ER3BMyPAKCkosTxqTBQyMEBuMK9GEMjRVVngNF-_1cJRn3wvz9yRY7OADYjiyasvd1Xv0207wNnuqz4Qw_3lG7CI-PHRCruqA-6-uM6AU1Vc3PghkoSYw"/>
              </div>
              <div class="ml-md flex-1">
                <p class="font-body-md font-bold text-on-surface">Renovación: Lucía Torres</p>
                <p class="font-body-sm text-on-surface-variant">Ramo: Hogar • Ayer, 4:45 PM</p>
              </div>
              <div class="text-right">
                <p class="font-body-md font-bold text-secondary">+$89,000</p>
                <span class="inline-block px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase">Éxito</span>
              </div>
            </div>
            <!-- Movement 3 -->
            <div class="flex items-center p-md hover:bg-surface-container-low transition-colors cursor-pointer">
              <div class="w-12 h-12 rounded-lg overflow-hidden bg-surface-container">
                <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp60agTCk6Z3i538xxs8A_KsyqvkRSqmF2j69J0zFehX1feTIBi3_yfa3ZcAuvbEXIbmcxF3zExQ_VtA2r_O4m7bT1w4FYg7t1CQVbzmpSUVyZRiE9l7EJc2tp-jKp0QQqOQEtiiVew40s3mcyLi-Dr21T9J_3HS6ATcNX-Vi7SOzXI4l7F1Ex5uGtR51lDV8BPyn-rYltc2-2ICSTp_uxcdXYAMGF4rACOTrtASJcu2IQBmDCyNjGOQ"/>
              </div>
              <div class="ml-md flex-1">
                <p class="font-body-md font-bold text-on-surface">Emisión: Roberto Gómez</p>
                <p class="font-body-sm text-on-surface-variant">Ramo: Vida • 12 Jun, 9:15 AM</p>
              </div>
              <div class="text-right">
                <p class="font-body-md font-bold text-secondary">+$210,000</p>
                <span class="inline-block px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase">Éxito</span>
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
