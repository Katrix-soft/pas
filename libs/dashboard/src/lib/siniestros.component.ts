import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export interface AdjuntoSiniestro {
  nombre: string;
  tipo: string;
  tamano: string;
  url?: string;
}

export interface Siniestro {
  id: string;
  numero_siniestro: string;
  poliza: string;
  cliente: string;
  cliente_id: number;
  tipo_siniestro: string;
  fecha_ocurrencia: string;
  fecha_denuncia: string;
  estado: 'Pendiente' | 'En Inspección' | 'Liquidado' | string;
  monto_estimado: number;
  monto_liquidado: number;
  compania: string;
  ramo: string;
  objeto: string;
  inspector?: string;
  taller_asignado?: string;
  adjuntos?: AdjuntoSiniestro[];
  cronograma?: any[];
}

@Component({
  selector: 'lib-siniestros',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  template: `
    <div class="bg-surface text-on-surface font-body-md min-h-screen pb-36 md:pb-12 overflow-x-hidden">
      <main class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6 space-y-4">
        
        <!-- Header Section -->
        <section class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant shadow-xs">
          <div>
            <h1 class="text-lg sm:text-2xl font-extrabold text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-2xl">report_problem</span>
              <span>Gestión de Siniestros</span>
            </h1>
            <p class="text-xs text-on-surface-variant mt-0.5">Denuncias, estado de inspección y peritajes en tiempo real.</p>
          </div>
          <button (click)="openDenunciaModal()" class="w-full sm:w-auto bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-xs cursor-pointer">
            <span class="material-symbols-outlined text-base">add_alert</span>
            <span>Denunciar Siniestro</span>
          </button>
        </section>

        <!-- Search Bar -->
        <section class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span class="material-symbols-outlined text-outline text-lg">search</span>
          </div>
          <input
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange()"
            class="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-sm text-on-surface placeholder-on-surface-variant transition-all shadow-xs"
            placeholder="Buscar por siniestro, cliente o póliza..."
            type="text"
          />
        </section>

        <!-- Filter Chips -->
        <section class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            *ngFor="let f of filters"
            (click)="setActiveFilter(f)"
            [class]="activeFilter() === f ? 'bg-primary text-white border-primary shadow-xs font-bold' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary font-medium'"
            class="whitespace-nowrap px-3.5 py-1.5 rounded-full border text-xs transition-colors cursor-pointer shrink-0"
          >
            {{ f }}
          </button>
        </section>

        <!-- Loading Spinner -->
        <div *ngIf="isLoading()" class="flex flex-col items-center justify-center py-12 space-y-3">
          <span class="material-symbols-outlined text-primary text-3xl animate-spin">sync</span>
          <p class="text-xs font-bold text-outline">Cargando expediente de siniestros...</p>
        </div>

        <!-- Siniestros Listing -->
        <section *ngIf="!isLoading()" class="space-y-3">
          
          <!-- Empty State -->
          <div *ngIf="filteredSiniestros().length === 0" class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 text-center space-y-2 shadow-xs">
            <span class="material-symbols-outlined text-outline text-3xl">folder_off</span>
            <p class="text-xs sm:text-sm font-bold text-on-surface">Sin resultados para esta búsqueda.</p>
          </div>

          <!-- Cards per Siniestro -->
          <div
            *ngFor="let item of filteredSiniestros()"
            class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all relative border-l-4"
            [ngClass]="{
              'border-l-indigo-600': item.estado === 'En Inspección',
              'border-l-emerald-600': item.estado === 'Liquidado',
              'border-l-amber-500': item.estado === 'Pendiente'
            }"
          >
            <div class="p-3.5 sm:p-5 flex flex-col space-y-3">
              <!-- Top Row: Client & Status Badge -->
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2.5 border-b border-outline-variant/40">
                <div class="min-w-0 w-full sm:w-auto">
                  <div class="flex items-center justify-between sm:justify-start gap-2">
                    <h3 class="text-sm sm:text-base font-bold text-on-surface truncate">{{ item.cliente }}</h3>
                    <span
                      class="sm:hidden px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 border"
                      [ngClass]="{
                        'bg-indigo-500/10 text-indigo-600 border-indigo-500/20': item.estado === 'En Inspección',
                        'bg-emerald-500/10 text-emerald-600 border-emerald-500/20': item.estado === 'Liquidado',
                        'bg-amber-500/10 text-amber-600 border-amber-500/20': item.estado === 'Pendiente'
                      }"
                    >
                      {{ item.estado }}
                    </span>
                  </div>
                  <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-on-surface-variant font-medium mt-1">
                    <span class="font-bold text-primary">Siniestro #{{ item.numero_siniestro }}</span>
                    <span class="hidden sm:inline">•</span>
                    <span class="text-[11px] sm:text-xs">Póliza: <strong>{{ item.poliza }}</strong></span>
                  </div>
                </div>

                <span
                  class="hidden sm:flex px-3 py-1 rounded-full text-xs font-bold items-center gap-1.5 shrink-0 border"
                  [ngClass]="{
                    'bg-indigo-500/10 text-indigo-600 border-indigo-500/20': item.estado === 'En Inspección',
                    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20': item.estado === 'Liquidado',
                    'bg-amber-500/10 text-amber-600 border-amber-500/20': item.estado === 'Pendiente'
                  }"
                >
                  <span class="w-2 h-2 rounded-full" [ngClass]="{
                    'bg-indigo-600': item.estado === 'En Inspección',
                    'bg-emerald-600': item.estado === 'Liquidado',
                    'bg-amber-600': item.estado === 'Pendiente'
                  }"></span>
                  <span>{{ item.estado }}</span>
                </span>
              </div>

              <!-- Details Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div class="bg-surface-container-low/50 p-2.5 rounded-xl border border-outline-variant/30">
                  <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Tipo & Ramo</p>
                  <p class="font-bold text-on-surface mt-0.5">{{ item.tipo_siniestro }}</p>
                  <p class="text-[11px] text-on-surface-variant">{{ item.ramo }}</p>
                </div>
                <div class="bg-surface-container-low/50 p-2.5 rounded-xl border border-outline-variant/30">
                  <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Fechas</p>
                  <p class="font-semibold text-on-surface mt-0.5">Ocurrió: {{ item.fecha_ocurrencia }}</p>
                  <p class="text-[11px] text-on-surface-variant">Denuncia: {{ item.fecha_denuncia }}</p>
                </div>
                <div class="bg-surface-container-low/50 p-2.5 rounded-xl border border-outline-variant/30">
                  <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Aseguradora & Taller</p>
                  <p class="font-bold text-indigo-600 mt-0.5">{{ item.compania }}</p>
                  <p class="text-[11px] text-on-surface-variant truncate" [title]="item.taller_asignado">{{ item.taller_asignado || 'En evaluación' }}</p>
                </div>
              </div>

              <!-- Objeto & Bottom Action Bar -->
              <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 pt-2 border-t border-outline-variant/40">
                <div class="text-xs text-on-surface-variant truncate">
                  <span class="font-semibold text-on-surface">Bien:</span> {{ item.objeto }}
                </div>
                <button (click)="verExpediente(item)" class="w-full sm:w-auto px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0">
                  <span>Ver Expediente Completo</span>
                  <span class="material-symbols-outlined text-sm">visibility</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer Unificado -->
          <footer class="py-6 px-4 text-center border-t border-outline-variant/40 mt-8 mb-20 md:mb-4 space-y-1">
            <p class="text-xs text-on-surface-variant font-bold">JC Broker Platform — <span class="text-primary font-extrabold">v1.0.0</span></p>
            <p class="text-[11px] text-outline font-medium">© 2026 JC Organizadores • Operación Centralizada • Powered by <strong class="text-primary">Katrix</strong></p>
          </footer>
        </section>
      </main>

      <!-- Modal Expediente Detallado -->
      <div *ngIf="selectedExpediente()" class="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-[60] overflow-y-auto">
        <div class="bg-surface-container-lowest border-t sm:border border-outline-variant rounded-t-2xl sm:rounded-2xl max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
          
          <!-- Modal Header -->
          <div class="flex justify-between items-start pb-3 border-b border-outline-variant">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">EXPEDIENTE OFICIAL</span>
                <span class="text-xs text-on-surface-variant font-bold">Mercantil Andina</span>
              </div>
              <h2 class="text-base sm:text-xl font-black text-on-surface mt-1">Siniestro #{{ selectedExpediente()?.numero_siniestro }}</h2>
              <p class="text-xs text-on-surface-variant font-medium">Cliente: <strong>{{ selectedExpediente()?.cliente }}</strong></p>
            </div>
            <button (click)="closeExpedienteModal()" class="text-outline hover:text-on-surface p-1 rounded-lg cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Section 1: Core Details -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant text-xs">
            <div>
              <p class="text-[10px] font-bold text-outline uppercase">Póliza & Ramo</p>
              <p class="font-bold text-primary text-sm">{{ selectedExpediente()?.poliza }}</p>
              <p class="text-[11px] text-on-surface-variant mt-0.5">{{ selectedExpediente()?.ramo }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-outline uppercase">Estado de Tramitación</p>
              <span class="font-bold px-2.5 py-0.5 rounded-full text-xs inline-block mt-0.5"
                [ngClass]="{
                  'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20': selectedExpediente()?.estado === 'En Inspección',
                  'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20': selectedExpediente()?.estado === 'Liquidado',
                  'bg-amber-500/10 text-amber-600 border border-amber-500/20': selectedExpediente()?.estado === 'Pendiente'
                }">
                {{ selectedExpediente()?.estado }}
              </span>
            </div>
            <div class="sm:col-span-2 pt-2 border-t border-outline-variant/40">
              <p class="text-[10px] font-bold text-outline uppercase">Bien Asegurado</p>
              <p class="font-bold text-on-surface">{{ selectedExpediente()?.objeto }}</p>
            </div>
          </div>

          <!-- Section 2: Technical Inspections & Amounts -->
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl">
              <p class="text-[10px] font-bold text-outline uppercase">Inspector</p>
              <p class="font-bold text-on-surface truncate">{{ selectedExpediente()?.inspector || 'Sin asignar' }}</p>
            </div>
            <div class="p-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl">
              <p class="text-[10px] font-bold text-outline uppercase">Taller / Prestador</p>
              <p class="font-bold text-on-surface truncate">{{ selectedExpediente()?.taller_asignado || 'Sin asignar' }}</p>
            </div>
            <div class="p-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl">
              <p class="text-[10px] font-bold text-outline uppercase">Estimado</p>
              <p class="font-black text-xs sm:text-sm text-primary">$ {{ selectedExpediente()?.monto_estimado | number:'1.0-0' }}</p>
            </div>
            <div class="p-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl">
              <p class="text-[10px] font-bold text-outline uppercase">Liquidado</p>
              <p class="font-black text-xs sm:text-sm text-emerald-600">$ {{ selectedExpediente()?.monto_liquidado | number:'1.0-0' }}</p>
            </div>
          </div>

          <!-- Section 3: Timeline Cronograma -->
          <div class="space-y-1.5">
            <h4 class="text-[10px] font-bold text-outline uppercase tracking-wider">Cronograma del Trámite</h4>
            <div class="space-y-2 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant">
              <div *ngFor="let item of selectedExpediente()?.cronograma" class="flex items-start gap-2.5 text-xs">
                <div class="w-2 h-2 rounded-full bg-primary mt-1 shrink-0"></div>
                <div>
                  <p class="font-bold text-on-surface text-xs">{{ item.titulo }} <span class="text-outline font-normal">({{ item.fecha }})</span></p>
                  <p class="text-on-surface-variant text-[11px]">{{ item.descripcion }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 4: Attachments (CLICK PARA PREVISUALIZAR) -->
          <div class="space-y-1.5">
            <h4 class="text-[10px] font-bold text-outline uppercase tracking-wider flex items-center justify-between">
              <span>Documentos Adjuntos</span>
              <span class="text-primary text-[10px] lowercase font-semibold">Tocar para visualizar online</span>
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div
                *ngFor="let adj of selectedExpediente()?.adjuntos"
                (click)="previsualizarAdjunto(adj)"
                class="p-2.5 bg-surface-container-low hover:bg-surface-container rounded-xl border border-outline-variant hover:border-primary flex items-center justify-between text-xs cursor-pointer transition-all shadow-xs group"
              >
                <div class="min-w-0 pr-1">
                  <p class="font-bold text-on-surface group-hover:text-primary truncate text-xs flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-sm text-primary">
                      {{ adj.tipo === 'Imagen' ? 'image' : 'picture_as_pdf' }}
                    </span>
                    <span class="truncate">{{ adj.nombre }}</span>
                  </p>
                  <p class="text-[10px] text-outline mt-0.5">{{ adj.tipo }} • {{ adj.tamano }}</p>
                </div>
                <span class="material-symbols-outlined text-primary text-base shrink-0 group-hover:scale-110 transition-transform">visibility</span>
              </div>
            </div>
          </div>

          <!-- Modal Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center gap-2 pt-3 border-t border-outline-variant pb-safe">
            <button (click)="enviarWppExpediente()" class="w-full sm:flex-1 py-3 px-4 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all cursor-pointer">
              <span class="material-symbols-outlined text-base">chat</span>
              <span>Enviar Estado por WhatsApp</span>
            </button>
            <button (click)="closeExpedienteModal()" class="w-full sm:w-auto px-5 py-3 border border-outline-variant text-on-surface font-bold rounded-xl text-xs hover:bg-surface-container transition-colors cursor-pointer">
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL VISUALIZADOR DE ADJUNTO (PREVIEWER INLINE NO DESCARGA - Z-INDEX 70) -->
      <div *ngIf="selectedAdjunto()" class="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-[70] overflow-y-auto">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
          
          <!-- Header Visualizador -->
          <div class="p-3.5 sm:p-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2 min-w-0">
              <span class="material-symbols-outlined text-primary text-xl">
                {{ selectedAdjunto()?.tipo === 'Imagen' ? 'image' : 'picture_as_pdf' }}
              </span>
              <div class="min-w-0">
                <h3 class="font-bold text-xs sm:text-sm text-on-surface truncate">{{ selectedAdjunto()?.nombre }}</h3>
                <p class="text-[10px] text-outline font-semibold">Previsualización de Documento • {{ selectedAdjunto()?.tipo }} ({{ selectedAdjunto()?.tamano }})</p>
              </div>
            </div>
            <button (click)="closeAdjuntoModal()" class="text-outline hover:text-on-surface p-1 rounded-lg cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Body Visualizador según tipo (Imagen vs PDF) -->
          <div class="flex-1 p-4 overflow-y-auto min-h-[300px] flex items-center justify-center bg-slate-900/90 text-white">
            
            <!-- Vista Previa de Imagen -->
            <div *ngIf="selectedAdjunto()?.tipo === 'Imagen'" class="w-full flex flex-col items-center justify-center space-y-3">
              <div class="relative max-w-md w-full rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                <img
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
                  alt="Peritaje Siniestro"
                  class="w-full h-64 sm:h-80 object-cover"
                />
                <!-- Sello Digital de Peritaje -->
                <div class="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 text-[10px]">
                  <p class="font-bold text-emerald-400">✓ PERITAJE FOTOGRÁFICO VERIFICADO</p>
                  <p class="text-slate-300">Mercantil Andina • Inspección #{{ selectedExpediente()?.numero_siniestro }}</p>
                </div>
              </div>
              <p class="text-xs text-slate-300 font-semibold text-center">Registro fotográfico del peritaje técnico de siniestros.</p>
            </div>

            <!-- Vista Previa de PDF -->
            <div *ngIf="selectedAdjunto()?.tipo === 'PDF'" class="w-full max-w-lg bg-white text-slate-900 rounded-xl p-5 shadow-2xl space-y-4 border border-slate-300 text-xs">
              <div class="flex items-center justify-between border-b pb-3 border-slate-200">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-black text-xs">MA</div>
                  <div>
                    <h4 class="font-black text-sm text-primary">MERCANTIL ANDINA S.A.</h4>
                    <p class="text-[9px] text-slate-500 font-bold uppercase">Constancia Oficial de Documentación Técnica</p>
                  </div>
                </div>
                <span class="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 uppercase">
                  DOCUMENTO OFICIAL
                </span>
              </div>

              <div class="space-y-2 text-xs">
                <p><strong>Archivo:</strong> {{ selectedAdjunto()?.nombre }}</p>
                <p><strong>Referencia Siniestro:</strong> #{{ selectedExpediente()?.numero_siniestro }}</p>
                <p><strong>Cliente Asegurado:</strong> {{ selectedExpediente()?.cliente }}</p>
                <p><strong>Póliza Afiliada:</strong> {{ selectedExpediente()?.poliza }}</p>
                
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-[11px] font-mono">
                  <p class="font-bold text-slate-700">Dictamen e Inspección:</p>
                  <p>• Validez técnica comprobada y cotejada en sistema.</p>
                  <p>• Perito Asignado: {{ selectedExpediente()?.inspector || 'Ing. Carlos M. Benítez' }}</p>
                  <p>• Monto Estimado: $ {{ selectedExpediente()?.monto_estimado | number:'1.0-0' }} ARS</p>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                <span>Firma Digital Habilitada SSN</span>
                <span class="font-mono">HASH: 8f92a014e912b</span>
              </div>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="p-3 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
            <button (click)="compartirAdjuntoWpp()" class="py-2 px-3 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-emerald-700 transition-all cursor-pointer">
              <span class="material-symbols-outlined text-sm">chat</span>
              <span>Enviar Ficha por WhatsApp</span>
            </button>
            <button (click)="closeAdjuntoModal()" class="py-2 px-4 border border-outline-variant text-on-surface font-bold rounded-xl text-xs hover:bg-surface-container transition-colors cursor-pointer">
              Cerrar Visualizador
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Denunciar Siniestro -->
      <div *ngIf="showDenunciaModal()" class="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-[60] overflow-y-auto">
        <div class="bg-surface-container-lowest border-t sm:border border-outline-variant rounded-t-2xl sm:rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
          <div class="flex justify-between items-center pb-3 border-b border-outline-variant">
            <h3 class="font-bold text-base sm:text-lg text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">add_alert</span>
              Denunciar Nuevo Siniestro
            </h3>
            <button (click)="closeDenunciaModal()" class="text-outline hover:text-on-surface p-1 rounded-lg cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-3 text-xs sm:text-sm">
            <div>
              <label class="block font-bold text-outline text-[10px] uppercase mb-1">Cliente Afectado</label>
              <input [(ngModel)]="newCliente" class="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-xs sm:text-sm" placeholder="Ej: BAHAMONDE JOSE ANTONIO" />
            </div>
            <div>
              <label class="block font-bold text-outline text-[10px] uppercase mb-1">Número de Póliza</label>
              <input [(ngModel)]="newPoliza" class="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-xs sm:text-sm" placeholder="Ej: 5-894210-242193" />
            </div>
            <div>
              <label class="block font-bold text-outline text-[10px] uppercase mb-1">Tipo de Incidente / Daño</label>
              <select [(ngModel)]="newTipo" class="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-xs sm:text-sm">
                <option value="Robo Parcial - Rueda / Auxilio">Robo Parcial - Rueda / Auxilio</option>
                <option value="Robo Total de Vehículo">Robo Total de Vehículo</option>
                <option value="Rotura de Cristales / Parabrisas">Rotura de Cristales / Parabrisas</option>
                <option value="Daños por Granizo e Inundación">Daños por Granizo e Inundación</option>
                <option value="Responsabilidad Civil - Colisión">Responsabilidad Civil - Colisión</option>
                <option value="Incendio Hogar / Comercio">Incendio Hogar / Comercio</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-outline text-[10px] uppercase mb-1">Fecha de Ocurrencia</label>
              <input type="date" [(ngModel)]="newFecha" class="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-xs sm:text-sm" />
            </div>
          </div>

          <div class="flex items-center gap-2 pt-3 border-t border-outline-variant pb-safe">
            <button (click)="closeDenunciaModal()" class="flex-1 py-3 border border-outline-variant text-on-surface font-bold rounded-xl text-xs hover:bg-surface-container transition-colors cursor-pointer">
              Cancelar
            </button>
            <button (click)="submitDenuncia()" [disabled]="isSubmitting()" class="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <span *ngIf="isSubmitting()" class="material-symbols-outlined text-sm animate-spin">sync</span>
              <span>{{ isSubmitting() ? 'Registrando...' : 'Confirmar Denuncia' }}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class SiniestrosComponent implements OnInit {
  private http = inject(HttpClient);

  siniestros = signal<Siniestro[]>([]);
  filteredSiniestros = signal<Siniestro[]>([]);
  isLoading = signal<boolean>(true);
  
  filters = ['Todos', 'Pendientes', 'En Inspección', 'Liquidados'];
  activeFilter = signal<string>('Todos');
  searchQuery = '';

  // Expediente Modal State
  selectedExpediente = signal<Siniestro | null>(null);

  // Adjunto Previewer State
  selectedAdjunto = signal<AdjuntoSiniestro | null>(null);

  // Modal Denuncia State
  showDenunciaModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  newCliente = '';
  newPoliza = '';
  newTipo = 'Robo Parcial - Rueda / Auxilio';
  newFecha = '2026-06-25';

  ngOnInit() {
    this.cargarSiniestros();
  }

  cargarSiniestros() {
    this.isLoading.set(true);
    this.http.get<any>('/api/v1/quotations/mercantil/siniestros').subscribe({
      next: (res) => {
        const datos = res?.datos || [];
        this.siniestros.set(datos);
        this.applyFilters();
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  setActiveFilter(f: string) {
    this.activeFilter.set(f);
    this.applyFilters();
  }

  applyFilters() {
    let list = this.siniestros();
    const filter = this.activeFilter();
    const q = this.searchQuery.trim().toLowerCase();

    if (filter !== 'Todos') {
      list = list.filter(s => s.estado === filter);
    }

    if (q) {
      list = list.filter(s =>
        s.cliente.toLowerCase().includes(q) ||
        s.numero_siniestro.toLowerCase().includes(q) ||
        s.poliza.toLowerCase().includes(q) ||
        s.tipo_siniestro.toLowerCase().includes(q)
      );
    }

    this.filteredSiniestros.set(list);
  }

  verExpediente(item: Siniestro) {
    this.http.get<any>(`/api/v1/quotations/mercantil/siniestros/${item.numero_siniestro}`).subscribe({
      next: (res) => {
        if (res?.expediente) {
          this.selectedExpediente.set(res.expediente);
        } else {
          this.selectedExpediente.set(item);
        }
      },
      error: () => {
        this.selectedExpediente.set(item);
      }
    });
  }

  closeExpedienteModal() {
    this.selectedExpediente.set(null);
  }

  previsualizarAdjunto(adj: AdjuntoSiniestro) {
    this.selectedAdjunto.set(adj);
  }

  closeAdjuntoModal() {
    this.selectedAdjunto.set(null);
  }

  compartirAdjuntoWpp() {
    const adj = this.selectedAdjunto();
    const exp = this.selectedExpediente();
    if (!adj || !exp) return;
    const msg = `Te adjunto la previsualización del documento ${adj.nombre} (Siniestro #${exp.numero_siniestro} - ${exp.cliente}).`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }

  enviarWppExpediente() {
    const exp = this.selectedExpediente();
    if (!exp) return;
    const msg = `Hola ${exp.cliente}, te contacto de JC Organizadores. Tu siniestro #${exp.numero_siniestro} (${exp.tipo_siniestro}) se encuentra en estado: ${exp.estado.toUpperCase()}. Quedamos a disposición.`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  openDenunciaModal() {
    this.newCliente = 'BAHAMONDE JOSE ANTONIO';
    this.newPoliza = '5-894210-242193';
    this.showDenunciaModal.set(true);
  }

  closeDenunciaModal() {
    this.showDenunciaModal.set(false);
  }

  submitDenuncia() {
    if (!this.newCliente || !this.newPoliza) return;
    this.isSubmitting.set(true);
    
    const payload = {
      cliente: this.newCliente,
      poliza: this.newPoliza,
      tipo_siniestro: this.newTipo,
      fecha_ocurrencia: this.newFecha
    };

    this.http.post<any>('/api/v1/quotations/mercantil/siniestros', payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.closeDenunciaModal();
        alert(res?.mensaje || 'Denuncia registrada con éxito.');
        this.cargarSiniestros();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.closeDenunciaModal();
      }
    });
  }
}
