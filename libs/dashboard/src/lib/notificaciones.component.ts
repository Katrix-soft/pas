import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PushNotificationService } from './services/push-notification.service';

export interface AlertaNotificacion {
  id: string;
  titulo: string;
  subtitulo: string;
  tipo: 'error' | 'warning' | 'info' | 'success';
  categoria: 'siniestro' | 'cobranza' | 'cartera';
  fecha: string;
  leido: boolean;
  link?: string;
}

export interface NotifPrefs {
  masterMuted: boolean;
  dndEnabled: boolean;
  dndFrom: string;
  dndTo: string;
  sound: boolean;
  vibration: boolean;
  // categorías
  emitidas: boolean;
  renovaciones: boolean;
  rechazos: boolean;
  deuda: boolean;
  inspeccion: boolean;
  liquidacion: boolean;
  seguridad: boolean;
  sistema: boolean;
}

const PREFS_KEY = 'jc_notif_prefs';

const defaultPrefs: NotifPrefs = {
  masterMuted: false,
  dndEnabled: false,
  dndFrom: '22:00',
  dndTo: '08:00',
  sound: true,
  vibration: true,
  emitidas: true,
  renovaciones: true,
  rechazos: true,
  deuda: true,
  inspeccion: true,
  liquidacion: true,
  seguridad: true,
  sistema: true,
};

// ─────────────────────────────────────────────────────────

@Component({
  selector: 'lib-notificaciones',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  template: `
    <div class="flex flex-col min-h-screen text-on-surface bg-surface font-body-md pb-28 overflow-x-hidden">
      <!-- TopAppBar -->
      <header class="w-full sticky top-0 z-40 bg-surface/95 dark:bg-on-background/95 backdrop-blur-md border-b border-outline-variant flex items-center justify-between h-14 px-4 sm:px-6">
        <div class="flex items-center gap-3">
          <button routerLink="/dashboard" class="p-2 rounded-full hover:bg-surface-container-high transition-colors active:opacity-70 cursor-pointer">
            <span class="material-symbols-outlined text-primary text-xl">arrow_back</span>
          </button>
          <h1 class="font-bold text-base sm:text-lg text-primary tracking-tight">Notificaciones y Alertas</h1>
        </div>

        <div class="flex items-center gap-2">
          <span *ngIf="pushService.isSubscribedBackend() && !prefs().masterMuted"
                class="bg-emerald-500/10 text-emerald-600 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            PUSH ACTIVO
          </span>
          <span *ngIf="prefs().masterMuted"
                class="bg-slate-500/10 text-slate-500 text-xs font-black px-3 py-1 rounded-full border border-slate-400/30 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm">notifications_off</span>
            SILENCIADO
          </span>
          <span *ngIf="!pushService.isSubscribedBackend() && !prefs().masterMuted"
                (click)="activarNotificaciones()"
                class="bg-amber-500/10 text-amber-600 text-xs font-black px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/20 transition-all">
            <span class="material-symbols-outlined text-sm">notifications_active</span>
            ACTIVAR
          </span>
        </div>
      </header>

      <main class="flex-grow px-4 sm:px-6 py-4 max-w-4xl mx-auto w-full space-y-5">

        <!-- ═══════════════════════════════════════════════════════
             CARD 1 — SILENCIAR TODO (Maestro) + DND
        ════════════════════════════════════════════════════════ -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
          <!-- Header maestro -->
          <div class="px-4 py-3 border-b border-outline-variant flex items-center gap-2"
               [ngClass]="prefs().masterMuted ? 'bg-slate-100/60 dark:bg-slate-900/40' : 'bg-surface-container-low'">
            <span class="material-symbols-outlined text-base" [ngClass]="prefs().masterMuted ? 'text-slate-500' : 'text-primary'">
              {{ prefs().masterMuted ? 'notifications_off' : 'notifications_active' }}
            </span>
            <h2 class="text-xs font-bold uppercase flex-1" [ngClass]="prefs().masterMuted ? 'text-slate-500' : 'text-primary'">
              Control Maestro de Notificaciones
            </h2>
          </div>

          <div class="divide-y divide-outline-variant">

            <!-- Toggle Maestro: Silenciar TODAS -->
            <div class="flex items-center justify-between p-4 sm:p-5 hover:bg-surface-container-low/50 transition-colors">
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-all"
                     [ngClass]="prefs().masterMuted ? 'bg-slate-500/15 text-slate-500' : 'bg-emerald-500/15 text-emerald-600'">
                  <span class="material-symbols-outlined text-xl">{{ prefs().masterMuted ? 'volume_off' : 'volume_up' }}</span>
                </div>
                <div class="min-w-0">
                  <p class="font-extrabold text-sm text-on-surface">{{ prefs().masterMuted ? 'Todas las notificaciones silenciadas' : 'Notificaciones activas' }}</p>
                  <p class="text-xs text-on-surface-variant mt-0.5">{{ prefs().masterMuted ? 'No recibirás ningún aviso ni ruidito hasta que reactives.' : 'Recibirás alertas de siniestros, cobranzas y cartera.' }}</p>
                </div>
              </div>
              <button type="button" (click)="toggleMaster()" class="shrink-0 ml-4 cursor-pointer -webkit-tap-highlight-color-transparent">
                <div class="toggle-track" [ngClass]="prefs().masterMuted ? 'toggle-muted' : 'toggle-on'">
                  <div class="toggle-thumb" [ngClass]="prefs().masterMuted ? 'thumb-on' : 'thumb-off'"></div>
                </div>
              </button>
            </div>

            <!-- Toggle: Sonido (ruidito) -->
            <div class="flex items-center justify-between p-4 sm:p-5 transition-colors"
                 [ngClass]="prefs().masterMuted ? 'opacity-40 pointer-events-none' : 'hover:bg-surface-container-low/50'">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-all"
                     [ngClass]="prefs().sound ? 'bg-indigo-500/15 text-indigo-600' : 'bg-surface-container text-outline'">
                  <span class="material-symbols-outlined text-xl">{{ prefs().sound ? 'music_note' : 'music_off' }}</span>
                </div>
                <div>
                  <p class="font-extrabold text-sm text-on-surface">Sonido de Alerta ("ruidito")</p>
                  <p class="text-xs text-on-surface-variant mt-0.5">Tono suave tipo marimba al llegar un aviso.</p>
                </div>
              </div>
              <button type="button" (click)="togglePref('sound')" class="shrink-0 ml-4 cursor-pointer">
                <div class="toggle-track" [ngClass]="prefs().sound ? 'toggle-on' : 'toggle-off'">
                  <div class="toggle-thumb" [ngClass]="prefs().sound ? 'thumb-on' : 'thumb-off'"></div>
                </div>
              </button>
            </div>

            <!-- Toggle: Vibración -->
            <div class="flex items-center justify-between p-4 sm:p-5 transition-colors"
                 [ngClass]="prefs().masterMuted ? 'opacity-40 pointer-events-none' : 'hover:bg-surface-container-low/50'">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-all"
                     [ngClass]="prefs().vibration ? 'bg-purple-500/15 text-purple-600' : 'bg-surface-container text-outline'">
                  <span class="material-symbols-outlined text-xl">vibration</span>
                </div>
                <div>
                  <p class="font-extrabold text-sm text-on-surface">Vibración</p>
                  <p class="text-xs text-on-surface-variant mt-0.5">Vibrar el celular al recibir cada alerta.</p>
                </div>
              </div>
              <button type="button" (click)="togglePref('vibration')" class="shrink-0 ml-4 cursor-pointer">
                <div class="toggle-track" [ngClass]="prefs().vibration ? 'toggle-on' : 'toggle-off'">
                  <div class="toggle-thumb" [ngClass]="prefs().vibration ? 'thumb-on' : 'thumb-off'"></div>
                </div>
              </button>
            </div>

            <!-- Modo No Molestar -->
            <div [ngClass]="prefs().masterMuted ? 'opacity-40 pointer-events-none' : ''">
              <div class="flex items-center justify-between p-4 sm:p-5 hover:bg-surface-container-low/50 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-all"
                       [ngClass]="prefs().dndEnabled ? 'bg-amber-500/15 text-amber-600' : 'bg-surface-container text-outline'">
                    <span class="material-symbols-outlined text-xl">bedtime</span>
                  </div>
                  <div>
                    <p class="font-extrabold text-sm text-on-surface">Modo No Molestar (DND)</p>
                    <p class="text-xs text-on-surface-variant mt-0.5">Silencia entre horarios definidos. <span *ngIf="prefs().dndEnabled" class="font-bold text-amber-600">{{ prefs().dndFrom }} → {{ prefs().dndTo }}</span></p>
                  </div>
                </div>
                <button type="button" (click)="togglePref('dndEnabled')" class="shrink-0 ml-4 cursor-pointer">
                  <div class="toggle-track" [ngClass]="prefs().dndEnabled ? 'toggle-amber' : 'toggle-off'">
                    <div class="toggle-thumb" [ngClass]="prefs().dndEnabled ? 'thumb-on' : 'thumb-off'"></div>
                  </div>
                </button>
              </div>

              <!-- Horario DND (visible solo si activado) -->
              <div *ngIf="prefs().dndEnabled" class="px-4 pb-4 grid grid-cols-2 gap-3 bg-amber-50/30 dark:bg-amber-900/10 border-t border-amber-200/30">
                <div class="pt-3">
                  <label class="block text-[10px] font-bold text-outline uppercase mb-1">Desde</label>
                  <input type="time" [ngModel]="prefs().dndFrom" (ngModelChange)="updateDndTime('dndFrom', $event)"
                         class="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-mono text-sm cursor-pointer">
                </div>
                <div class="pt-3">
                  <label class="block text-[10px] font-bold text-outline uppercase mb-1">Hasta</label>
                  <input type="time" [ngModel]="prefs().dndTo" (ngModelChange)="updateDndTime('dndTo', $event)"
                         class="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-mono text-sm cursor-pointer">
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════
             CARD 2 — CATEGORÍAS INDIVIDUALES
        ════════════════════════════════════════════════════════ -->
        <section class="space-y-3" [ngClass]="prefs().masterMuted ? 'opacity-50 pointer-events-none' : ''">
          <h2 class="text-xs font-bold text-outline uppercase tracking-wider flex items-center gap-1.5 px-1">
            <span class="material-symbols-outlined text-primary text-base">tune</span>
            Filtrar por Tipo de Alerta
          </h2>

          <!-- Cartera -->
          <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
            <div class="px-4 py-2.5 bg-surface-container-low border-b border-outline-variant flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">folder_special</span>
              <h3 class="text-xs font-bold text-primary uppercase">Eventos de Cartera</h3>
            </div>
            <div class="divide-y divide-outline-variant">

              <div class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-container-high/50 transition-colors">
                <div>
                  <p class="text-sm font-semibold text-on-surface">Nuevas Pólizas Emitidas</p>
                  <p class="text-xs text-on-surface-variant">Cuando Mercantil Andina emite una nueva póliza.</p>
                </div>
                <button type="button" (click)="togglePref('emitidas')" class="shrink-0 ml-3 cursor-pointer">
                  <div class="toggle-track-sm" [ngClass]="prefs().emitidas ? 'toggle-on' : 'toggle-off'">
                    <div class="toggle-thumb-sm" [ngClass]="prefs().emitidas ? 'thumb-sm-on' : 'thumb-sm-off'"></div>
                  </div>
                </button>
              </div>

              <div class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-container-high/50 transition-colors">
                <div>
                  <p class="text-sm font-semibold text-on-surface">Próximas Renovaciones (30 días)</p>
                  <p class="text-xs text-on-surface-variant">Aviso previo al vencimiento de una póliza.</p>
                </div>
                <button type="button" (click)="togglePref('renovaciones')" class="shrink-0 ml-3 cursor-pointer">
                  <div class="toggle-track-sm" [ngClass]="prefs().renovaciones ? 'toggle-on' : 'toggle-off'">
                    <div class="toggle-thumb-sm" [ngClass]="prefs().renovaciones ? 'thumb-sm-on' : 'thumb-sm-off'"></div>
                  </div>
                </button>
              </div>

            </div>
          </div>

          <!-- Cobranzas -->
          <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
            <div class="px-4 py-2.5 bg-surface-container-low border-b border-outline-variant flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">payments</span>
              <h3 class="text-xs font-bold text-primary uppercase">Cobranzas y Morosidad</h3>
            </div>
            <div class="divide-y divide-outline-variant">

              <div class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-container-high/50 transition-colors">
                <div>
                  <p class="text-sm font-semibold text-on-surface">Rechazos de Débito Automático</p>
                  <p class="text-xs text-on-surface-variant">Cuota que no pudo debitarse en banco.</p>
                </div>
                <button type="button" (click)="togglePref('rechazos')" class="shrink-0 ml-3 cursor-pointer">
                  <div class="toggle-track-sm" [ngClass]="prefs().rechazos ? 'toggle-on' : 'toggle-off'">
                    <div class="toggle-thumb-sm" [ngClass]="prefs().rechazos ? 'thumb-sm-on' : 'thumb-sm-off'"></div>
                  </div>
                </button>
              </div>

              <div class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-container-high/50 transition-colors">
                <div>
                  <p class="text-sm font-semibold text-on-surface">Alertas de Cuotas Vencidas</p>
                  <p class="text-xs text-on-surface-variant">Clientes con cuotas impagas pendientes.</p>
                </div>
                <button type="button" (click)="togglePref('deuda')" class="shrink-0 ml-3 cursor-pointer">
                  <div class="toggle-track-sm" [ngClass]="prefs().deuda ? 'toggle-on' : 'toggle-off'">
                    <div class="toggle-thumb-sm" [ngClass]="prefs().deuda ? 'thumb-sm-on' : 'thumb-sm-off'"></div>
                  </div>
                </button>
              </div>

            </div>
          </div>

          <!-- Siniestros -->
          <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
            <div class="px-4 py-2.5 bg-surface-container-low border-b border-outline-variant flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">report_problem</span>
              <h3 class="text-xs font-bold text-primary uppercase">Tramitación de Siniestros</h3>
            </div>
            <div class="divide-y divide-outline-variant">

              <div class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-container-high/50 transition-colors">
                <div>
                  <p class="text-sm font-semibold text-on-surface">Cambios de Estado en Inspecciones</p>
                  <p class="text-xs text-on-surface-variant">Inspector aprueba, rechaza o asigna taller.</p>
                </div>
                <button type="button" (click)="togglePref('inspeccion')" class="shrink-0 ml-3 cursor-pointer">
                  <div class="toggle-track-sm" [ngClass]="prefs().inspeccion ? 'toggle-on' : 'toggle-off'">
                    <div class="toggle-thumb-sm" [ngClass]="prefs().inspeccion ? 'thumb-sm-on' : 'thumb-sm-off'"></div>
                  </div>
                </button>
              </div>

              <div class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-container-high/50 transition-colors">
                <div>
                  <p class="text-sm font-semibold text-on-surface">Liquidación de Pagos y Talleres</p>
                  <p class="text-xs text-on-surface-variant">Pago a beneficiario o taller aprobado.</p>
                </div>
                <button type="button" (click)="togglePref('liquidacion')" class="shrink-0 ml-3 cursor-pointer">
                  <div class="toggle-track-sm" [ngClass]="prefs().liquidacion ? 'toggle-on' : 'toggle-off'">
                    <div class="toggle-thumb-sm" [ngClass]="prefs().liquidacion ? 'thumb-sm-on' : 'thumb-sm-off'"></div>
                  </div>
                </button>
              </div>

            </div>
          </div>

          <!-- Sistema y Seguridad -->
          <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
            <div class="px-4 py-2.5 bg-surface-container-low border-b border-outline-variant flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">security</span>
              <h3 class="text-xs font-bold text-primary uppercase">Sistema y Seguridad</h3>
            </div>
            <div class="divide-y divide-outline-variant">

              <div class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-container-high/50 transition-colors">
                <div>
                  <p class="text-sm font-semibold text-on-surface">Alertas de Seguridad (2FA, IP)</p>
                  <p class="text-xs text-on-surface-variant">Intentos de acceso sospechosos o bloqueos.</p>
                </div>
                <button type="button" (click)="togglePref('seguridad')" class="shrink-0 ml-3 cursor-pointer">
                  <div class="toggle-track-sm" [ngClass]="prefs().seguridad ? 'toggle-on' : 'toggle-off'">
                    <div class="toggle-thumb-sm" [ngClass]="prefs().seguridad ? 'thumb-sm-on' : 'thumb-sm-off'"></div>
                  </div>
                </button>
              </div>

              <div class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-container-high/50 transition-colors">
                <div>
                  <p class="text-sm font-semibold text-on-surface">Actualizaciones del Sistema</p>
                  <p class="text-xs text-on-surface-variant">Cambios importantes en la plataforma Katrix.</p>
                </div>
                <button type="button" (click)="togglePref('sistema')" class="shrink-0 ml-3 cursor-pointer">
                  <div class="toggle-track-sm" [ngClass]="prefs().sistema ? 'toggle-on' : 'toggle-off'">
                    <div class="toggle-thumb-sm" [ngClass]="prefs().sistema ? 'thumb-sm-on' : 'thumb-sm-off'"></div>
                  </div>
                </button>
              </div>

            </div>
          </div>

        </section>

        <!-- ═══════════════════════════════════════════════════════
             CARD 3 — PUSH: Estado + Test + Desuscribir
        ════════════════════════════════════════════════════════ -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div class="flex items-center gap-2 pb-1">
            <span class="material-symbols-outlined text-primary text-base">phonelink_ring</span>
            <h2 class="text-xs font-bold text-primary uppercase">Notificaciones Push (Celular)</h2>
          </div>

          <!-- Estado + Activar -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                   [ngClass]="pushService.isSubscribedBackend() ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'">
                <span class="material-symbols-outlined">{{ pushService.isSubscribedBackend() ? 'notifications_active' : 'notifications_off' }}</span>
              </div>
              <div>
                <p class="font-bold text-sm text-on-surface">{{ pushService.isSubscribedBackend() ? 'Push activo en este dispositivo' : 'Push no activado' }}</p>
                <p class="text-xs text-on-surface-variant">{{ pushService.isSubscribedBackend() ? 'Recibirás alertas en la persiana del celular.' : 'Tocá el botón para recibir avisos en pantalla bloqueada.' }}</p>
              </div>
            </div>
            <button *ngIf="!pushService.isSubscribedBackend()"
                    (click)="activarNotificaciones()"
                    [disabled]="pushService.isSubscribing() || pushDenied()"
                    class="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="material-symbols-outlined text-lg">{{ pushService.isSubscribing() ? 'progress_activity' : 'phonelink_ring' }}</span>
              <span>{{ pushService.isSubscribing() ? 'Solicitando permiso...' : 'Activar Push en este dispositivo' }}</span>
            </button>
          </div>

          <!-- Banner: Permiso Denegado por el navegador -->
          <div *ngIf="pushDenied()" class="flex items-start gap-3 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-300/50 rounded-xl p-3.5 text-xs">
            <span class="material-symbols-outlined text-amber-600 text-xl shrink-0 mt-0.5">info</span>
            <div>
              <p class="font-bold text-amber-800 dark:text-amber-300">Permiso bloqueado en el navegador</p>
              <p class="text-amber-700 dark:text-amber-400 mt-0.5">El navegador tiene las notificaciones bloqueadas para este sitio. Para habilitarlas: hacé clic en el 🔒 candado en la barra de dirección → <strong>Notificaciones → Permitir</strong> → recargá la página.</p>
            </div>
          </div>

          <!-- Banner: Error genérico -->
          <div *ngIf="pushError() && !pushDenied()" class="flex items-start gap-3 bg-error/8 border border-error/25 rounded-xl p-3.5 text-xs">
            <span class="material-symbols-outlined text-error text-xl shrink-0 mt-0.5">error</span>
            <div>
              <p class="font-bold text-error">No se pudo activar el push</p>
              <p class="text-on-surface-variant mt-0.5">{{ pushError() }}</p>
            </div>
          </div>

          <!-- Probar Notificación -->
          <div *ngIf="!prefs().masterMuted" class="pt-3 border-t border-outline-variant/60 space-y-2">
            <span class="text-xs font-bold text-outline uppercase tracking-wider">Probar ahora:</span>
            <div class="flex flex-wrap gap-2">
              <button (click)="simularAlertaSiniestro()" class="px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-primary/20 active:scale-95">
                <span>🚨 Siniestro</span>
              </button>
              <button (click)="simularAlertaCobranza()" class="px-3.5 py-2 bg-error/10 hover:bg-error/20 text-error rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-error/20 active:scale-95">
                <span>💳 Cobranza</span>
              </button>
              <button (click)="simularAlertaEmision()" class="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-500/20 active:scale-95">
                <span>✅ Póliza</span>
              </button>
            </div>
          </div>

          <!-- Desuscribir del push -->
          <div *ngIf="pushService.isSubscribedBackend()" class="pt-3 border-t border-outline-variant/60">
            <button (click)="desuscribirPush()"
                    class="w-full py-2.5 bg-error/8 hover:bg-error/15 border border-error/25 text-error font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-base">notifications_off</span>
              Desactivar notificaciones en este dispositivo
            </button>
          </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════
             CARD 4 — HISTORIAL DE ALERTAS
        ════════════════════════════════════════════════════════ -->
        <section class="space-y-3">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
            <h2 class="text-xs font-bold text-outline uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-primary text-base">history</span>
              <span>Historial ({{ unreadCount() }} no leídas)</span>
            </h2>
            <div class="flex items-center gap-2">
              <button *ngIf="unreadCount() > 0" (click)="marcarTodasLeidas()" class="text-xs font-bold text-primary hover:underline cursor-pointer">
                Marcar todas leídas
              </button>
              <button *ngIf="alertList().length > 0" (click)="limpiarHistorial()" class="text-xs font-bold text-error hover:underline cursor-pointer">
                Limpiar todo
              </button>
            </div>
          </div>

          <!-- Filtro chips -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              *ngFor="let cat of ['todas', 'noleidas', 'siniestro', 'cobranza', 'cartera']"
              (click)="filtroCategoria.set(cat)"
              class="px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 capitalize cursor-pointer border"
              [ngClass]="filtroCategoria() === cat ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container-high'"
            >
              {{ cat === 'noleidas' ? 'No leídas (' + unreadCount() + ')' : cat }}
            </button>
          </div>

          <!-- Items -->
          <div class="space-y-2.5">
            <div
              *ngFor="let alert of filteredAlerts()"
              (click)="marcarLeida(alert.id)"
              class="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xs hover:shadow-md transition-all flex items-start justify-between gap-3 border-l-4 cursor-pointer"
              [ngClass]="{
                'border-l-error': alert.tipo === 'error',
                'border-l-amber-500': alert.tipo === 'warning',
                'border-l-primary': alert.tipo === 'info',
                'border-l-emerald-600': alert.tipo === 'success',
                'bg-primary/5': !alert.leido
              }"
            >
              <div class="flex items-start gap-3 min-w-0">
                <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                     [ngClass]="{
                       'bg-error/10 text-error': alert.tipo === 'error',
                       'bg-amber-500/10 text-amber-600': alert.tipo === 'warning',
                       'bg-primary/10 text-primary': alert.tipo === 'info',
                       'bg-emerald-500/10 text-emerald-600': alert.tipo === 'success'
                     }">
                  <span class="material-symbols-outlined text-lg">
                    {{ alert.tipo === 'error' ? 'priority_high' : alert.tipo === 'warning' ? 'warning' : alert.tipo === 'success' ? 'check_circle' : 'info' }}
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <p class="font-bold text-xs sm:text-sm text-on-surface truncate">{{ alert.titulo }}</p>
                    <span *ngIf="!alert.leido" class="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                  </div>
                  <p class="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{{ alert.subtitulo }}</p>
                  <p class="text-[10px] text-outline mt-1 font-semibold">{{ alert.fecha }}</p>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2 shrink-0">
                <a *ngIf="alert.link" [routerLink]="alert.link" class="text-xs font-bold text-primary hover:underline p-1">Ver →</a>
                <button (click)="eliminarAlerta(alert.id); $event.stopPropagation()" class="text-outline hover:text-error text-xs p-1 cursor-pointer">
                  <span class="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>

            <div *ngIf="filteredAlerts().length === 0" class="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant text-outline">
              <span class="material-symbols-outlined text-3xl">notifications_off</span>
              <p class="text-xs font-bold mt-2">Sin notificaciones en esta categoría.</p>
            </div>
          </div>
        </section>

        <!-- Guardar -->
        <div class="pt-1">
          <button (click)="saveChanges($event)"
                  class="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-sm transition-all hover:bg-primary-container active:scale-[0.99] cursor-pointer text-sm">
            Guardar Preferencias
          </button>
        </div>

        <footer class="py-6 px-4 text-center border-t border-outline-variant/40 mt-4 mb-20 md:mb-4 space-y-1">
          <p class="text-xs text-on-surface-variant font-bold">JC Broker Platform — <span class="text-primary font-extrabold">v1.0.0</span></p>
          <p class="text-[11px] text-outline font-medium">© 2026 JC Organizadores • Operación Centralizada • Powered by <strong class="text-primary">Katrix</strong></p>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }

    /* ── iOS Toggle Grande ── */
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
      cursor: pointer;
    }
    .toggle-on    { background-color: #2563eb; }
    .toggle-muted { background-color: #64748b; }
    .toggle-amber { background-color: #d97706; }
    .toggle-off   { background-color: #9ca3af; }

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

    /* ── iOS Toggle Pequeño ── */
    .toggle-track-sm {
      position: relative;
      width: 42px;
      height: 24px;
      border-radius: 999px;
      transition: background-color 0.25s ease;
      -webkit-tap-highlight-color: transparent;
      display: flex;
      align-items: center;
      padding: 0 2px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .toggle-thumb-sm {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #ffffff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
      will-change: transform;
    }
    .thumb-sm-on  { transform: translateX(18px); }
    .thumb-sm-off { transform: translateX(0); }
  `]
})
export class NotificacionesComponent implements OnInit {
  pushService = inject(PushNotificationService);

  filtroCategoria = signal<string>('todas');
  prefs = signal<NotifPrefs>({ ...defaultPrefs });

  alertList = signal<AlertaNotificacion[]>([
    {
      id: 'a1',
      titulo: '🚨 Inspección Aprobada: Siniestro #98412',
      subtitulo: 'Mercantil Andina autorizó la reparación en Taller Cuyo SRL (Chevrolet Spin).',
      tipo: 'warning',
      categoria: 'siniestro',
      fecha: 'Hace 10 minutos',
      leido: false,
      link: '/siniestros'
    },
    {
      id: 'a2',
      titulo: '💳 Cuota Impaga: Mario Bustos',
      subtitulo: 'Cuota 07/2026 vencida ($23.322). Link de cuponera generado.',
      tipo: 'error',
      categoria: 'cobranza',
      fecha: 'Hace 45 minutos',
      leido: false,
      link: '/cobranzas'
    },
    {
      id: 'a3',
      titulo: '✅ Póliza Emitida Exitosamente',
      subtitulo: 'Endoso #492815 asignado a Toyota Hilux de Roberto Gómez.',
      tipo: 'success',
      categoria: 'cartera',
      fecha: 'Hoy 09:15 hs',
      leido: true
    }
  ]);

  unreadCount = computed(() => this.alertList().filter(a => !a.leido).length);

  filteredAlerts = computed(() => {
    const cat = this.filtroCategoria();
    const list = this.alertList();
    if (cat === 'todas') return list;
    if (cat === 'noleidas') return list.filter(a => !a.leido);
    return list.filter(a => a.categoria === cat);
  });

  pushDenied = signal<boolean>(false);
  pushError = signal<string | null>(null);

  // ── Lifecycle ──────────────────────────────────────────────
  ngOnInit() {
    this.loadPrefs();
    // Detectar si el permiso ya fue denegado previamente (sin disparar alert)
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.pushDenied.set((Notification.permission as string) === 'denied');
    }
  }

  // ── Persistencia ───────────────────────────────────────────
  private loadPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        this.prefs.set({ ...defaultPrefs, ...JSON.parse(raw) });
      }
    } catch { }
  }

  private savePrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(this.prefs()));
    } catch { }
  }

  // ── Toggles ────────────────────────────────────────────────
  toggleMaster() {
    this.prefs.update(p => ({ ...p, masterMuted: !p.masterMuted }));
    this.savePrefs();
  }

  togglePref(key: keyof NotifPrefs) {
    this.prefs.update(p => ({ ...p, [key]: !p[key] }));
    this.savePrefs();
  }

  updateDndTime(field: 'dndFrom' | 'dndTo', value: string) {
    this.prefs.update(p => ({ ...p, [field]: value }));
    this.savePrefs();
  }

  // ── Push ───────────────────────────────────────────────────
  async activarNotificaciones() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      this.pushError.set('Tu navegador no soporta notificaciones push.');
      return;
    }
    if ((Notification.permission as string) === 'denied') {
      this.pushDenied.set(true);
      return;
    }
    this.pushError.set(null);
    this.pushDenied.set(false);
    try {
      const ok = await this.pushService.solicitarPermisoYSuscribir();
      if (!ok) {
        if ((Notification.permission as string) === 'denied') {
          this.pushDenied.set(true);
        } else {
          this.pushError.set('No se pudo completar la suscripción push. Intentá de nuevo.');
        }
      }
    } catch (e: any) {
      this.pushError.set(e?.message || 'Error inesperado al activar push.');
    }
  }

  async desuscribirPush() {
    if (!confirm('¿Desactivar las notificaciones push en este dispositivo?')) return;
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          const sub = await reg.pushManager.getSubscription();
          if (sub) await sub.unsubscribe();
        }
      }
      this.pushService.isSubscribedBackend.set(false);
    } catch (e) { }
  }

  // ── Alertas test ───────────────────────────────────────────
  simularAlertaSiniestro() {
    if (this.prefs().masterMuted || !this.prefs().inspeccion) return;
    this.pushService.emitirAlerta({
      id: 'sin-' + Date.now(),
      titulo: '🚨 Nuevo Siniestro Reportado #98412',
      mensaje: 'Cliente Juan Pérez reportó choque en Mendoza. Taller asignado: Cuyo SRL.',
      tipo: 'siniestro',
      icon: 'report_problem',
      remitente: '🚨 SINIESTROS MERCANTIL',
      link: '/siniestros',
      hora: 'Ahora'
    });
  }

  simularAlertaCobranza() {
    if (this.prefs().masterMuted || !this.prefs().deuda) return;
    this.pushService.emitirAlerta({
      id: 'cob-' + Date.now(),
      titulo: '💳 Alerta de Cuota Vencida ($23.322)',
      mensaje: 'El cliente Mario Bustos tiene cuota impaga de Honda Twister.',
      tipo: 'cobranzas',
      icon: 'payments',
      remitente: '💳 COBRANZAS IMPAGAS',
      link: '/cobranzas',
      hora: 'Ahora'
    });
  }

  simularAlertaEmision() {
    if (this.prefs().masterMuted || !this.prefs().emitidas) return;
    this.pushService.emitirAlerta({
      id: 'emi-' + Date.now(),
      titulo: '✅ Póliza Emitida #594387120',
      mensaje: 'Mercantil Andina emitió la póliza Auto Chevrolet Spin.',
      tipo: 'cartera',
      icon: 'check_circle',
      remitente: '✅ EMISIÓN MERCANTIL',
      link: '/clientes',
      hora: 'Ahora'
    });
  }

  // ── Historial ──────────────────────────────────────────────
  marcarLeida(id: string) {
    this.alertList.update(list => list.map(a => a.id === id ? { ...a, leido: true } : a));
  }

  marcarTodasLeidas() {
    this.alertList.update(list => list.map(a => ({ ...a, leido: true })));
  }

  eliminarAlerta(id: string) {
    this.alertList.update(list => list.filter(a => a.id !== id));
  }

  limpiarHistorial() {
    this.alertList.set([]);
  }

  // ── Guardar ────────────────────────────────────────────────
  saveChanges(event: Event) {
    this.savePrefs();
    const btn = event.target as HTMLElement;
    const orig = btn.innerText;
    btn.innerText = '¡Preferencias Guardadas!';
    btn.classList.add('bg-emerald-600');
    btn.classList.remove('bg-primary');
    setTimeout(() => {
      btn.innerText = orig;
      btn.classList.remove('bg-emerald-600');
      btn.classList.add('bg-primary');
    }, 2000);
  }
}
