import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
          <h1 class="font-bold text-base sm:text-lg text-primary tracking-tight">Centro de Alertas Push & Notificaciones</h1>
        </div>

        <div class="flex items-center gap-2">
          <span *ngIf="pushService.isSubscribedBackend()" class="bg-emerald-500/10 text-emerald-600 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            PUSH ACTIVO
          </span>
          <span *ngIf="!pushService.isSubscribedBackend()" (click)="activarNotificaciones()" class="bg-amber-500/10 text-amber-600 text-xs font-black px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/20 transition-all">
            <span class="material-symbols-outlined text-sm">notifications_active</span>
            ACTIVAR PUSH
          </span>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow px-4 sm:px-6 py-4 max-w-4xl mx-auto w-full space-y-6">
        
        <!-- Activation & Status Card -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-2xl">notifications_active</span>
              </div>
              <div>
                <h2 class="font-extrabold text-sm sm:text-base text-on-surface">Notificaciones Push Emergentes en Celular</h2>
                <p class="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  Avisos automáticos en tiempo real con sonido ("ruidito"), vibración y ventana emergente para siniestros, cuotas impagas e inspecciones.
                </p>
              </div>
            </div>

            <button
              (click)="activarNotificaciones()"
              [disabled]="pushService.isSubscribing()"
              class="w-full sm:w-auto px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50">
              <span class="material-symbols-outlined text-lg">phonelink_ring</span>
              <span>{{ pushService.isSubscribedBackend() ? '✅ Alertas Activas en Celular' : '🔔 Activar Notificaciones en Celular' }}</span>
            </button>
          </div>

          <!-- Quick Test Chime Buttons -->
          <div class="pt-3 border-t border-outline-variant/60 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-outline uppercase tracking-wider">Probar Notificación con Sonido ("ruidito") & Persiana:</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button (click)="simularAlertaSiniestro()" class="px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-primary/20 active:scale-95">
                <span>🚨 Probar: Siniestro #98412</span>
              </button>
              <button (click)="simularAlertaCobranza()" class="px-3.5 py-2 bg-error/10 hover:bg-error/20 text-error rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-error/20 active:scale-95">
                <span>💳 Probar: Cuota Vencida</span>
              </button>
              <button (click)="simularAlertaEmision()" class="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-500/20 active:scale-95">
                <span>✅ Probar: Póliza Emitida</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Live Feed Section with Filter Chips -->
        <section class="space-y-3">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 class="text-xs font-bold text-outline uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-primary text-base">history</span>
              <span>Historial de Alertas de Cartera ({{ unreadCount() }} No leídas)</span>
            </h2>

            <button *ngIf="unreadCount() > 0" (click)="marcarTodasLeidas()" class="text-xs font-bold text-primary hover:underline cursor-pointer">
              Marcar todas como leídas
            </button>
          </div>

          <!-- Filter Chips -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              *ngFor="let cat of ['todas', 'noleidas', 'siniestro', 'cobranza']"
              (click)="filtroCategoria.set(cat)"
              class="px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 capitalize cursor-pointer border"
              [ngClass]="filtroCategoria() === cat ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container-high'"
            >
              {{ cat === 'noleidas' ? 'No leídas (' + unreadCount() + ')' : cat }}
            </button>
          </div>

          <!-- Feed Items -->
          <div class="space-y-2.5">
            <div
              *ngFor="let alert of filteredAlerts()"
              class="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xs hover:shadow-md transition-all flex items-start justify-between gap-3 border-l-4"
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
                <a *ngIf="alert.link" [routerLink]="alert.link" (click)="marcarLeida(alert.id)" class="text-xs font-bold text-primary hover:underline p-1">
                  Ver →
                </a>
                <button (click)="eliminarAlerta(alert.id)" class="text-outline hover:text-error text-xs p-1 cursor-pointer">
                  <span class="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>

            <div *ngIf="filteredAlerts().length === 0" class="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant text-outline">
              <span class="material-symbols-outlined text-3xl">notifications_off</span>
              <p class="text-xs font-bold mt-2">No hay notificaciones en esta categoría.</p>
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
  pushService = inject(PushNotificationService);

  filtroCategoria = signal<string>('todas');
  isIosDevice = signal<boolean>(false);

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

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent || '';
      this.isIosDevice.set(/iPhone|iPad|iPod/.test(ua));
      
      // Intentar suscripción automática al abrir la vista
      this.pushService.solicitarPermisoYSuscribir();
    }
  }

  activarNotificaciones() {
    this.pushService.solicitarPermisoYSuscribir();
  }

  simularAlertaSiniestro() {
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

  marcarLeida(id: string) {
    this.alertList.update(list => list.map(a => a.id === id ? { ...a, leido: true } : a));
  }

  marcarTodasLeidas() {
    this.alertList.update(list => list.map(a => ({ ...a, leido: true })));
  }

  eliminarAlerta(id: string) {
    this.alertList.update(list => list.filter(a => a.id !== id));
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
