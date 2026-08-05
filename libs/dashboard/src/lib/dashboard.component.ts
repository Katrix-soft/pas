import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { PushNotificationService } from './services/push-notification.service';

export interface Ticket {
  id: string;
  tipo: 'Siniestro' | 'Endoso' | 'Alta' | 'Facturación' | 'Consulta';
  asunto: string;
  prioridad: 'Crítica' | 'Alta' | 'Media' | 'Baja';
  estado: 'Abierto' | 'En Proceso' | 'Falta Doc.' | 'Cerrado';
  asignado: string;
  asignadoInitials: string;
  tiempo: string;
  pas: string;
  pasMatricula: string;
  polizaRef?: string;
  notasInternal?: string[];
}

export interface ProducerStats {
  id: string;
  nombre: string;
  region: string;
  avatar: string;
  ticketsResueltos: number;
  porcentaje: number;
  tiempoRespuesta: string;
  satisfaccion: string;
  carteraTotal: string;
  matricula: string;
  email: string;
  telefono: string;
}

const DEFAULT_TICKETS: Ticket[] = [
  {
    id: '#SIN-8842',
    tipo: 'Siniestro',
    asunto: 'Falta reporte policial para siniestro de flota camionera.',
    prioridad: 'Alta',
    estado: 'En Proceso',
    asignado: 'Gonzalo',
    asignadoInitials: 'G',
    tiempo: '12m ago',
    pas: 'Gonzalo Paso',
    pasMatricula: '86992',
    polizaRef: '5-894210-242193',
    notasInternal: ['Mesa Operativa Gonzalo: Se requiere informe policial de la Comisaría 2da para proceder con la cobertura.']
  },
  {
    id: '#END-8839',
    tipo: 'Endoso',
    asunto: 'Cambio de titularidad y modificación de CBU para cobro automático.',
    prioridad: 'Media',
    estado: 'En Proceso',
    asignado: 'Candela',
    asignadoInitials: 'C',
    tiempo: '45m ago',
    pas: 'Carlos Benítez',
    pasMatricula: '74129',
    polizaRef: '20027144800',
    notasInternal: ['Verificado CBU en AFIP por Candela.']
  },
  {
    id: '#ALT-8835',
    tipo: 'Alta',
    asunto: 'Validación técnica DNI & scoring nuevo asegurado Toyota Corolla.',
    prioridad: 'Alta',
    estado: 'Abierto',
    asignado: 'Candela',
    asignadoInitials: 'C',
    tiempo: '1h ago',
    pas: 'Gonzalo Paso',
    pasMatricula: '86992',
    polizaRef: '5-302194-950723',
    notasInternal: []
  },
  {
    id: '#FAC-8820',
    tipo: 'Facturación',
    asunto: 'Consulta sobre desglose de liquidación de comisiones quincena Mayo.',
    prioridad: 'Baja',
    estado: 'Cerrado',
    asignado: 'Marina',
    asignadoInitials: 'M',
    tiempo: '3h ago',
    pas: 'Gonzalo Paso',
    pasMatricula: '86992',
    notasInternal: ['Liquidación enviada en formato PDF firmado por Marina.']
  },
  {
    id: '#END-8812',
    tipo: 'Endoso',
    asunto: 'Solicitud de inclusión de cláusula de no repetición a favor de YPF S.A.',
    prioridad: 'Crítica',
    estado: 'Abierto',
    asignado: 'Gonzalo',
    asignadoInitials: 'G',
    tiempo: '4h ago',
    pas: 'Juan Pérez',
    pasMatricula: '91234',
    notasInternal: []
  }
];

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  template: `
    @if (isLoading()) {

    <div class="text-on-surface font-body-md bg-background min-h-screen">
      <!-- Main Content Area Skeleton -->
      <main class="min-h-screen px-container-margin pb-24 md:pb-8 pt-lg">
        <div class="mb-xl">
          <div class="skeleton h-8 w-48 rounded-lg mb-sm"></div>
          <div class="skeleton h-4 w-64 rounded-lg"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-md mb-xl">
          <div class="bg-surface-container-lowest p-md rounded-xl card-accent-blue shadow-sm">
            <div class="skeleton h-10 w-20 rounded-lg mb-xs"></div>
          </div>
          <div class="bg-surface-container-lowest p-md rounded-xl card-accent-orange shadow-sm">
            <div class="skeleton h-10 w-20 rounded-lg mb-xs"></div>
          </div>
          <div class="bg-surface-container-lowest p-md rounded-xl card-accent-red shadow-sm">
            <div class="skeleton h-10 w-20 rounded-lg mb-xs"></div>
          </div>
          <div class="bg-surface-container-lowest p-md rounded-xl card-accent-green shadow-sm">
            <div class="skeleton h-10 w-20 rounded-lg mb-xs"></div>
          </div>
        </div>
      </main>
    </div>

    } @else if (isError()) {

    <div class="bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-md">
      <div class="max-w-xl w-full flex flex-col items-center text-center">
        <div class="relative mb-lg">
          <div class="relative bg-surface-container-lowest border border-error-container shadow-lg rounded-full p-xl flex items-center justify-center error-shake">
            <span class="material-symbols-outlined text-[80px] text-error">error</span>
          </div>
        </div>
        <h2 class="font-bold text-2xl mb-2">Error de Sincronización</h2>
        <p class="text-on-surface-variant mb-6">No pudimos conectar con los servicios centrales.</p>
        <button (click)="simulateReload()" class="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2">
          <span class="material-symbols-outlined" [class.animate-spin]="isRetrying()">refresh</span>
          Reintentar Carga
        </button>
      </div>
    </div>

    } @else {

    <div class="font-body-md text-on-background min-h-screen bg-background flex flex-col w-full relative">
      
      <!-- BANNER EMERGENTE PUSH-POP ESTILO WHATSAPP DE ALERTA PUSH (VISTA PAS Y ADMIN) -->
      <div *ngIf="pushService.activeToast()" class="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[99999] bg-[#111b21] text-white border-l-4 border-l-[#25d366] rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.8)] p-3.5 sm:p-4 backdrop-blur-xl animate-in slide-in-from-top-6 duration-300 flex items-start gap-3 border border-white/10"
           [class.cursor-pointer]="!!pushService.activeToast()?.link"
           (click)="openTicketFromToast(pushService.activeToast()!)">
        <div class="w-11 h-11 rounded-2xl bg-[#25d366]/20 text-[#25d366] border border-[#25d366]/40 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <span class="material-symbols-outlined text-2xl">{{ pushService.activeToast()?.icon || 'notifications_active' }}</span>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-black text-[#25d366] uppercase tracking-wider bg-[#25d366]/10 px-2 py-0.5 rounded border border-[#25d366]/20">
              {{ pushService.activeToast()?.remitente || 'JC PAS MESA OPERATIVA' }}
            </span>
            <span class="text-[10px] text-white/50 font-semibold">{{ pushService.activeToast()?.hora }}</span>
          </div>

          <h4 class="font-extrabold text-xs sm:text-sm text-white mt-1 leading-snug">{{ pushService.activeToast()?.titulo }}</h4>
          <p class="text-xs text-white/80 mt-0.5 leading-relaxed">{{ pushService.activeToast()?.mensaje }}</p>
          
          <div class="mt-2.5 flex items-center gap-2">
            <!-- Si tiene link → botón Ver Ticket; si no → solo Entendido -->
            <button *ngIf="pushService.activeToast()?.link"
                    (click)="$event.stopPropagation(); openTicketFromToast(pushService.activeToast()!)"
                    class="bg-[#25d366] hover:bg-[#20bd5a] text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">open_in_new</span>
              Ver Ticket
            </button>
            <button *ngIf="!pushService.activeToast()?.link"
                    (click)="$event.stopPropagation(); pushService.descartarToast()"
                    class="bg-[#25d366] hover:bg-[#20bd5a] text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer">
              Entendido
            </button>
            <button (click)="$event.stopPropagation(); pushService.descartarToast()"
                    class="text-white/60 hover:text-white text-xs font-semibold px-2 py-1.5 rounded-xl transition-colors cursor-pointer">
              Descartar
            </button>
          </div>
        </div>

        <button (click)="$event.stopPropagation(); pushService.descartarToast()" class="text-white/40 hover:text-white p-1 rounded-lg shrink-0 cursor-pointer">
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <!-- Toast Notification Alert (Solo visible para el destinatario PAS) -->
      <div *ngIf="toastMessage()" class="fixed top-20 right-5 z-[9999] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
        <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
          <span class="material-symbols-outlined text-lg">check_circle</span>
        </div>
        <span class="text-sm font-semibold">{{ toastMessage() }}</span>
        <button (click)="toastMessage.set(null)" class="text-white/60 hover:text-white ml-2">
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col pb-24 md:pb-lg w-full overflow-x-hidden">
        
        <!-- Top Header Bar -->
        <header class="sticky top-0 z-40 bg-surface/95 dark:bg-on-background/95 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-3 sm:px-8 py-2.5 w-full shadow-xs gap-2">
          <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <span class="material-symbols-outlined text-primary text-xl sm:text-2xl shrink-0">{{ role() === 'admin' ? 'admin_panel_settings' : 'dashboard' }}</span>
            <div class="min-w-0 flex-1">
              <h1 class="font-black text-sm sm:text-lg text-primary tracking-tight truncate">Métricas de Gestión</h1>
              <p class="text-[11px] text-on-surface-variant font-medium hidden sm:block truncate">
                {{ role() === 'admin' ? 'Control de Trámites & Operaciones Centralizadoras' : 'Panel Principal de Productor de Seguros (PAS)' }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <!-- Period Selector -->
            <div class="relative">
              <select [(ngModel)]="selectedPeriod" (change)="showToast('Período actualizado: ' + selectedPeriod())"
                      class="bg-surface-container-low border border-outline-variant text-on-surface text-[11px] sm:text-xs font-bold px-2.5 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:border-primary">
                <option value="Junio 2026">Junio 2026</option>
                <option value="Mayo 2026">Mayo 2026</option>
                <option value="Abril 2026">Abril 2026</option>
              </select>
            </div>

            <!-- Profile Avatar & Direct Logout -->
            <div routerLink="/perfil" class="w-8 h-8 rounded-full border-2 border-primary-fixed overflow-hidden cursor-pointer shrink-0 shadow-xs" title="Mi Perfil">
              <img class="w-full h-full object-cover" alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTIabKB45fJfFZT8sg1aLxduEgN7AhCOFzIsvmDSkF1oQKBmdkCcCBoTSyCSChn6hodGbZI9ruZjissrJ5QsF3IDVRtjA6J_W2g7JLX0xFKsM1ikBVlcQ9r38sAYjxHsXHIZPTgie5K_XSZduWWYNgACxqSIw2gLDCzotWC2Dnob-KctR1SKP16Bl51hNH5aWcclyiekEm3v5yGCDSQ9gi7Dg_7O1eT0OBqbZcPDCORCLDN0MRj7JEYCCNBeurMU-BOkLdAi8BUPh0">
            </div>
          </div>
        </header>

        @if (role() === 'admin') {
          <!-- VISTA ADMINISTRADOR -->
          <section class="p-container-margin md:p-lg space-y-lg pb-24 max-w-7xl mx-auto w-full">
            
            <!-- Welcome Header & Quick Action Buttons -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant/40 pb-4">
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="font-extrabold text-xl sm:text-2xl text-on-surface">Panel Administrativo</h2>
                  <span class="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-wider">Operador: {{ activeAdminAgent() }}</span>
                </div>
                <p class="text-xs sm:text-sm text-on-surface-variant mt-1 font-medium">Supervisión en tiempo real de endosos, siniestros y solicitudes de PAS.</p>
              </div>

              <!-- Quick Action Toolbar -->
              <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button (click)="openNewTicketModal()" class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-on-primary font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-primary-container transition-all shadow-sm cursor-pointer active:scale-95">
                  <span class="material-symbols-outlined text-base">add_box</span>
                  <span>Nuevo Ticket</span>
                </button>

                <button (click)="exportReport()" class="flex items-center justify-center gap-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs px-3.5 py-2.5 rounded-xl border border-outline-variant transition-colors cursor-pointer" title="Exportar reporte de gestión">
                  <span class="material-symbols-outlined text-base">download</span>
                  <span class="hidden sm:inline">Exportar Excel</span>
                </button>
              </div>
            </div>

            <!-- Interactive KPI Stat Cards (Counter Filters) -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Estado Global de Trámites</span>
                <span *ngIf="activeStatusFilter() !== 'all'" (click)="setStatusFilter('all')" class="text-xs text-primary font-bold hover:underline cursor-pointer">
                  Limpiar Filtro (Ver Todos) ✕
                </span>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
                <!-- Abiertos -->
                <div (click)="setStatusFilter('Abierto')" 
                     class="premium-card rounded-xl p-md left-accent-blue cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                     [class.ring-2]="activeStatusFilter() === 'Abierto'"
                     [class.ring-primary]="activeStatusFilter() === 'Abierto'">
                  <p class="text-label-md font-label-md text-on-surface-variant mb-1 flex items-center justify-between">
                    <span>Abiertos</span>
                    <span class="text-[10px] bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded font-bold">Total</span>
                  </p>
                  <div class="flex justify-between items-end">
                    <h4 class="font-black text-2xl sm:text-3xl text-on-surface">{{ countByStatus('Abierto') }}</h4>
                    <span class="material-symbols-outlined text-primary text-2xl">mail</span>
                  </div>
                </div>

                <!-- En Proceso -->
                <div (click)="setStatusFilter('En Proceso')" 
                     class="premium-card rounded-xl p-md left-accent-orange cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                     [class.ring-2]="activeStatusFilter() === 'En Proceso'"
                     [class.ring-amber-500]="activeStatusFilter() === 'En Proceso'">
                  <p class="text-label-md font-label-md text-on-surface-variant mb-1 flex items-center justify-between">
                    <span>En Proceso</span>
                    <span class="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-bold">Asignados</span>
                  </p>
                  <div class="flex justify-between items-end">
                    <h4 class="font-black text-2xl sm:text-3xl text-on-surface">{{ countByStatus('En Proceso') }}</h4>
                    <span class="material-symbols-outlined text-amber-500 text-2xl">pending_actions</span>
                  </div>
                </div>

                <!-- Falta Doc -->
                <div (click)="setStatusFilter('Falta Doc.')" 
                     class="premium-card rounded-xl p-md left-accent-red cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                     [class.ring-2]="activeStatusFilter() === 'Falta Doc.'"
                     [class.ring-error]="activeStatusFilter() === 'Falta Doc.'">
                  <p class="text-label-md font-label-md text-on-surface-variant mb-1 flex items-center justify-between">
                    <span>Falta Doc.</span>
                    <span class="text-[10px] bg-red-500/10 text-red-600 px-1.5 py-0.5 rounded font-bold">Requeridos</span>
                  </p>
                  <div class="flex justify-between items-end">
                    <h4 class="font-black text-2xl sm:text-3xl text-on-surface">{{ countByStatus('Falta Doc.') }}</h4>
                    <span class="material-symbols-outlined text-error text-2xl">description</span>
                  </div>
                </div>

                <!-- Cerrados (Hoy) -->
                <div (click)="setStatusFilter('Cerrado')" 
                     class="premium-card rounded-xl p-md left-accent-green cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                     [class.ring-2]="activeStatusFilter() === 'Cerrado'"
                     [class.ring-emerald-500]="activeStatusFilter() === 'Cerrado'">
                  <p class="text-label-md font-label-md text-on-surface-variant mb-1 flex items-center justify-between">
                    <span>Cerrados (Hoy)</span>
                    <span class="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-bold">Listos</span>
                  </p>
                  <div class="flex justify-between items-end">
                    <h4 class="font-black text-2xl sm:text-3xl text-on-surface">{{ countByStatus('Cerrado') }}</h4>
                    <span class="material-symbols-outlined text-emerald-600 text-2xl">check_circle</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Administrative Alerts & Tickets Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-xl mb-xl">
              
              <!-- Left Column (1 col): Administrative Alerts -->
              <div class="lg:col-span-1 space-y-md">
                <div class="flex items-center justify-between mb-sm">
                  <div class="flex items-center gap-sm">
                    <span class="material-symbols-outlined text-error text-xl">notification_important</span>
                    <h3 class="font-extrabold text-base text-on-surface">Alertas Administrativas</h3>
                  </div>
                  <span class="text-[11px] font-bold bg-error/10 text-error px-2 py-0.5 rounded-full">Acción Requerida</span>
                </div>

                <!-- Alert Item 1: Endosos Críticos -->
                <div (click)="openAlertModal('endosos')" 
                     class="premium-card rounded-xl p-md bg-error-container/10 border-error/30 hover:border-error flex items-center gap-md cursor-pointer hover:bg-error-container/20 transition-all group">
                  <div class="w-10 h-10 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center text-error shrink-0">
                    <span class="material-symbols-outlined">priority_high</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-black text-on-surface">8 Endosos Críticos</p>
                      <span class="text-[9px] bg-error text-white font-extrabold px-1.5 py-0.5 rounded">Urgente</span>
                    </div>
                    <p class="text-xs text-on-surface-variant mt-0.5 truncate">Requieren firma digital inmediata para emisión.</p>
                  </div>
                  <span class="material-symbols-outlined text-outline group-hover:text-error group-hover:translate-x-1 transition-all">chevron_right</span>
                </div>

                <!-- Alert Item 2: Altas Pendientes -->
                <div (click)="openAlertModal('altas')" 
                     class="premium-card rounded-xl p-md bg-secondary-container/10 border-secondary/30 hover:border-secondary flex items-center gap-md cursor-pointer hover:bg-secondary-container/20 transition-all group">
                  <div class="w-10 h-10 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0">
                    <span class="material-symbols-outlined">task</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-black text-on-surface">15 Altas Pendientes</p>
                      <span class="text-[9px] bg-secondary text-white font-extrabold px-1.5 py-0.5 rounded">Revisión</span>
                    </div>
                    <p class="text-xs text-on-surface-variant mt-0.5 truncate">En espera de validación de identidad técnica.</p>
                  </div>
                  <span class="material-symbols-outlined text-outline group-hover:text-secondary group-hover:translate-x-1 transition-all">chevron_right</span>
                </div>

                <!-- Alert Item 3: Liquidaciones Comisiones PAS -->
                <div (click)="showToast('Panel de Liquidación Abierto')" 
                     class="premium-card rounded-xl p-md bg-amber-500/10 border-amber-500/30 hover:border-amber-500 flex items-center gap-md cursor-pointer hover:bg-amber-500/20 transition-all group">
                  <div class="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
                    <span class="material-symbols-outlined">payments</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-black text-on-surface">Liquidación Quincenal</p>
                    <p class="text-xs text-on-surface-variant mt-0.5 truncate">32 recibos de comisiones pendientes de aprobación.</p>
                  </div>
                  <span class="material-symbols-outlined text-outline group-hover:text-amber-500 group-hover:translate-x-1 transition-all">chevron_right</span>
                </div>
              </div>

              <!-- Right Column (2 cols): Urgent Tickets & Search -->
              <div class="lg:col-span-2 space-y-md">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-sm">
                  <div class="flex items-center gap-2">
                    <h3 class="font-extrabold text-base text-on-surface">Tickets Operativos & Urgentes</h3>
                    <span class="text-xs text-on-surface-variant font-bold">({{ filteredTickets().length }} de {{ tickets().length }})</span>
                  </div>

                  <div class="flex items-center gap-2 w-full sm:w-auto">
                    <!-- Search Input -->
                    <div class="relative flex-1 sm:w-64">
                      <span class="material-symbols-outlined absolute left-2.5 top-2 text-outline text-base">search</span>
                      <input type="text" [(ngModel)]="ticketSearchQuery" placeholder="Buscar por #TK, PAS o asunto..."
                             class="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-8 pr-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary">
                    </div>

                    <a routerLink="/ticketera/kanban" class="text-xs font-extrabold text-primary hover:underline shrink-0 whitespace-nowrap">
                      Ver Kanban →
                    </a>
                  </div>
                </div>

                <!-- Status Filter Pills -->
                <div class="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
                  <button (click)="setStatusFilter('pendientes')" 
                          class="px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1"
                          [ngClass]="activeStatusFilter() === 'pendientes' ? 'bg-primary text-white shadow-xs' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'">
                    <span>⚡ Pendientes</span>
                    <span class="bg-white/20 text-[10px] px-1.5 py-0.2 rounded-full font-black">{{ countPendingTickets() }}</span>
                  </button>
                  <button (click)="setStatusFilter('Abierto')" 
                          class="px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0"
                          [ngClass]="activeStatusFilter() === 'Abierto' ? 'bg-blue-600 text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'">
                    Abiertos ({{ countByStatus('Abierto') }})
                  </button>
                  <button (click)="setStatusFilter('En Proceso')" 
                          class="px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0"
                          [ngClass]="activeStatusFilter() === 'En Proceso' ? 'bg-amber-600 text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'">
                    En Proceso ({{ countByStatus('En Proceso') }})
                  </button>
                  <button (click)="setStatusFilter('Falta Doc.')" 
                          class="px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0"
                          [ngClass]="activeStatusFilter() === 'Falta Doc.' ? 'bg-red-600 text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'">
                    Falta Doc ({{ countByStatus('Falta Doc.') }})
                  </button>
                  <button (click)="setStatusFilter('Cerrado')" 
                          class="px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0"
                          [ngClass]="activeStatusFilter() === 'Cerrado' ? 'bg-emerald-600 text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'">
                    ✅ Cerrados / Archivados ({{ countByStatus('Cerrado') }})
                  </button>
                  <button (click)="setStatusFilter('all')" 
                          class="px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0"
                          [ngClass]="activeStatusFilter() === 'all' ? 'bg-slate-700 text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'">
                    📋 Todos ({{ tickets().length }})
                  </button>
                </div>

                <!-- Ticket List Container -->
                <div class="space-y-sm">
                  @for (t of filteredTickets(); track t.id) {
                    <div (click)="openTicketDetail(t)" 
                         class="premium-card rounded-xl p-md flex flex-col gap-sm cursor-pointer hover:shadow-md transition-all duration-300 border-l-4 group"
                         [ngClass]="{
                           'border-l-blue-600': t.estado === 'Abierto',
                           'border-l-amber-500': t.estado === 'En Proceso',
                           'border-l-red-600': t.estado === 'Falta Doc.',
                           'border-l-emerald-600': t.estado === 'Cerrado'
                         }">
                      
                      <div class="flex justify-between items-start">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="text-xs font-extrabold bg-surface-container px-2 py-0.5 rounded text-on-surface">{{ t.id }}</span>
                          <span class="text-xs font-bold px-2 py-0.5 rounded-full"
                                [ngClass]="{
                                  'bg-red-500/10 text-red-600': t.tipo === 'Siniestro',
                                  'bg-indigo-500/10 text-indigo-600': t.tipo === 'Endoso',
                                  'bg-emerald-500/10 text-emerald-600': t.tipo === 'Alta',
                                  'bg-amber-500/10 text-amber-600': t.tipo === 'Facturación'
                                }">{{ t.tipo }}</span>

                          <span class="text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase"
                                [ngClass]="{
                                  'bg-red-600 text-white': t.prioridad === 'Crítica',
                                  'bg-amber-500 text-white': t.prioridad === 'Alta',
                                  'bg-blue-500 text-white': t.prioridad === 'Media',
                                  'bg-slate-400 text-white': t.prioridad === 'Baja'
                                }">{{ t.prioridad }}</span>
                        </div>

                        <div class="flex items-center gap-3">
                          <span class="text-[11px] text-outline font-bold flex items-center gap-1">
                            <span class="material-symbols-outlined text-xs">schedule</span> {{ t.tiempo }}
                          </span>
                          <span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-base">open_in_new</span>
                        </div>
                      </div>

                      <p class="text-xs sm:text-sm text-on-surface font-semibold leading-snug">{{ t.asunto }}</p>

                      <div class="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-outline-variant/40 text-xs">
                        <div class="flex items-center gap-2 flex-wrap">
                          <div class="w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 shadow-xs"
                               [ngClass]="{
                                 'bg-indigo-600 text-white': t.asignado === 'Gonzalo',
                                 'bg-emerald-600 text-white': t.asignado === 'Candela',
                                 'bg-amber-600 text-white': t.asignado === 'Marina',
                                 'bg-slate-400 text-white': t.asignado !== 'Gonzalo' && t.asignado !== 'Candela' && t.asignado !== 'Marina'
                               }">
                            {{ t.asignadoInitials }}
                          </div>
                          <span class="text-on-surface-variant font-medium">Asignado: <strong>{{ t.asignado }}</strong></span>
                          
                          <!-- Botones de Acción Directa de 1 Clic -->
                          <button *ngIf="t.asignado !== activeAdminAgent() && t.estado !== 'Cerrado'" (click)="tomarTramiteDirecto(t, $event)" 
                                  class="px-2 py-0.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 text-[10px] font-extrabold rounded-lg border border-indigo-500/20 transition-all cursor-pointer shadow-xs active:scale-95">
                            ⚡ Tomar
                          </button>

                          <button *ngIf="t.estado !== 'Cerrado'" (click)="aprobarYArchivarTramiteDirecto(t, $event)" 
                                  class="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 text-[10px] font-extrabold rounded-lg border border-emerald-500/20 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-0.5" title="Aprobar este trámite y quitarlo de la lista de pendientes al instante">
                            <span class="material-symbols-outlined text-xs">check_circle</span>
                            <span>Aprobar & Archivar</span>
                          </button>

                          <button *ngIf="t.estado !== 'Falta Doc.' && t.estado !== 'Cerrado'" (click)="requerirDocDirecto(t, $event)" 
                                  class="px-2 py-0.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 text-[10px] font-extrabold rounded-lg border border-red-500/20 transition-all cursor-pointer shadow-xs active:scale-95">
                            Pedir Doc
                          </button>
                        </div>

                        <span class="text-outline text-[11px]">PAS: <strong>{{ t.pas }}</strong> (#{{ t.pasMatricula }})</span>
                      </div>
                    </div>
                  } @empty {
                    <div class="p-8 text-center bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant">
                      <span class="material-symbols-outlined text-4xl text-outline mb-2">inbox</span>
                      <p class="text-sm font-bold text-on-surface">No se encontraron tickets con el filtro seleccionado</p>
                      <button (click)="setStatusFilter('all'); ticketSearchQuery.set('')" class="mt-3 text-xs text-primary font-bold underline">
                        Restablecer filtros de búsqueda
                      </button>
                    </div>
                  }
                </div>
              </div>

            </div>

            <!-- Top Productores (Gestión Focus & Ranking) -->
            <div class="mb-xl">
              <div class="flex justify-between items-center mb-md">
                <div>
                  <h3 class="font-extrabold text-base text-on-surface">Productores con Mayor Gestión</h3>
                  <p class="text-xs text-on-surface-variant">Rendimiento mensual y tiempo promedio de resolución de trámites.</p>
                </div>
                <span class="text-xs font-bold text-primary">Ranking Regional 2026</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
                @for (p of producers(); track p.id) {
                  <div (click)="openProducerDetail(p)" class="premium-card rounded-xl p-md cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all group">
                    <div class="flex items-center gap-md mb-md">
                      <img [alt]="p.nombre" class="w-12 h-12 rounded-full object-cover border-2 border-primary-fixed shadow-xs" [src]="p.avatar"/>
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center justify-between">
                          <p class="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">{{ p.nombre }}</p>
                          <span class="text-[10px] font-black bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded border border-indigo-500/20">PAS #{{ p.matricula }}</span>
                        </div>
                        <p class="text-xs text-on-surface-variant font-medium">{{ p.region }}</p>
                      </div>
                    </div>

                    <div class="space-y-sm bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                      <div class="flex justify-between text-xs">
                        <span class="text-on-surface-variant font-medium">Tickets Resueltos</span>
                        <span class="font-black text-primary">{{ p.ticketsResueltos }}</span>
                      </div>
                      <div class="w-full bg-surface-container rounded-full h-2">
                        <div class="bg-primary h-2 rounded-full transition-all duration-500" [style.width.%]="p.porcentaje"></div>
                      </div>
                      <div class="flex justify-between items-center pt-1 text-[11px] text-outline">
                        <span>Tiempo prom.: <strong>{{ p.tiempoRespuesta }}</strong></span>
                        <span class="text-emerald-600 font-bold">★ {{ p.satisfaccion }}</span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

          </section>
        } @else {
          <!-- VISTA PRODUCTOR (PAS) COMPLETA -->
          <section class="px-3 sm:px-6 lg:px-8 py-4 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
            
            <!-- Greeting & Producer Profile Banner -->
            <div class="bg-gradient-to-r from-indigo-500/10 via-surface-container-lowest to-surface-container-lowest border border-outline-variant p-4 sm:p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div class="flex items-start sm:items-center gap-3 min-w-0 w-full md:w-auto">
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold text-lg sm:text-xl shadow-md border border-primary-fixed shrink-0">
                  {{ userFullName().charAt(0) }}
                </div>
                <div class="flex flex-col min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <h2 class="text-base sm:text-xl font-extrabold text-on-surface truncate">Hola, {{ userFullName() }}</h2>
                    <span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider shrink-0">PAS SSN</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-on-surface-variant mt-1 font-medium">
                    <span>Matrícula: <strong>#{{ userMatricula() }}</strong></span>
                    <span class="hidden sm:inline">•</span>
                    <span class="truncate">{{ userOrganizador() }}</span>
                    <span class="hidden sm:inline">•</span>
                    <span class="text-primary font-bold">Mercantil Andina (Principal)</span>
                  </div>
                </div>
              </div>
              
              <button routerLink="/asistente" class="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-primary-container transition-all shadow-sm cursor-pointer shrink-0">
                <span class="material-symbols-outlined text-base">smart_toy</span>
                <span>Abrir Multicotizador IA</span>
              </button>
            </div>

            <!-- Mis Solicitudes / Tickets Operativos (PAS View) -->
            <div class="bg-surface-container-lowest p-4 sm:p-6 rounded-xl border border-outline-variant shadow-sm w-full">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                  <h3 class="text-base sm:text-lg font-extrabold flex items-center gap-2 text-on-surface">
                    <span class="material-symbols-outlined text-primary">confirmation_number</span>
                    Mis Solicitudes & Trámites Operativos
                  </h3>
                  <p class="text-xs text-on-surface-variant">Estado en tiempo real de trámites gestionados por Mesa Operativa Central.</p>
                </div>
                <a routerLink="/ticket/seguimiento" class="text-xs text-primary font-bold hover:underline shrink-0">Ver todos mis tickets →</a>
              </div>

              <div class="space-y-3">
                @for (t of pasTickets(); track t.id) {
                  <div (click)="openTicketDetail(t)" class="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-surface-container transition-all group">
                    <div class="flex items-start sm:items-center gap-3 min-w-0 w-full sm:w-auto flex-1">
                      <div class="w-10 h-10 rounded-xl flex flex-col items-center justify-center font-black text-xs shrink-0 shadow-xs mt-0.5 sm:mt-0"
                           [ngClass]="{
                             'bg-red-500/10 text-red-600 border border-red-500/20': t.estado === 'Falta Doc.',
                             'bg-amber-500/10 text-amber-600 border border-amber-500/20': t.estado === 'En Proceso',
                             'bg-blue-500/10 text-blue-600 border border-blue-500/20': t.estado === 'Abierto',
                             'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20': t.estado === 'Cerrado'
                           }">
                        <span>{{ t.id }}</span>
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 flex-wrap mb-1 sm:mb-0">
                          <p class="font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors leading-snug">{{ t.asunto }}</p>
                          <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0"
                                [ngClass]="{
                                  'bg-red-600 text-white': t.estado === 'Falta Doc.',
                                  'bg-amber-500 text-white': t.estado === 'En Proceso',
                                  'bg-blue-600 text-white': t.estado === 'Abierto',
                                  'bg-emerald-600 text-white': t.estado === 'Cerrado'
                                }">{{ t.estado }}</span>
                        </div>
                        <p class="text-xs text-on-surface-variant mt-0.5">
                          Asignado: <strong>{{ t.asignado }}</strong> • Actualizado: {{ t.tiempo }}
                        </p>
                        <p *ngIf="t.notasInternal && t.notasInternal.length > 0" class="text-[11px] text-amber-700 dark:text-amber-300 font-semibold mt-1 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 leading-relaxed">
                          📌 Última observación: {{ t.notasInternal[0] }}
                        </p>
                      </div>
                    </div>
                    <button class="w-full sm:w-auto bg-primary hover:bg-primary-container text-white text-xs font-bold px-4 py-2.5 rounded-xl shrink-0 cursor-pointer shadow-xs text-center">
                      Ver Detalle
                    </button>
                  </div>
                } @empty {
                  <div class="p-6 text-center text-xs text-outline bg-surface-container-low rounded-xl">
                    No tenés tickets activos en este momento.
                  </div>
                }
              </div>
            </div>

            <!-- Metrics Grid PAS -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <!-- Premio Administrado -->
              <div (click)="showToast('Abriendo detalle de premio administrado...')" 
                   class="bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-outline-variant metric-card-accent-blue shadow-sm col-span-1 sm:col-span-2 flex flex-col justify-between hover:scale-[0.99] transition-transform cursor-pointer">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Premio Administrado (Mensual)</p>
                    <h2 class="text-2xl sm:text-3xl font-black text-primary">{{ premioTotalFmt() }}</h2>
                  </div>
                  <div class="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold text-xs border border-emerald-500/20">
                    <span class="material-symbols-outlined text-sm">trending_up</span>
                    <span>+14.8%</span>
                  </div>
                </div>
                <div class="flex justify-between items-center mt-3 pt-2 border-t border-outline-variant/40 text-xs text-outline">
                  <span class="truncate">Cartera Vigente ({{ polizasCount() }} Pólizas)</span>
                  <span class="font-semibold text-primary shrink-0">Ver detalle →</span>
                </div>
              </div>

              <!-- Clientes Activos -->
              <div routerLink="/clientes" class="bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-outline-variant metric-card-accent-blue shadow-sm flex flex-col justify-between hover:scale-[0.99] transition-transform cursor-pointer">
                <div>
                  <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Clientes Activos</p>
                  <h2 class="text-2xl sm:text-3xl font-black text-on-surface">{{ clientesCount() }}</h2>
                </div>
                <div class="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/40 text-xs">
                  <div class="flex -space-x-2 overflow-hidden shrink-0">
                    <div class="w-6 h-6 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center border border-white">BA</div>
                    <div class="w-6 h-6 rounded-full bg-secondary text-white text-[9px] font-bold flex items-center justify-center border border-white">PR</div>
                    <div class="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface border border-white">+216</div>
                  </div>
                  <span class="text-xs text-outline font-semibold">98.5% retención →</span>
                </div>
              </div>

              <!-- Pólizas con Deuda -->
              <div routerLink="/cobranzas" class="bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-outline-variant metric-card-accent-red shadow-sm flex flex-col justify-between hover:scale-[0.99] transition-transform cursor-pointer">
                <div>
                  <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Pólizas con Deuda</p>
                  <h2 class="text-2xl sm:text-3xl font-black text-error">5</h2>
                </div>
                <div class="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/40 text-xs">
                  <div class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-error text-sm">payments</span>
                    <span class="text-error font-bold text-xs uppercase">$420.000 pend.</span>
                  </div>
                  <span class="text-xs text-error font-bold underline">Cobrar →</span>
                </div>
              </div>
            </div>

            <!-- Solicitudes Quick Actions Bar -->
            <div class="bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-outline-variant shadow-sm w-full">
              <h3 class="text-[11px] text-on-surface-variant mb-3 font-bold uppercase tracking-widest">Gestiones Rápidas del Productor</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
                <button routerLink="/asistente" class="w-full py-2.5 px-3 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                  <span class="material-symbols-outlined text-base">add_circle</span>
                  <span>Nueva Cotización / Emisión</span>
                </button>
                <button (click)="openNewTicketModal()" class="w-full py-2.5 px-3 rounded-xl border border-primary text-primary font-bold text-xs hover:bg-primary-container transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <span class="material-symbols-outlined text-base">edit_document</span>
                  <span>Solicitar Endoso</span>
                </button>
                <button routerLink="/siniestros" class="w-full py-2.5 px-3 rounded-xl border border-primary text-primary font-bold text-xs hover:bg-primary-container transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <span class="material-symbols-outlined text-base">report_problem</span>
                  <span>Denunciar Siniestro</span>
                </button>
              </div>
            </div>

            <!-- Breakdown: Ramos & Compañías -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <!-- Distribución por Ramos -->
              <div class="bg-surface-container-lowest p-4 sm:p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col">
                <h3 class="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">pie_chart</span>
                  Distribución por Ramos (Mercantil & Aliadas)
                </h3>
                <div class="space-y-3.5">
                  <div>
                    <div class="flex justify-between mb-1 text-xs sm:text-sm">
                      <span class="font-bold text-on-surface">Automotor (Rama 5)</span>
                      <span class="text-primary font-bold">58% (115 pólizas)</span>
                    </div>
                    <div class="w-full bg-surface-container rounded-full h-2">
                      <div class="bg-primary h-2 rounded-full" style="width: 58%"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between mb-1 text-xs sm:text-sm">
                      <span class="font-bold text-on-surface">Combinado Familiar / Hogar (Rama 14)</span>
                      <span class="text-secondary font-bold">22% (44 pólizas)</span>
                    </div>
                    <div class="w-full bg-surface-container rounded-full h-2">
                      <div class="bg-secondary h-2 rounded-full" style="width: 22%"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between mb-1 text-xs sm:text-sm">
                      <span class="font-bold text-on-surface">Motovehículos (Rama 35)</span>
                      <span class="text-tertiary font-bold">12% (24 pólizas)</span>
                    </div>
                    <div class="w-full bg-surface-container rounded-full h-2">
                      <div class="bg-tertiary h-2 rounded-full" style="width: 12%"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between mb-1 text-xs sm:text-sm">
                      <span class="font-bold text-on-surface">Accidentes Personales / Vida (Rama 18)</span>
                      <span class="text-on-surface-variant font-bold">8% (15 pólizas)</span>
                    </div>
                    <div class="w-full bg-surface-container rounded-full h-2">
                      <div class="bg-outline h-2 rounded-full" style="width: 8%"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pólizas por Compañía -->
              <div class="bg-surface-container-lowest p-4 sm:p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col">
                <h3 class="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">domain</span>
                  Cartera por Compañía Aseguradora
                </h3>
                <div class="grid grid-cols-1 gap-2.5">
                  <!-- Mercantil Andina -->
                  <div (click)="showToast('Filtrando cartera Mercantil Andina...')" 
                       class="flex items-center justify-between p-3 sm:p-3.5 bg-indigo-500/10 rounded-xl border border-indigo-500/30 cursor-pointer hover:bg-indigo-500/20 transition-all">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                        MA
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <p class="font-bold text-sm text-on-surface truncate">Mercantil Andina</p>
                          <span class="text-[9px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-extrabold uppercase">Principal</span>
                        </div>
                        <p class="text-xs text-on-surface-variant truncate">128 pólizas vigentes (65% cartera)</p>
                      </div>
                    </div>
                    <span class="material-symbols-outlined text-indigo-500 shrink-0">chevron_right</span>
                  </div>

                  <!-- San Cristóbal -->
                  <div (click)="showToast('Filtrando cartera San Cristóbal...')" 
                       class="flex items-center justify-between p-3 sm:p-3.5 bg-surface-container-low rounded-xl border border-outline-variant cursor-pointer hover:bg-surface-container transition-colors">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                        SC
                      </div>
                      <div class="min-w-0">
                        <p class="font-bold text-sm text-on-surface truncate">San Cristóbal Seguros</p>
                        <p class="text-xs text-on-surface-variant truncate">42 pólizas vigentes (21% cartera)</p>
                      </div>
                    </div>
                    <span class="material-symbols-outlined text-on-surface-variant shrink-0">chevron_right</span>
                  </div>

                  <!-- Sancor Seguros -->
                  <div (click)="showToast('Filtrando cartera Sancor Seguros...')" 
                       class="flex items-center justify-between p-3 sm:p-3.5 bg-surface-container-low rounded-xl border border-outline-variant cursor-pointer hover:bg-surface-container transition-colors">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                        SS
                      </div>
                      <div class="min-w-0">
                        <p class="font-bold text-sm text-on-surface truncate">Sancor Seguros</p>
                        <p class="text-xs text-on-surface-variant truncate">28 pólizas vigentes (14% cartera)</p>
                      </div>
                    </div>
                    <span class="material-symbols-outlined text-on-surface-variant shrink-0">chevron_right</span>
                  </div>

                  <!-- Cooperación Seguros -->
                  <div (click)="showToast('Ariendo integrador Cooperación Seguros...')" 
                       class="flex items-center justify-between p-3 sm:p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/30 cursor-pointer hover:bg-amber-500/20 transition-all">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                        CS
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <p class="font-bold text-sm text-on-surface truncate">Cooperación Seguros</p>
                        </div>
                        <p class="text-xs text-on-surface-variant truncate">Cotización & Emisión disponible</p>
                      </div>
                    </div>
                    <span class="material-symbols-outlined text-amber-500 shrink-0">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bento Section: Próximas Renovaciones Mercantil -->
            <div class="bg-surface-container-lowest p-4 sm:p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col w-full">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h3 class="text-base sm:text-lg font-bold flex items-center gap-2">
                  <span class="material-symbols-outlined text-amber-500">event_upcoming</span>
                  Próximas Renovaciones de Cartera
                </h3>
                <span (click)="showToast('Mostrando todas las renovaciones del mes')" class="text-xs font-bold text-primary cursor-pointer hover:underline">Ver todas (18 este mes)</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                @for (r of renovaciones(); track r.poliza_numero) {
                  <div (click)="showToast('Abriendo trámite de renovación ' + r.poliza_numero)" class="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-surface-container hover:shadow-sm transition-all">
                    <div class="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                      <div class="w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold border shrink-0"
                           [ngClass]="{
                             'bg-amber-500/10 text-amber-600 border-amber-500/20': r.dias_restantes <= 5,
                             'bg-slate-500/10 text-slate-600 border-slate-500/20': r.dias_restantes > 5
                           }">
                        <span class="text-xs font-black">{{ r.dias_restantes }}</span>
                        <span class="text-[8px] uppercase">días</span>
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="font-bold text-xs sm:text-sm text-on-surface truncate">Póliza {{ r.aseguradora }} #{{ r.poliza_numero }}</p>
                        <p class="text-xs text-on-surface-variant truncate">{{ r.bien }} • Cliente: <strong>{{ r.cliente }}</strong></p>
                      </div>
                    </div>
                    <div class="flex sm:flex-col justify-between sm:justify-center items-center sm:items-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/40 shrink-0">
                      <span class="text-sm font-extrabold text-primary block">{{ r.premio_fmt }}</span>
                      <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            [ngClass]="{
                              'text-emerald-600 bg-emerald-500/10 border border-emerald-500/20': r.estado === 'Renovación Lista',
                              'text-amber-600 bg-amber-500/10 border border-amber-500/20': r.estado !== 'Renovación Lista'
                            }">{{ r.estado }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </section>
        }

        <!-- Global Footer Info -->
        <footer class="py-6 px-4 text-center border-t border-outline-variant/40 mt-8 mb-20 md:mb-4 space-y-1">
          <p class="text-xs text-on-surface-variant font-bold">JC Broker Platform — <span class="text-primary font-extrabold">v1.0.0</span></p>
          <p class="text-[11px] text-outline font-medium">© 2026 JC Organizadores • Operación Centralizada • Powered by <strong class="text-primary">Katrix</strong></p>
        </footer>

      </main>

      <!-- ================= MODALS INTERACTIVOS ================= -->

      <!-- 1. MODAL DETALLE DE TICKET -->
      <div *ngIf="selectedTicket()" class="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
          
          <div class="flex justify-between items-start border-b border-outline-variant/40 pb-3">
            <div class="flex-1 mr-3 space-y-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-black bg-primary text-white px-2.5 py-0.5 rounded-lg shadow-xs">{{ selectedTicket().id }}</span>
                
                <!-- Tipo Selector (Editable) -->
                <div class="flex items-center gap-1 bg-surface-container p-1 rounded-xl border border-outline-variant/50">
                  <button (click)="changeSelectedTicketType('Siniestro')" 
                          class="px-2 py-0.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer"
                          [ngClass]="selectedTicket().tipo === 'Siniestro' ? 'bg-red-600 text-white shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'">
                    Siniestro
                  </button>
                  <button (click)="changeSelectedTicketType('Endoso')" 
                          class="px-2 py-0.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer"
                          [ngClass]="selectedTicket().tipo === 'Endoso' ? 'bg-indigo-600 text-white shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'">
                    Endoso
                  </button>
                  <button (click)="changeSelectedTicketType('Alta')" 
                          class="px-2 py-0.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer"
                          [ngClass]="selectedTicket().tipo === 'Alta' ? 'bg-emerald-600 text-white shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'">
                    Alta
                  </button>
                  <button (click)="changeSelectedTicketType('Facturación')" 
                          class="px-2 py-0.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer"
                          [ngClass]="selectedTicket().tipo === 'Facturación' ? 'bg-amber-600 text-white shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'">
                    Facturación
                  </button>
                </div>
              </div>

              <!-- Asunto Input Editable -->
              <input type="text" [(ngModel)]="selectedTicket().asunto" (change)="updateSelectedTicketSubject()"
                     class="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-1.5 text-xs sm:text-sm font-extrabold text-on-surface focus:outline-none focus:border-primary">
            </div>
            <button (click)="closeTicketDetail()" class="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container shrink-0">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Quick Stats & Priority Control Row -->
          <div class="space-y-2 bg-surface-container-low p-3 rounded-xl text-xs">
            <div class="grid grid-cols-2 gap-2 pb-2 border-b border-outline-variant/30">
              <div>
                <span class="text-on-surface-variant block font-medium">PAS Solicitante:</span>
                <strong class="text-on-surface">{{ selectedTicket().pas }}</strong>
              </div>
              <div>
                <span class="text-on-surface-variant block font-medium">Matrícula PAS:</span>
                <strong class="text-on-surface">#{{ selectedTicket().pasMatricula }}</strong>
              </div>
            </div>

            <!-- Priority Selector (Editable) -->
            <div>
              <span class="text-on-surface-variant block font-bold mb-1 uppercase text-[10px]">Nivel de Prioridad:</span>
              <div class="grid grid-cols-4 gap-1.5">
                <button (click)="changeSelectedTicketPriority('Baja')" 
                        class="py-1 px-2 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer active:scale-95"
                        [ngClass]="selectedTicket().prioridad === 'Baja' ? 'bg-slate-700 text-white border-slate-700 shadow-xs' : 'bg-surface-container text-on-surface border-outline-variant'">
                  Baja
                </button>
                <button (click)="changeSelectedTicketPriority('Media')" 
                        class="py-1 px-2 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer active:scale-95"
                        [ngClass]="selectedTicket().prioridad === 'Media' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-surface-container text-on-surface border-outline-variant'">
                  Media
                </button>
                <button (click)="changeSelectedTicketPriority('Alta')" 
                        class="py-1 px-2 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer active:scale-95"
                        [ngClass]="selectedTicket().prioridad === 'Alta' ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-surface-container text-on-surface border-outline-variant'">
                  Alta
                </button>
                <button (click)="changeSelectedTicketPriority('Crítica')" 
                        class="py-1 px-2 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer active:scale-95"
                        [ngClass]="selectedTicket().prioridad === 'Crítica' ? 'bg-red-600 text-white border-red-600 shadow-xs' : 'bg-surface-container text-on-surface border-outline-variant'">
                  🔥 Crítica
                </button>
              </div>
            </div>
          </div>

          <!-- Change Status Form (Solo editable por Administrador, Lectura para PAS) -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-on-surface-variant block">Estado del Trámite</label>
            <ng-container *ngIf="role() === 'admin'; else pasStatusReadOnly">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button (click)="changeSelectedTicketStatus('Abierto')" 
                        class="py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer"
                        [ngClass]="selectedTicket().estado === 'Abierto' ? 'bg-blue-600 text-white border-blue-600' : 'bg-surface-container text-on-surface border-outline-variant'">
                  Abierto
                </button>
                <button (click)="changeSelectedTicketStatus('En Proceso')" 
                        class="py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer"
                        [ngClass]="selectedTicket().estado === 'En Proceso' ? 'bg-amber-600 text-white border-amber-600' : 'bg-surface-container text-on-surface border-outline-variant'">
                  En Proceso
                </button>
                <button (click)="changeSelectedTicketStatus('Falta Doc.')" 
                        class="py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer"
                        [ngClass]="selectedTicket().estado === 'Falta Doc.' ? 'bg-red-600 text-white border-red-600' : 'bg-surface-container text-on-surface border-outline-variant'">
                  Falta Doc
                </button>
                <button (click)="changeSelectedTicketStatus('Cerrado')" 
                        class="py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer"
                        [ngClass]="selectedTicket().estado === 'Cerrado' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-surface-container text-on-surface border-outline-variant'">
                  Cerrado
                </button>
              </div>
            </ng-container>
            <ng-template #pasStatusReadOnly>
              <div class="flex items-center gap-2">
                <span class="text-xs font-black px-3.5 py-1.5 rounded-xl text-white shadow-xs"
                      [ngClass]="{
                        'bg-blue-600': selectedTicket().estado === 'Abierto',
                        'bg-amber-600': selectedTicket().estado === 'En Proceso',
                        'bg-red-600': selectedTicket().estado === 'Falta Doc.',
                        'bg-emerald-600': selectedTicket().estado === 'Cerrado'
                      }">
                  Estado Actual: {{ selectedTicket().estado }}
                </span>
                <span class="text-[11px] text-on-surface-variant font-medium">(Gestionado por Mesa Operativa Central)</span>
              </div>
            </ng-template>
          </div>

          <!-- Reassign Agent (Solo editable por Administrador, Lectura para PAS) -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-on-surface-variant block">Agente Asignado en Mesa Operativa</label>
            <ng-container *ngIf="role() === 'admin'; else pasAgentReadOnly">
              <select [ngModel]="selectedTicket().asignado" (ngModelChange)="reassignSelectedTicket($event)"
                      class="w-full bg-surface-container-low border border-outline-variant text-xs text-on-surface font-bold p-2.5 rounded-xl">
                <option value="Gonzalo">👑 Gonzalo (Mesa Operativa)</option>
                <option value="Candela">👩‍💼 Candela (Mesa Operativa)</option>
                <option value="Marina">👩‍💼 Marina (Mesa Operativa)</option>
              </select>
            </ng-container>
            <ng-template #pasAgentReadOnly>
              <div class="p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-bold text-on-surface flex items-center justify-between">
                <span>{{ selectedTicket().asignado }}</span>
                <span class="text-[10px] text-primary font-extrabold uppercase">Mesa Operativa Central</span>
              </div>
            </ng-template>
          </div>

          <!-- Add Note Section (Abierto para PAS y Admin para intercambio de respuestas) -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-on-surface-variant block">
              {{ role() === 'admin' ? 'Agregar Observación Operativa (Notifica al PAS)' : 'Enviar Respuesta / Documentación a Mesa Operativa' }}
            </label>
            <div class="flex flex-col sm:flex-row gap-2">
              <input type="text" [(ngModel)]="newTicketNote" (keyup.enter)="addNoteToSelectedTicket()"
                     [placeholder]="role() === 'admin' ? 'Ej: Se solicitó copia de cédula verde al PAS...' : 'Ej: Adjunto informe policial o consulta sobre el trámite...'"
                     class="flex-1 bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary">
              <button (click)="addNoteToSelectedTicket()" class="w-full sm:w-auto bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 cursor-pointer shadow-xs text-center">
                {{ role() === 'admin' ? 'Agregar & Notificar' : 'Enviar a Mesa Operativa' }}
              </button>
            </div>
          </div>

          <!-- Acciones Rápidas & Herramientas del Trámite -->
          <div class="space-y-1.5 pt-2 border-t border-outline-variant/30">
            <span class="text-[11px] font-bold text-on-surface-variant uppercase block">Acciones Rápidas & Herramientas:</span>
            <div class="flex flex-wrap gap-1.5">
              <button *ngIf="role() === 'admin'" (click)="ejecutarAccionRapidaTicket('doc')" class="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-xl text-xs font-bold transition-all border border-red-500/20 flex items-center gap-1 cursor-pointer active:scale-95">
                <span class="material-symbols-outlined text-sm">assignment_late</span>
                <span>Requerir Doc.</span>
              </button>
              <button *ngIf="role() === 'admin'" (click)="ejecutarAccionRapidaTicket('firma')" class="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 rounded-xl text-xs font-bold transition-all border border-amber-500/20 flex items-center gap-1 cursor-pointer active:scale-95">
                <span class="material-symbols-outlined text-sm">draw</span>
                <span>Pedir Firma Digital</span>
              </button>
              <button *ngIf="role() === 'admin'" (click)="ejecutarAccionRapidaTicket('aprobar')" class="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-xl text-xs font-bold transition-all border border-emerald-500/20 flex items-center gap-1 cursor-pointer active:scale-95">
                <span class="material-symbols-outlined text-sm">check_circle</span>
                <span>Aprobar & Cerrar</span>
              </button>
              <button (click)="adjuntarDocumentoTicket()" class="px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-all border border-primary/20 flex items-center gap-1 cursor-pointer active:scale-95">
                <span class="material-symbols-outlined text-sm">attach_file</span>
                <span>Adjuntar Documento / PDF</span>
              </button>
              <button (click)="contactarWhatsAppTicket()" class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95">
                <span class="material-symbols-outlined text-sm">chat</span>
                <span>Abrir WhatsApp</span>
              </button>
            </div>
          </div>

          <!-- Internal Notes & Movement History Timeline -->
          <div *ngIf="selectedTicket().notasInternal && selectedTicket().notasInternal.length > 0" class="space-y-1.5 pt-2 border-t border-outline-variant/30">
            <span class="text-[11px] font-bold text-on-surface-variant uppercase flex items-center gap-1">
              <span class="material-symbols-outlined text-xs text-primary">history</span> Historial de Movimientos y Observaciones:
            </span>
            <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              <div *ngFor="let note of selectedTicket().notasInternal; let first = first" 
                   class="text-xs p-2.5 rounded-xl text-on-surface border transition-all"
                   [ngClass]="first ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200 font-semibold' : 'bg-surface-container border-outline-variant/40'">
                <div class="flex items-center justify-between gap-1 mb-0.5">
                  <span class="text-[10px] font-bold text-primary uppercase" *ngIf="first">📌 ÚLTIMO MOVIMIENTO</span>
                </div>
                <span>{{ note }}</span>
              </div>
            </div>
          </div>

          <!-- Actions Footer -->
          <div class="pt-3 border-t border-outline-variant/40 flex justify-end gap-2">
            <button (click)="closeTicketDetail()" class="bg-primary hover:bg-primary-container text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-sm active:scale-95">
              Guardar & Cerrar
            </button>
          </div>
        </div>
      </div>

      <!-- 2. MODAL NUEVO TICKET OPERATIVO -->
      <div *ngIf="showNewTicketModal()" class="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
          <div class="flex justify-between items-center border-b border-outline-variant/40 pb-3">
            <h3 class="font-extrabold text-lg text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">add_circle</span>
              Nuevo Ticket Operativo
            </h3>
            <button (click)="showNewTicketModal.set(false)" class="p-1 rounded-lg text-outline hover:text-on-surface">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="font-bold text-on-surface-variant block mb-1">Asunto o Motivo del Trámite *</label>
              <input type="text" [(ngModel)]="newTicketForm.asunto" placeholder="Ej: Cambio de plan cobertura peugeot 208..."
                     class="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-xs text-on-surface focus:border-primary">
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-on-surface-variant block mb-1">Tipo de Trámite</label>
                <select [(ngModel)]="newTicketForm.tipo" class="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-xs text-on-surface">
                  <option value="Endoso">Endoso</option>
                  <option value="Siniestro">Siniestro</option>
                  <option value="Alta">Alta</option>
                  <option value="Facturación">Facturación</option>
                </select>
              </div>
              <div>
                <label class="font-bold text-on-surface-variant block mb-1">Prioridad</label>
                <select [(ngModel)]="newTicketForm.prioridad" class="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-xs text-on-surface">
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                  <option value="Crítica">Crítica</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-on-surface-variant block mb-1">Productor PAS Solicitante</label>
                <input type="text" [(ngModel)]="newTicketForm.pas" placeholder="Nombre PAS"
                       class="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-xs text-on-surface">
              </div>
              <div>
                <label class="font-bold text-on-surface-variant block mb-1">Agente Responsable</label>
                <select [(ngModel)]="newTicketForm.asignado" class="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-xs text-on-surface">
                  <option value="Marta García">Marta García</option>
                  <option value="Carlos Pires">Carlos Pires</option>
                  <option value="Lucía Fernández">Lucía Fernández</option>
                  <option value="Roberto Gómez">Roberto Gómez</option>
                </select>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-outline-variant/40 flex justify-end gap-2">
            <button (click)="showNewTicketModal.set(false)" class="px-4 py-2 rounded-xl text-xs font-bold border border-outline-variant">
              Cancelar
            </button>
            <button (click)="submitNewTicket()" class="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white shadow-sm cursor-pointer">
              Crear Ticket
            </button>
          </div>
        </div>
      </div>

      <!-- 3. MODAL DE ALERTAS (ENDOSOS Y ALTAS CRÍTICAS) -->
      <div *ngIf="alertType()" class="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
          <div class="flex justify-between items-center border-b border-outline-variant/40 pb-3">
            <h3 class="font-extrabold text-base text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-error">priority_high</span>
              {{ alertType() === 'endosos' ? '8 Endosos Críticos por Firmar' : '15 Altas Pendientes de Validación' }}
            </h3>
            <button (click)="alertType.set(null)" class="p-1 rounded-lg text-outline hover:text-on-surface">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div *ngFor="let item of alertItems()" class="p-3 bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-between text-xs">
              <div>
                <p class="font-bold text-on-surface">{{ item.titulo }}</p>
                <p class="text-on-surface-variant text-[11px]">{{ item.sub }}</p>
              </div>
              <button (click)="resolveAlertItem(item)" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] cursor-pointer">
                Aprobar
              </button>
            </div>
          </div>

          <div class="pt-3 border-t border-outline-variant/40 flex justify-end">
            <button (click)="alertType.set(null)" class="px-4 py-2 rounded-xl text-xs font-bold bg-surface-container text-on-surface">
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <!-- 4. MODAL DETALLE DE PRODUCTOR -->
      <div *ngIf="selectedProducer()" class="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex justify-between items-start border-b border-outline-variant/40 pb-3">
            <div class="flex items-center gap-3">
              <img [src]="selectedProducer().avatar" class="w-12 h-12 rounded-full object-cover border-2 border-primary">
              <div>
                <h3 class="font-extrabold text-base text-on-surface">{{ selectedProducer().nombre }}</h3>
                <p class="text-xs text-on-surface-variant font-medium">{{ selectedProducer().region }} • PAS #{{ selectedProducer().matricula }}</p>
              </div>
            </div>
            <button (click)="selectedProducer.set(null)" class="p-1 rounded-lg text-outline">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-2 text-xs">
            <div class="flex justify-between p-2.5 bg-surface-container rounded-xl">
              <span class="text-on-surface-variant font-medium">Tickets Resueltos Este Mes:</span>
              <strong class="text-primary font-black">{{ selectedProducer().ticketsResueltos }}</strong>
            </div>
            <div class="flex justify-between p-2.5 bg-surface-container rounded-xl">
              <span class="text-on-surface-variant font-medium">Tiempo Promedio de Respuesta:</span>
              <strong class="text-on-surface">{{ selectedProducer().tiempoRespuesta }}</strong>
            </div>
            <div class="flex justify-between p-2.5 bg-surface-container rounded-xl">
              <span class="text-on-surface-variant font-medium">Calificación de Servicio:</span>
              <strong class="text-emerald-600">★ {{ selectedProducer().satisfaccion }}</strong>
            </div>
            <div class="flex justify-between p-2.5 bg-surface-container rounded-xl">
              <span class="text-on-surface-variant font-medium">Cartera Administrada:</span>
              <strong class="text-on-surface">{{ selectedProducer().carteraTotal }}</strong>
            </div>
          </div>

          <div class="pt-3 border-t border-outline-variant/40 flex justify-end gap-2">
            <button (click)="selectedProducer.set(null)" class="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white cursor-pointer">
              Aceptar
            </button>
          </div>
        </div>
      </div>

    </div>
  
    }
  `,
  styles: [`
    .error-shake {
      animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }

    .skeleton {
      background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite linear;
    }

    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .card-accent-blue { border-left: 4px solid #0058be; }
    .card-accent-green { border-left: 4px solid #006c49; }
    .card-accent-red { border-left: 4px solid #ba1a1a; }

    .metric-card-accent-blue { border-left: 4px solid #0058be; }
    .metric-card-accent-green { border-left: 4px solid #006c49; }
    .metric-card-accent-red { border-left: 4px solid #ba1a1a; }
    .metric-card-accent-tertiary { border-left: 4px solid #4648d4; }

    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    .premium-card {
        background: #ffffff;
        border: 1px solid #E2E8F0;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .left-accent-blue { border-left: 4px solid #0058be; }
    .left-accent-green { border-left: 4px solid #006c49; }
    .left-accent-red { border-left: 4px solid #ba1a1a; }
    .left-accent-orange { border-left: 4px solid #f59e0b; }
  `]
})
export class DashboardComponent implements OnInit {
  isLoading = signal(true);
  isError = signal(false);
  isRetrying = signal(false);

  private authService = inject(AuthService);
  private pushService = inject(PushNotificationService);
  private http = inject(HttpClient);

  // States
  selectedPeriod = signal('Junio 2026');
  activeStatusFilter = signal<'pendientes' | 'all' | 'Abierto' | 'En Proceso' | 'Falta Doc.' | 'Cerrado'>('pendientes');
  ticketSearchQuery = signal('');
  toastMessage = signal<string | null>(null);

  // PAS Specific Stats
  premioTotalFmt = signal('$18.5M');
  clientesCount = signal(219);
  polizasCount = signal(312);
  renovaciones = signal<any[]>([
    {
      dias_restantes: 3,
      poliza_numero: "5-894210-242193",
      aseguradora: "Mercantil Andina",
      bien: "PEUGEOT 208 1.6 FELINE HDI",
      cliente: "BAHAMONDE JOSE ANTONIO",
      cliente_id: 242193,
      premio_fmt: "$64.500",
      estado: "Renovación Lista"
    },
    {
      dias_restantes: 5,
      poliza_numero: "20027144800",
      aseguradora: "Cooperación Seguros",
      bien: "COMBINADO FAMILIAR HOGAR",
      cliente: "PEREZ CLAUDIA ROSANA",
      cliente_id: 2008962,
      premio_fmt: "$28.900",
      estado: "Renovación Lista"
    },
    {
      dias_restantes: 8,
      poliza_numero: "5-894210-2008962",
      aseguradora: "Mercantil Andina",
      bien: "TOYOTA COROLLA 2.0 SEG",
      cliente: "PEREZ CLAUDIA ROSANA",
      cliente_id: 2008962,
      premio_fmt: "$64.500",
      estado: "Pendiente Inspección"
    },
    {
      dias_restantes: 12,
      poliza_numero: "5-302194-950723",
      aseguradora: "Mercantil Andina",
      bien: "TOYOTA HILUX 2.8 SRX 4X4",
      cliente: "PEREZ DANIEL HORACIO",
      cliente_id: 950723,
      premio_fmt: "$118.500",
      estado: "Renovación Lista"
    }
  ]);

  // Modals state
  selectedTicket = signal<Ticket | null>(null);
  newTicketNote = '';
  showNewTicketModal = signal(false);
  alertType = signal<'endosos' | 'altas' | null>(null);
  selectedProducer = signal<ProducerStats | null>(null);

  newTicketForm = {
    asunto: '',
    tipo: 'Endoso' as 'Endoso' | 'Siniestro' | 'Alta' | 'Facturación',
    prioridad: 'Media' as 'Baja' | 'Media' | 'Alta' | 'Crítica',
    pas: 'Gonzalo Paso',
    asignado: 'Marta García'
  };

  // Tickets signal
  tickets = signal<Ticket[]>(DEFAULT_TICKETS);

  // Perfiles Administrativos de Mesa Operativa Central
  activeAdminAgent = signal<'Gonzalo' | 'Candela' | 'Marina'>('Gonzalo');
  assignedFilter = signal<'mis' | 'todos'>('todos');

  setActiveAdminAgent(agentName: 'Gonzalo' | 'Candela' | 'Marina') {
    this.activeAdminAgent.set(agentName);
    this.showToast(`Operador activo cambiado a: ${agentName}`);
  }

  countByAgent(agentName: string): number {
    return this.tickets().filter(t => t.asignado === agentName).length;
  }

  tomarTramiteDirecto(ticket: Ticket, event?: Event) {
    if (event) event.stopPropagation();
    const active = this.activeAdminAgent();
    ticket.asignado = active;
    ticket.asignadoInitials = active.substring(0, 1).toUpperCase();
    ticket.tiempo = 'Justo ahora';

    if (!ticket.notasInternal) ticket.notasInternal = [];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    ticket.notasInternal.unshift(`[${timestamp}] ⚡ Trámite tomado por ${active} para gestión exclusiva.`);

    const alertData = {
      id: 'auto-take-' + Date.now(),
      titulo: `⚡ Trámite Asignado (${ticket.id})`,
      mensaje: `${active} tomó el trámite "${ticket.asunto}".`,
      tipo: 'cartera',
      icon: 'person',
      remitente: active.toUpperCase(),
      hora: 'Ahora',
      link: ticket.id,
      recipientRole: 'pas'
    };

    this.updateTicketInList(ticket, alertData);
    this.showToast(`Trámite ${ticket.id} asignado a ${active}`);
  }

  producers = signal<ProducerStats[]>([
    {
      id: 'p1',
      nombre: 'Gonzalo',
      region: 'Mesa Operativa',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTIabKB45fJfFZT8sg1aLxduEgN7AhCOFzIsvmDSkF1oQKBmdkCcCBoTSyCSChn6hodGbZI9ruZjissrJ5QsF3IDVRtjA6J_W2g7JLX0xFKsM1ikBVlcQ9r38sAYjxHsXHIZPTgie5K_XSZduWWYNgACxqSIw2gLDCzotWC2Dnob-KctR1SKP16Bl51hNH5aWcclyiekEm3v5yGCDSQ9gi7Dg_7O1eT0OBqbZcPDCORCLDN0MRj7JEYCCNBeurMU-BOkLdAi8BUPh0',
      ticketsResueltos: 142,
      porcentaje: 92,
      tiempoRespuesta: '12 min',
      satisfaccion: '4.9/5',
      carteraTotal: '$28.8M',
      matricula: '86992',
      email: 'gonzalo@jcorg.com.ar',
      telefono: '+54 9 261 423-8800'
    },
    {
      id: 'p2',
      nombre: 'Candela',
      region: 'Mesa Operativa',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      ticketsResueltos: 118,
      porcentaje: 88,
      tiempoRespuesta: '15 min',
      satisfaccion: '4.9/5',
      carteraTotal: '$21.2M',
      matricula: 'ADM-102',
      email: 'candela@jcorg.com.ar',
      telefono: '+54 9 11 3322-1100'
    },
    {
      id: 'p3',
      nombre: 'Marina',
      region: 'Mesa Operativa',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      ticketsResueltos: 105,
      porcentaje: 84,
      tiempoRespuesta: '19 min',
      satisfaccion: '4.8/5',
      carteraTotal: '$18.4M',
      matricula: 'ADM-105',
      email: 'marina@jcorg.com.ar',
      telefono: '+54 9 261 412-9988'
    }
  ]);

  countPendingTickets(): number {
    return this.tickets().filter(t => t.estado !== 'Cerrado').length;
  }

  aprobarYArchivarTramiteDirecto(ticket: Ticket, event: Event) {
    event.stopPropagation();
    ticket.estado = 'Cerrado';
    ticket.tiempo = 'Justo ahora';

    if (!ticket.notasInternal) ticket.notasInternal = [];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    ticket.notasInternal.unshift(`[${timestamp}] Mesa Operativa (${this.activeAdminAgent()}): Trámite aprobado y archivado.`);

    const alertData = {
      id: 'auto-close-' + Date.now(),
      titulo: `✅ Trámite Aprobado & Archivado (${ticket.id})`,
      mensaje: `El trámite "${ticket.asunto}" fue finalizado exitosamente por ${this.activeAdminAgent()}.`,
      tipo: 'siniestro',
      icon: 'check_circle',
      remitente: 'MESA OPERATIVA',
      hora: 'Ahora',
      link: ticket.id,
      recipientRole: 'pas'
    };

    this.updateTicketInList(ticket, alertData);
    this.showToast(`Trámite ${ticket.id} Aprobado y Archivado (Salió de pendientes)`);
  }

  requerirDocDirecto(ticket: Ticket, event: Event) {
    event.stopPropagation();
    ticket.estado = 'Falta Doc.';
    ticket.tiempo = 'Justo ahora';

    if (!ticket.notasInternal) ticket.notasInternal = [];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    ticket.notasInternal.unshift(`[${timestamp}] Mesa Operativa (${this.activeAdminAgent()}): Se solicitó documentación urgente al PAS.`);

    const alertData = {
      id: 'auto-docreq-' + Date.now(),
      titulo: `⚠️ Documentación Requerida (${ticket.id})`,
      mensaje: `Se requirió documentación para el trámite "${ticket.asunto}".`,
      tipo: 'siniestro',
      icon: 'warning',
      remitente: 'MESA OPERATIVA',
      hora: 'Ahora',
      link: ticket.id,
      recipientRole: 'pas'
    };

    this.updateTicketInList(ticket, alertData);
    this.showToast(`Trámite ${ticket.id} marcado como Falta Documentación`);
  }

  // Computed Filtered Tickets for Admin
  filteredTickets = computed(() => {
    let list = this.tickets();
    const filter = this.activeStatusFilter();
    const query = this.ticketSearchQuery().toLowerCase().trim();

    if (filter === 'pendientes') {
      list = list.filter(t => t.estado !== 'Cerrado');
    } else if (filter !== 'all') {
      list = list.filter(t => t.estado === filter);
    }

    if (query) {
      list = list.filter(t => 
        t.id.toLowerCase().includes(query) ||
        t.asunto.toLowerCase().includes(query) ||
        t.pas.toLowerCase().includes(query) ||
        t.tipo.toLowerCase().includes(query) ||
        t.asignado.toLowerCase().includes(query)
      );
    }

    return list;
  });

  // Computed Tickets for PAS view (Gonzalo Paso / Carlos Benítez)
  // Los tickets Cerrados siempre van al fondo de la lista
  pasTickets = computed(() => {
    const all = this.tickets();
    const pasName = this.userFullName();
    const mat = this.userMatricula();
    const filtered = all.filter(t =>
      t.pasMatricula === mat ||
      t.pas.toLowerCase().includes('gonzalo') ||
      t.pas.toLowerCase().includes('carlos') ||
      t.pas.toLowerCase().includes(pasName.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const aClosed = a.estado === 'Cerrado' ? 1 : 0;
      const bClosed = b.estado === 'Cerrado' ? 1 : 0;
      return aClosed - bClosed;
    });
  });

  // Computed Alert Items
  alertItems = computed(() => {
    if (this.alertType() === 'endosos') {
      return [
        { id: 1, titulo: '#END-901 Toyota Hilux SRX', sub: 'Inclusión cláusula no repetición • PAS Gonzalo Paso' },
        { id: 2, titulo: '#END-904 Peugeot 208 Feline', sub: 'Cambio de titularidad • PAS Carlos Benítez' },
        { id: 3, titulo: '#END-908 Volkswagen Amarok V6', sub: 'Aumento suma asegurada $45M • PAS Marta García' },
        { id: 4, titulo: '#END-912 Ford Ranger Limited', sub: 'Modificación zona de riesgo • PAS Juan Pérez' }
      ];
    } else {
      return [
        { id: 10, titulo: '#ALT-301 Bahamonde José', sub: 'Scoring A+ • Mercantil Andina' },
        { id: 11, titulo: '#ALT-302 Pérez Claudia', sub: 'Combinado Familiar • Cooperación Seguros' },
        { id: 12, titulo: '#ALT-305 Gómez Roberto', sub: 'Accidentes Personales Flota' }
      ];
    }
  });

  role = computed(() => this.authService.currentUser()?.role || 'admin');
  userFullName = computed(() => {
    const name = this.authService.currentUser()?.name;
    return (!name || name === 'Productor PAS') ? 'Gonzalo Javier Paso' : name;
  });
  userMatricula = computed(() => this.authService.currentUser()?.matricula || '86992');
  userOrganizador = computed(() => this.authService.currentUser()?.organizador || 'JCORG Broker de Seguros');

  ngOnInit() {
    this.initialLoadSequence();
    this.cargarMetricasCartera();

    // Sincronizar inicialmente desde FastAPI backend
    this.syncTicketsFromBackend();

    // Sincronización continua en vivo (cada 3s) desde la API central de FastAPI
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.syncTicketsFromBackend();
      }, 3000);
    }
  }

  private processedAlertIds = new Set<string>();
  // Bloqueo temporal de sync mientras hay un cambio local en vuelo (ms)
  private _syncLockUntil = 0;

  private syncTicketsFromBackend() {
    // Si hay un cambio local reciente en vuelo, no sobreescribir con datos viejos
    if (Date.now() < this._syncLockUntil) return;

    this.http.get<any>('/api/v1/tickets').subscribe({
      next: (res) => {
        // Verificar de nuevo al recibir la respuesta (el POST puede tardar)
        if (Date.now() < this._syncLockUntil) return;

        if (res && res.tickets) {
          const remoteJson = JSON.stringify(res.tickets);
          const currentJson = JSON.stringify(this.tickets());
          if (remoteJson !== currentJson) {
            this.tickets.set(res.tickets);

            // Si hay un modal abierto (selectedTicket), actualizar sus notas y estado en tiempo real
            if (this.selectedTicket()) {
              const currentId = this.selectedTicket()!.id;
              const updatedTicket = res.tickets.find((t: any) => t.id === currentId);
              if (updatedTicket) {
                this.selectedTicket.set({ ...updatedTicket });
              }
            }
          }
        }
        if (res && res.pending_alerts && res.pending_alerts.length > 0) {
          for (const alertData of res.pending_alerts) {
            const alertId = alertData.id || alertData.titulo;
            if (!this.processedAlertIds.has(alertId)) {
              this.processedAlertIds.add(alertId);
              const targetRole = alertData.recipientRole || 'pas';
              if (targetRole === 'all' || targetRole === this.role()) {
                this.pushService.emitirAlertaLocal(alertData);
              }
            }
          }
        }
      },
      error: () => {}
    });
  }

  private persistTickets(list: Ticket[], pendingAlert?: any) {
    this.tickets.set([...list]);
    // Bloquear sync por 8s para darle tiempo al backend de procesar el POST
    this._syncLockUntil = Date.now() + 8000;
    const payload: any = { tickets: list };
    if (pendingAlert) {
      payload.alert = pendingAlert;
    }
    this.http.post('/api/v1/tickets', payload).subscribe({
      next: () => {
        // POST confirmado: extender lock 3s más para que el próximo GET traiga datos frescos
        this._syncLockUntil = Date.now() + 3000;
      },
      error: () => {
        // Si el POST falla, mantener el estado local (no liberar el lock prematuramente)
        this._syncLockUntil = Math.max(this._syncLockUntil, Date.now() + 5000);
      }
    });
  }

  cargarMetricasCartera() {
    this.http.get<any>('/api/v1/quotations/mercantil/portfolio/metrics').subscribe({
      next: (m) => {
        if (m) {
          if (m.premio_administrado_fmt) this.premioTotalFmt.set(m.premio_administrado_fmt);
          if (m.clientes_activos) this.clientesCount.set(m.clientes_activos);
          if (m.polizas_vigentes) this.polizasCount.set(m.polizas_vigentes);
          if (m.renovaciones && m.renovaciones.length > 0) this.renovaciones.set(m.renovaciones);
        }
      },
      error: () => {}
    });
  }

  initialLoadSequence() {
    this.isLoading.set(false);
    this.isError.set(false);
  }

  simulateReload() {
    this.isRetrying.set(true);
    setTimeout(() => {
      this.isRetrying.set(false);
      this.isError.set(false);
      this.isLoading.set(false);
    }, 1200);
  }

  // Interactivity Methods
  setStatusFilter(status: 'all' | 'Abierto' | 'En Proceso' | 'Falta Doc.' | 'Cerrado') {
    this.activeStatusFilter.set(status);
  }

  countByStatus(status: 'Abierto' | 'En Proceso' | 'Falta Doc.' | 'Cerrado'): number {
    return this.tickets().filter(t => t.estado === status).length;
  }

  openTicketDetail(ticket: Ticket) {
    this.selectedTicket.set({ ...ticket, notasInternal: [...(ticket.notasInternal || [])] });
  }

  /** Abre el detalle del ticket referenciado en el toast (link = ticket ID, ej: '#END-8839') */
  openTicketFromToast(toast: any) {
    if (!toast?.link) {
      this.pushService.descartarToast();
      return;
    }
    // Buscar el ticket por ID en la lista actual
    const ticketId = toast.link.startsWith('#') ? toast.link : '#' + toast.link;
    const found = this.tickets().find(t => t.id === ticketId);
    if (found) {
      this.pushService.descartarToast();
      this.openTicketDetail(found);
    } else {
      // Si no encuentra por ID exacto, cerrar el toast igualmente
      this.pushService.descartarToast();
    }
  }

  closeTicketDetail() {
    this.selectedTicket.set(null);
    this.newTicketNote = '';
  }

  // CAMBIO DE ESTADO EN TIEMPO REAL: Notifica al backend y actualiza UI reactiva
  changeSelectedTicketStatus(status: 'Abierto' | 'En Proceso' | 'Falta Doc.' | 'Cerrado') {
    const t = this.selectedTicket();
    if (!t) return;
    t.estado = status;
    t.tiempo = 'Justo ahora';

    // Forzar actualización reactiva de la señal modal
    this.selectedTicket.set({ ...t });

    const alertData = {
      id: 'auto-pas-' + Date.now(),
      titulo: `🔔 Mesa Operativa (${t.id})`,
      mensaje: `Tu trámite (${t.tipo}): "${t.asunto}" cambió a estado "${status}".`,
      tipo: 'siniestro',
      icon: 'notifications_active',
      remitente: 'JC PAS MESA OPERATIVA',
      hora: 'Ahora',
      link: t.id,
      recipientRole: 'pas'
    };

    this.updateTicketInList(t, alertData);
    this.showToast(`Estado del ticket ${t.id} actualizado a "${status}"`);
  }

  changeSelectedTicketPriority(priority: 'Baja' | 'Media' | 'Alta' | 'Crítica') {
    const t = this.selectedTicket();
    if (!t) return;
    t.prioridad = priority;
    t.tiempo = 'Justo ahora';

    if (!t.notasInternal) t.notasInternal = [];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    t.notasInternal.unshift(`[${timestamp}] Prioridad de trámite actualizada a "${priority}".`);

    this.selectedTicket.set({ ...t });

    const alertData = {
      id: 'auto-prio-' + Date.now(),
      titulo: `⚡ Prioridad Actualizada (${t.id})`,
      mensaje: `Prioridad del trámite cambiada a "${priority}".`,
      tipo: 'siniestro',
      icon: 'priority_high',
      remitente: 'MESA OPERATIVA',
      hora: 'Ahora',
      link: t.id,
      recipientRole: 'pas'
    };

    this.updateTicketInList(t, alertData);
    this.showToast(`Prioridad del ticket ${t.id} cambiada a "${priority}"`);
  }

  changeSelectedTicketType(tipo: 'Endoso' | 'Siniestro' | 'Alta' | 'Facturación') {
    const t = this.selectedTicket();
    if (!t) return;
    t.tipo = tipo;

    const numPart = t.id.replace(/[^0-9]/g, '');
    const prefixMap = {
      'Siniestro': 'SIN',
      'Endoso': 'END',
      'Alta': 'ALT',
      'Facturación': 'FAC'
    };
    t.id = `#${prefixMap[tipo]}-${numPart}`;
    t.tiempo = 'Justo ahora';

    if (!t.notasInternal) t.notasInternal = [];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    t.notasInternal.unshift(`[${timestamp}] Categoría de trámite modificada a "${tipo}" (Nuevo ID: ${t.id}).`);

    this.selectedTicket.set({ ...t });

    const alertData = {
      id: 'auto-type-' + Date.now(),
      titulo: `🏷️ Categoría de Trámite (${t.id})`,
      mensaje: `Categoría del trámite actualizada a "${tipo}".`,
      tipo: 'cartera',
      icon: 'category',
      remitente: 'MESA OPERATIVA',
      hora: 'Ahora',
      link: t.id,
      recipientRole: 'pas'
    };

    this.updateTicketInList(t, alertData);
    this.showToast(`Tipo de trámite cambiado a "${tipo}" (${t.id})`);
  }

  updateSelectedTicketSubject() {
    const t = this.selectedTicket();
    if (!t) return;
    t.tiempo = 'Justo ahora';
    this.selectedTicket.set({ ...t });
    this.updateTicketInList(t);
    this.showToast(`Asunto del ticket ${t.id} actualizado`);
  }

  // REASIGNACIÓN EN TIEMPO REAL
  reassignSelectedTicket(agentName: string) {
    const t = this.selectedTicket();
    if (!t) return;
    t.asignado = agentName;
    t.asignadoInitials = agentName.split(' ').map(n => n[0]).join('');
    t.tiempo = 'Justo ahora';

    this.selectedTicket.set({ ...t });

    const alertData = {
      id: 'auto-pas-' + Date.now(),
      titulo: `👤 Agente Reasignado (${t.id})`,
      mensaje: `Tu trámite ${t.id} fue reasignado al agente ${agentName} en Mesa Operativa.`,
      tipo: 'cartera',
      icon: 'person',
      remitente: 'JC PAS MESA OPERATIVA',
      hora: 'Ahora',
      link: t.id,
      recipientRole: 'pas'
    };

    this.updateTicketInList(t, alertData);
    this.showToast(`Ticket ${t.id} reasignado a ${agentName}`);
  }

  // NUEVA OBSERVACIÓN O RESPUESTA EN TIEMPO REAL
  addNoteToSelectedTicket() {
    if (!this.newTicketNote.trim() || !this.selectedTicket()) return;
    const t = this.selectedTicket()!;
    if (!t.notasInternal) t.notasInternal = [];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const noteContent = this.newTicketNote.trim();
    const isAdmin = this.role() === 'admin';
    const sender = isAdmin ? 'Mesa Operativa' : `PAS ${this.userFullName()}`;

    t.notasInternal.unshift(`[${timestamp}] ${sender}: ${noteContent}`);
    t.tiempo = 'Justo ahora';

    this.selectedTicket.set({ ...t });

    const recipientRole: 'pas' | 'admin' = isAdmin ? 'pas' : 'admin';
    const alertData = {
      id: 'auto-note-' + Date.now(),
      titulo: isAdmin ? `📌 Nueva Observación en ${t.id}` : `📩 Mensaje del PAS (${t.id})`,
      mensaje: `${sender}: "${noteContent}"`,
      tipo: 'siniestro',
      icon: 'edit_note',
      remitente: sender.toUpperCase(),
      hora: 'Ahora',
      link: t.id,
      recipientRole: recipientRole
    };

    this.updateTicketInList(t, alertData);
    this.newTicketNote = '';
    this.showToast(isAdmin ? 'Observación guardada y notificada al PAS' : 'Respuesta enviada a Mesa Operativa');
  }

  adjuntarDocumentoTicket() {
    const t = this.selectedTicket();
    if (!t) return;
    const fileName = prompt('Ingrese el nombre del archivo o documento a adjuntar (ej: denuncia_policial.pdf):', 'denuncia_policial_comisaria_2da.pdf');
    if (!fileName) return;

    if (!t.notasInternal) t.notasInternal = [];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sender = this.role() === 'admin' ? 'Mesa Operativa' : `PAS ${this.userFullName()}`;

    t.notasInternal.unshift(`[${timestamp}] 📎 ${sender} adjuntó documento: ${fileName} (Válido)`);
    t.tiempo = 'Justo ahora';

    this.selectedTicket.set({ ...t });

    const alertData = {
      id: 'auto-doc-' + Date.now(),
      titulo: `📎 Documento Adjunto (${t.id})`,
      mensaje: `${sender} adjuntó "${fileName}" al trámite.`,
      tipo: 'siniestro',
      icon: 'attach_file',
      remitente: sender.toUpperCase(),
      hora: 'Ahora',
      link: t.id,
      recipientRole: this.role() === 'admin' ? 'pas' : 'admin'
    };

    this.updateTicketInList(t, alertData);
    this.showToast(`Documento "${fileName}" adjuntado exitosamente`);
  }

  ejecutarAccionRapidaTicket(accion: 'doc' | 'firma' | 'aprobar') {
    const t = this.selectedTicket();
    if (!t) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (accion === 'doc') {
      t.estado = 'Falta Doc.';
      if (!t.notasInternal) t.notasInternal = [];
      t.notasInternal.unshift(`[${timestamp}] Mesa Operativa: Se requirió documentación complementaria (Cédula / DNI / Informe) al PAS.`);
    } else if (accion === 'firma') {
      t.estado = 'En Proceso';
      if (!t.notasInternal) t.notasInternal = [];
      t.notasInternal.unshift(`[${timestamp}] Mesa Operativa: Se envió enlace de Firma Digital por Email/SMS al asegurado.`);
    } else if (accion === 'aprobar') {
      t.estado = 'Cerrado';
      if (!t.notasInternal) t.notasInternal = [];
      t.notasInternal.unshift(`[${timestamp}] Mesa Operativa: Trámite verificado y Aprobado exitosamente. Póliza/Endoso listo.`);
    }
    t.tiempo = 'Justo ahora';

    this.selectedTicket.set({ ...t });

    const alertData = {
      id: 'auto-action-' + Date.now(),
      titulo: `⚡ Actualización de Trámite ${t.id}`,
      mensaje: `El trámite cambió a estado "${t.estado}".`,
      tipo: 'siniestro',
      icon: 'sync',
      remitente: 'MESA OPERATIVA',
      hora: 'Ahora',
      link: t.id,
      recipientRole: 'pas'
    };

    this.updateTicketInList(t, alertData);
    this.showToast(`Acción ejecutada: Estado actualizado a "${t.estado}"`);
  }

  contactarWhatsAppTicket() {
    const t = this.selectedTicket();
    if (!t) return;
    const msg = `Hola! 👋 Te escribo respecto al trámite ${t.id} (${t.tipo}): "${t.asunto}". Estado actual: ${t.estado}.`;
    const phone = '02614238800';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  private updateTicketInList(updated: Ticket, alertData?: any) {
    const current = [...this.tickets()];
    const idx = current.findIndex(x => x.id === updated.id);
    if (idx !== -1) {
      current[idx] = { ...updated };
      this.persistTickets(current, alertData);
    }
  }

  openNewTicketModal() {
    this.newTicketForm = {
      asunto: '',
      tipo: 'Endoso',
      prioridad: 'Media',
      pas: 'Gonzalo Paso',
      asignado: 'Marta García'
    };
    this.showNewTicketModal.set(true);
  }

  submitNewTicket() {
    if (!this.newTicketForm.asunto.trim()) {
      this.showToast('Por favor ingresá el asunto del ticket');
      return;
    }
    const newId = `#TK-${Math.floor(8850 + Math.random() * 100)}`;
    const initials = this.newTicketForm.asignado.split(' ').map(n => n[0]).join('');

    const newT: Ticket = {
      id: newId,
      tipo: this.newTicketForm.tipo,
      asunto: this.newTicketForm.asunto,
      prioridad: this.newTicketForm.prioridad,
      estado: 'Abierto',
      asignado: this.newTicketForm.asignado,
      asignadoInitials: initials,
      tiempo: 'Justo ahora',
      pas: this.newTicketForm.pas,
      pasMatricula: '86992',
      notasInternal: ['Ticket creado desde la plataforma']
    };

    const alertData = {
      id: 'new-ticket-' + Date.now(),
      titulo: `📋 Nuevo Ticket Operativo (${newId})`,
      mensaje: `Trámite "${newT.asunto}" registrado para el PAS ${newT.pas}.`,
      tipo: 'cartera',
      icon: 'add_task',
      remitente: 'JC PAS MESA OPERATIVA',
      hora: 'Ahora',
      link: newId,
      recipientRole: 'pas'
    };

    const updated = [newT, ...this.tickets()];
    this.persistTickets(updated, alertData);
    this.showNewTicketModal.set(false);
    this.showToast(`Ticket ${newId} creado con éxito`);
  }

  openAlertModal(type: 'endosos' | 'altas') {
    this.alertType.set(type);
  }

  resolveAlertItem(item: any) {
    this.showToast(`Trámite ${item.titulo} aprobado con éxito`);
  }

  openProducerDetail(producer: ProducerStats) {
    this.selectedProducer.set(producer);
  }

  exportReport() {
    this.showToast('Generando y descargando reporte de gestión en Excel (XLSX)...');
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      if (this.toastMessage() === msg) {
        this.toastMessage.set(null);
      }
    }, 3500);
  }
}
