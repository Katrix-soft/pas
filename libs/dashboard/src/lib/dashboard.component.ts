import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
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
          <section class="p-container-margin md:p-lg space-y-lg pb-24">
            <!-- Welcome Section -->
            <div class="flex justify-between items-end mb-base">
              <div>
                <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Panel Administrativo</h2>
                <p class="text-body-md text-on-surface-variant mt-1">Control centralizado de trámites y tickets operativos.</p>
              </div>
              <span class="text-label-md font-label-md text-primary bg-primary-fixed px-2 py-1 rounded-full">Junio 2026</span>
            </div>

            <!-- Gestión de Tickets (Counters) -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
              <div class="premium-card rounded-xl p-md left-accent-blue cursor-pointer">
                <p class="text-label-md font-label-md text-on-surface-variant mb-1">Abiertos</p>
                <div class="flex justify-between items-end">
                  <h4 class="font-headline-md text-headline-md text-on-surface">124</h4>
                  <span class="material-symbols-outlined text-primary">mail</span>
                </div>
              </div>
              <div class="premium-card rounded-xl p-md left-accent-orange cursor-pointer">
                <p class="text-label-md font-label-md text-on-surface-variant mb-1">En Proceso</p>
                <div class="flex justify-between items-end">
                  <h4 class="font-headline-md text-headline-md text-on-surface">56</h4>
                  <span class="material-symbols-outlined text-tertiary">pending_actions</span>
                </div>
              </div>
              <div class="premium-card rounded-xl p-md left-accent-red cursor-pointer">
                <p class="text-label-md font-label-md text-on-surface-variant mb-1">Falta Doc.</p>
                <div class="flex justify-between items-end">
                  <h4 class="font-headline-md text-headline-md text-on-surface">18</h4>
                  <span class="material-symbols-outlined text-error">description</span>
                </div>
              </div>
              <div class="premium-card rounded-xl p-md left-accent-green cursor-pointer">
                <p class="text-label-md font-label-md text-on-surface-variant mb-1">Cerrados (Hoy)</p>
                <div class="flex justify-between items-end">
                  <h4 class="font-headline-md text-headline-md text-on-surface">42</h4>
                  <span class="material-symbols-outlined text-secondary">check_circle</span>
                </div>
              </div>
            </div>

            <!-- Dashboard Columns: Salud Operativa & Tickets Recientes -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-xl mb-xl">
              <!-- Salud Operativa (Administrative Focus) -->
              <div>
                <div class="flex items-center gap-sm mb-md">
                  <span class="material-symbols-outlined text-error">notification_important</span>
                  <h3 class="font-headline-sm text-headline-sm text-on-surface">Alertas Administrativas</h3>
                </div>
                <div class="space-y-sm">
                  <!-- Administrative Task 1 -->
                  <div class="premium-card rounded-xl p-md bg-error-container/10 border-error/20 flex items-center gap-md cursor-pointer hover:bg-error-container/20">
                    <div class="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
                      <span class="material-symbols-outlined">priority_high</span>
                    </div>
                    <div class="flex-1">
                      <p class="text-body-md font-semibold text-on-surface">8 Endosos Críticos</p>
                      <p class="text-body-sm text-on-surface-variant">Requieren firma digital inmediata para emisión.</p>
                    </div>
                    <span class="material-symbols-outlined text-outline">chevron_right</span>
                  </div>
                  <!-- Administrative Task 2 -->
                  <div class="premium-card rounded-xl p-md bg-secondary-container/10 border-secondary/20 flex items-center gap-md cursor-pointer hover:bg-secondary-container/20">
                    <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                      <span class="material-symbols-outlined">task</span>
                    </div>
                    <div class="flex-1">
                      <p class="text-body-md font-semibold text-on-surface">15 Altas Pendientes</p>
                      <p class="text-body-sm text-on-surface-variant">En espera de validación de identidad técnica.</p>
                    </div>
                    <span class="material-symbols-outlined text-outline">chevron_right</span>
                  </div>
                </div>
              </div>

              <!-- Tickets Recientes/Urgentes -->
              <div>
                <div class="flex justify-between items-center mb-md">
                  <h3 class="font-headline-sm text-headline-sm text-on-surface">Tickets Urgentes</h3>
                  <button class="text-label-md font-bold text-primary hover:underline">Ver todos</button>
                </div>
                <div class="space-y-sm">
                  <!-- Ticket Item 1 -->
                  <div class="premium-card rounded-xl p-md flex flex-col gap-sm">
                    <div class="flex justify-between items-start">
                      <div class="flex items-center gap-2">
                        <span class="text-label-md font-bold bg-surface-container px-2 py-0.5 rounded">#TK-8842</span>
                        <span class="text-label-md font-medium text-tertiary">Siniestro</span>
                      </div>
                      <span class="text-[10px] text-error font-bold flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">schedule</span> 12m ago
                      </span>
                    </div>
                    <p class="text-body-sm text-on-surface font-medium">Falta reporte policial para siniestro de flota.</p>
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-primary-container text-[10px] flex items-center justify-center text-white">MG</div>
                      <p class="text-[12px] text-on-surface-variant">Asignado a: Marta García</p>
                    </div>
                  </div>
                  <!-- Ticket Item 2 -->
                  <div class="premium-card rounded-xl p-md flex flex-col gap-sm">
                    <div class="flex justify-between items-start">
                      <div class="flex items-center gap-2">
                        <span class="text-label-md font-bold bg-surface-container px-2 py-0.5 rounded">#TK-8839</span>
                        <span class="text-label-md font-medium text-primary">Endoso</span>
                      </div>
                      <span class="text-[10px] text-outline font-bold flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">schedule</span> 45m ago
                      </span>
                    </div>
                    <p class="text-body-sm text-on-surface font-medium">Cambio de titularidad y medio de pago.</p>
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-secondary-container text-[10px] flex items-center justify-center text-on-secondary-container">CP</div>
                      <p class="text-[12px] text-on-surface-variant">Asignado a: Carlos Pires</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top Productores (Gestión Focus) -->
            <div class="mb-xl overflow-hidden">
              <h3 class="font-headline-sm text-headline-sm text-on-surface mb-md">Productores con Mayor Gestión</h3>
              <div class="flex gap-md overflow-x-auto hide-scrollbar pb-2">
                <!-- Producer Card 1 -->
                <div class="min-w-[240px] premium-card rounded-xl p-md">
                  <div class="flex items-center gap-md mb-md">
                    <img alt="Marta García" class="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLXKTm9fdfuxX1umSqlgzvi6Cmh8jk6QYMgn4ymVmzLpzXhUIfLkZFS0QB3Kz1m5w40BHo-IGwB4Pm5jyAtc7rXXmq9m0sD8qvtsMENBYgQjfVhkUW6SNZKZneDXEI21C7F_l2m7JvDKrPNhYbQwyx9Y1LIOyBYiVCjNKAnGbOvEjVWfiRDNnu26AOFcFvb_6ewGdmWEmZuktDlEvMbefU3fDuHFmeLAbvVCNd_blC79a0iR0YRGQN5w"/>
                    <div>
                      <p class="text-body-md font-bold">Marta García</p>
                      <p class="text-label-md text-on-surface-variant">Región Norte</p>
                    </div>
                  </div>
                  <div class="space-y-sm">
                    <div class="flex justify-between text-body-sm">
                      <span class="text-on-surface-variant">Tickets Resueltos</span>
                      <span class="font-bold">142</span>
                    </div>
                    <div class="w-full bg-surface-container rounded-full h-1.5">
                      <div class="bg-primary h-1.5 rounded-full" style="width: 92%"></div>
                    </div>
                  </div>
                </div>
                <!-- Producer Card 2 -->
                <div class="min-w-[240px] premium-card rounded-xl p-md">
                  <div class="flex items-center gap-md mb-md">
                    <img alt="Carlos Pires" class="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnvFVytqaWCZv-TNI6ISNP3Hueq3mmKgV4P-RNPxma-vQWimrZAuOeDNQ9PVcp3lraLjCAHY3u8S3E5VQstYIH_LyCRSMDnHWQmsnFsofN_0f3tsitCG1akXwqeanWdP-MZughxm9NG0B7AewhPBSnThluUmU461TNAmT9ByPCj6X5ntIK235O1siHhHM7R0xxZkY1YkZfoeEGKFhT2VAfV1Q96vVkShYc3RyZ5n9jQPZYRWMeVIpAbQ"/>
                    <div>
                      <p class="text-body-md font-bold">Carlos Pires</p>
                      <p class="text-label-md text-on-surface-variant">Región Sur</p>
                    </div>
                  </div>
                  <div class="space-y-sm">
                    <div class="flex justify-between text-body-sm">
                      <span class="text-on-surface-variant">Tickets Resueltos</span>
                      <span class="font-bold">118</span>
                    </div>
                    <div class="w-full bg-surface-container rounded-full h-1.5">
                      <div class="bg-primary h-1.5 rounded-full" style="width: 78%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </section>
        } @else {
          <!-- VISTA PAS (Productor) -->
          <section class="p-container-margin md:p-lg space-y-lg">
          <!-- Greeting & Producer Profile Banner -->
          <div class="bg-gradient-to-r from-primary-fixed-dim/20 via-surface-container-lowest to-surface-container-lowest border border-outline-variant p-md lg:p-lg rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
            <div class="flex items-center gap-md">
              <div class="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold text-xl shadow-md border border-primary-fixed">
                {{ userFullName().charAt(0) }}
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-xs">
                  <h2 class="font-headline-md text-headline-md text-on-surface">Hola, {{ userFullName() }}</h2>
                  <span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">PAS Habilitado SSN</span>
                </div>
                <p class="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2 mt-0.5">
                  <span>Matrícula: <strong>#{{ userMatricula() }}</strong></span>
                  <span>•</span>
                  <span>{{ userOrganizador() }}</span>
                  <span>•</span>
                  <span class="text-primary font-semibold">Mercantil Andina (Compañía Principal)</span>
                </p>
              </div>
            </div>
            
            <button routerLink="/asistente" class="w-full md:w-auto flex items-center justify-center gap-sm bg-primary text-on-primary px-lg py-md rounded-xl font-bold text-sm hover:bg-primary-container hover:shadow-lg transition-all shadow-sm cursor-pointer">
              <span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
              <span>Abrir Multicotizador IA</span>
            </button>
          </div>

          <!-- Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
            <!-- Premio Administrado -->
            <div routerLink="/premio" class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant metric-card-accent-blue shadow-sm lg:col-span-2 flex flex-col justify-between hover:scale-[0.98] transition-transform cursor-pointer">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Premio Administrado (Mensual)</p>
                  <h2 class="font-metric-xl text-metric-xl text-primary">{{ premioTotalFmt() }}</h2>
                </div>
                <div class="flex items-center gap-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-sm py-xs rounded-full font-bold text-xs border border-emerald-500/20">
                  <span class="material-symbols-outlined text-sm">trending_up</span>
                  <span>+14.8%</span>
                </div>
              </div>
              <div class="flex justify-between items-center mt-sm text-xs text-outline">
                <span>Cartera Total Vigente ({{ polizasCount() }} Pólizas)</span>
                <span class="font-semibold text-primary">Ver detalle de prima →</span>
              </div>
            </div>

            <!-- Clientes Activos -->
            <div routerLink="/clientes" class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant metric-card-accent-blue shadow-sm flex flex-col justify-between hover:scale-[0.98] transition-transform cursor-pointer">
              <div>
                <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Clientes Activos</p>
                <h2 class="font-metric-xl text-metric-xl text-on-surface">{{ clientesCount() }}</h2>
              </div>
              <div class="flex items-center justify-between mt-sm">
                <div class="flex -space-x-2 overflow-hidden">
                  <div class="w-6 h-6 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center border border-white">BA</div>
                  <div class="w-6 h-6 rounded-full bg-secondary text-white text-[9px] font-bold flex items-center justify-center border border-white">PR</div>
                  <div class="w-6 h-6 rounded-full bg-tertiary text-white text-[9px] font-bold flex items-center justify-center border border-white">AL</div>
                  <div class="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface border border-white">+216</div>
                </div>
                <span class="text-xs text-outline font-semibold">98.5% retención →</span>
              </div>
            </div>

            <!-- Pólizas con Deuda/Rechazo -->
            <div routerLink="/cobranzas" class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant metric-card-accent-red shadow-sm flex flex-col justify-between hover:scale-[0.98] transition-transform cursor-pointer">
              <div>
                <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Pólizas con Deuda</p>
                <h2 class="font-metric-xl text-metric-xl text-error">5</h2>
              </div>
              <div class="flex items-center justify-between mt-sm">
                <div class="flex items-center gap-xs">
                  <span class="material-symbols-outlined text-error text-sm">payments</span>
                  <span class="text-error font-bold text-xs uppercase">$420.000 pend.</span>
                </div>
                <span class="text-xs text-error font-semibold underline">Gestionar cobro →</span>
              </div>
            </div>
          </div>

          <!-- Solicitudes Quick Actions -->
          <div class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm w-full mb-md">
            <h3 class="font-label-md text-on-surface-variant mb-md font-bold uppercase tracking-widest text-[11px]">Gestiones Rápidas del Productor</h3>
            <div class="flex flex-col md:flex-row gap-sm w-full">
              <button routerLink="/asistente" class="flex-1 py-sm px-md rounded-lg bg-primary text-on-primary font-label-md font-bold hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                <span class="material-symbols-outlined text-sm">add_circle</span>
                <span>Nueva Cotización / Emisión</span>
              </button>
              <button routerLink="/endoso" class="flex-1 py-sm px-md rounded-lg border border-primary text-primary font-label-md font-bold hover:bg-primary-container hover:text-on-primary-container hover:border-primary-container transition-colors cursor-pointer flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-sm">edit_document</span>
                <span>Solicitar Endoso</span>
              </button>
              <button routerLink="/siniestros" class="flex-1 py-sm px-md rounded-lg border border-primary text-primary font-label-md font-bold hover:bg-primary-container hover:text-on-primary-container hover:border-primary-container transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <span class="material-symbols-outlined text-sm">report_problem</span>
                <span>Denunciar Siniestro</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-md">
            <!-- Distribución por Ramos -->
            <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col">
              <h3 class="font-headline-sm text-headline-sm mb-lg flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">pie_chart</span>
                Distribución por Ramos (Mercantil & Aliadas)
              </h3>
              <div class="space-y-md">
                <div>
                  <div class="flex justify-between mb-xs">
                    <span class="font-label-md text-label-md">Automotor (Rama 5)</span>
                    <span class="font-body-sm text-body-sm text-primary font-bold">58% (115 pólizas)</span>
                  </div>
                  <div class="w-full bg-surface-container rounded-full h-2">
                    <div class="bg-primary h-2 rounded-full" style="width: 58%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-xs">
                    <span class="font-label-md text-label-md">Combinado Familiar / Hogar (Rama 14)</span>
                    <span class="font-body-sm text-body-sm text-secondary font-bold">22% (44 pólizas)</span>
                  </div>
                  <div class="w-full bg-surface-container rounded-full h-2">
                    <div class="bg-secondary h-2 rounded-full" style="width: 22%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-xs">
                    <span class="font-label-md text-label-md">Motovehículos & Movilidad (Rama 35)</span>
                    <span class="font-body-sm text-body-sm text-tertiary font-bold">12% (24 pólizas)</span>
                  </div>
                  <div class="w-full bg-surface-container rounded-full h-2">
                    <div class="bg-tertiary h-2 rounded-full" style="width: 12%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-xs">
                    <span class="font-label-md text-label-md">Accidentes Personales / Vida (Rama 18)</span>
                    <span class="font-body-sm text-body-sm text-on-surface-variant font-bold">8% (15 pólizas)</span>
                  </div>
                  <div class="w-full bg-surface-container rounded-full h-2">
                    <div class="bg-outline h-2 rounded-full" style="width: 8%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pólizas por Compañía -->
            <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col">
              <h3 class="font-headline-sm text-headline-sm mb-lg flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">domain</span>
                Cartera por Compañía Aseguradora
              </h3>
              <div class="grid grid-cols-1 gap-sm">
                <!-- Mercantil Andina -->
                <div [routerLink]="['/compania']" [queryParams]="{ id: 'mercantil' }" class="flex items-center justify-between p-md bg-indigo-500/10 rounded-xl border border-indigo-500/30 cursor-pointer hover:bg-indigo-500/20 transition-all">
                  <div class="flex items-center gap-md">
                    <div class="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-md">
                      MA
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <p class="font-bold text-sm text-on-surface">Mercantil Andina</p>
                        <span class="text-[9px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-extrabold uppercase">Principal</span>
                      </div>
                      <p class="text-xs text-on-surface-variant">128 pólizas vigentes (65% cartera)</p>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-indigo-500">chevron_right</span>
                </div>

                <!-- San Cristóbal -->
                <div [routerLink]="['/compania']" [queryParams]="{ id: 'sancristobal' }" class="flex items-center justify-between p-md bg-surface-container-low rounded-xl border border-outline-variant cursor-pointer hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-md">
                    <div class="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                      SC
                    </div>
                    <div>
                      <p class="font-bold text-sm text-on-surface">San Cristóbal Seguros</p>
                      <p class="text-xs text-on-surface-variant">42 pólizas vigentes (21% cartera)</p>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </div>

                <!-- Sancor Seguros -->
                <div [routerLink]="['/compania']" [queryParams]="{ id: 'sancor' }" class="flex items-center justify-between p-md bg-surface-container-low rounded-xl border border-outline-variant cursor-pointer hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-md">
                    <div class="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                      SS
                    </div>
                    <div>
                      <p class="font-bold text-sm text-on-surface">Sancor Seguros</p>
                      <p class="text-xs text-on-surface-variant">28 pólizas vigentes (14% cartera)</p>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </div>

                <!-- Cooperación Seguros -->
                <div [routerLink]="['/compania']" [queryParams]="{ id: 'cooperacion' }" class="flex items-center justify-between p-md bg-amber-500/10 rounded-xl border border-amber-500/30 cursor-pointer hover:bg-amber-500/20 transition-all">
                  <div class="flex items-center gap-md">
                    <div class="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-md">
                      CS
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <p class="font-bold text-sm text-on-surface">Cooperación Seguros</p>
                      </div>
                      <p class="text-xs text-on-surface-variant">Cotización & Emisión disponible</p>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-amber-500">chevron_right</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bento Section: Activity & Vencimientos Mercantil -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-md">
            <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col lg:col-span-3">
              <div class="flex justify-between items-center mb-md">
                <h3 class="font-headline-sm text-headline-sm flex items-center gap-2">
                  <span class="material-symbols-outlined text-amber-500">event_upcoming</span>
                  Próximas Renovaciones de Cartera
                </h3>
                <span class="text-xs font-bold text-primary">Ver todas (18 renovaciones este mes)</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-sm">
                @for (r of renovaciones(); track r.poliza_numero) {
                  <div [routerLink]="['/clientes/detalle']" [queryParams]="{ nombre: r.cliente, id: r.cliente_id }" class="p-md bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-between cursor-pointer hover:bg-surface-container hover:shadow-sm transition-all">
                    <div class="flex items-center gap-md">
                      <div class="w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold border"
                           [ngClass]="{
                             'bg-amber-500/10 text-amber-600 border-amber-500/20': r.dias_restantes <= 5,
                             'bg-slate-500/10 text-slate-600 border-slate-500/20': r.dias_restantes > 5
                           }">
                        <span class="text-xs">{{ r.dias_restantes }}</span>
                        <span class="text-[9px] uppercase">días</span>
                      </div>
                      <div>
                        <p class="font-bold text-sm text-on-surface">Póliza {{ r.aseguradora }} #{{ r.poliza_numero }}</p>
                        <p class="text-xs text-on-surface-variant">{{ r.bien }} • Cliente: <strong>{{ r.cliente }}</strong></p>
                      </div>
                    </div>
                    <div class="text-right">
                      <span class="text-sm font-bold text-primary block">{{ r.premio_fmt }}</span>
                      <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            [ngClass]="{
                              'text-emerald-600 bg-emerald-500/10 border border-emerald-500/20': r.estado === 'Renovación Lista',
                              'text-amber-600 bg-amber-500/10 border border-amber-500/20': r.estado !== 'Renovación Lista'
                            }">{{ r.estado }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </section>
        }

        <!-- Global Footer Info (Admin & PAS) -->
        <footer class="py-md text-center border-t border-outline-variant mt-auto mx-container-margin md:mx-lg">
          <p class="text-label-md text-outline">© 2026 JC Organizadores - Operación Centralizada</p>
          <p class="text-[10px] text-outline mt-1 uppercase tracking-widest font-bold text-primary">Powered by Katrix.</p>
        </footer>
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

    /* Estilos nuevos Admin Dashboard */
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    .premium-card {
        background: #ffffff;
        border: 1px solid #E2E8F0;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .premium-card:active {
        transform: scale(0.98);
    }
    .left-accent-blue { border-left: 4px solid #0058be; }
    .left-accent-green { border-left: 4px solid #006c49; }
    .left-accent-red { border-left: 4px solid #ba1a1a; }
    .left-accent-purple { border-left: 4px solid #4648d4; }
    .left-accent-orange { border-left: 4px solid #f59e0b; }
  
`]
})
export class DashboardComponent implements OnInit {
  isLoading = signal(true);
  isError = signal(false);
  isRetrying = signal(false);

  private authService = inject(AuthService);
  private http = inject(HttpClient);

  premioTotalFmt = signal('$18.5M');
  clientesCount = signal(219);
  polizasCount = signal(312);
  renovaciones = signal<any[]>([
    {
      dias_restantes: 3,
      poliza_numero: "5-894210-242193",
      aseguradora: "Mercantil Andina",
      bien: "PEUGEOT 208 1.6 FELINE HDI",
      cliente: "BAHAMONDE JOSE ANTONIO",
      cliente_id: 242193,
      premio_fmt: "$64.500",
      estado: "Renovación Lista"
    },
    {
      dias_restantes: 5,
      poliza_numero: "20027144800",
      aseguradora: "Cooperación Seguros",
      bien: "COMBINADO FAMILIAR HOGAR",
      cliente: "PEREZ CLAUDIA ROSANA",
      cliente_id: 2008962,
      premio_fmt: "$28.900",
      estado: "Renovación Lista"
    },
    {
      dias_restantes: 8,
      poliza_numero: "5-894210-2008962",
      aseguradora: "Mercantil Andina",
      bien: "TOYOTA COROLLA 2.0 SEG",
      cliente: "PEREZ CLAUDIA ROSANA",
      cliente_id: 2008962,
      premio_fmt: "$64.500",
      estado: "Pendiente Inspección"
    },
    {
      dias_restantes: 12,
      poliza_numero: "5-302194-950723",
      aseguradora: "Mercantil Andina",
      bien: "TOYOTA HILUX 2.8 SRX 4X4",
      cliente: "PEREZ DANIEL HORACIO",
      cliente_id: 950723,
      premio_fmt: "$118.500",
      estado: "Renovación Lista"
    }
  ]);

  role = computed(() => this.authService.currentUser()?.role || 'admin');
  userFullName = computed(() => {
    const name = this.authService.currentUser()?.name;
    return (!name || name === 'Productor PAS') ? 'Gonzalo Javier Paso' : name;
  });
  userMatricula = computed(() => this.authService.currentUser()?.matricula || '86992');
  userOrganizador = computed(() => this.authService.currentUser()?.organizador || 'JCORG Broker de Seguros');
  userEmail = computed(() => this.authService.currentUser()?.email || 'gpaso@jcorg.com.ar');
  userName = computed(() => {
    const name = this.userFullName();
    return name.split(' ')[0];
  });

  ngOnInit() {
    this.initialLoadSequence();
    this.cargarMetricasCartera();
  }

  cargarMetricasCartera() {
    this.http.get<any>('/api/v1/quotations/mercantil/portfolio/metrics').subscribe({
      next: (m) => {
        if (m) {
          if (m.premio_administrado_fmt) this.premioTotalFmt.set(m.premio_administrado_fmt);
          if (m.clientes_activos) this.clientesCount.set(m.clientes_activos);
          if (m.polizas_vigentes) this.polizasCount.set(m.polizas_vigentes);
          if (m.renovaciones && m.renovaciones.length > 0) this.renovaciones.set(m.renovaciones);
        }
      },
      error: () => {}
    });
  }

  initialLoadSequence() {
    this.isLoading.set(false);
    
    if (!navigator.onLine) {
      this.isError.set(true);
    } else {
      this.isError.set(false);
    }
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
