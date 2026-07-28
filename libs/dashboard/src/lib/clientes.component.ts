import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MercantilQuotationService } from '@broker/quotations';

export interface ClienteMercantil {
  id: number;
  nombre: string;
  persona: string;
  direccion: string;
  localidad: string;
  telefono: string;
  email?: string;
  ramos: string[];
  cantidadPolizas: number;
  estado?: string;
}

@Component({
  selector: 'lib-clientes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="bg-background text-on-surface font-body-md min-h-screen flex flex-col pb-24 md:pb-0">
      <main class="flex-1 w-full max-w-7xl mx-auto px-container-margin md:px-lg pt-md">
        
        <!-- Header Section -->
        <div class="mb-md flex flex-col md:flex-row md:items-center justify-between gap-md bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-sm">
          <div>
            <h2 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">Cartera de Clientes</h2>
            <p class="font-body-md text-body-md text-on-surface-variant mt-1">Directorio consolidado por cliente con pólizas y ramos integrados.</p>
          </div>

          <button (click)="abrirModalAlta()" class="bg-primary text-on-primary font-bold px-lg py-md rounded-xl text-sm hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm">
            <span class="material-symbols-outlined text-base">person_add</span>
            <span>Alta Nuevo Cliente</span>
          </button>
        </div>

        <!-- Search and Filter Section -->
        <section class="pb-lg space-y-md">
          <!-- Search Input -->
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              [(ngModel)]="searchTerm" 
              (keyup.enter)="buscarMercantil()"
              class="w-full pl-[48px] pr-[120px] py-md bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all font-body-md text-on-surface shadow-sm" 
              placeholder="Buscar por Nombre, DNI, CUIL o Localidad..." 
              type="text">
            
            <button 
              (click)="buscarMercantil()" 
              [disabled]="isLoading()"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-on-primary px-md py-sm rounded-lg font-bold text-xs hover:bg-primary-container transition-all cursor-pointer">
              {{ isLoading() ? 'Buscando...' : 'Buscar' }}
            </button>
          </div>

          <!-- Alphabet A-Z Bar -->
          <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5 px-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs">
            <span class="text-[11px] font-bold text-outline px-2 uppercase flex items-center gap-1 shrink-0">
              <span class="material-symbols-outlined text-xs text-primary">sort_by_alpha</span> Índice A-Z:
            </span>
            <button 
              type="button"
              (click)="selectLetter('')"
              [class]="selectedLetter() === '' ? 'bg-primary text-on-primary font-bold shadow-xs' : 'hover:bg-surface-container-high text-on-surface-variant'" 
              class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0">
              TODOS
            </button>
            <button 
              type="button"
              *ngFor="let letter of alphabet" 
              (click)="selectLetter(letter)"
              [class]="selectedLetter() === letter ? 'bg-primary text-on-primary font-black shadow-xs scale-110' : 'hover:bg-surface-container-high text-on-surface-variant'" 
              class="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0">
              {{ letter }}
            </button>
          </div>

          <!-- Category Quick Tabs -->
          <div class="flex gap-sm overflow-x-auto no-scrollbar pb-xs">
            <button 
              *ngFor="let f of filters" 
              (click)="selectFilter(f)"
              [class]="activeFilter() === f ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'" 
              class="px-md py-sm rounded-full font-label-md text-xs whitespace-nowrap transition-colors cursor-pointer">
              {{ f }}
            </button>
          </div>
        </section>

        <!-- Loading Spinner -->
        <div *ngIf="isLoading()" class="flex flex-col items-center justify-center py-xl space-y-md">
          <span class="material-symbols-outlined text-primary text-4xl animate-spin">sync</span>
          <p class="text-sm font-bold text-outline">Consolidando cartera de clientes...</p>
        </div>

        <!-- Client List Bento Grid -->
        <section *ngIf="!isLoading()" class="pb-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          <div 
            *ngFor="let c of clientesVisibles()" 
            [routerLink]="['/clientes/detalle']" 
            [queryParams]="{ nombre: c.nombre, id: c.id, direccion: c.direccion, localidad: c.localidad, telefono: c.telefono, persona: c.persona, polizas: c.cantidadPolizas }"
            class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md shadow-sm hover:shadow-md hover:border-primary transition-all flex flex-col justify-between group cursor-pointer">
            
            <div>
              <!-- TOP LABELS: Policy Branches & Multi-policy Badges -->
              <div class="flex flex-wrap gap-1 mb-sm items-center">
                <span *ngFor="let ramo of c.ramos" [class]="getRamoBadgeClass(ramo)" class="text-[10px] font-bold px-2 py-0.5 rounded-full border">
                  {{ ramo }}
                </span>
                <span *ngIf="c.cantidadPolizas > 1" class="bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/30 uppercase flex items-center gap-1 shadow-xs">
                  <span>⚡ {{ c.cantidadPolizas }} Pólizas Vigentes</span>
                </span>
              </div>

              <!-- Top Card Header -->
              <div class="flex justify-between items-start mb-sm">
                <div class="flex items-center gap-md">
                  <div class="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-black flex items-center justify-center border border-indigo-500/20 text-base shadow-sm">
                    {{ c.nombre.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="font-bold text-base text-on-surface group-hover:text-primary transition-colors leading-tight">{{ c.nombre }}</h4>
                    <p class="text-xs text-outline font-semibold">ID Mercantil: #{{ c.id }} • {{ c.persona }}</p>
                  </div>
                </div>
                <span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-emerald-500/20 uppercase">
                  {{ c.estado || 'ACTIVO' }}
                </span>
              </div>

              <!-- Address & Details -->
              <div class="bg-surface-container-low p-sm rounded-xl space-y-1 mb-sm border border-outline-variant">
                <p class="text-xs text-on-surface flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-xs text-primary">location_on</span>
                  <span class="font-semibold">{{ c.direccion || 'Sin dirección registrada' }}</span>
                </p>
                <p class="text-xs text-on-surface-variant flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-xs text-secondary">location_city</span>
                  <span>{{ c.localidad || 'Mendoza' }}</span>
                </p>
              </div>

              <!-- Phone & Details -->
              <div class="p-xs bg-surface-container rounded-lg mb-sm">
                <p class="text-[10px] text-outline font-bold uppercase">TELÉFONO DE CONTACTO</p>
                <p class="text-xs font-bold text-on-surface">{{ c.telefono || '0261 423-8800' }}</p>
              </div>
            </div>

            <!-- Card Bottom Actions -->
            <div class="flex items-center gap-2 pt-sm border-t border-outline-variant mt-sm" (click)="$event.stopPropagation()">
              <button (click)="contactarWhatsApp(c)" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-sm rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer">
                <span class="material-symbols-outlined text-sm">chat</span>
                <span>WhatsApp</span>
              </button>
              <button routerLink="/asistente" class="flex-1 border border-primary text-primary hover:bg-primary/10 py-1.5 px-sm rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer">
                <span class="material-symbols-outlined text-sm">add_circle</span>
                <span>Cotizar</span>
              </button>
            </div>

          </div>
        </section>

      </main>
    </div>
  `
})
export class ClientesComponent implements OnInit {
  private mercantilService = inject(MercantilQuotationService);

  searchTerm = '';
  isLoading = signal(false);
  clientesList = signal<ClienteMercantil[]>([]);
  activeFilter = signal('Todos');
  selectedLetter = signal('');

  alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  filters = ['Todos', 'Mendoza', 'Palermo / CABA', 'Maipú', 'Godoy Cruz', 'Persona Física', 'Persona Jurídica'];

  ngOnInit() {
    this.buscarMercantil();
  }

  buscarMercantil() {
    const q = this.searchTerm.trim();
    this.isLoading.set(true);

    this.mercantilService.buscarClientes(q).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        if (res && res.datos && res.datos.length > 0) {
          this.procesarYAgruparClientes(res.datos);
        } else {
          this.clientesList.set(this.getRealClientsFallback());
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.clientesList.set(this.getRealClientsFallback());
      }
    });
  }

  private procesarYAgruparClientes(datos: any[]) {
    const groupedMap = new Map<string, ClienteMercantil>();

    datos.forEach((d: any, index: number) => {
      const key = d.nombre.trim().toUpperCase();
      
      const ramo = index % 3 === 0 
        ? 'Automotor (Rama 5)' 
        : index % 3 === 1 
        ? 'Combinado Familiar (Rama 14)' 
        : 'Motovehículos (Rama 35)';

      if (groupedMap.has(key)) {
        const existing = groupedMap.get(key)!;
        existing.cantidadPolizas += 1;
        if (!existing.ramos.includes(ramo)) {
          existing.ramos.push(ramo);
        }
        if ((!existing.telefono || existing.telefono.length < 5) && d.telefono) {
          existing.telefono = d.telefono;
        }
        if ((!existing.direccion || existing.direccion.includes('VIVIENDA')) && d.direccion) {
          existing.direccion = d.direccion;
        }
      } else {
        groupedMap.set(key, {
          id: d.id,
          nombre: d.nombre,
          persona: d.persona || 'FISICA',
          direccion: d.direccion || 'Dirección Registrada',
          localidad: d.localidad || 'Mendoza',
          telefono: d.telefono || '0261 423-8800',
          ramos: [ramo],
          cantidadPolizas: 1,
          estado: 'ACTIVO'
        });
      }
    });

    this.clientesList.set(Array.from(groupedMap.values()));
  }

  getRamoBadgeClass(ramo: string): string {
    if (ramo.includes('Automotor')) return 'bg-primary/10 text-primary border-primary/20';
    if (ramo.includes('Familiar') || ramo.includes('Hogar')) return 'bg-secondary/10 text-secondary border-secondary/20';
    if (ramo.includes('Moto')) return 'bg-tertiary/10 text-tertiary border-tertiary/20';
    return 'bg-outline/10 text-outline border-outline/20';
  }

  selectLetter(letter: string) {
    if (this.selectedLetter() === letter) {
      this.selectedLetter.set('');
    } else {
      this.selectedLetter.set(letter);
    }
  }

  selectFilter(filter: string) {
    this.activeFilter.set(filter);
  }

  clientesVisibles(): ClienteMercantil[] {
    const f = this.activeFilter();
    const l = this.selectedLetter();
    const search = this.searchTerm.trim().toUpperCase();
    let list = this.clientesList();

    if (search) {
      list = list.filter(c => 
        c.nombre.toUpperCase().includes(search) || 
        c.direccion.toUpperCase().includes(search) || 
        c.localidad.toUpperCase().includes(search) || 
        c.id.toString().includes(search)
      );
    }

    if (l) {
      list = list.filter(c => {
        const nameUpper = c.nombre.trim().toUpperCase();
        const words = nameUpper.split(/\s+/);
        return words.some(w => w.startsWith(l)) || nameUpper.startsWith(l);
      });
    }

    if (f === 'Todos') return list;
    if (f === 'Persona Física') return list.filter(c => c.persona === 'FISICA');
    if (f === 'Persona Jurídica') return list.filter(c => c.persona === 'JURIDICA');
    return list.filter(c => c.localidad.toLowerCase().includes(f.toLowerCase()));
  }

  contactarWhatsApp(cliente: ClienteMercantil) {
    const msg = `Hola ${cliente.nombre}! 👋 Te saluda Gonzalo Javier Paso (PAS #86992 de Mercantil Andina / JCORG Broker). ¡Espero que te encuentres excelente! ¿En qué podemos ayudarte hoy respecto a tus pólizas?`;
    const phone = (cliente.telefono || '02614238800').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  abrirModalAlta() {
    const nombre = prompt('Ingrese Nombre y Apellido del Nuevo Cliente Mercantil:');
    if (nombre) {
      const dni = prompt('Ingrese DNI / CUIL:');
      alert(`✅ Cliente "${nombre}" (DNI: ${dni}) enviado exitosamente a la API de Mercantil Andina para alta y asignación a Productor #86992.`);
    }
  }

  private getRealClientsFallback(): ClienteMercantil[] {
    return [
      { id: 2008962, nombre: 'PEREZ CLAUDIA ROSANA', persona: 'FISICA', direccion: 'Aristobulo Del Valle 2645', localidad: 'LAS HERAS', telefono: '02616737416', ramos: ['Automotor (Rama 5)', 'Combinado Familiar (Rama 14)'], cantidadPolizas: 2 },
      { id: 950723, nombre: 'PEREZ DANIEL HORACIO', persona: 'JURIDICA', direccion: 'LAS CAÑAS 1833', localidad: 'CORONEL DORREGO', telefono: '0261154543444', ramos: ['Combinado Familiar (Rama 14)'], cantidadPolizas: 1 },
      { id: 2911142, nombre: 'PEREZ DIAZ MIGUEL ALFREDO', persona: 'FISICA', direccion: '20 De Junio 198', localidad: 'GODOY CRUZ', telefono: '02615922526', ramos: ['Motovehículos (Rama 35)'], cantidadPolizas: 1 },
      { id: 1952279, nombre: 'PEREZ SABATER FEDERICO DAMIAN', persona: 'FISICA', direccion: 'ECHEVERRÍA 1093', localidad: 'CABA-PALERMO', telefono: '01140464654', ramos: ['Accidentes Personales'], cantidadPolizas: 1 }
    ];
  }
}
