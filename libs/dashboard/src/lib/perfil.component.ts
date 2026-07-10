import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'lib-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-surface text-on-surface font-body-md min-h-screen pb-20 md:pb-0">
      <!-- TopAppBar -->
      <header class="docked full-width top-0 sticky z-40 bg-surface border-b border-outline-variant flex justify-between items-center px-md py-sm w-full">
        <div class="flex items-center gap-md">
          <button routerLink="/dashboard" class="material-symbols-outlined text-primary p-2 hover:bg-surface-container-high rounded-full transition-all cursor-pointer">arrow_back</button>
          <h1 class="font-headline-sm-mobile text-headline-sm-mobile text-primary font-black">Mi Perfil</h1>
        </div>
        <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed">
          <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBocJoCDkjvz0SavJ4vfWsNPe1rC7zadFsLVHIZQCkxfOwvDTaMR0Wg9bY9G23szQ-48xqm2l3N5-2_5mixfxLhP6PRoi5hWPDn2-5_0dkLeiS1_-zvC4hW2nvFwf9W4gH6rm-GdjM6YiYmoJuQRs7v1sq_R-KBt3Uq-eI1SQgjStSVtJPi8DiiC6jsK9TQNuttXnFV4IU9X5O0oY-yVDhgDbuq4--dHGEa_pld3QtffuJpM6D6wrooK_HtXaZngIyjhxiSdNE89nYD">
        </div>
      </header>
      


      <main class="max-w-4xl mx-auto p-md space-y-lg">
        <!-- Profile Hero Section -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div class="h-32 profile-header-gradient relative">
            <div class="absolute -bottom-12 left-md">
              <div class="p-1 bg-surface-container-lowest rounded-full">
                <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-lowest">
                  <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt4UiWSA8UA5JIC_UKjqz23kE7ix-9Z2P9uU5xeXPasU7C4ddXo7F6KnFnzgtXE3ZZgkC4-GeqMalVlCAlov1bMR3JqepzErfImMxhPJy579efvurkKk02Oe9SGjuOJNj2laAjEJCLWY9VPrG1IhR8SoCz8itj9Nc_xBmeRlObrlaJPfN_nSngtqZqn9lW6ZiXkg2ve3HR42frgxmpSLVFy8VUIyI7GmGiZkRTN6UOTupglj6hgIGeksWr65SMePd4_mrlBB789iNH">
                </div>
              </div>
            </div>
          </div>
          <div class="pt-14 pb-lg px-lg">
            <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Carlos López</h2>
            <p class="text-primary font-semibold flex items-center gap-xs">
              <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">verified</span>
              Productor Asesor Senior
            </p>
          </div>
        </section>

        <!-- Performance Summary -->
        <section>
          <h3 class="font-label-md text-label-md text-outline uppercase mb-md tracking-wider">Resumen de Rendimiento</h3>
          <div class="grid grid-cols-2 gap-md">
            <div class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
              <p class="font-label-md text-label-md text-on-surface-variant">Años de Trayectoria</p>
              <p class="font-metric-xl text-metric-xl text-primary mt-xs">12</p>
            </div>
            <div class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant border-l-4 border-l-secondary shadow-sm hover:shadow-md transition-shadow">
              <p class="font-label-md text-label-md text-on-surface-variant">Pólizas Totales</p>
              <p class="font-metric-xl text-metric-xl text-secondary mt-xs">450</p>
            </div>
          </div>
        </section>

        <!-- Personal Data -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div class="p-md border-b border-outline-variant bg-surface-container-low">
            <h3 class="font-headline-sm text-headline-sm text-on-surface">Datos Personales</h3>
          </div>
          <div class="divide-y divide-outline-variant">
            <div class="p-md flex justify-between items-center hover:bg-surface-container-lowest/50 transition-colors">
              <div>
                <p class="font-label-md text-label-md text-outline">ID DE AGENTE</p>
                <p class="font-body-md text-body-md font-semibold text-on-surface">28491</p>
              </div>
              <span class="material-symbols-outlined text-outline">badge</span>
            </div>
            <div class="p-md flex justify-between items-center hover:bg-surface-container-lowest/50 transition-colors">
              <div>
                <p class="font-label-md text-label-md text-outline">EMAIL</p>
                <p class="font-body-md text-body-md font-semibold text-on-surface">carlos.lopez&#64;jcorg.com.ar</p>
              </div>
              <span class="material-symbols-outlined text-outline">mail</span>
            </div>
            <div class="p-md flex justify-between items-center hover:bg-surface-container-lowest/50 transition-colors">
              <div>
                <p class="font-label-md text-label-md text-outline">TELÉFONO</p>
                <p class="font-body-md text-body-md font-semibold text-on-surface">+54 11 4567-8901</p>
              </div>
              <span class="material-symbols-outlined text-outline">call</span>
            </div>
            <!-- Subir Logo Row -->
            <div *ngIf="authService.currentUser()?.role === 'pas'" class="p-md flex justify-between items-center hover:bg-surface-container-lowest/50 transition-colors">
              <div>
                <p class="font-label-md text-label-md text-outline mb-xs">LOGO DE EMPRESA</p>
                <input type="file" accept="image/*" class="hidden" #logoInput (change)="onLogoSelected($event)">
                <button (click)="logoInput.click()" class="font-body-md text-primary font-semibold hover:underline cursor-pointer">
                  Agregar imagen del logo
                </button>
              </div>
              <div class="w-12 h-12 rounded bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant">
                <img *ngIf="authService.tenantLogo()" [src]="authService.tenantLogo()" class="w-full h-full object-contain">
                <span *ngIf="!authService.tenantLogo()" class="material-symbols-outlined text-outline">image</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Menu Options -->
        <section class="space-y-sm">
          <h3 class="font-label-md text-label-md text-outline uppercase px-xs tracking-wider">Configuración</h3>
          <div class="bg-surface-container-lowest border border-outline-variant rounded-xl divide-y divide-outline-variant shadow-sm">
            <button routerLink="/notificaciones" class="w-full p-md flex items-center justify-between hover:bg-surface-container-high transition-all group cursor-pointer">
              <div class="flex items-center gap-md">
                <span class="material-symbols-outlined text-primary">notifications</span>
                <span class="font-body-md text-body-md text-on-surface">Notificaciones</span>
              </div>
              <span class="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
            <button routerLink="/seguridad" class="w-full p-md flex items-center justify-between hover:bg-surface-container-high transition-all group cursor-pointer">
              <div class="flex items-center gap-md">
                <span class="material-symbols-outlined text-primary">security</span>
                <span class="font-body-md text-body-md text-on-surface">Seguridad</span>
              </div>
              <span class="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
            <button class="w-full p-md flex items-center justify-between hover:bg-surface-container-high transition-all group cursor-pointer">
              <div class="flex items-center gap-md">
                <span class="material-symbols-outlined text-primary">draw</span>
                <span class="font-body-md text-body-md text-on-surface">Configuración de Firma</span>
              </div>
              <span class="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
          </div>
        </section>

        <!-- Logout Button -->
        <section class="pt-lg">
          <button routerLink="/login" class="w-full py-md px-lg bg-surface-container-lowest border-2 border-error text-error font-bold rounded-xl flex items-center justify-center gap-md hover:bg-error-container/20 active:scale-[0.98] transition-all cursor-pointer">
            <span class="material-symbols-outlined">logout</span>
            Cerrar Sesión
          </button>
          <p class="text-center text-outline font-label-md text-label-md mt-lg">Versión 2.4.1 (Producción)</p>
        </section>
      </main>


    </div>
`,
  styles: [`
    .profile-header-gradient {
        background: linear-gradient(180deg, #0058be 0%, #213145 100%);
    }
    .glass-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(8px);
    }
`]
})
export class PerfilComponent {
  authService = inject(AuthService);

  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        this.authService.tenantLogo.set(base64);
        localStorage.setItem('tenantLogo', base64);
      };
      reader.readAsDataURL(file);
    }
  }
}
