import { Component, signal, effect, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { BreadcrumbsComponent } from './breadcrumbs.component';

export type Role = 'admin' | 'pas' | string;
export const isPdfModalOpen = signal(false);

@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, BreadcrumbsComponent],
  template: `
    <div class="flex h-screen w-full bg-background overflow-hidden">
      
      <!-- Unified Mobile Bottom Nav -->
      @if (!authService.isModalActive()) {
        <nav class="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-2 py-2 bg-[#1c2e43] border-t border-white/10 z-10 pb-safe">
          <a routerLink="/dashboard" routerLinkActive="text-[#10b981]" [routerLinkActiveOptions]="{exact: true}" class="flex flex-col items-center justify-center text-white/60 p-2 rounded-xl transition-all cursor-pointer min-w-[64px]">
            <span class="material-symbols-outlined">grid_view</span>
            <span class="text-[10px] mt-1 font-medium">Panel</span>
          </a>
          <a routerLink="/cobranzas" routerLinkActive="text-[#10b981]" class="flex flex-col items-center justify-center text-white/60 p-2 rounded-xl transition-all cursor-pointer min-w-[64px]">
            <span class="material-symbols-outlined">payments</span>
            <span class="text-[10px] mt-1 font-medium">Cobros</span>
          </a>
          <a routerLink="/clientes" routerLinkActive="text-[#10b981]" class="flex flex-col items-center justify-center text-white/60 p-2 rounded-xl transition-all cursor-pointer min-w-[64px]">
            <span class="material-symbols-outlined">group</span>
            <span class="text-[10px] mt-1 font-medium">Clientes</span>
          </a>
          <a *ngIf="role() === 'admin'" routerLink="/ticketera/kanban" routerLinkActive="text-[#10b981]" class="flex flex-col items-center justify-center text-white/60 p-2 rounded-xl transition-all cursor-pointer min-w-[64px] relative">
            <span class="material-symbols-outlined">view_kanban</span>
            <span class="text-[10px] mt-1 font-medium">Mesa</span>
            <span class="absolute top-1 right-3 w-2 h-2 bg-[#2563eb] rounded-full border border-[#1c2e43]"></span>
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
        <nav class="flex flex-col gap-2 px-3 mt-2 flex-1 overflow-y-auto">
          
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
              Multicotizador IA
              <span class="bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">Mercantil</span>
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
               Mesa Operativa
               <span class="bg-[#2563eb] text-white text-[12px] font-bold w-6 h-6 rounded-full flex items-center justify-center">4</span>
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
              Configuraciones
              <span class="w-2 h-2 rounded-full bg-error mr-2"></span>
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
      <div class="flex-1 h-full overflow-y-auto relative z-20 bg-background pb-20 md:pb-0 custom-scrollbar">
        <!-- Global Breadcrumbs Wrapper -->
        <div class="w-full px-container-margin md:px-xl pt-sm pb-0 relative z-10">
          <lib-breadcrumbs></lib-breadcrumbs>
        </div>
        <router-outlet></router-outlet>
      </div>

    </div>
  `,
  styles: [``]
})
export class LayoutComponent {
  isPdfModalOpen = isPdfModalOpen;
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
  
  constructor() {
  }

  isModalOpen(): boolean {
    return typeof document !== 'undefined' && document.body.classList.contains('modal-open');
  }

  toggleSidebar() {
    this.isExpanded.set(!this.isExpanded());
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
