import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { emitirAlertaPushPop } from './layout.component';

export interface AlertaNotificacion {
  id: string;
  titulo: string;
  subtitulo: string;
  tipo: 'error' | 'warning' | 'info' | 'success';
  fecha: string;
  leido: boolean;
  link?: string;
}

@Component({
  selector: 'lib-notificaciones',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  template: `
    <div class="flex flex-col min-h-screen text-on-surface bg-surface font-body-md pb-24 overflow-x-hidden">
      <!-- TopAppBar -->
      <header class="w-full sticky top-0 z-40 bg-surface/95 dark:bg-on-background/95 backdrop-blur-md border-b border-outline-variant flex items-center justify-between h-14 px-4 sm:px-6">
        <div class="flex items-center gap-3">
          <button routerLink="/dashboard" class="p-2 rounded-full hover:bg-surface-container-high transition-colors active:opacity-70 cursor-pointer">
            <span class="material-symbols-outlined text-primary text-xl">arrow_back</span>
          </button>
          <h1 class="font-bold text-base sm:text-lg text-primary tracking-tight">Centro de Alertas & Notificaciones</h1>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow px-4 sm:px-6 py-4 max-w-4xl mx-auto w-full space-y-6">
        
        <!-- Push Notifications Mobile Status Banner -->
        <section class="bg-gradient-to-r from-[#0a0f24] via-[#1c2e43] to-[#0a0f24] text-white p-5 rounded-2xl border border-emerald-500/30 shadow-xl space-y-3">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-2xl">mobile_friendly</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="font-black text-base text-white">Alertas Push Emergentes en el Teléfono</h2>
                  <span class="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-emerald-500/30">
                    {{ pushPermissionStatus() === 'granted' ? 'ACTIVO' : 'DISPONIBLE' }}
                  </span>
                </div>
                <p class="text-xs text-white/80 mt-1 leading-relaxed">
                  Recibí avisos instantáneos tipo ventana emergente (Pop-up) en la pantalla de tu celular cuando ocurran inspecciones de siniestros, cuotas impagas o renovaciones.
                </p>
              </div>
            </div>

            <button
              (click)="solicitarPermisoPush()"
              class="w-full sm:w-auto px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0">
              <span class="material-symbols-outlined text-lg">notifications_active</span>
              <span>{{ pushPermissionStatus() === 'granted' ? 'Notificaciones Push Activas' : 'Activar Notificaciones Push' }}</span>
            </button>
          </div>

          <!-- Simulation Quick Buttons -->
          <div class="pt-3 border-t border-white/10 flex flex-wrap gap-2 items-center">
            <span class="text-[11px] text-white/60 font-bold uppercase tracking-wider">Probar Alertas Pop-up:</span>
            <button (click)="simularAlertaSiniestro()" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
              <span>🚨 Probar Siniestro Push</span>
            </button>
            <button (click)="simularAlertaCobranza()" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
              <span>💳 Probar Cuota Vencida Push</span>
            </button>
          </div>
        </section>

        <!-- Live Alerts Feed from API -->
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold text-outline uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-primary text-base">notifications_active</span>
              <span>Alertas Recientes de la Cartera</span>
            </h2>
            <span class="text-xs text-primary font-bold bg-primary-container/20 px-2.5 py-0.5 rounded-full border border-primary/20">
              {{ alertList().length }} Alertas
            </span>
          </div>

          <div class="space-y-2.5">
            <div
              *ngFor="let alert of alertList()"
              class="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xs hover:shadow-md transition-all flex items-start justify-between gap-3 border-l-4"
              [ngClass]="{
                'border-l-error': alert.tipo === 'error',
                'border-l-amber-500': alert.tipo === 'warning',
                'border-l-primary': alert.tipo === 'info',
                'border-l-emerald-600': alert.tipo === 'success'
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
                  <p class="font-bold text-xs sm:text-sm text-on-surface truncate">{{ alert.titulo }}</p>
                  <p class="text-xs text-on-surface-variant mt-0.5">{{ alert.subtitulo }}</p>
                  <p class="text-[10px] text-outline mt-1 font-semibold">{{ alert.fecha }}</p>
                </div>
              </div>
              
              <a *ngIf="alert.link" [routerLink]="alert.link" class="text-xs font-bold text-primary hover:underline shrink-0 p-1">
                Ver →
              </a>
            </div>
          </div>
        </section>

        <!-- Preference Toggles -->
        <section class="space-y-4">
          <h2 class="text-xs font-bold text-outline uppercase tracking-wider">Configuración de Canales de Alerta</h2>

          <!-- Section: Cartera -->
          <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
            <div class="px-4 py-2.5 bg-surface-container-low border-b border-outline-variant flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">folder_special</span>
              <h3 class="text-xs font-bold text-primary uppercase">Eventos de Cartera</h3>
            </div>
            <div class="divide-y divide-outline-variant text-xs sm:text-sm">
              <label class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
                <span class="font-semibold text-on-surface">Nuevas Pólizas Emitidas</span>
                <input type="checkbox" [(ngModel)]="prefEmitidas" class="w-5 h-5 accent-primary cursor-pointer">
              </label>
              <label class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
                <span class="font-semibold text-on-surface">Próximas Renovaciones (30 días)</span>
                <input type="checkbox" [(ngModel)]="prefRenovaciones" class="w-5 h-5 accent-primary cursor-pointer">
              </label>
            </div>
          </div>

          <!-- Section: Cobranzas -->
          <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
            <div class="px-4 py-2.5 bg-surface-container-low border-b border-outline-variant flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">payments</span>
              <h3 class="text-xs font-bold text-primary uppercase">Cobranzas y Morosidad</h3>
            </div>
            <div class="divide-y divide-outline-variant text-xs sm:text-sm">
              <label class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
                <span class="font-semibold text-on-surface">Rechazos de Débito Automático</span>
                <input type="checkbox" [(ngModel)]="prefRechazos" class="w-5 h-5 accent-primary cursor-pointer">
              </label>
              <label class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
                <span class="font-semibold text-on-surface">Alertas de Cuotas Vencidas</span>
                <input type="checkbox" [(ngModel)]="prefDeuda" class="w-5 h-5 accent-primary cursor-pointer">
              </label>
            </div>
          </div>

          <!-- Section: Siniestros -->
          <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
            <div class="px-4 py-2.5 bg-surface-container-low border-b border-outline-variant flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">report_problem</span>
              <h3 class="text-xs font-bold text-primary uppercase">Tramitación de Siniestros</h3>
            </div>
            <div class="divide-y divide-outline-variant text-xs sm:text-sm">
              <label class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
                <span class="font-semibold text-on-surface">Cambios de Estado en Inspecciones</span>
                <input type="checkbox" [(ngModel)]="prefInspeccion" class="w-5 h-5 accent-primary cursor-pointer">
              </label>
              <label class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
                <span class="font-semibold text-on-surface">Liquidación de Pagos y Talleres</span>
                <input type="checkbox" [(ngModel)]="prefLiquidacion" class="w-5 h-5 accent-primary cursor-pointer">
              </label>
            </div>
          </div>

          <!-- Save Button -->
          <div class="pt-2">
            <button
              (click)="saveChanges($event)"
              class="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-xs transition-all hover:bg-primary-container active:scale-[0.99] cursor-pointer text-sm"
            >
              Guardar Preferencias de Notificación
            </button>
          </div>
        </section>

        <!-- Footer Unificado -->
        <footer class="py-6 px-4 text-center border-t border-outline-variant/40 mt-8 mb-20 md:mb-4 space-y-1">
          <p class="text-xs text-on-surface-variant font-bold">JC Broker Platform — <span class="text-primary font-extrabold">v1.0.0</span></p>
          <p class="text-[11px] text-outline font-medium">© 2026 JC Organizadores • Operación Centralizada • Powered by <strong class="text-primary">Katrix</strong></p>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
  `]
})
export class NotificacionesComponent implements OnInit {
  private http = inject(HttpClient);

  pushPermissionStatus = signal<string>('default');

  prefEmitidas = true;
  prefRenovaciones = true;
  prefRechazos = true;
  prefDeuda = true;
  prefInspeccion = true;
  prefLiquidacion = true;

  alertList = signal<AlertaNotificacion[]>([
    {
      id: 'a1',
      titulo: '🚨 Inspección Aprobada: Siniestro #98412',
      subtitulo: 'Mercantil Andina autorizó la reparación en Taller Cuyo SRL (Chevrolet Spin).',
      tipo: 'warning',
      fecha: 'Hace 10 minutos',
      leido: false,
      link: '/siniestros'
    },
    {
      id: 'a2',
      titulo: '💳 Cuota Impaga: Mario Bustos',
      subtitulo: 'Cuota 07/2026 vencida ($23.322). Link de cuponera generado.',
      tipo: 'error',
      fecha: 'Hace 45 minutos',
      leido: false,
      link: '/cobranzas'
    },
    {
      id: 'a3',
      titulo: '✅ Póliza Emitida Exitosamente',
      subtitulo: 'Endoso #492815 asignado a Toyota Hilux de Roberto Gómez.',
      tipo: 'success',
      fecha: 'Hoy 09:15 hs',
      leido: true
    }
  ]);

  ngOnInit() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.pushPermissionStatus.set(Notification.permission);
    }
  }

  solicitarPermisoPush() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Tu navegador o dispositivo no soporta la API de Notificaciones Push.');
      return;
    }

    Notification.requestPermission().then(permission => {
      this.pushPermissionStatus.set(permission);
      if (permission === 'granted') {
        emitirAlertaPushPop({
          id: 'push-granted-' + Date.now(),
          titulo: '🔔 Notificaciones Push Activadas',
          mensaje: '¡Excelente! Ahora recibirás alertas en tiempo real en la pantalla de tu celular.',
          tipo: 'cartera',
          icon: 'notifications_active',
          hora: 'Ahora'
        });
      } else if (permission === 'denied') {
        alert('Las notificaciones Push fueron bloqueadas en los ajustes de tu navegador.');
      }
    });
  }

  simularAlertaSiniestro() {
    emitirAlertaPushPop({
      id: 'sin-' + Date.now(),
      titulo: '🚨 Nuevo Siniestro Reportado #98412',
      mensaje: 'Cliente Juan Pérez reportó choque en Mendoza. Taller asignado: Cuyo SRL.',
      tipo: 'siniestro',
      icon: 'report_problem',
      link: '/siniestros',
      hora: 'Ahora'
    });
  }

  simularAlertaCobranza() {
    emitirAlertaPushPop({
      id: 'cob-' + Date.now(),
      titulo: '💳 Alerta de Cuota Vencida ($23.322)',
      mensaje: 'El cliente Mario Bustos tiene cuota impaga de Honda Twister.',
      tipo: 'cobranza',
      icon: 'payments',
      link: '/cobranzas',
      hora: 'Ahora'
    });
  }

  saveChanges(event: Event) {
    const btn = event.target as HTMLElement;
    const orig = btn.innerText;
    btn.innerText = '¡Preferencias de Notificación Guardadas!';
    btn.classList.add('bg-emerald-600');
    btn.classList.remove('bg-primary');

    setTimeout(() => {
      btn.innerText = orig;
      btn.classList.remove('bg-emerald-600');
      btn.classList.add('bg-primary');
    }, 2000);
  }
}
