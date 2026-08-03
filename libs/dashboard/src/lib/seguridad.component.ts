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

        <!-- Section 2: Autenticación Avanzada (2FA & Biometría) -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
          <div class="px-4 py-3 bg-blue-50/70 dark:bg-blue-950/40 border-b border-outline-variant/60 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-base">shield</span>
            <h3 class="text-xs font-bold text-primary uppercase tracking-wide">AUTENTICACIÓN AVANZADA (2FA & BIOMETRÍA)</h3>
          </div>
          <div class="divide-y divide-outline-variant/60">

            <!-- 2FA Row -->
            <button type="button" (click)="toggle2FA()" class="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-surface-container-low/50 active:bg-surface-container-low transition-colors cursor-pointer text-left">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-all"
                     [ngClass]="is2faEnabled() ? 'bg-blue-600/15 text-blue-600' : 'bg-surface-container text-outline'">
                  <span class="material-symbols-outlined text-xl">phonelink_lock</span>
                </div>
                <div class="min-w-0">
                  <p class="font-extrabold text-on-surface text-sm">Verificación en Dos Pasos (2FA)</p>
                  <p class="text-xs text-on-surface-variant mt-0.5">Código OTP por aplicación autenticadora o SMS.</p>
                  <span *ngIf="is2faEnabled()" class="inline-block mt-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">✓ ACTIVO</span>
                  <span *ngIf="!is2faEnabled()" class="inline-block mt-1 text-[10px] font-extrabold text-outline bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant">DESACTIVADO</span>
                </div>
              </div>
              <!-- iOS Toggle -->
              <div class="toggle-track shrink-0 ml-4" [ngClass]="is2faEnabled() ? 'toggle-on' : 'toggle-off'">
                <div class="toggle-thumb" [ngClass]="is2faEnabled() ? 'thumb-on' : 'thumb-off'"></div>
              </div>
            </button>

            <!-- Biometría Row -->
            <button type="button" (click)="toggleBiometric()" class="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-surface-container-low/50 active:bg-surface-container-low transition-colors cursor-pointer text-left">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-all"
                     [ngClass]="isBiometricEnabled() ? 'bg-purple-600/15 text-purple-600' : 'bg-surface-container text-outline'">
                  <span class="material-symbols-outlined text-xl">fingerprint</span>
                </div>
                <div class="min-w-0">
                  <p class="font-extrabold text-on-surface text-sm">Biometría (Face ID / Huella)</p>
                  <p class="text-xs text-on-surface-variant mt-0.5">Acceso directo en dispositivos móviles registrados.</p>
                  <span *ngIf="isBiometricEnabled()" class="inline-block mt-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">✓ ACTIVO</span>
                  <span *ngIf="!isBiometricEnabled()" class="inline-block mt-1 text-[10px] font-extrabold text-outline bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant">DESACTIVADO</span>
                </div>
              </div>
              <!-- iOS Toggle -->
              <div class="toggle-track shrink-0 ml-4" [ngClass]="isBiometricEnabled() ? 'toggle-bio-on' : 'toggle-off'">
                <div class="toggle-thumb" [ngClass]="isBiometricEnabled() ? 'thumb-on' : 'thumb-off'"></div>
              </div>
            </button>

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

        <!-- Footer Unificado -->
        <footer class="py-6 px-4 text-center border-t border-outline-variant/40 mt-8 mb-20 md:mb-4 space-y-1">
          <p class="text-xs text-on-surface-variant font-bold">JC Broker Platform — <span class="text-primary font-extrabold">v1.0.0</span></p>
          <p class="text-[11px] text-outline font-medium">© 2026 JC Organizadores • Operación Centralizada • Powered by <strong class="text-primary">Katrix</strong></p>
        </footer>
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

          <!-- Section C: Audit Logs History & Threat Defense -->
          <div class="space-y-3">
            <div class="flex justify-between items-center flex-wrap gap-1">
              <h4 class="text-xs font-bold text-outline uppercase tracking-wider">Historial de Accesos Recientes & Amenazas</h4>
              <button (click)="activarGeobloqueoTotal()" class="text-[11px] font-extrabold text-error hover:underline flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-outlined text-xs">public_off</span>
                <span>Activar Geobloqueo (Solo IP Argentina)</span>
              </button>
            </div>

            <!-- Threat Defense Actions Banner -->
            <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-red-600/20 text-red-600 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-lg">gavel</span>
                </div>
                <div>
                  <span class="font-extrabold text-red-900 dark:text-red-300 block">¿Detectaste un intento sosprechoso desde EEUU (45.33.21.110)?</span>
                  <span class="text-on-surface-variant text-[11px]">El sistema anti-fuerza bruta contuvo los 3 intentos. Podés aplicar sanción inmediata:</span>
                </div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0 w-full sm:w-auto">
                <button (click)="banearIpSospechosa('45.33.21.110')" class="flex-1 sm:flex-none px-2.5 py-1.5 bg-red-600 text-white font-bold rounded-lg text-[11px] hover:bg-red-700 transition-all cursor-pointer shadow-xs active:scale-95">
                  🚫 Banear IP EEUU
                </button>
                <button (click)="notificarIntentoSospechoso()" class="flex-1 sm:flex-none px-2.5 py-1.5 bg-slate-800 text-white font-bold rounded-lg text-[11px] hover:bg-slate-900 transition-all cursor-pointer active:scale-95">
                  📲 Notificar WhatsApp
                </button>
              </div>
            </div>

            <div class="space-y-1.5 bg-surface-container-low p-3 rounded-xl border border-outline-variant text-xs max-h-48 overflow-y-auto custom-scrollbar">
              <div *ngFor="let log of auditoriaLogs" class="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-outline-variant/40 last:border-0 gap-2">
                <div>
                  <div class="flex items-center gap-1.5">
                    <p class="font-bold text-on-surface">{{ log.dispositivo }}</p>
                    <span class="text-outline text-[11px]">({{ log.ip }})</span>
                  </div>
                  <p class="text-[10px] text-outline mt-0.5">{{ log.fecha }}</p>
                </div>

                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded"
                        [ngClass]="log.resultado === 'Exitoso' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-error/10 text-error border border-error/20'">
                    {{ log.resultado }}
                  </span>
                  
                  <button *ngIf="log.resultado !== 'Exitoso'" (click)="banearIpSospechosa(log.ip)" 
                          class="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded hover:bg-red-700 transition-colors cursor-pointer shadow-xs">
                    Banear IP
                  </button>
                </div>
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

      <!-- MODAL CONFIGURACIÓN 2FA OTP -->
      <div *ngIf="show2faModal()" class="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-[80] animate-in fade-in">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
          <div class="flex justify-between items-start pb-3 border-b border-outline-variant">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-xl">phonelink_lock</span>
              <h3 class="font-extrabold text-base text-on-surface">Configurar 2FA (Google Authenticator)</h3>
            </div>
            <button (click)="close2faModal()" class="text-outline hover:text-on-surface p-1 rounded-lg cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <p class="text-on-surface-variant">1. Escaneá este código QR con Google Authenticator, Authy o Microsoft Authenticator:</p>
            <div class="flex justify-center p-3 bg-white rounded-xl border border-outline-variant">
              <div class="w-32 h-32 bg-slate-950 rounded-lg p-2 flex flex-wrap gap-1 items-center justify-around">
                <div class="w-4 h-4 bg-white"></div>
                <div class="w-4 h-4 bg-blue-500"></div>
                <div class="w-4 h-4 bg-white"></div>
                <div class="w-4 h-4 bg-emerald-400"></div>
                <div class="w-4 h-4 bg-white"></div>
                <div class="w-4 h-4 bg-white"></div>
              </div>
            </div>
            <p class="text-[11px] text-center text-outline">Clave de recuperación: <strong class="text-primary font-mono select-all">JCORG-PAS-86992-SEC</strong></p>

            <div class="space-y-1.5 pt-2">
              <label class="font-bold text-on-surface block">2. Ingresá el código OTP de 6 dígitos:</label>
              <input type="text" maxlength="6" [(ngModel)]="otpCode" placeholder="Ej: 482910"
                     class="w-full text-center tracking-[0.5em] font-mono text-lg p-3 bg-surface-container-low border border-outline-variant rounded-xl text-primary font-black">
            </div>
          </div>

          <div class="pt-3 flex gap-2">
            <button (click)="confirm2FA()" class="flex-1 bg-primary text-white font-bold py-3 rounded-xl text-xs hover:bg-primary-container cursor-pointer shadow-xs">
              Verificar & Activar 2FA
            </button>
            <button (click)="close2faModal()" class="px-4 bg-surface-container text-on-surface font-bold py-3 rounded-xl text-xs hover:bg-surface-container-high cursor-pointer">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL ESCÁNER BIOMÉTRICO (FACE ID / HUELLA) -->
      <div *ngIf="showBiometricModal()" class="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-[80] animate-in fade-in">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
          <div class="w-20 h-20 rounded-full bg-blue-500/10 text-primary mx-auto flex items-center justify-center animate-pulse border border-primary/20">
            <span class="material-symbols-outlined text-4xl" [ngClass]="biometricSuccess() ? 'text-emerald-500' : 'text-primary'">
              {{ biometricSuccess() ? 'verified' : 'fingerprint' }}
            </span>
          </div>

          <div>
            <h3 class="font-extrabold text-base text-on-surface">Biometría (Face ID / Huella)</h3>
            <p class="text-xs text-on-surface-variant mt-1.5 font-medium">{{ biometricStatusText() }}</p>
          </div>

          <div class="pt-2">
            <button *ngIf="biometricSuccess()" (click)="closeBiometricModal()" class="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs hover:bg-emerald-700 cursor-pointer shadow-xs">
              ¡Excelente! Continuar
            </button>
            <button *ngIf="!biometricSuccess()" (click)="closeBiometricModal()" class="w-full bg-surface-container text-on-surface font-bold py-3 rounded-xl text-xs hover:bg-surface-container-high cursor-pointer">
              Cancelar
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }

    /* iOS-style Toggle Switch */
    .toggle-track {
      position: relative;
      width: 52px;
      height: 30px;
      border-radius: 999px;
      transition: background-color 0.25s ease;
      -webkit-tap-highlight-color: transparent;
      display: flex;
      align-items: center;
      padding: 0 3px;
      box-sizing: border-box;
    }
    .toggle-on  { background-color: #2563eb; }
    .toggle-bio-on { background-color: #7c3aed; }
    .toggle-off { background-color: #9ca3af; }

    .toggle-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #ffffff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      will-change: transform;
    }
    .thumb-on  { transform: translateX(22px); }
    .thumb-off { transform: translateX(0); }
  `]
})
export class SeguridadComponent {
  currentPass = '';
  newPass = '';
  passStrength = signal<number>(0);
  passStrengthLabel = signal<string>('Sin definir');

  is2faEnabled = signal<boolean>(true);
  isBiometricEnabled = signal<boolean>(true);

  // Modales & Amenazas
  showDevicesModal = signal<boolean>(false);
  show2faModal = signal<boolean>(false);
  showBiometricModal = signal<boolean>(false);
  otpCode = '';
  biometricStatusText = signal<string>('Escaneando rostro / huella digital en este dispositivo...');
  biometricSuccess = signal<boolean>(false);

  ipBaneadas = signal<string[]>([]);
  geobloqueoActivo = signal<boolean>(true);

  banearIpSospechosa(ip: string) {
    if (!this.ipBaneadas().includes(ip)) {
      this.ipBaneadas.update(list => [...list, ip]);
    }
    alert(`🚨 IP ${ip} BLOQUEADA permanentemente en Firewall. Ninguna petición ni intento de acceso proveniente de esta IP podrá llegar al servidor.`);
  }

  activarGeobloqueoTotal() {
    this.geobloqueoActivo.set(true);
    alert('🛡️ Geobloqueo Internacional Activado: Se denegará el acceso a cualquier dirección IP proveniente fuera de Argentina (EEUU, Europa, Asia).');
  }

  notificarIntentoSospechoso() {
    const msg = `⚠️ *ALERTA DE SEGURIDAD JC BROKER*\nSe detectó e impidió un intento de acceso no autorizado a tu cuenta desde EEUU (IP: 45.33.21.110).\nLa IP fue bloqueada por el sistema anti-fuerza bruta.`;
    const phone = '02614238800';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

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

  toggle2FA() {
    if (!this.is2faEnabled()) {
      // Activar: abrir modal de configuración OTP
      this.otpCode = '';
      this.show2faModal.set(true);
    } else {
      // Desactivar directamente
      this.is2faEnabled.set(false);
    }
  }

  confirm2FA() {
    if (!this.otpCode || this.otpCode.length < 6) {
      alert('Ingresá el código OTP de 6 dígitos de tu aplicación autenticadora.');
      return;
    }
    this.is2faEnabled.set(true);
    this.show2faModal.set(false);
  }

  close2faModal() {
    this.show2faModal.set(false);
  }

  toggleBiometric() {
    if (!this.isBiometricEnabled()) {
      // Activar: abrir modal de escáner biométrico
      this.biometricSuccess.set(false);
      this.biometricStatusText.set('Escaneando rostro / huella digital en este dispositivo...');
      this.showBiometricModal.set(true);

      setTimeout(() => {
        this.biometricStatusText.set('¡Identidad Biométrica Confirmada! Dispositivo registrado.');
        this.biometricSuccess.set(true);
        this.isBiometricEnabled.set(true);
      }, 1800);
    } else {
      // Desactivar directamente
      this.isBiometricEnabled.set(false);
    }
  }

  closeBiometricModal() {
    this.showBiometricModal.set(false);
  }

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
