import { Component, signal, effect, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { BreadcrumbsComponent } from './breadcrumbs.component';

export type Role = 'admin' | 'pas' | string;
export const isPdfModalOpen = signal(false);

export interface PushPopAlert {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'siniestro' | 'cobranzas' | 'cartera';
  link?: string;
  icon: string;
  hora: string;
  remitente?: string;
}

export const activePushToast = signal<PushPopAlert | null>(null);

// Función infalible para enviar Notificaciones a la barra del Sistema Operativo Android/iOS
export async function enviarNotificacionSistemaAndroid(alerta: PushPopAlert) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  let permission = Notification.permission;
  if (permission === 'default') {
    try {
      permission = await Notification.requestPermission();
    } catch (e) {}
  }

  if (permission !== 'granted') return;

  const options: any = {
    body: alerta.mensaje,
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-192x192.png',
    tag: alerta.id || ('jc-pas-' + Date.now()),
    renotify: true,
    requireInteraction: true,
    vibrate: [300, 100, 300, 100, 300],
    data: { url: alerta.link || '/dashboard' }
  };

  // En Android Chrome, la notificación DEBE enviarse vía Service Worker Registration para figurar en la persiana de Android
  if ('serviceWorker' in navigator) {
    try {
      let reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        reg = await navigator.serviceWorker.register('/sw.js');
      }
      if (reg) {
        await reg.showNotification(alerta.titulo, options);
        return;
      }
    } catch (e) {
      console.warn('Fallback SW Android Push:', e);
    }
  }

  // Fallback para navegadores de escritorio
  try {
    new Notification(alerta.titulo, options);
  } catch (e) {}
}

export function emitirAlertaPushPop(alerta: PushPopAlert) {
  activePushToast.set(alerta);

  // 1. Sonido Web Audio Synth (Tono estilo notificación WhatsApp / Celular)
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {}

  // 2. Vibración en celulares
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate([150, 70, 150, 70, 200]); } catch (e) {}
  }

  // 3. Notificación Push a la barra del sistema Android/iOS
  enviarNotificacionSistemaAndroid(alerta);

  // Auto descartar después de 6.5 segundos del toast flotante
  setTimeout(() => {
    if (activePushToast()?.id === alerta.id) {
      activePushToast.set(null);
    }
  }, 6500);
}

@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, BreadcrumbsComponent],
  template: `
    <div class="flex h-screen w-full bg-background overflow-hidden relative">
      
      <!-- BANNER EMERGENTE PUSH-POP ESTILO WHATSAPP (TOP MOBILE & DESKTOP) -->
      <div *ngIf="activePushToast()" class="fixed top-2 left-2 right-2 sm:left-auto sm:right-6 sm:max-w-md z-[99999] bg-[#111b21] text-white border-l-4 border-l-[#25d366] rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.8)] p-3.5 sm:p-4 backdrop-blur-xl animate-in slide-in-from-top-6 duration-300 flex items-start gap-3 border border-white/10">
        
        <!-- App Icon Avatar -->
        <div class="w-11 h-11 rounded-2xl bg-[#25d366]/20 text-[#25d366] border border-[#25d366]/40 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <span class="material-symbols-outlined text-2xl">{{ activePushToast()?.icon || 'chat' }}</span>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-black text-[#25d366] uppercase tracking-wider bg-[#25d366]/10 px-2 py-0.5 rounded border border-[#25d366]/20">
              {{ activePushToast()?.remitente || 'JC PAS ALERTA PUSH' }}
            </span>
            <span class="text-[10px] text-white/50 font-semibold">{{ activePushToast()?.hora }}</span>
          </div>

          <h4 class="font-extrabold text-xs sm:text-sm text-white mt-1 leading-snug">{{ activePushToast()?.titulo }}</h4>
          <p class="text-xs text-white/80 mt-0.5 leading-relaxed truncate-2-lines">{{ activePushToast()?.mensaje }}</p>
          
          <div class="mt-2.5 flex items-center gap-2">
            <a *ngIf="activePushToast()?.link" [routerLink]="activePushToast()?.link" (click)="descartarPushToast()" class="bg-[#25d366] hover:bg-[#20bd5a] text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center gap-1">
              <span>Abrir en PAS</span>
              <span class="material-symbols-outlined text-sm">open_in_new</span>
            </a>
            <button (click)="descartarPushToast()" class="text-xs text-white/70 hover:text-white font-semibold px-2 py-1 cursor-pointer">
              Descartar
            </button>
          </div>
        </div>

        <button (click)="descartarPushToast()" class="text-white/40 hover:text-white p-1 rounded-lg shrink-0 cursor-pointer">
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <!-- Unified Mobile Bottom Nav -->
      @if (!authService.isModalActive()) {
        <nav class="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-1 py-2 bg-[#1c2e43] border-t border-white/10 z-50 pb-safe shadow-2xl">
          <a routerLink="/dashboard" routerLinkActive="text-[#10b981]" [routerLinkActiveOptions]="{exact: true}" class="flex flex-col items-center justify-center text-white/70 hover:text-white p-1.5 rounded-xl transition-all cursor-pointer min-w-[56px]">
            <span class="material-symbols-outlined text-[20px]">grid_view</span>
            <span class="text-[9px] mt-0.5 font-bold">Panel</span>
          </a>
          <a routerLink="/siniestros" routerLinkActive="text-[#10b981]" class="flex flex-col items-center justify-center text-white/70 hover:text-white p-1.5 rounded-xl transition-all cursor-pointer min-w-[56px]">
            <span class="material-symbols-outlined text-[20px]">report_problem</span>
            <span class="text-[9px] mt-0.5 font-bold">Siniestros</span>
          </a>
          <a routerLink="/cobranzas" routerLinkActive="text-[#10b981]" class="flex flex-col items-center justify-center text-white/70 hover:text-white p-1.5 rounded-xl transition-all cursor-pointer min-w-[56px]">
            <span class="material-symbols-outlined text-[20px]">payments</span>
            <span class="text-[9px] mt-0.5 font-bold">Cobros</span>
          </a>
          <a routerLink="/clientes" routerLinkActive="text-[#10b981]" class="flex flex-col items-center justify-center text-white/70 hover:text-white p-1.5 rounded-xl transition-all cursor-pointer min-w-[56px]">
            <span class="material-symbols-outlined text-[20px]">group</span>
            <span class="text-[9px] mt-0.5 font-bold">Clientes</span>
          </a>
          <a routerLink="/perfil" routerLinkActive="text-[#10b981]" class="flex flex-col items-center justify-center text-white/70 hover:text-white p-1.5 rounded-xl transition-all cursor-pointer min-w-[56px]">
            <span class="material-symbols-outlined text-[20px]">person</span>
            <span class="text-[9px] mt-0.5 font-bold">Perfil</span>
          </a>
          <a *ngIf="role() === 'admin'" routerLink="/ticketera/kanban" routerLinkActive="text-[#10b981]" class="flex flex-col items-center justify-center text-white/70 hover:text-white p-1.5 rounded-xl transition-all cursor-pointer min-w-[56px] relative">
            <span class="material-symbols-outlined text-[20px]">view_kanban</span>
            <span class="text-[9px] mt-0.5 font-bold">Mesa</span>
            <span class="absolute top-1 right-2 w-2 h-2 bg-[#2563eb] rounded-full border border-[#1c2e43]"></span>
          </a>
        </nav>
      }

      <!-- Unified Desktop Sidebar (Collapsible) -->
      <aside 
        class="hidden md:flex flex-col h-full bg-[#1c2e43] text-white flex-shrink-0 z-50 transition-all duration-300 ease-in-out relative border-r border-white/5"
        [class.w-[280px]]="isExpanded()"
        [class.w-[72px]]="!isExpanded()">
        
        <!-- Toggle Button & Top Title -->
        <div class="flex items-center relative min-h-[64px] w-full pt-4" [class.px-6]="isExpanded()" [class.justify-center]="!isExpanded()">
          <div class="flex flex-col justify-center w-full overflow-hidden transition-all duration-300" 
               [class.items-center]="authService.tenantLogo() || role() === 'admin'"
               [class.items-start]="!authService.tenantLogo() && role() === 'pas'"
               [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()" [class.hidden]="!isExpanded()">
            <!-- PAS Role: Uploaded Logo or Default Text -->
            <ng-container *ngIf="role() === 'pas'">
               <span *ngIf="!authService.tenantLogo()" class="font-bold text-xl text-white opacity-60 tracking-wide whitespace-nowrap">Seguros Globales</span>
               <img *ngIf="authService.tenantLogo()" [src]="authService.tenantLogo()" class="h-20 w-auto max-w-[80%] object-contain mx-auto">
            </ng-container>

            <!-- Admin Role: JC Organizadores Logo -->
            <ng-container *ngIf="role() === 'admin'">
               <img src="assets/logo1.png" alt="JC Organizadores" class="h-20 w-auto max-w-[80%] object-contain mx-auto drop-shadow-md">
            </ng-container>
          </div>
          <button (click)="toggleSidebar()" class="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 flex items-center justify-center text-white/70 hover:text-white z-10" 
                  [class.absolute]="isExpanded()" [class.right-4]="isExpanded()"
                  [title]="isExpanded() ? 'Colapsar menú' : 'Expandir menú'">
            <span class="material-symbols-outlined">{{ isExpanded() ? 'menu_open' : 'menu' }}</span>
          </button>
        </div>

        <!-- Profile Area -->
        <div class="px-6 pb-4 pt-2 flex flex-col items-start overflow-hidden transition-all duration-300" [class.items-center]="!isExpanded()">
          <div class="flex flex-col whitespace-nowrap transition-all duration-200" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()" [class.hidden]="!isExpanded()">
            <span class="text-base font-bold text-[#10b981]">{{ userFullName() }}</span>
            <span class="text-xs text-white/90 mt-0.5 font-medium flex items-center gap-1">
              <span class="bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-indigo-400/30">PAS #{{ userMatricula() }}</span>
            </span>
            <span class="text-xs text-white/60 mt-1 font-medium">{{ userOrganizador() }}</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex flex-col gap-2 px-3 mt-2 flex-1 overflow-y-auto no-scrollbar">
          
          <a routerLink="/dashboard" routerLinkActive="bg-[#2563eb] text-white" [routerLinkActiveOptions]="{exact: true}" 
             class="flex items-center gap-3 p-3 rounded-xl text-white/80 hover:bg-white/5 transition-all cursor-pointer group relative font-medium"
             [title]="!isExpanded() ? 'Dashboard' : ''"
             [class.justify-center]="!isExpanded()">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0" style="font-variation-settings: 'wght' 400;">grid_view</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()" [class.hidden]="!isExpanded()">Dashboard</span>
          </a>

          <a routerLink="/asistente" routerLinkActive="bg-[#2563eb] text-white" 
             class="flex items-center gap-3 p-3 rounded-xl text-white/80 hover:bg-white/5 transition-all cursor-pointer group relative font-medium text-emerald-400"
             [title]="!isExpanded() ? 'Multicotizador IA' : ''"
             [class.justify-center]="!isExpanded()">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0 text-indigo-400" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 flex-1 flex justify-between items-center overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()" [class.hidden]="!isExpanded()">
              <span class="truncate min-w-0">Multicotizador IA</span>
              <span class="bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase flex-shrink-0 ml-2">Mercantil</span>
            </span>
          </a>
          
          <a routerLink="/cobranzas" routerLinkActive="bg-[#2563eb] text-white" 
             class="flex items-center gap-3 p-3 rounded-xl text-white/80 hover:bg-white/5 transition-all cursor-pointer group relative font-medium"
             [title]="!isExpanded() ? 'Cobranzas' : ''"
             [class.justify-center]="!isExpanded()">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0" style="font-variation-settings: 'wght' 400;">payments</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()" [class.hidden]="!isExpanded()">Cobranzas</span>
          </a>
          
          <a routerLink="/clientes" routerLinkActive="bg-[#2563eb] text-white" 
             class="flex items-center gap-3 p-3 rounded-xl text-white/80 hover:bg-white/5 transition-all cursor-pointer group relative font-medium"
             [title]="!isExpanded() ? 'Clientes' : ''"
             [class.justify-center]="!isExpanded()">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0" style="font-variation-settings: 'wght' 400;">group</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()" [class.hidden]="!isExpanded()">Clientes</span>
          </a>
          
          <a routerLink="/siniestros" routerLinkActive="bg-[#2563eb] text-white" 
             class="flex items-center gap-3 p-3 rounded-xl text-white/80 hover:bg-white/5 transition-all cursor-pointer group relative font-medium"
             [title]="!isExpanded() ? 'Siniestros' : ''"
             [class.justify-center]="!isExpanded()">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0" style="font-variation-settings: 'wght' 400;">warning</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()" [class.hidden]="!isExpanded()">Siniestros</span>
          </a>
          
          <div class="w-full h-[1px] bg-white/10 my-2"></div>
          
          <a routerLink="/ticket/seguimiento" routerLinkActive="bg-[#2563eb] text-white" 
             class="flex items-center gap-3 p-3 rounded-xl text-white/80 hover:bg-white/5 transition-all cursor-pointer group relative font-medium"
             [title]="!isExpanded() ? 'Mesa Operativa & Tickets' : ''"
             [class.justify-center]="!isExpanded()">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0" style="font-variation-settings: 'wght' 400;">confirmation_number</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 flex-1 flex justify-between items-center overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()" [class.hidden]="!isExpanded()">
               <span class="truncate min-w-0">Mesa Operativa</span>
               <span class="bg-[#2563eb] text-white text-[12px] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ml-2">4</span>
            </span>
            <!-- Badge when collapsed -->
            <span *ngIf="!isExpanded()" class="absolute top-2 right-2 w-3 h-3 bg-[#2563eb] rounded-full border-2 border-[#1c2e43]"></span>
          </a>
          
          <a routerLink="/perfil" routerLinkActive="bg-[#2563eb] text-white" 
             class="flex items-center gap-3 p-3 rounded-xl text-white/80 hover:bg-white/5 transition-all cursor-pointer group relative font-medium"
             [title]="!isExpanded() ? 'Mi Perfil' : ''"
             [class.justify-center]="!isExpanded()">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0" style="font-variation-settings: 'wght' 400;">person</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 flex-1 flex items-center overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()" [class.hidden]="!isExpanded()">
              Mi Perfil
            </span>
          </a>

          <a routerLink="/notificaciones" routerLinkActive="bg-[#2563eb] text-white" 
             class="flex items-center gap-3 p-3 rounded-xl text-white/80 hover:bg-white/5 transition-all cursor-pointer group relative font-medium"
             [title]="!isExpanded() ? 'Configuraciones' : ''"
             [class.justify-center]="!isExpanded()">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0" style="font-variation-settings: 'wght' 400;">settings</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 flex-1 flex justify-between items-center overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()" [class.hidden]="!isExpanded()">
              <span class="truncate min-w-0">Configuraciones</span>
              <span class="w-2 h-2 rounded-full bg-error mr-2 flex-shrink-0 ml-2"></span>
            </span>
            <!-- Badge when collapsed -->
            <span *ngIf="!isExpanded()" class="absolute top-2 right-2 w-3 h-3 bg-error rounded-full border-2 border-[#1c2e43]"></span>
          </a>
        </nav>

        <!-- Bottom Area (Settings, Profile) -->
        <div class="p-3 mb-4 flex flex-col gap-2 mt-auto">
          <a (click)="logout()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group relative" 
             [title]="!isExpanded() ? 'Cerrar Sesión' : 'Cerrar Sesión'"
             [class.justify-center]="!isExpanded()">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0 text-white/80 group-hover:text-white" style="font-variation-settings: 'wght' 400;">logout</span>
            <span class="font-medium text-white/80 group-hover:text-white transition-all duration-200 overflow-hidden whitespace-nowrap" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()" [class.hidden]="!isExpanded()">Cerrar sesión</span>
          </a>
        </div>
      </aside>

      <!-- Main Content Container -->
      <div class="flex-1 h-full overflow-y-auto relative z-10 bg-background pb-28 md:pb-4 custom-scrollbar">
        <!-- Global Breadcrumbs Wrapper -->
        <div class="w-full px-container-margin md:px-xl pt-sm pb-0 relative z-10">
          <lib-breadcrumbs></lib-breadcrumbs>
        </div>
        <router-outlet></router-outlet>
      </div>

    </div>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class LayoutComponent {
  isPdfModalOpen = isPdfModalOpen;
  activePushToast = activePushToast;
  isExpanded = signal(false);
  authService = inject(AuthService);
  router = inject(Router);

  role = computed<Role>(() => this.authService.currentUser()?.role || 'admin');
  userFullName = computed(() => {
    const user = this.authService.currentUser();
    return (!user?.name || user.name === 'Productor PAS') ? 'Gonzalo Javier Paso' : user.name;
  });
  userMatricula = computed(() => this.authService.currentUser()?.matricula || '86992');
  userOrganizador = computed(() => this.authService.currentUser()?.organizador || 'JCORG Broker de Seguros');
  userName = computed<string>(() => this.userFullName().split(' ')[0]);

  descartarPushToast() {
    activePushToast.set(null);
  }

  toggleSidebar() {
    this.isExpanded.set(!this.isExpanded());
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
