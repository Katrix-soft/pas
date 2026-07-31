import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
}

@Component({
  selector: 'lib-siniestros',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  template: `
    <div class="bg-surface text-on-surface font-body-md min-h-screen pb-24 overflow-x-hidden">
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-4 sm:space-y-6">
        
        <!-- Header Section -->
        <section class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant shadow-sm">
          <div>
            <h1 class="text-xl sm:text-2xl font-extrabold text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-2xl">report_problem</span>
              Gestión & Seguimiento de Siniestros
            </h1>
            <p class="text-xs sm:text-sm text-on-surface-variant mt-0.5">Control en tiempo real de denuncias, inspecciones y liquidaciones de cartera.</p>
          </div>
          <button (click)="openDenunciaModal()" class="w-full sm:w-auto bg-primary text-on-primary px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-base">add_alert</span>
            <span>Denunciar Siniestro</span>
          </button>
        </section>

        <!-- Search Bar & Stats Cards -->
        <section class="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          <!-- Search Input -->
          <div class="md:col-span-4 relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <span class="material-symbols-outlined text-outline text-lg">search</span>
            </div>
            <input
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange()"
              class="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm text-on-surface placeholder-on-surface-variant transition-all shadow-xs"
              placeholder="Buscar por número de siniestro, cliente, póliza o tipo de incidente..."
              type="text"
            />
          </div>
        </section>

        <!-- Filter Chips -->
        <section class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            *ngFor="let f of filters"
            (click)="setActiveFilter(f)"
            [class]="activeFilter() === f ? 'bg-primary text-white border-primary shadow-xs font-bold' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary font-medium'"
            class="whitespace-nowrap px-4 py-1.5 rounded-full border text-xs transition-colors cursor-pointer shrink-0"
          >
            {{ f }}
          </button>
        </section>

        <!-- Loading Spinner -->
        <div *ngIf="isLoading()" class="flex flex-col items-center justify-center py-12 space-y-3">
          <span class="material-symbols-outlined text-primary text-4xl animate-spin">sync</span>
          <p class="text-xs sm:text-sm font-bold text-outline">Cargando siniestros registrados en la API...</p>
        </div>

        <!-- Siniestros Listing -->
        <section *ngIf="!isLoading()" class="space-y-3 sm:space-y-4">
          
          <!-- Empty State -->
          <div *ngIf="filteredSiniestros().length === 0" class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 text-center space-y-3 shadow-xs">
            <span class="material-symbols-outlined text-outline text-4xl">folder_off</span>
            <p class="text-sm font-bold text-on-surface">No se encontraron siniestros para el criterio seleccionado.</p>
            <p class="text-xs text-on-surface-variant">Prueba borrar el buscador o seleccionar la pestaña "Todos".</p>
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
            <div class="p-4 sm:p-5 flex flex-col space-y-3">
              <!-- Top Row: Client & Status Badge -->
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-outline-variant/40">
                <div>
                  <h3 class="text-base sm:text-lg font-bold text-on-surface">{{ item.cliente }}</h3>
                  <div class="flex items-center gap-2 text-xs text-on-surface-variant font-medium mt-0.5">
                    <span class="font-bold text-primary">Siniestro #{{ item.numero_siniestro }}</span>
                    <span>•</span>
                    <span>Póliza: <strong>{{ item.poliza }}</strong></span>
                  </div>
                </div>

                <span
                  class="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 border"
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
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                <div>
                  <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Tipo de Incidente / Ramo</p>
                  <p class="font-bold text-on-surface mt-0.5">{{ item.tipo_siniestro }}</p>
                  <p class="text-xs text-on-surface-variant">{{ item.ramo }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Fechas de Ocurrencia / Denuncia</p>
                  <p class="font-semibold text-on-surface mt-0.5">Ocurrió: {{ item.fecha_ocurrencia }}</p>
                  <p class="text-xs text-on-surface-variant">Denunciado: {{ item.fecha_denuncia }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Compañía & Asignación</p>
                  <p class="font-bold text-indigo-600 mt-0.5">{{ item.compania }}</p>
                  <p class="text-xs text-on-surface-variant truncate" [title]="item.taller_asignado">{{ item.taller_asignado || 'En evaluación' }}</p>
                </div>
              </div>

              <!-- Objeto & Bottom Action Bar -->
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-outline-variant/40">
                <div class="text-xs text-on-surface-variant">
                  <span class="font-semibold text-on-surface">Bien Asegurado:</span> {{ item.objeto }}
                </div>
                <div class="flex items-center gap-2 w-full sm:w-auto">
                  <button (click)="verDetalle(item)" class="w-full sm:w-auto px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
                    <span>Ver Expediente</span>
                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- FAB Floating Button for Mobile -->
      <button (click)="openDenunciaModal()" class="fixed right-4 bottom-20 sm:bottom-8 w-13 h-13 bg-primary text-on-primary rounded-2xl shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 cursor-pointer">
        <span class="material-symbols-outlined text-2xl">add</span>
      </button>

      <!-- Modal Denunciar Siniestro -->
      <div *ngIf="showDenunciaModal()" class="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-xl">
          <div class="flex justify-between items-center pb-3 border-b border-outline-variant">
            <h3 class="font-bold text-lg text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">add_alert</span>
              Denunciar Nuevo Siniestro
            </h3>
            <button (click)="closeDenunciaModal()" class="text-outline hover:text-on-surface p-1 rounded-lg cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-3 text-xs sm:text-sm">
            <div>
              <label class="block font-bold text-outline text-[11px] uppercase mb-1">Cliente Afectado</label>
              <input [(ngModel)]="newCliente" class="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-sm" placeholder="Ej: BAHAMONDE JOSE ANTONIO" />
            </div>
            <div>
              <label class="block font-bold text-outline text-[11px] uppercase mb-1">Número de Póliza</label>
              <input [(ngModel)]="newPoliza" class="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-sm" placeholder="Ej: 5-894210-242193" />
            </div>
            <div>
              <label class="block font-bold text-outline text-[11px] uppercase mb-1">Tipo de Incidente / Daño</label>
              <select [(ngModel)]="newTipo" class="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-sm">
                <option value="Robo Parcial - Rueda / Auxilio">Robo Parcial - Rueda / Auxilio</option>
                <option value="Robo Total de Vehículo">Robo Total de Vehículo</option>
                <option value="Rotura de Cristales / Parabrisas">Rotura de Cristales / Parabrisas</option>
                <option value="Daños por Granizo e Inundación">Daños por Granizo e Inundación</option>
                <option value="Responsabilidad Civil - Colisión">Responsabilidad Civil - Colisión</option>
                <option value="Incendio Hogar / Comercio">Incendio Hogar / Comercio</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-outline text-[11px] uppercase mb-1">Fecha de Ocurrencia</label>
              <input type="date" [(ngModel)]="newFecha" class="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-sm" />
            </div>
          </div>

          <div class="flex items-center gap-2 pt-3 border-t border-outline-variant">
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

  // Modal State
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

  verDetalle(item: Siniestro) {
    alert(`Consulta de expediente #${item.numero_siniestro} (${item.cliente}): estado ${item.estado}.`);
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
