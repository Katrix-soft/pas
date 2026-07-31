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
  adjuntos?: any[];
  cronograma?: any[];
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

        <!-- Search Bar -->
        <section class="relative">
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
                  <button (click)="verExpediente(item)" class="w-full sm:w-auto px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
                    <span>Ver Expediente Completo</span>
                    <span class="material-symbols-outlined text-sm">visibility</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Modal Expediente Detallado -->
      <div *ngIf="selectedExpediente()" class="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
          
          <!-- Modal Header -->
          <div class="flex justify-between items-start pb-3 border-b border-outline-variant">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-black bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">EXPEDIENTE OFICIAL</span>
                <span class="text-xs text-on-surface-variant font-bold">Mercantil Andina</span>
              </div>
              <h2 class="text-lg sm:text-xl font-black text-on-surface mt-1">Siniestro #{{ selectedExpediente()?.numero_siniestro }}</h2>
              <p class="text-xs text-on-surface-variant font-medium">Cliente: <strong>{{ selectedExpediente()?.cliente }}</strong> (DNI/ID #{{ selectedExpediente()?.cliente_id }})</p>
            </div>
            <button (click)="closeExpedienteModal()" class="text-outline hover:text-on-surface p-1 rounded-lg cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Section 1: Core Details -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant text-xs sm:text-sm">
            <div>
              <p class="text-[10px] font-bold text-outline uppercase">Póliza Afiliada</p>
              <p class="font-bold text-primary text-sm">{{ selectedExpediente()?.poliza }}</p>
              <p class="text-xs text-on-surface-variant mt-0.5">{{ selectedExpediente()?.ramo }}</p>
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
              <p class="text-[10px] font-bold text-outline uppercase">Bien Afiliado & Dominio</p>
              <p class="font-bold text-on-surface">{{ selectedExpediente()?.objeto }}</p>
            </div>
          </div>

          <!-- Section 2: Technical Inspections & Amounts -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div class="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl space-y-1">
              <p class="text-[10px] font-bold text-outline uppercase">Perito / Inspector Asignado</p>
              <p class="font-bold text-on-surface">{{ selectedExpediente()?.inspector || 'Sin asignar' }}</p>
            </div>
            <div class="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl space-y-1">
              <p class="text-[10px] font-bold text-outline uppercase">Taller Oficial / Prestador</p>
              <p class="font-bold text-on-surface truncate">{{ selectedExpediente()?.taller_asignado || 'Sin asignar' }}</p>
            </div>
            <div class="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl space-y-1">
              <p class="text-[10px] font-bold text-outline uppercase">Monto Estimado</p>
              <p class="font-black text-sm text-primary">$ {{ selectedExpediente()?.monto_estimado | number:'1.0-0' }} ARS</p>
            </div>
            <div class="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl space-y-1">
              <p class="text-[10px] font-bold text-outline uppercase">Monto Liquidado</p>
              <p class="font-black text-sm text-emerald-600">$ {{ selectedExpediente()?.monto_liquidado | number:'1.0-0' }} ARS</p>
            </div>
          </div>

          <!-- Section 3: Timeline Cronograma -->
          <div class="space-y-2">
            <h4 class="text-xs font-bold text-outline uppercase tracking-wider">Cronograma de Trámite</h4>
            <div class="space-y-2 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant">
              <div *ngFor="let item of selectedExpediente()?.cronograma" class="flex items-start gap-3 text-xs">
                <div class="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                <div>
                  <p class="font-bold text-on-surface">{{ item.titulo }} <span class="text-outline font-normal">({{ item.fecha }})</span></p>
                  <p class="text-on-surface-variant text-[11px]">{{ item.descripcion }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 4: Attachments -->
          <div class="space-y-2">
            <h4 class="text-xs font-bold text-outline uppercase tracking-wider">Documentos y Fotos Adjuntas</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div *ngFor="let adj of selectedExpediente()?.adjuntos" class="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-between text-xs">
                <div class="min-w-0 pr-1">
                  <p class="font-bold text-on-surface truncate">{{ adj.nombre }}</p>
                  <p class="text-[10px] text-outline">{{ adj.tipo }} • {{ adj.tamano }}</p>
                </div>
                <span class="material-symbols-outlined text-primary text-base shrink-0">download</span>
              </div>
            </div>
          </div>

          <!-- Modal Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center gap-2 pt-3 border-t border-outline-variant">
            <button (click)="enviarWppExpediente()" class="w-full sm:w-auto flex-1 py-2.5 px-4 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all cursor-pointer">
              <span class="material-symbols-outlined text-base">chat</span>
              <span>Enviar Estado por WhatsApp</span>
            </button>
            <button (click)="closeExpedienteModal()" class="w-full sm:w-auto px-5 py-2.5 border border-outline-variant text-on-surface font-bold rounded-xl text-xs hover:bg-surface-container transition-colors cursor-pointer">
              Cerrar
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
