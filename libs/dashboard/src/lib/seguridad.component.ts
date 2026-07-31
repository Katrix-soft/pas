import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface DispositivoSesion {
  id: string;
  nombre: string;
  tipo: 'desktop' | 'mobile' | 'tablet';
  ip: string;
  ubicacion: string;
  ultimoAcceso: string;
  esActual: boolean;
}

export interface RegistroAuditoria {
  fecha: string;
  dispositivo: string;
  ip: string;
  resultado: 'Exitoso' | 'Bloqueado anti-fuerza bruta';
}

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
              <p class="text-xs text-on-surface-variant mt-0.5">Protección activa contra fuerza bruta, XSS, CSRF, rate-limiting y capturas.</p>
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

        <!-- Section 3: DISPOSITIVOS VINCULADOS & SESIONES ACTIVAS (HACER CLIC ABRE EL MODAL) -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
          <div (click)="openDevicesModal()" class="px-4 py-3 bg-surface-container-low border-b border-outline-variant flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">devices</span>
              <h3 class="text-xs font-bold text-primary uppercase">Dispositivos Vinculados & Sesiones ({{ dispositivos().length }})</h3>
            </div>
            <span class="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <span>Gestionar y Vincular</span>
              <span class="material-symbols-outlined text-sm">open_in_new</span>
            </span>
          </div>

          <div class="divide-y divide-outline-variant text-xs">
            <div *ngFor="let dev of dispositivos()" (click)="openDevicesModal()" class="p-4 flex items-center justify-between hover:bg-surface-container-high/40 transition-colors cursor-pointer">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-xl" [ngClass]="dev.esActual ? 'text-emerald-600' : 'text-outline'">
                  {{ dev.tipo === 'mobile' ? 'smartphone' : dev.tipo === 'tablet' ? 'tablet' : 'computer' }}
                </span>
                <div>
                  <p class="font-bold text-on-surface">{{ dev.nombre }}</p>
                  <p class="text-[11px] text-outline">IP: {{ dev.ip }} • {{ dev.ubicacion }} • {{ dev.ultimoAcceso }}</p>
                </div>
              </div>
              
              <span *ngIf="dev.esActual" class="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">ESTA SESIÓN</span>
              <button *ngIf="!dev.esActual" (click)="revocarDispositivo(dev.id, $event)" class="text-xs text-outline hover:text-error cursor-pointer">Revocar</button>
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

      <!-- MODAL GESTIÓN COMPLETA DE DISPOSITIVOS VINCULADOS & AUDITORÍA DE ACCESOS -->
      <div *ngIf="showDevicesModal()" class="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-[70] overflow-y-auto">
        <div class="bg-surface-container-lowest border-t sm:border border-outline-variant rounded-t-2xl sm:rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
          
          <!-- Modal Header -->
          <div class="flex justify-between items-start pb-3 border-b border-outline-variant">
            <div>
              <h2 class="text-lg sm:text-xl font-black text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">devices</span>
                Dispositivos Vinculados & Auditoría
              </h2>
              <p class="text-xs text-on-surface-variant mt-0.5">Control de equipos autorizados para acceder a tu cartera de PAS.</p>
            </div>
            <button (click)="closeDevicesModal()" class="text-outline hover:text-on-surface p-1 rounded-lg cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Section A: QR Generator for New Device Pairing -->
          <div class="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 text-xs">
            <div class="w-24 h-24 bg-white rounded-xl p-2 border border-outline-variant shrink-0 flex flex-col items-center justify-center shadow-xs">
              <!-- QR Fake Render -->
              <div class="w-full h-full bg-slate-950 rounded p-1.5 flex flex-wrap gap-0.5 justify-around items-center">
                <div class="w-3 h-3 bg-white"></div>
                <div class="w-3 h-3 bg-emerald-400"></div>
                <div class="w-3 h-3 bg-white"></div>
                <div class="w-3 h-3 bg-white"></div>
                <div class="w-3 h-3 bg-primary"></div>
                <div class="w-3 h-3 bg-white"></div>
              </div>
            </div>
            <div class="space-y-1 text-center sm:text-left">
              <h4 class="font-bold text-primary text-sm">Vincular Nuevo Dispositivo Móvil</h4>
              <p class="text-on-surface-variant">Escaneá este código QR desde la App Móvil o WhatsApp del PAS para autorizar biometría en un nuevo celular.</p>
              <button (click)="generarNuevoQr()" class="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer">
                ↻ Generar nuevo código de vinculación seguro
              </button>
            </div>
          </div>

          <!-- Section B: List of Linked Devices -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <h4 class="text-xs font-bold text-outline uppercase tracking-wider">Sesiones & Equipos Autorizados</h4>
              <button (click)="cerrarOtrasSesiones()" class="text-xs font-bold text-error hover:underline cursor-pointer">
                Revocar todas las demás
              </button>
            </div>

            <div class="divide-y divide-outline-variant bg-surface-container-low rounded-xl border border-outline-variant text-xs">
              <div *ngFor="let dev of dispositivos()" class="p-3.5 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-xl" [ngClass]="dev.esActual ? 'text-emerald-600' : 'text-outline'">
                    {{ dev.tipo === 'mobile' ? 'smartphone' : dev.tipo === 'tablet' ? 'tablet' : 'computer' }}
                  </span>
                  <div>
                    <p class="font-bold text-on-surface">{{ dev.nombre }}</p>
                    <p class="text-[11px] text-outline">IP: {{ dev.ip }} • {{ dev.ubicacion }} • {{ dev.ultimoAcceso }}</p>
                  </div>
                </div>

                <span *ngIf="dev.esActual" class="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">ACTIVO AHORA</span>
                <button *ngIf="!dev.esActual" (click)="revocarDispositivo(dev.id)" class="px-3 py-1 bg-error/10 text-error hover:bg-error/20 font-bold rounded-lg transition-colors cursor-pointer text-xs">
                  Revocar
                </button>
              </div>
            </div>
          </div>

          <!-- Section C: Audit Logs History -->
          <div class="space-y-2">
            <h4 class="text-xs font-bold text-outline uppercase tracking-wider">Historial de Accesos Recientes (Auditoría)</h4>
            <div class="space-y-1.5 bg-surface-container-low p-3 rounded-xl border border-outline-variant text-xs max-h-40 overflow-y-auto">
              <div *ngFor="let log of auditoriaLogs" class="flex items-center justify-between py-1.5 border-b border-outline-variant/40 last:border-0">
                <div>
                  <p class="font-semibold text-on-surface">{{ log.dispositivo }} <span class="text-outline font-normal">({{ log.ip }})</span></p>
                  <p class="text-[10px] text-outline">{{ log.fecha }}</p>
                </div>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded"
                      [ngClass]="log.resultado === 'Exitoso' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-error/10 text-error border border-error/20'">
                  {{ log.resultado }}
                </span>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="pt-2 border-t border-outline-variant pb-safe">
            <button (click)="closeDevicesModal()" class="w-full py-3 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface font-bold rounded-xl text-xs transition-colors cursor-pointer">
              Cerrar Gestión de Dispositivos
            </button>
          </div>

        </div>
      </div>

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

  // Modal State
  showDevicesModal = signal<boolean>(false);

  dispositivos = signal<DispositivoSesion[]>([
    {
      id: 'dev-1',
      nombre: 'Navegador Web Actual (Linux / Chrome 124)',
      tipo: 'desktop',
      ip: '190.224.89.12',
      ubicacion: 'Mendoza, Argentina',
      ultimoAcceso: 'Activo ahora',
      esActual: true
    },
    {
      id: 'dev-2',
      nombre: 'iPhone 15 Pro — App Oficial PAS',
      tipo: 'mobile',
      ip: '181.44.120.95',
      ubicacion: 'Mendoza, Argentina',
      ultimoAcceso: 'Hace 15 minutos',
      esActual: false
    },
    {
      id: 'dev-3',
      nombre: 'iPad Air 5° Gen — Portal Web Móvil',
      tipo: 'tablet',
      ip: '190.224.89.12',
      ubicacion: 'Mendoza, Argentina',
      ultimoAcceso: 'Ayer 18:30 hs',
      esActual: false
    }
  ]);

  auditoriaLogs: RegistroAuditoria[] = [
    { fecha: 'Hoy 11:35 hs', dispositivo: 'Chrome Linux', ip: '190.224.89.12', resultado: 'Exitoso' },
    { fecha: 'Hoy 11:20 hs', dispositivo: 'iPhone 15 Pro App', ip: '181.44.120.95', resultado: 'Exitoso' },
    { fecha: 'Ayer 22:15 hs', dispositivo: 'IP desconocida (EEUU)', ip: '45.33.21.110', resultado: 'Bloqueado anti-fuerza bruta' },
    { fecha: 'Ayer 18:30 hs', dispositivo: 'iPad Air Safari', ip: '190.224.89.12', resultado: 'Exitoso' }
  ];

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

  openDevicesModal() {
    this.showDevicesModal.set(true);
  }

  closeDevicesModal() {
    this.showDevicesModal.set(false);
  }

  generarNuevoQr() {
    alert('Se generó un nuevo código QR de vinculación válido por 5 minutos.');
  }

  cerrarOtrasSesiones() {
    const list = this.dispositivos().filter(d => d.esActual);
    this.dispositivos.set(list);
    alert('Se han revocado todas las demás sesiones activas por seguridad.');
  }

  revocarDispositivo(id: string, event?: Event) {
    if (event) event.stopPropagation();
    const list = this.dispositivos().filter(d => d.id !== id);
    this.dispositivos.set(list);
    alert('Sesión de dispositivo revocada exitosamente.');
  }
}
