import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (isLoading()) {

    <div class="text-on-surface font-body-md bg-background min-h-screen">
      <!-- Main Content Area -->
      <main class="min-h-screen px-container-margin pb-24 md:pb-8 pt-lg">
        <!-- Dashboard Header / Welcome Skeleton -->
        <div class="mb-xl">
          <div class="skeleton h-8 w-48 rounded-lg mb-sm"></div>
          <div class="skeleton h-4 w-64 rounded-lg"></div>
        </div>

        <!-- KPI Bento Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
          <!-- Card: Premio Administrado -->
          <div class="bg-surface-container-lowest p-md rounded-xl card-accent-blue shadow-sm">
            <div class="flex justify-between items-start mb-sm">
              <div class="skeleton h-4 w-32 rounded-md"></div>
              <div class="skeleton h-6 w-12 rounded-full"></div>
            </div>
            <div class="skeleton h-10 w-40 rounded-lg mb-xs"></div>
            <div class="skeleton h-4 w-24 rounded-md"></div>
          </div>

          <!-- Card: Clientes -->
          <div class="bg-surface-container-lowest p-md rounded-xl card-accent-green shadow-sm">
            <div class="flex justify-between items-start mb-sm">
              <div class="skeleton h-4 w-24 rounded-md"></div>
              <div class="skeleton h-6 w-12 rounded-full"></div>
            </div>
            <div class="skeleton h-10 w-24 rounded-lg mb-xs"></div>
            <div class="skeleton h-4 w-32 rounded-md"></div>
          </div>

          <!-- Card: Pólizas con Deuda -->
          <div class="bg-surface-container-lowest p-md rounded-xl card-accent-red shadow-sm">
            <div class="flex justify-between items-start mb-sm">
              <div class="skeleton h-4 w-40 rounded-md"></div>
              <span class="material-symbols-outlined text-error" style="font-variation-settings: 'FILL' 1;">warning</span>
            </div>
            <div class="skeleton h-10 w-16 rounded-lg mb-xs"></div>
            <div class="skeleton h-4 w-48 rounded-md"></div>
          </div>
        </div>

        <!-- Charts and Lists Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <!-- Distribution Chart Placeholder -->
          <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant">
            <div class="flex items-center justify-between mb-lg">
              <div class="skeleton h-6 w-48 rounded-md"></div>
              <div class="skeleton h-6 w-6 rounded-full"></div>
            </div>
            <div class="flex flex-col items-center justify-center py-xl">
              <!-- Circular Chart Skeleton -->
              <div class="relative w-48 h-48 rounded-full border-[16px] border-surface-container-low flex items-center justify-center">
                <div class="skeleton h-12 w-24 rounded-lg"></div>
              </div>
              <!-- Legend Skeletons -->
              <div class="grid grid-cols-2 gap-md mt-lg w-full">
                <div class="flex items-center gap-sm">
                  <div class="skeleton w-3 h-3 rounded-full"></div>
                  <div class="skeleton h-4 w-20 rounded-md"></div>
                </div>
                <div class="flex items-center gap-sm">
                  <div class="skeleton w-3 h-3 rounded-full"></div>
                  <div class="skeleton h-4 w-20 rounded-md"></div>
                </div>
                <div class="flex items-center gap-sm">
                  <div class="skeleton w-3 h-3 rounded-full"></div>
                  <div class="skeleton h-4 w-20 rounded-md"></div>
                </div>
                <div class="flex items-center gap-sm">
                  <div class="skeleton w-3 h-3 rounded-full"></div>
                  <div class="skeleton h-4 w-20 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Companies List Placeholder -->
          <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant">
            <div class="flex items-center justify-between mb-lg">
              <div class="skeleton h-6 w-40 rounded-md"></div>
              <div class="skeleton h-4 w-16 rounded-md"></div>
            </div>
            <div class="space-y-md">
              <!-- Company Row 1 -->
              <div class="flex items-center justify-between p-sm border-b border-surface-container">
                <div class="flex items-center gap-md">
                  <div class="skeleton w-10 h-10 rounded-lg"></div>
                  <div class="space-y-xs">
                    <div class="skeleton h-4 w-32 rounded-md"></div>
                    <div class="skeleton h-3 w-20 rounded-md"></div>
                  </div>
                </div>
                <div class="skeleton h-5 w-16 rounded-md"></div>
              </div>
              <!-- Company Row 2 -->
              <div class="flex items-center justify-between p-sm border-b border-surface-container">
                <div class="flex items-center gap-md">
                  <div class="skeleton w-10 h-10 rounded-lg"></div>
                  <div class="space-y-xs">
                    <div class="skeleton h-4 w-24 rounded-md"></div>
                    <div class="skeleton h-3 w-16 rounded-md"></div>
                  </div>
                </div>
                <div class="skeleton h-5 w-16 rounded-md"></div>
              </div>
              <!-- Company Row 3 -->
              <div class="flex items-center justify-between p-sm border-b border-surface-container">
                <div class="flex items-center gap-md">
                  <div class="skeleton w-10 h-10 rounded-lg"></div>
                  <div class="space-y-xs">
                    <div class="skeleton h-4 w-36 rounded-md"></div>
                    <div class="skeleton h-3 w-24 rounded-md"></div>
                  </div>
                </div>
                <div class="skeleton h-5 w-16 rounded-md"></div>
              </div>
              <!-- Company Row 4 -->
              <div class="flex items-center justify-between p-sm">
                <div class="flex items-center gap-md">
                  <div class="skeleton w-10 h-10 rounded-lg"></div>
                  <div class="space-y-xs">
                    <div class="skeleton h-4 w-28 rounded-md"></div>
                    <div class="skeleton h-3 w-20 rounded-md"></div>
                  </div>
                </div>
                <div class="skeleton h-5 w-16 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity Skeleton -->
        <div class="mt-lg bg-surface-container-lowest p-lg rounded-xl border border-outline-variant">
          <div class="skeleton h-6 w-32 rounded-md mb-lg"></div>
          <div class="space-y-md">
            <div class="flex items-center gap-md p-xs">
              <div class="skeleton w-2 h-2 rounded-full"></div>
              <div class="skeleton h-4 flex-1 rounded-md"></div>
              <div class="skeleton h-4 w-12 rounded-md"></div>
            </div>
            <div class="flex items-center gap-md p-xs">
              <div class="skeleton w-2 h-2 rounded-full"></div>
              <div class="skeleton h-4 flex-1 rounded-md"></div>
              <div class="skeleton h-4 w-12 rounded-md"></div>
            </div>
            <div class="flex items-center gap-md p-xs">
              <div class="skeleton w-2 h-2 rounded-full"></div>
              <div class="skeleton h-4 flex-1 rounded-md"></div>
              <div class="skeleton h-4 w-12 rounded-md"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
    } @else if (isError()) {

    <div class="bg-background text-on-background min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      <!-- Main Content Canvas -->
      <main class="flex-1 flex flex-col items-center justify-center p-md lg:p-xl mb-16 md:mb-0 bg-background relative w-full overflow-hidden">


        <!-- Background Decoration (Subtle Gradients) -->
        <div class="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div class="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-surface-container-high rounded-full blur-[100px]"></div>
          <div class="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-primary-fixed-dim rounded-full blur-[100px]"></div>
        </div>

        <!-- Error Container -->
        <div class="max-w-xl w-full flex flex-col items-center text-center z-10 mt-12 md:mt-0">
          <!-- Illustration / Icon Area -->
          <div class="relative mb-lg">
            <!-- Inner glow effect -->
            <div class="absolute inset-0 bg-error-container blur-2xl opacity-40 rounded-full animate-pulse"></div>
            <div class="relative bg-surface-container-lowest border border-error-container shadow-lg rounded-full p-xl flex items-center justify-center error-shake" [class.animate-none]="isRetrying()">
              <span class="material-symbols-outlined text-[80px] text-error" style="font-variation-settings: 'FILL' 1;">error</span>
            </div>
          </div>

          <!-- Error Messaging -->
          <div class="space-y-md mb-xl">
            <h2 class="font-headline-lg text-headline-lg text-on-background">¡Vaya! Algo salió mal</h2>
            <p class="font-body-lg text-on-surface-variant px-md">
              No pudimos sincronizar los datos de tu cartera de seguros en este momento. Por favor, verifica tu conexión o intenta nuevamente.
            </p>
            <div class="inline-flex items-center gap-sm px-md py-xs bg-error-container text-on-error-container rounded-full text-label-md font-label-md">
              <span class="material-symbols-outlined text-sm">wifi_off</span>
              Código de error: ERR_DATA_FETCH_TIMEOUT
            </div>
          </div>

          <!-- Action Area -->
          <div class="flex flex-col sm:flex-row items-center gap-md">
            <button (click)="simulateReload()" [disabled]="isRetrying()" class="flex items-center gap-sm px-xl py-md bg-primary text-on-primary rounded-xl font-headline-sm text-headline-sm shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed">
              <span class="material-symbols-outlined" [class.animate-spin]="isRetrying()">refresh</span>
              <span>{{ isRetrying() ? 'Cargando...' : 'Reintentar carga' }}</span>
            </button>
            <button class="px-xl py-md bg-transparent border border-outline-variant text-primary rounded-xl font-headline-sm text-headline-sm hover:bg-surface-container-low transition-colors">
              Contactar soporte
            </button>
          </div>

          <!-- Footer Details (Optional context) -->
          <p class="mt-xl font-body-sm text-on-surface-variant opacity-60">
            Último intento: hace 2 minutos
          </p>
        </div>
      </main>
    </div>

    } @else {

    <div class="font-body-md text-on-background min-h-screen bg-background flex flex-col">
      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col pb-6 md:pb-lg">
        <!-- TopAppBar -->
        <header class="docked full-width top-0 sticky z-40 bg-surface dark:bg-on-background border-b border-outline-variant flex justify-between items-center px-md py-sm w-full">
          <div class="flex items-center gap-md">
            <h1 class="font-headline-sm-mobile text-headline-sm-mobile md:font-headline-sm md:text-headline-sm font-black text-primary">Métricas de Gestión</h1>
          </div>
          <div class="flex items-center gap-sm">
            <button class="hidden md:flex p-xs text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all cursor-pointer">
              <span class="material-symbols-outlined">search</span>
            </button>
            <div routerLink="/perfil" class="w-8 h-8 rounded-full border-2 border-primary-fixed overflow-hidden cursor-pointer">
              <img class="w-full h-full object-cover" alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTIabKB45fJfFZT8sg1aLxduEgN7AhCOFzIsvmDSkF1oQKBmdkCcCBoTSyCSChn6hodGbZI9ruZjissrJ5QsF3IDVRtjA6J_W2g7JLX0xFKsM1ikBVlcQ9r38sAYjxHsXHIZPTgie5K_XSZduWWYNgACxqSIw2gLDCzotWC2Dnob-KctR1SKP16Bl51hNH5aWcclyiekEm3v5yGCDSQ9gi7Dg_7O1eT0OBqbZcPDCORCLDN0MRj7JEYCCNBeurMU-BOkLdAi8BUPh0">
            </div>
            
            <!-- Botón de Cerrar Sesión Temporal -->
            <button routerLink="/login" class="hidden md:flex items-center gap-xs ml-2 p-xs text-error hover:bg-error-container rounded-full transition-all cursor-pointer" title="Cerrar Sesión">
              <span class="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        @if (role() === 'admin') {
          <!-- VISTA ADMINISTRADOR -->
          <section class="p-container-margin md:p-lg space-y-lg">
            <!-- Greeting Admin -->
            <div class="flex justify-between items-start w-full mb-lg">
              <div class="flex flex-col">
                <h2 class="font-headline-md text-headline-md text-on-surface">Hola, {{ userName() || 'Admin' }}</h2>
                <p class="font-body-sm text-body-sm text-on-surface-variant">Resumen Global de la Plataforma (Vista Admin).</p>
              </div>
            </div>

            <!-- Admin Metrics Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-md">
              <div class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant metric-card-accent-blue shadow-sm flex flex-col justify-between hover:scale-[0.98] transition-transform">
                <div>
                  <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Productores Activos</p>
                  <h2 class="font-metric-xl text-metric-xl text-primary">124</h2>
                </div>
                <div class="flex items-center gap-xs bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full font-bold text-xs self-start mt-sm">
                  <span class="material-symbols-outlined text-sm">trending_up</span>
                  <span>+12%</span>
                </div>
              </div>

              <div class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant metric-card-accent-green shadow-sm flex flex-col justify-between hover:scale-[0.98] transition-transform">
                <div>
                  <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Cartera Global Administrada</p>
                  <h2 class="font-metric-xl text-metric-xl text-on-surface">$1.2B</h2>
                </div>
              </div>

              <div class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant metric-card-accent-tertiary shadow-sm flex flex-col justify-between hover:scale-[0.98] transition-transform">
                <div>
                  <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Tickets de Mesa Operativa</p>
                  <h2 class="font-metric-xl text-metric-xl text-tertiary">42</h2>
                </div>
                <div class="flex items-center gap-xs mt-sm">
                  <span class="material-symbols-outlined text-tertiary text-sm">view_kanban</span>
                  <span class="text-tertiary font-bold text-xs uppercase">15 Pendientes</span>
                </div>
              </div>
            </div>
          </section>
        } @else {
          <!-- VISTA PAS (Productor) -->
          <section class="p-container-margin md:p-lg space-y-lg">
          <!-- Greeting -->
          <div class="flex justify-between items-start w-full mb-lg">
            <div class="flex flex-col">
              <h2 class="font-headline-md text-headline-md text-on-surface">Hola, {{ userName() || 'Agente' }}</h2>
              <p class="font-body-sm text-body-sm text-on-surface-variant">Aquí tienes el resumen de tu cartera hoy.</p>
            </div>
            <button routerLink="/asistente" class="flex items-center gap-sm bg-primary text-on-primary px-md py-sm rounded-lg font-bold text-sm hover:bg-primary-container transition-colors shadow-sm cursor-pointer">
              <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
              <span class="hidden md:inline">Multicotizador</span>
            </button>
          </div>

          <!-- Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
            <!-- Premio Administrado -->
            <div routerLink="/premio" class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant metric-card-accent-blue shadow-sm lg:col-span-2 flex flex-col justify-between hover:scale-[0.98] transition-transform cursor-pointer">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Premio Administrado</p>
                  <h2 class="font-metric-xl text-metric-xl text-primary">$13.5M</h2>
                </div>
                <span class="material-symbols-outlined text-primary-fixed-dim text-4xl opacity-50">account_balance_wallet</span>
                <div class="flex items-center gap-xs bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full font-bold text-xs">
                  <span class="material-symbols-outlined text-sm">trending_up</span>
                  <span>+4.2%</span>
                </div>
              </div>
              <p class="font-body-sm text-body-sm text-outline mt-sm">Cartera Total Vigente</p>
            </div>

            <!-- Clientes Activos -->
            <div class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant metric-card-accent-blue shadow-sm flex flex-col justify-between hover:scale-[0.98] transition-transform cursor-pointer">
              <div>
                <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Clientes Activos</p>
                <h2 class="font-metric-xl text-metric-xl text-on-surface">8</h2>
              </div>
              <div class="flex gap-xs mt-sm overflow-hidden">
                <div class="w-6 h-6 rounded-full bg-primary-fixed"></div>
                <div class="w-6 h-6 rounded-full bg-secondary-fixed"></div>
                <div class="w-6 h-6 rounded-full bg-tertiary-fixed"></div>
                <div class="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold">+5</div>
              </div>
            </div>

            <!-- Pólizas con Deuda/Rechazo -->
            <div class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant metric-card-accent-red shadow-sm flex flex-col justify-between hover:scale-[0.98] transition-transform cursor-pointer">
              <div>
                <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Pólizas con Deuda</p>
                <h2 class="font-metric-xl text-metric-xl text-error">12</h2>
              </div>
              <div class="flex items-center gap-xs mt-sm">
                <span class="material-symbols-outlined text-error text-sm">payments</span>
                <span class="text-error font-bold text-xs uppercase">En deuda</span>
              </div>
            </div>
          </div>

          <!-- Solicitudes Quick Actions -->
          <div class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm w-full mb-md">
            <h3 class="font-label-md text-on-surface-variant mb-md font-bold uppercase tracking-widest text-[11px]">Solicitudes</h3>
            <div class="flex flex-col md:flex-row gap-sm w-full">
              <button class="flex-1 py-sm px-md rounded-lg border border-primary text-primary font-label-md font-bold hover:bg-primary-container hover:text-on-primary-container hover:border-primary-container transition-colors">
                Cotización/Emisión
              </button>
              <button routerLink="/endoso" class="flex-1 py-sm px-md rounded-lg border border-primary text-primary font-label-md font-bold hover:bg-primary-container hover:text-on-primary-container hover:border-primary-container transition-colors cursor-pointer">
                Endoso/Operativo
              </button>
              <button class="flex-1 py-sm px-md rounded-lg border border-primary text-primary font-label-md font-bold hover:bg-primary-container hover:text-on-primary-container hover:border-primary-container transition-colors">
                Siniestro
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-md">
            <!-- Distribución por Ramos -->
            <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col">
              <h3 class="font-headline-sm text-headline-sm mb-lg">Distribución por Ramos</h3>
              <div class="space-y-md">
                <div>
                  <div class="flex justify-between mb-xs">
                    <span class="font-label-md text-label-md">Automotor</span>
                    <span class="font-body-sm text-body-sm text-primary font-bold">55%</span>
                  </div>
                  <div class="w-full bg-surface-container rounded-full h-2">
                    <div class="bg-primary h-2 rounded-full" style="width: 55%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-xs">
                    <span class="font-label-md text-label-md">Hogar</span>
                    <span class="font-body-sm text-body-sm text-secondary font-bold">25%</span>
                  </div>
                  <div class="w-full bg-surface-container rounded-full h-2">
                    <div class="bg-secondary h-2 rounded-full" style="width: 25%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-xs">
                    <span class="font-label-md text-label-md">Vida</span>
                    <span class="font-body-sm text-body-sm text-tertiary font-bold">15%</span>
                  </div>
                  <div class="w-full bg-surface-container rounded-full h-2">
                    <div class="bg-tertiary h-2 rounded-full" style="width: 15%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-xs">
                    <span class="font-label-md text-label-md">Otros</span>
                    <span class="font-body-sm text-body-sm text-on-surface-variant font-bold">5%</span>
                  </div>
                  <div class="w-full bg-surface-container rounded-full h-2">
                    <div class="bg-outline h-2 rounded-full" style="width: 5%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pólizas por Compañía -->
            <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col">
              <h3 class="font-headline-sm text-headline-sm mb-lg">Pólizas por Compañía</h3>
              <div class="grid grid-cols-1 gap-sm">
                <div routerLink="/compania" class="flex items-center justify-between p-md bg-surface-container-low rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-md">
                    <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-outline-variant overflow-hidden">
                      <span class="material-symbols-outlined text-primary">business</span>
                    </div>
                    <div>
                      <p class="font-label-md text-label-md">Allianz</p>
                      <p class="text-xs text-on-surface-variant">42 pólizas</p>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </div>
                <div class="flex items-center justify-between p-md bg-surface-container-low rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-md">
                    <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-outline-variant overflow-hidden">
                      <span class="material-symbols-outlined text-error">business</span>
                    </div>
                    <div>
                      <p class="font-label-md text-label-md">Mapfre</p>
                      <p class="text-xs text-on-surface-variant">28 pólizas</p>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </div>
                <div class="flex items-center justify-between p-md bg-surface-container-low rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-md">
                    <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-outline-variant overflow-hidden">
                      <span class="material-symbols-outlined text-secondary">business</span>
                    </div>
                    <div>
                      <p class="font-label-md text-label-md">Zurich</p>
                      <p class="text-xs text-on-surface-variant">15 pólizas</p>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bento Section: Activity -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-md">
            <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col lg:col-span-3">
              <h3 class="font-headline-sm text-headline-sm mb-md">Próximas a Renovar</h3>
              <div class="space-y-md">
                <div class="flex items-center gap-md border-b border-surface-container pb-sm">
                  <div class="bg-error-container text-on-error-container w-10 h-10 rounded flex items-center justify-center font-bold">12</div>
                  <div>
                    <p class="font-label-md text-label-md">Póliza #88219</p>
                    <p class="text-xs text-on-surface-variant">Cliente: Juan Pérez</p>
                  </div>
                </div>
                <div class="flex items-center gap-md border-b border-surface-container pb-sm">
                  <div class="bg-surface-container text-on-surface-variant w-10 h-10 rounded flex items-center justify-center font-bold">15</div>
                  <div>
                    <p class="font-label-md text-label-md">Póliza #99312</p>
                    <p class="text-xs text-on-surface-variant">Cliente: Maria Gomez</p>
                  </div>
                </div>
                <button class="w-full py-sm border border-primary text-primary font-bold rounded-lg text-sm mt-auto hover:bg-primary/5 transition-colors cursor-pointer" onclick="alert('Para otras cotizaciones, por favor diríjase a Solicitudes')">
                  Ver Calendario Completo
                </button>
              </div>
              </div>
            </div>
          </div>
        </section>
        }
      </main>
    </div>
  
    }
`,
  styles: [`
    .error-shake {
      animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }

    .skeleton {
      background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite linear;
    }

    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .card-accent-blue { border-left: 4px solid #0058be; }
    .card-accent-green { border-left: 4px solid #006c49; }
    .card-accent-red { border-left: 4px solid #ba1a1a; }

    .metric-card-accent-blue { border-left: 4px solid #0058be; }
    .metric-card-accent-green { border-left: 4px solid #006c49; }
    .metric-card-accent-red { border-left: 4px solid #ba1a1a; }
    .metric-card-accent-tertiary { border-left: 4px solid #4648d4; }
  
`]
})
export class DashboardComponent implements OnInit {
  isLoading = signal(true);
  isError = signal(false);
  isRetrying = signal(false);

  private authService = inject(AuthService);
  role = computed(() => this.authService.currentUser()?.role || 'pas');
  userName = computed(() => {
    const user = this.authService.currentUser();
    if (!user || !user.name) return '';
    // Optional: Just grab the first name
    return user.name.split(' ')[0];
  });

  ngOnInit() {
    this.initialLoadSequence();
  }

  initialLoadSequence() {
    this.isLoading.set(true);
    this.isError.set(false);
    
    // Mostramos skeleton 2 segs y simulamos carga
    setTimeout(() => {
      this.isLoading.set(false);
      // Solo mostramos error si no hay internet
      if (!navigator.onLine) {
        this.isError.set(true);
      } else {
        this.isError.set(false);
      }
    }, 2000);
  }

  simulateReload() {
    this.isRetrying.set(true);
    
    // Mostramos estado de carga en el boton y al 1.5s cargamos dashboard final (exitoso)
    setTimeout(() => {
      this.isRetrying.set(false);
      this.isError.set(false);
      this.isLoading.set(false);
    }, 1500);
  }
}
