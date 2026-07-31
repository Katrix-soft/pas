import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-seguridad',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="bg-surface text-on-surface flex flex-col min-h-screen font-body-md pb-24 overflow-x-hidden">
      <!-- TopAppBar -->
      <header class="bg-surface/95 dark:bg-on-background/95 backdrop-blur-md w-full top-0 sticky z-40 border-b border-outline-variant flex justify-between items-center px-4 sm:px-6 py-3 transition-colors">
        <div class="flex items-center gap-3">
          <button routerLink="/perfil" class="hover:bg-surface-container-high p-2 rounded-full transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-primary text-xl">arrow_back</span>
          </button>
          <h1 class="font-bold text-base sm:text-lg text-primary tracking-tight">Centro de Seguridad & Acceso</h1>
        </div>
        <span class="bg-emerald-500/10 text-emerald-600 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          ENCRIPTACIÓN TLS 1.3
        </span>
      </header>

      <main class="flex-grow px-4 sm:px-6 py-4 space-y-6 max-w-3xl mx-auto w-full">
        <!-- Security Status Banner -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-emerald-600">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <span class="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <h2 class="text-base font-bold text-on-surface">Estado de Seguridad: BLINDADO</h2>
              <p class="text-xs text-on-surface-variant mt-0.5">Protección activa contra fuerza bruta, XSS, CSRF y rate-limiting en API.</p>
            </div>
          </div>
          <span class="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 shrink-0">
            Nivel 100% Óptimo
          </span>
        </div>

        <!-- Section 1: Cambiar Contraseña -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
          <div class="px-4 py-3 bg-surface-container-low border-b border-outline-variant flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-base">key</span>
            <h3 class="text-xs font-bold text-primary uppercase">Actualización de Contraseña</h3>
          </div>
          <div class="p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
            <div>
              <label class="block font-bold text-outline text-[10px] uppercase mb-1">Contraseña Actual</label>
              <input type="password" [(ngModel)]="currentPass" class="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface" placeholder="••••••••••••" />
            </div>
            <div>
              <label class="block font-bold text-outline text-[10px] uppercase mb-1">Nueva Contraseña Segura</label>
              <input type="password" [(ngModel)]="newPass" (ngModelChange)="checkStrength()" class="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface" placeholder="Mínimo 8 caracteres, números y símbolos" />
              <!-- Strength meter -->
              <div class="mt-2 flex items-center gap-2">
                <div class="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div class="h-full transition-all duration-300" [ngClass]="{
                    'w-1/4 bg-error': passStrength() === 1,
                    'w-2/4 bg-amber-500': passStrength() === 2,
                    'w-3/4 bg-indigo-600': passStrength() === 3,
                    'w-full bg-emerald-600': passStrength() === 4,
                    'w-0': passStrength() === 0
                  }"></div>
                </div>
                <span class="text-[10px] font-bold uppercase text-outline">{{ passStrengthLabel() }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 2: Autenticación & 2FA -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
          <div class="px-4 py-3 bg-surface-container-low border-b border-outline-variant flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-base">shield</span>
            <h3 class="text-xs font-bold text-primary uppercase">Autenticación Avanzada (2FA & Biometría)</h3>
          </div>
          <div class="divide-y divide-outline-variant text-xs sm:text-sm">
            <div class="p-4 flex items-center justify-between">
              <div>
                <p class="font-bold text-on-surface">Verificación en Dos Pasos (2FA)</p>
                <p class="text-xs text-on-surface-variant">Código OTP por aplicación autenticadora o SMS.</p>
              </div>
              <input type="checkbox" [(ngModel)]="is2faEnabled" class="w-5 h-5 accent-primary cursor-pointer">
            </div>
            <div class="p-4 flex items-center justify-between">
              <div>
                <p class="font-bold text-on-surface">Autenticación Biométrica (Face ID / Huella)</p>
                <p class="text-xs text-on-surface-variant">Permite acceso directo en dispositivos móviles registrados.</p>
              </div>
              <input type="checkbox" [(ngModel)]="isBiometricEnabled" class="w-5 h-5 accent-primary cursor-pointer">
            </div>
          </div>
        </section>

        <!-- Section 3: Sesiones Activas & Revocación -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
          <div class="px-4 py-3 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">devices</span>
              <h3 class="text-xs font-bold text-primary uppercase">Sesiones Activas Dispositivos</h3>
            </div>
            <button (click)="cerrarOtrasSesiones()" class="text-xs font-bold text-error hover:underline cursor-pointer">
              Cerrar en otros dispositivos
            </button>
          </div>
          <div class="divide-y divide-outline-variant text-xs">
            <div class="p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-emerald-600 text-xl">computer</span>
                <div>
                  <p class="font-bold text-on-surface">Navegador Actual (Linux / Chrome)</p>
                  <p class="text-[11px] text-outline">IP: 190.224.89.12 • Mendoza, Argentina</p>
                </div>
              </div>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">ESTA SESIÓN</span>
            </div>
            <div class="p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-outline text-xl">smartphone</span>
                <div>
                  <p class="font-bold text-on-surface">iPhone 15 Pro PAS App</p>
                  <p class="text-[11px] text-outline">Hace 15 minutos • Mendoza, Argentina</p>
                </div>
              </div>
              <button (click)="revocarDispositivo('iPhone 15 Pro')" class="text-xs text-outline hover:text-error cursor-pointer">Revocar</button>
            </div>
          </div>
        </section>

        <!-- Save Button -->
        <div class="pt-2">
          <button (click)="guardarSeguridad($event)" class="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-sm transition-all hover:bg-primary-container active:scale-[0.99] cursor-pointer text-sm">
            Guardar Ajustes de Seguridad
          </button>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
  `]
})
export class SeguridadComponent {
  currentPass = '';
  newPass = '';
  passStrength = signal<number>(0);
  passStrengthLabel = signal<string>('Sin definir');

  is2faEnabled = true;
  isBiometricEnabled = true;

  checkStrength() {
    const p = this.newPass;
    if (!p) {
      this.passStrength.set(0);
      this.passStrengthLabel.set('Sin definir');
      return;
    }
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    this.passStrength.set(score);
    const labels = ['', 'Débil', 'Media', 'Buena', 'Excelente / Blindada'];
    this.passStrengthLabel.set(labels[score] || 'Buena');
  }

  guardarSeguridad(event: Event) {
    const btn = event.target as HTMLElement;
    const originalText = btn.innerText;
    btn.innerText = '¡Ajustes de Seguridad Guardados!';
    btn.classList.add('bg-emerald-600');
    btn.classList.remove('bg-primary');

    setTimeout(() => {
      btn.innerText = originalText;
      btn.classList.remove('bg-emerald-600');
      btn.classList.add('bg-primary');
    }, 2000);
  }

  cerrarOtrasSesiones() {
    alert('Se han revocado todas las demás sesiones activas por seguridad.');
  }

  revocarDispositivo(nombre: string) {
    alert(`Sesión en ${nombre} revocada exitosamente.`);
  }
}
