import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-seguridad',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-background flex flex-col min-h-screen">
      <!-- TopAppBar -->
      <header class="bg-surface dark:bg-on-background w-full top-0 sticky z-40 border-b border-outline-variant dark:border-outline flex justify-between items-center px-container-margin py-sm transition-colors duration-200 ease-in-out">
        <div class="flex items-center gap-md">
          <button routerLink="/perfil" class="hover:bg-surface-container-low dark:hover:bg-surface-container-high p-sm rounded-full transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-primary dark:text-primary-fixed-dim">arrow_back</span>
          </button>
          <h1 class="font-headline-sm text-headline-sm-mobile text-on-surface">Configuración de Seguridad</h1>
        </div>
        <button class="hover:bg-surface-container-low dark:hover:bg-surface-container-high p-sm rounded-full transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-primary dark:text-primary-fixed-dim">help</span>
        </button>
      </header>

      <main class="flex-grow px-container-margin py-lg space-y-lg max-w-2xl mx-auto w-full pb-32">
        <!-- Welcome/Hero Visualization (Bento-style Header) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div class="md:col-span-2 glass-card p-lg rounded-xl border-l-4 border-primary shadow-sm">
            <h2 class="font-headline-md text-headline-md mb-xs">Tu seguridad es prioridad</h2>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Gestiona cómo accedes a JC Organizadores y protege tus datos personales.</p>
          </div>
          <div class="hidden md:flex glass-card p-lg rounded-xl items-center justify-center bg-primary-container/10">
            <span class="material-symbols-outlined text-primary text-5xl" style="font-variation-settings: 'FILL' 1;">security</span>
          </div>
        </div>

        <!-- Security Options Container -->
        <div class="space-y-sm">
          <h3 class="font-label-md text-label-md text-primary px-sm uppercase tracking-wider">Acceso y Autenticación</h3>
          <div class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <!-- Option: Cambiar Contraseña -->
            <button class="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors text-left cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="bg-primary/10 p-sm rounded-lg">
                  <span class="material-symbols-outlined text-primary">key</span>
                </div>
                <div>
                  <p class="font-headline-sm text-[16px] text-on-surface">Cambiar Contraseña</p>
                  <p class="font-body-sm text-body-sm text-on-surface-variant">Actualiza tu clave de acceso</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-outline">chevron_right</span>
            </button>
            <div class="h-[1px] bg-outline-variant mx-md"></div>
            <!-- Option: Biometric -->
            <div class="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors">
              <div class="flex items-center gap-md">
                <div class="bg-secondary/10 p-sm rounded-lg">
                  <span class="material-symbols-outlined text-secondary">fingerprint</span>
                </div>
                <div>
                  <p class="font-headline-sm text-[16px] text-on-surface">Autenticación Biométrica</p>
                  <p class="font-body-sm text-body-sm text-on-surface-variant">Face ID / Touch ID</p>
                </div>
              </div>
              <div class="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                <input checked class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-outline-variant appearance-none cursor-pointer checked:border-on-secondary-container" id="toggleBiometric" name="toggle" type="checkbox">
                <label class="toggle-label block overflow-hidden h-6 rounded-full bg-outline-variant cursor-pointer transition-colors duration-200 after:content-[''] after:absolute after:top-0 after:left-0 after:w-6 after:h-6 after:bg-white after:rounded-full after:transition-transform after:duration-200" for="toggleBiometric"></label>
              </div>
            </div>
            <div class="h-[1px] bg-outline-variant mx-md"></div>
            <!-- Option: 2FA -->
            <button class="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors text-left cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="bg-tertiary/10 p-sm rounded-lg">
                  <span class="material-symbols-outlined text-tertiary">verified_user</span>
                </div>
                <div>
                  <p class="font-headline-sm text-[16px] text-on-surface">Verificación en dos pasos (2FA)</p>
                  <p class="font-body-sm text-body-sm text-on-surface-variant">Estado: <span class="text-error font-semibold">Desactivado</span></p>
                </div>
              </div>
              <span class="material-symbols-outlined text-outline">chevron_right</span>
            </button>
          </div>
        </div>

        <!-- Section: Devices -->
        <div class="space-y-sm">
          <h3 class="font-label-md text-label-md text-primary px-sm uppercase tracking-wider">Dispositivos</h3>
          <div class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <button class="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors text-left cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="bg-on-surface/5 p-sm rounded-lg">
                  <span class="material-symbols-outlined text-on-surface">devices</span>
                </div>
                <div>
                  <p class="font-headline-sm text-[16px] text-on-surface">Sesiones Activas</p>
                  <p class="font-body-sm text-body-sm text-on-surface-variant">2 dispositivos conectados actualmente</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-outline">chevron_right</span>
            </button>
          </div>
        </div>

        <!-- Tip Card -->
        <div class="bg-surface-container-high/50 p-md rounded-xl border border-outline-variant flex gap-md items-start">
          <span class="material-symbols-outlined text-primary-container mt-xs">info</span>
          <p class="font-body-sm text-body-sm text-on-surface-variant">
            Te recomendamos cambiar tu contraseña cada 90 días para mantener un nivel de seguridad óptimo en tu cuenta de productor.
          </p>
        </div>
      </main>

      <!-- Bottom Action Button Wrapper (Floating logic for mobile) -->
      <div class="fixed bottom-16 left-0 right-0 p-container-margin bg-gradient-to-t from-background via-background to-transparent z-40 md:static md:bg-none md:mt-lg md:bottom-auto">
        <button class="w-full bg-primary text-on-primary font-headline-sm py-md rounded-lg shadow-lg hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-sm cursor-pointer">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">save</span>
          Guardar Cambios
        </button>
      </div>

      <!-- BottomNavBar -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-outline-variant flex justify-around items-center h-16 px-container-margin pb-safe">
        <button routerLink="/dashboard" class="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-all rounded-lg p-2 cursor-pointer">
          <span class="material-symbols-outlined">dashboard</span>
          <span class="font-label-md text-label-md">Métricas</span>
        </button>
        <button class="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-all rounded-lg p-2 cursor-pointer">
          <span class="material-symbols-outlined">payments</span>
          <span class="font-label-md text-label-md">Cobros</span>
        </button>
        <button class="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-all rounded-lg p-2 cursor-pointer">
          <span class="material-symbols-outlined">group</span>
          <span class="font-label-md text-label-md">Clientes</span>
        </button>
        <button class="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-all rounded-lg p-2 cursor-pointer">
          <span class="material-symbols-outlined">report_problem</span>
          <span class="font-label-md text-label-md">Siniestros</span>
        </button>
        <button routerLink="/perfil" class="flex flex-col items-center justify-center text-primary transition-all rounded-lg p-2 cursor-pointer">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">person</span>
          <span class="font-label-md text-label-md">Perfil</span>
        </button>
      </nav>
    </div>
`,
  styles: [`
    .toggle-checkbox:checked + .toggle-label {
        background-color: #006c49;
    }
    .toggle-checkbox:checked + .toggle-label::after {
        transform: translateX(20px);
    }
    .glass-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(8px);
        border: 1px solid #e2e8f0;
    }
`]
})
export class SeguridadComponent {}
