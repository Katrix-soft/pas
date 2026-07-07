import { Component, signal, effect, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

export type Role = 'admin' | 'pas' | string;

@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen w-full bg-background overflow-hidden">
      
      <!-- Unified Desktop Sidebar (Collapsible) -->
      <aside 
        class="hidden md:flex flex-col h-full bg-[#151518] text-white flex-shrink-0 z-50 transition-all duration-300 ease-in-out relative border-r border-white/5"
        [class.w-[280px]]="isExpanded()"
        [class.w-[72px]]="!isExpanded()">
        
        <!-- Toggle Button & Logo Area -->
        <div class="h-20 flex items-center px-4 mt-2" [class.justify-between]="isExpanded()" [class.justify-center]="!isExpanded()">
          <div class="flex items-center gap-3 overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()" [class.hidden]="!isExpanded()">
            <!-- Diamond Logo Match -->
            <div class="relative w-8 h-8 flex-shrink-0 flex items-center justify-center cursor-pointer" title="Katrix CRM">
               <div class="w-4 h-4 bg-gradient-to-tr from-blue-400 via-green-400 to-yellow-400 rotate-45 rounded-sm"></div>
               <div class="absolute w-4 h-4 bg-gradient-to-bl from-blue-600 via-purple-500 to-red-500 rotate-45 rounded-sm mix-blend-screen"></div>
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-lg tracking-wide whitespace-nowrap">Katrix CRM</span>
              <span class="text-[10px] text-white/50 uppercase font-bold tracking-widest">{{ role() === 'admin' ? 'Administrador' : 'Productor (PAS)' }}</span>
            </div>
          </div>
          <button (click)="toggleSidebar()" class="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 flex items-center justify-center text-white/70 hover:text-white" [title]="isExpanded() ? 'Colapsar menú' : 'Expandir menú'">
            <span class="material-symbols-outlined">{{ isExpanded() ? 'menu_open' : 'menu' }}</span>
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="flex flex-col gap-2 px-3 mt-4 flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          
          <a routerLink="/dashboard" routerLinkActive="bg-[#1f2937] text-white font-semibold" [routerLinkActiveOptions]="{exact: true}" 
             class="flex items-center gap-4 p-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer group relative"
             [title]="!isExpanded() ? 'Dashboard' : ''">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0 font-light" style="font-variation-settings: 'wght' 300;">grid_view</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()">Dashboard</span>
          </a>
          
          <a routerLink="/cobranzas" routerLinkActive="bg-[#1f2937] text-white font-semibold" 
             class="flex items-center gap-4 p-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer group relative"
             [title]="!isExpanded() ? 'Cobranzas' : ''">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0 font-light" style="font-variation-settings: 'wght' 300;">payments</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()">Cobranzas</span>
          </a>
          
          <a routerLink="/clientes" routerLinkActive="bg-[#1f2937] text-white font-semibold" 
             class="flex items-center gap-4 p-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer group relative"
             [title]="!isExpanded() ? 'Clientes' : ''">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0 font-light" style="font-variation-settings: 'wght' 300;">group</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()">Clientes</span>
          </a>
          
          <a routerLink="/siniestros" routerLinkActive="bg-[#1f2937] text-white font-semibold" 
             class="flex items-center gap-4 p-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer group relative"
             [title]="!isExpanded() ? 'Siniestros' : ''">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0 font-light" style="font-variation-settings: 'wght' 300;">warning</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()">Siniestros</span>
          </a>
          
          <a *ngIf="role() === 'pas'" routerLink="/ticket/seguimiento" routerLinkActive="bg-[#1f2937] text-white font-semibold" 
             class="flex items-center gap-4 p-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer group relative"
             [title]="!isExpanded() ? 'Mis Tickets' : ''">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0 font-light" style="font-variation-settings: 'wght' 300;">confirmation_number</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()">Mis Tickets</span>
          </a>
          
          <div *ngIf="role() === 'admin'" class="w-[80%] mx-auto h-[1px] bg-white/10 my-4"></div>
          
          <a *ngIf="role() === 'admin'" routerLink="/ticketera/kanban" routerLinkActive="bg-[#1f2937] text-white font-semibold" 
             class="flex items-center gap-4 p-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer group relative"
             [title]="!isExpanded() ? 'Mesa Operativa' : ''">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0 font-light" style="font-variation-settings: 'wght' 300;">view_kanban</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 flex-1 flex justify-between items-center overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()">
               Mesa Operativa
               <span class="bg-[#2b64d7] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">4</span>
            </span>
            <!-- Badge when collapsed -->
            <span *ngIf="!isExpanded()" class="absolute top-2 right-2 w-2.5 h-2.5 bg-[#2b64d7] rounded-full border-2 border-[#151518]"></span>
          </a>
          
          <a routerLink="/notificaciones" routerLinkActive="bg-[#1f2937] text-white font-semibold" 
             class="flex items-center gap-4 p-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer group relative"
             [title]="!isExpanded() ? 'Alertas' : ''">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0 font-light" style="font-variation-settings: 'wght' 300;">notifications</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 flex-1 flex justify-between items-center overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()">
              Alertas
              <span class="w-2 h-2 rounded-full bg-error mr-1"></span>
            </span>
            <!-- Badge when collapsed -->
            <span *ngIf="!isExpanded()" class="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-[#151518]"></span>
          </a>
        </nav>

        <!-- Bottom Area (Settings, Profile) -->
        <div class="p-3 mb-4 flex flex-col gap-2 border-t border-white/5 pt-4 mt-auto">
          <a *ngIf="role() === 'admin'" routerLink="/seguridad" class="flex items-center gap-4 p-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer group relative" [title]="!isExpanded() ? 'Configuración' : ''">
            <span class="material-symbols-outlined text-[24px] flex-shrink-0 font-light" style="font-variation-settings: 'wght' 300;">settings</span>
            <span class="tracking-wide whitespace-nowrap transition-all duration-200 overflow-hidden" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()">Configuración</span>
          </a>
          <a (click)="logout()" class="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group relative" [title]="!isExpanded() ? 'Cerrar Sesión' : 'Cerrar Sesión'">
            <div class="w-8 h-8 rounded-full bg-[#f25f33] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 border-2 border-transparent group-hover:border-white transition-colors" [class.bg-blue-600]="role() === 'admin'">
              {{ role() === 'admin' ? 'A' : 'P' }}
            </div>
            <div class="flex flex-col whitespace-nowrap overflow-hidden transition-all duration-200" [class.opacity-0]="!isExpanded()" [class.w-0]="!isExpanded()">
              <span class="font-bold text-sm leading-tight text-white">{{ userName() }}</span>
              <span class="text-xs text-white/50">Cerrar sesión</span>
            </div>
          </a>
        </div>
      </aside>

      <!-- Main Content Container -->
      <div class="flex-1 h-full overflow-y-auto relative bg-background pb-20 md:pb-0 custom-scrollbar">
        <router-outlet></router-outlet>
      </div>

      <!-- Unified Mobile Bottom Nav -->
      <nav class="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant z-[100] pb-safe">
        <a routerLink="/dashboard" routerLinkActive="text-primary bg-primary-container" [routerLinkActiveOptions]="{exact: true}" class="flex flex-col items-center justify-center text-on-surface-variant p-2 rounded-xl transition-all cursor-pointer min-w-[64px]">
          <span class="material-symbols-outlined">grid_view</span>
          <span class="text-[10px] mt-1 font-medium">Panel</span>
        </a>
        <a routerLink="/cobranzas" routerLinkActive="text-primary bg-primary-container" class="flex flex-col items-center justify-center text-on-surface-variant p-2 rounded-xl transition-all cursor-pointer min-w-[64px]">
          <span class="material-symbols-outlined">payments</span>
          <span class="text-[10px] mt-1 font-medium">Cobros</span>
        </a>
        <a routerLink="/clientes" routerLinkActive="text-primary bg-primary-container" class="flex flex-col items-center justify-center text-on-surface-variant p-2 rounded-xl transition-all cursor-pointer min-w-[64px]">
          <span class="material-symbols-outlined">group</span>
          <span class="text-[10px] mt-1 font-medium">Clientes</span>
        </a>
        <a *ngIf="role() === 'pas'" routerLink="/ticket/seguimiento" routerLinkActive="text-primary bg-primary-container" class="flex flex-col items-center justify-center text-on-surface-variant p-2 rounded-xl transition-all cursor-pointer min-w-[64px] relative">
          <span class="material-symbols-outlined">confirmation_number</span>
          <span class="text-[10px] mt-1 font-medium">Tickets</span>
        </a>
        <a *ngIf="role() === 'admin'" routerLink="/ticketera/kanban" routerLinkActive="text-primary bg-primary-container" class="flex flex-col items-center justify-center text-on-surface-variant p-2 rounded-xl transition-all cursor-pointer min-w-[64px] relative">
          <span class="material-symbols-outlined">view_kanban</span>
          <span class="text-[10px] mt-1 font-medium">Mesa</span>
          <span class="absolute top-1 right-3 w-2 h-2 bg-[#2b64d7] rounded-full border border-surface"></span>
        </a>
        <a (click)="logout()" class="flex flex-col items-center justify-center text-on-surface-variant p-2 rounded-xl transition-all cursor-pointer min-w-[64px]">
          <span class="material-symbols-outlined text-error">logout</span>
          <span class="text-[10px] mt-1 font-medium text-error">Salir</span>
        </a>
      </nav>

    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
  `]
})
export class LayoutComponent {
  isExpanded = signal(false);
  private authService = inject(AuthService);

  role = computed<Role>(() => this.authService.currentUser()?.role || 'admin');
  userName = computed<string>(() => this.authService.currentUser()?.name || '');
  
  constructor() {
  }

  toggleSidebar() {
    this.isExpanded.set(!this.isExpanded());
  }

  logout() {
    this.authService.logout();
  }
}
