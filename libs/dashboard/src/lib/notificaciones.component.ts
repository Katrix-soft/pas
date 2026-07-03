import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-notificaciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex flex-col min-h-screen text-on-surface bg-surface">
      <!-- TopAppBar -->
      <header class="w-full sticky top-0 z-50 bg-surface border-b border-outline-variant flex items-center h-16 px-md w-full">
        <button routerLink="/perfil" class="mr-4 p-2 rounded-full hover:bg-surface-container-high transition-colors active:opacity-70 cursor-pointer">
          <span class="material-symbols-outlined text-primary" data-icon="arrow_back">arrow_back</span>
        </button>
        <h1 class="font-headline-sm text-headline-sm text-primary">Configuración de Notificaciones</h1>
      </header>

      <!-- Main Content -->
      <main class="flex-grow px-md pt-lg pb-32 max-w-2xl mx-auto w-full">
        <!-- Intro Text -->
        <p class="font-body-md text-body-md text-on-surface-variant mb-lg px-2">
          Elige qué alertas deseas recibir para mantenerte al tanto de tu cartera.
        </p>

        <!-- Notification Sections -->
        <div class="space-y-lg">
          <!-- Section: Cartera -->
          <section class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div class="px-md py-sm bg-surface-container-low border-b border-outline-variant">
              <h2 class="font-label-md text-label-md text-primary uppercase">Notificaciones de Cartera</h2>
            </div>
            <div class="divide-y divide-outline-variant">
              <!-- Row 1 -->
              <label class="flex items-center justify-between p-md hover:bg-surface-container-high transition-colors cursor-pointer group">
                <span class="font-body-md text-body-md text-on-surface">Nuevas Pólizas Emitidas</span>
                <div class="relative inline-block w-10 h-5">
                  <input checked class="toggle-checkbox absolute opacity-0 w-0 h-0" type="checkbox">
                  <div class="toggle-slot block bg-outline-variant w-10 h-5 rounded-full transition-colors duration-200">
                    <div class="toggle-dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform duration-200 shadow-sm"></div>
                  </div>
                </div>
              </label>
              <!-- Row 2 -->
              <label class="flex items-center justify-between p-md hover:bg-surface-container-high transition-colors cursor-pointer group">
                <span class="font-body-md text-body-md text-on-surface">Próximas Renovaciones</span>
                <div class="relative inline-block w-10 h-5">
                  <input checked class="toggle-checkbox absolute opacity-0 w-0 h-0" type="checkbox">
                  <div class="toggle-slot block bg-outline-variant w-10 h-5 rounded-full transition-colors duration-200">
                    <div class="toggle-dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform duration-200 shadow-sm"></div>
                  </div>
                </div>
              </label>
            </div>
          </section>

          <!-- Section: Cobranzas -->
          <section class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div class="px-md py-sm bg-surface-container-low border-b border-outline-variant">
              <h2 class="font-label-md text-label-md text-primary uppercase">Gestión de Cobranzas</h2>
            </div>
            <div class="divide-y divide-outline-variant">
              <label class="flex items-center justify-between p-md hover:bg-surface-container-high transition-colors cursor-pointer">
                <span class="font-body-md text-body-md text-on-surface">Pagos Rechazados</span>
                <div class="relative inline-block w-10 h-5">
                  <input checked class="toggle-checkbox absolute opacity-0 w-0 h-0" type="checkbox">
                  <div class="toggle-slot block bg-outline-variant w-10 h-5 rounded-full transition-colors">
                    <div class="toggle-dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform shadow-sm"></div>
                  </div>
                </div>
              </label>
              <label class="flex items-center justify-between p-md hover:bg-surface-container-high transition-colors cursor-pointer">
                <span class="font-body-md text-body-md text-on-surface">Pólizas con Deuda</span>
                <div class="relative inline-block w-10 h-5">
                  <input checked class="toggle-checkbox absolute opacity-0 w-0 h-0" type="checkbox">
                  <div class="toggle-slot block bg-outline-variant w-10 h-5 rounded-full transition-colors">
                    <div class="toggle-dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform shadow-sm"></div>
                  </div>
                </div>
              </label>
            </div>
          </section>

          <!-- Section: Siniestros -->
          <section class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div class="px-md py-sm bg-surface-container-low border-b border-outline-variant">
              <h2 class="font-label-md text-label-md text-primary uppercase">Siniestros</h2>
            </div>
            <div class="divide-y divide-outline-variant">
              <label class="flex items-center justify-between p-md hover:bg-surface-container-high transition-colors cursor-pointer">
                <span class="font-body-md text-body-md text-on-surface">Actualización de Estado</span>
                <div class="relative inline-block w-10 h-5">
                  <input checked class="toggle-checkbox absolute opacity-0 w-0 h-0" type="checkbox">
                  <div class="toggle-slot block bg-outline-variant w-10 h-5 rounded-full transition-colors">
                    <div class="toggle-dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform shadow-sm"></div>
                  </div>
                </div>
              </label>
              <label class="flex items-center justify-between p-md hover:bg-surface-container-high transition-colors cursor-pointer">
                <span class="font-body-md text-body-md text-on-surface">Nuevos Siniestros Reportados</span>
                <div class="relative inline-block w-10 h-5">
                  <input class="toggle-checkbox absolute opacity-0 w-0 h-0" type="checkbox">
                  <div class="toggle-slot block bg-outline-variant w-10 h-5 rounded-full transition-colors">
                    <div class="toggle-dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform shadow-sm"></div>
                  </div>
                </div>
              </label>
            </div>
          </section>

          <!-- Section: Canales -->
          <section class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div class="px-md py-sm bg-surface-container-low border-b border-outline-variant">
              <h2 class="font-label-md text-label-md text-primary uppercase">Canales de Envío</h2>
            </div>
            <div class="divide-y divide-outline-variant">
              <label class="flex items-center justify-between p-md hover:bg-surface-container-high transition-colors cursor-pointer">
                <span class="font-body-md text-body-md text-on-surface">Notificaciones Push</span>
                <div class="relative inline-block w-10 h-5">
                  <input checked class="toggle-checkbox absolute opacity-0 w-0 h-0" type="checkbox">
                  <div class="toggle-slot block bg-outline-variant w-10 h-5 rounded-full transition-colors">
                    <div class="toggle-dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform shadow-sm"></div>
                  </div>
                </div>
              </label>
              <label class="flex items-center justify-between p-md hover:bg-surface-container-high transition-colors cursor-pointer">
                <span class="font-body-md text-body-md text-on-surface">Correo Electrónico</span>
                <div class="relative inline-block w-10 h-5">
                  <input class="toggle-checkbox absolute opacity-0 w-0 h-0" type="checkbox">
                  <div class="toggle-slot block bg-outline-variant w-10 h-5 rounded-full transition-colors">
                    <div class="toggle-dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform shadow-sm"></div>
                  </div>
                </div>
              </label>
            </div>
          </section>

          <!-- Action Button -->
          <div class="pt-lg pb-md">
            <button class="w-full bg-primary text-on-primary font-headline-sm text-headline-sm py-4 rounded-xl shadow-sm active:scale-[0.98] transition-all hover:bg-primary-container hover:text-on-primary-container cursor-pointer" id="save-btn" (click)="saveChanges($event)">
              Guardar Cambios
            </button>
          </div>
        </div>
      </main>

      <!-- BottomNavBar -->
      <nav class="md:hidden fixed bottom-0 w-full z-50 pb-safe bg-white border-t border-outline-variant shadow-sm flex justify-around items-center h-20 px-2">
        <button routerLink="/dashboard" class="flex flex-col items-center justify-center text-on-surface-variant px-2 py-1 hover:text-primary transition-colors active:scale-95 cursor-pointer">
          <span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
          <span class="font-label-md text-label-md">Métricas</span>
        </button>
        <button class="flex flex-col items-center justify-center text-on-surface-variant px-2 py-1 hover:text-primary transition-colors active:scale-95 cursor-pointer">
          <span class="material-symbols-outlined" data-icon="payments">payments</span>
          <span class="font-label-md text-label-md">Cobros</span>
        </button>
        <button class="flex flex-col items-center justify-center text-on-surface-variant px-2 py-1 hover:text-primary transition-colors active:scale-95 cursor-pointer">
          <span class="material-symbols-outlined" data-icon="groups">groups</span>
          <span class="font-label-md text-label-md">Clientes</span>
        </button>
        <button class="flex flex-col items-center justify-center text-on-surface-variant px-2 py-1 hover:text-primary transition-colors active:scale-95 cursor-pointer">
          <span class="material-symbols-outlined" data-icon="report_problem">report_problem</span>
          <span class="font-label-md text-label-md">Siniestros</span>
        </button>
        <button routerLink="/perfil" class="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-1 active:scale-95 cursor-pointer">
          <span class="material-symbols-outlined" data-icon="person" style="font-variation-settings: 'FILL' 1;">person</span>
          <span class="font-label-md text-label-md">Perfil</span>
        </button>
      </nav>
    </div>
`,
  styles: [`
    .toggle-checkbox:checked + .toggle-slot {
        background-color: #0058be;
    }
    .toggle-checkbox:checked + .toggle-slot .toggle-dot {
        transform: translateX(1.25rem);
    }
    .scroll-mask {
        mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
    }
`]
})
export class NotificacionesComponent {
  saveChanges(event: Event) {
    const btn = event.target as HTMLElement;
    const originalText = btn.innerText;
    btn.innerText = '¡Guardado!';
    btn.classList.add('bg-secondary');
    btn.classList.remove('bg-primary');
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove('bg-secondary');
        btn.classList.add('bg-primary');
    }, 2000);
  }
}
