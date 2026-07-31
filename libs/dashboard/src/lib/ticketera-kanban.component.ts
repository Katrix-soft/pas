import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface KanbanTicket {
  id: string;
  title: string;
  client: string;
  producer: string;
  value: number;
  statusTag: { text: string; css: string; containerCss: string };
  producerAvatar: string;
  progress?: number;
  isStrikethrough?: boolean;
}

@Component({
  selector: 'lib-ticketera-kanban',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-background text-on-background font-body-md min-h-screen pb-24 overflow-x-hidden">
      
      <!-- Top Mobile Navigation Header -->
      <header class="w-full sticky top-0 z-40 bg-surface/95 dark:bg-on-background/95 backdrop-blur-md border-b border-outline-variant flex items-center justify-between h-14 px-4 sm:px-6">
        <div class="flex items-center gap-3">
          <button class="p-2 rounded-full hover:bg-surface-container-high transition-colors active:opacity-70 cursor-pointer">
            <span class="material-symbols-outlined text-primary text-xl">confirmation_number</span>
          </button>
          <div>
            <h1 class="font-bold text-base sm:text-lg text-primary tracking-tight leading-none">Seguimientos Admin</h1>
            <p class="text-[11px] text-on-surface-variant font-medium mt-0.5">Supervisión global de pipeline</p>
          </div>
        </div>
      </header>

      <!-- Main Content Canvas -->
      <main class="px-4 sm:px-6 py-4 space-y-6 max-w-7xl mx-auto">
        <!-- Header & Filters -->
        <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg sm:text-xl font-black text-on-background">Supervisión de Productores</h2>
            <p class="text-xs text-on-surface-variant font-medium">Filtra por productor y área global para revisar estados</p>
          </div>

          <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <div class="flex items-center bg-surface-container-lowest border border-outline-variant px-3 py-2 rounded-xl shrink-0">
              <span class="material-symbols-outlined text-primary text-sm mr-1.5">group</span>
              <select class="bg-transparent border-none focus:ring-0 text-xs font-bold py-0 pr-4">
                <option>Todos los Productores</option>
                <option>Juan Pérez</option>
                <option>María García</option>
                <option>Roberto Sánchez</option>
              </select>
            </div>
            
            <div class="flex items-center bg-surface-container-lowest border border-outline-variant px-3 py-2 rounded-xl shrink-0">
              <span class="material-symbols-outlined text-primary text-sm mr-1.5">public</span>
              <select class="bg-transparent border-none focus:ring-0 text-xs font-bold py-0 pr-4">
                <option>Áreas Globales</option>
                <option>Automotores</option>
                <option>Vida y Salud</option>
                <option>Riesgos Varios</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Summary Bar (Responsive Grid) -->
        <section class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div class="bg-surface-container-lowest border-l-4 border-primary p-3.5 sm:p-4 rounded-2xl shadow-xs border border-outline-variant/60 flex items-center justify-between">
            <div>
              <p class="text-on-surface-variant text-[10px] sm:text-xs font-black uppercase tracking-wider">Oportunidades</p>
              <p class="text-2xl sm:text-3xl font-black text-on-background mt-0.5">142</p>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl">trending_up</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest border-l-4 border-secondary p-3.5 sm:p-4 rounded-2xl shadow-xs border border-outline-variant/60 flex items-center justify-between">
            <div>
              <p class="text-on-surface-variant text-[10px] sm:text-xs font-black uppercase tracking-wider">Volumen Global</p>
              <p class="text-2xl sm:text-3xl font-black text-on-background mt-0.5">$2.4M</p>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl">payments</span>
            </div>
          </div>

          <div class="col-span-2 sm:col-span-1 bg-surface-container-lowest border-l-4 border-tertiary p-3.5 sm:p-4 rounded-2xl shadow-xs border border-outline-variant/60 flex items-center justify-between">
            <div>
              <p class="text-on-surface-variant text-[10px] sm:text-xs font-black uppercase tracking-wider">Tiempo Promedio</p>
              <p class="text-2xl sm:text-3xl font-black text-on-background mt-0.5">12d</p>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-tertiary-container text-tertiary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl">schedule</span>
            </div>
          </div>
        </section>

        <!-- Segmented Filter Control (Mobile Tabs) -->
        <section class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar md:hidden">
          <button
            (click)="tabSeleccionado.set('todos')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer"
            [ngClass]="tabSeleccionado() === 'todos' ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface-container-low text-on-surface-variant border-outline-variant'"
          >
            Todos los Kanban
          </button>

          <button
            (click)="tabSeleccionado.set('por_iniciar')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer flex items-center gap-1.5"
            [ngClass]="tabSeleccionado() === 'por_iniciar' ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface-container-low text-on-surface-variant border-outline-variant'"
          >
            <span class="w-2 h-2 rounded-full bg-primary"></span>
            <span>Por Iniciar ({{ ticketsPorIniciar.length }})</span>
          </button>

          <button
            (click)="tabSeleccionado.set('en_gestion')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer flex items-center gap-1.5"
            [ngClass]="tabSeleccionado() === 'en_gestion' ? 'bg-tertiary text-white border-tertiary shadow-xs' : 'bg-surface-container-low text-on-surface-variant border-outline-variant'"
          >
            <span class="w-2 h-2 rounded-full bg-tertiary"></span>
            <span>En Gestión ({{ ticketsEnGestion.length }})</span>
          </button>

          <button
            (click)="tabSeleccionado.set('cerrados')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer flex items-center gap-1.5"
            [ngClass]="tabSeleccionado() === 'cerrados' ? 'bg-secondary text-white border-secondary shadow-xs' : 'bg-surface-container-low text-on-surface-variant border-outline-variant'"
          >
            <span class="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Cerrados ({{ ticketsCerrado.length }})</span>
          </button>
        </section>

        <!-- Kanban View (Grid on Desktop, Dynamic Columns on Mobile) -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          
          <!-- Column: Por Iniciar -->
          <div *ngIf="tabSeleccionado() === 'todos' || tabSeleccionado() === 'por_iniciar'" class="flex flex-col gap-3">
            <div class="flex items-center justify-between px-1 py-1">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-primary rounded-full"></span>
                <h3 class="font-extrabold text-sm text-on-background">Por Iniciar</h3>
                <span class="bg-primary/10 text-primary text-xs font-black px-2 py-0.5 rounded-full border border-primary/20">
                  {{ ticketsPorIniciar.length }}
                </span>
              </div>
            </div>
            
            <div class="kanban-column flex flex-col gap-3 pb-4 transition-colors rounded-2xl"
                 [ngClass]="{'bg-primary/5': draggedColumn === 'porIniciar'}"
                 (dragover)="onDragOver($event, 'porIniciar')"
                 (drop)="onDrop($event, 'porIniciar')">
              
              <div *ngFor="let item of ticketsPorIniciar" 
                   draggable="true"
                   (dragstart)="onDragStart($event, item, 'porIniciar')"
                   (dragend)="onDragEnd()"
                   class="bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl shadow-xs space-y-3 hover:shadow-md transition-all cursor-grab active:cursor-grabbing border-l-4 border-l-primary"
                   [ngClass]="{'opacity-50': draggedItem?.id === item.id}">
                
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-bold text-sm text-on-surface hover:text-primary transition-colors" [class.line-through]="item.isStrikethrough">{{ item.title }}</h4>
                    <p class="text-xs text-on-surface-variant font-medium mt-0.5">{{ item.client }}</p>
                  </div>
                  <span [class]="item.statusTag.containerCss + ' ' + item.statusTag.css + ' text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-tight shrink-0'">
                    {{ item.statusTag.text }}
                  </span>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-outline-variant/40">
                  <div class="flex items-center gap-2">
                    <img [src]="item.producerAvatar" class="w-6 h-6 rounded-full object-cover border border-outline-variant">
                    <span class="text-xs font-bold text-on-surface-variant">{{ item.producer }}</span>
                  </div>
                  <span class="text-xs font-black text-on-surface">{{ item.value | currency:'USD':'symbol':'1.0-0' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Column: En Gestión -->
          <div *ngIf="tabSeleccionado() === 'todos' || tabSeleccionado() === 'en_gestion'" class="flex flex-col gap-3">
            <div class="flex items-center justify-between px-1 py-1">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-tertiary rounded-full"></span>
                <h3 class="font-extrabold text-sm text-on-background">En Gestión</h3>
                <span class="bg-tertiary/10 text-tertiary text-xs font-black px-2 py-0.5 rounded-full border border-tertiary/20">
                  {{ ticketsEnGestion.length }}
                </span>
              </div>
            </div>
            
            <div class="kanban-column flex flex-col gap-3 pb-4 transition-colors rounded-2xl"
                 [ngClass]="{'bg-tertiary/5': draggedColumn === 'enGestion'}"
                 (dragover)="onDragOver($event, 'enGestion')"
                 (drop)="onDrop($event, 'enGestion')">
                 
              <div *ngFor="let item of ticketsEnGestion" 
                   draggable="true"
                   (dragstart)="onDragStart($event, item, 'enGestion')"
                   (dragend)="onDragEnd()"
                   class="bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl shadow-xs space-y-3 hover:shadow-md transition-all cursor-grab active:cursor-grabbing border-l-4 border-l-tertiary"
                   [ngClass]="{'opacity-50': draggedItem?.id === item.id}">
                   
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-bold text-sm text-on-surface hover:text-tertiary transition-colors" [class.line-through]="item.isStrikethrough">{{ item.title }}</h4>
                    <p class="text-xs text-on-surface-variant font-medium mt-0.5">{{ item.client }}</p>
                  </div>
                  <span [class]="item.statusTag.containerCss + ' ' + item.statusTag.css + ' text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-tight shrink-0'">
                    {{ item.statusTag.text }}
                  </span>
                </div>

                <div *ngIf="item.progress !== undefined" class="space-y-1">
                  <div class="flex justify-between items-center text-[10px] font-extrabold">
                    <span class="text-on-surface-variant uppercase">Avance</span>
                    <span class="text-tertiary">{{ item.progress }}%</span>
                  </div>
                  <div class="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div class="h-full bg-tertiary rounded-full transition-all duration-500" [style.width.%]="item.progress"></div>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-outline-variant/40">
                  <div class="flex items-center gap-2">
                    <img [src]="item.producerAvatar" class="w-6 h-6 rounded-full object-cover border border-outline-variant">
                    <span class="text-xs font-bold text-on-surface-variant">{{ item.producer }}</span>
                  </div>
                  <span class="text-xs font-black text-on-surface">{{ item.value | currency:'USD':'symbol':'1.0-0' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Column: Cerrados -->
          <div *ngIf="tabSeleccionado() === 'todos' || tabSeleccionado() === 'cerrados'" class="flex flex-col gap-3">
            <div class="flex items-center justify-between px-1 py-1">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-secondary rounded-full"></span>
                <h3 class="font-extrabold text-sm text-on-background">Cerrados</h3>
                <span class="bg-secondary/10 text-secondary text-xs font-black px-2 py-0.5 rounded-full border border-secondary/20">
                  {{ ticketsCerrado.length }}
                </span>
              </div>
            </div>
            
            <div class="kanban-column flex flex-col gap-3 pb-4 transition-colors rounded-2xl"
                 [ngClass]="{'bg-secondary/5': draggedColumn === 'cerrado'}"
                 (dragover)="onDragOver($event, 'cerrado')"
                 (drop)="onDrop($event, 'cerrado')">
                 
              <div *ngFor="let item of ticketsCerrado" 
                   draggable="true"
                   (dragstart)="onDragStart($event, item, 'cerrado')"
                   (dragend)="onDragEnd()"
                   class="bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl shadow-xs opacity-80 hover:opacity-100 transition-all cursor-grab active:cursor-grabbing border-l-4 border-l-secondary"
                   [ngClass]="{'opacity-50': draggedItem?.id === item.id}">
                   
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-bold text-sm text-on-surface line-through decoration-on-surface-variant/40 group-hover:text-secondary transition-colors">{{ item.title }}</h4>
                    <p class="text-xs text-on-surface-variant font-medium mt-0.5">{{ item.client }}</p>
                  </div>
                  <span [class]="item.statusTag.containerCss + ' ' + item.statusTag.css + ' text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-tight shrink-0'">
                    {{ item.statusTag.text }}
                  </span>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-outline-variant/40">
                  <div class="flex items-center gap-2">
                    <img [src]="item.producerAvatar" class="w-6 h-6 rounded-full object-cover border border-outline-variant">
                    <span class="text-xs font-bold text-on-surface-variant opacity-80">{{ item.producer }}</span>
                  </div>
                  <span class="text-xs font-black text-secondary">{{ item.value | currency:'USD':'symbol':'1.0-0' }}</span>
                </div>
              </div>
            </div>
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
    .kanban-column {
      min-height: 120px;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
  `]
})
export class TicketeraKanbanComponent {
  tabSeleccionado = signal<string>('todos');

  ticketsPorIniciar: KanbanTicket[] = [
    {
      id: '1',
      title: 'Cotización Flotas de Camiones',
      client: 'Transportes Aconcagua S.A.',
      producer: 'Juan Pérez',
      value: 120000,
      statusTag: { text: 'Urgente', css: 'text-on-error-container', containerCss: 'bg-error-container' },
      producerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: '2',
      title: 'Seguro Técnico Equipos Médicos',
      client: 'Clínica San Juan',
      producer: 'María García',
      value: 45000,
      statusTag: { text: 'Nueva Oportunidad', css: 'text-on-surface-variant', containerCss: 'bg-surface-container' },
      producerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    }
  ];

  ticketsEnGestion: KanbanTicket[] = [
    {
      id: '3',
      title: 'Todo Riesgo Operativo - Bodega',
      client: 'Viñedos del Valle',
      producer: 'Roberto Sánchez',
      value: 350000,
      statusTag: { text: 'En Inspección', css: 'text-white', containerCss: 'bg-tertiary' },
      producerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      progress: 40
    },
    {
      id: '5',
      title: 'Póliza Colectiva de Vida',
      client: 'Constructora Cuyo',
      producer: 'Juan Pérez',
      value: 18000,
      statusTag: { text: 'Emisión Solicitada', css: 'text-tertiary', containerCss: 'bg-tertiary-container' },
      producerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      progress: 85
    }
  ];

  ticketsCerrado: KanbanTicket[] = [
    {
      id: '4',
      title: 'RC Caución Ambiental',
      client: 'Minería San Rafael',
      producer: 'María García',
      value: 89000,
      statusTag: { text: 'Póliza Emitida', css: 'text-on-secondary-container', containerCss: 'bg-secondary-container' },
      producerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      isStrikethrough: true
    }
  ];

  draggedItem: KanbanTicket | null = null;
  draggedColumn: 'porIniciar' | 'enGestion' | 'cerrado' | null = null;

  onDragStart(event: DragEvent, item: KanbanTicket, fromColumn: 'porIniciar' | 'enGestion' | 'cerrado') {
    this.draggedItem = item;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', item.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent, targetColumn: 'porIniciar' | 'enGestion' | 'cerrado') {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.draggedColumn = targetColumn;
  }

  onDragEnd() {
    this.draggedItem = null;
    this.draggedColumn = null;
  }

  onDrop(event: DragEvent, targetColumn: 'porIniciar' | 'enGestion' | 'cerrado') {
    event.preventDefault();
    if (!this.draggedItem) return;

    this.ticketsPorIniciar = this.ticketsPorIniciar.filter(t => t.id !== this.draggedItem!.id);
    this.ticketsEnGestion = this.ticketsEnGestion.filter(t => t.id !== this.draggedItem!.id);
    this.ticketsCerrado = this.ticketsCerrado.filter(t => t.id !== this.draggedItem!.id);

    const movedItem = { ...this.draggedItem };

    if (targetColumn === 'cerrado') {
      movedItem.isStrikethrough = true;
      movedItem.statusTag = { text: 'Finalizado', css: 'text-on-secondary-container', containerCss: 'bg-secondary-container' };
      this.ticketsCerrado.push(movedItem);
    } else if (targetColumn === 'enGestion') {
      movedItem.isStrikethrough = false;
      movedItem.statusTag = { text: 'En Gestión', css: 'text-white', containerCss: 'bg-tertiary' };
      this.ticketsEnGestion.push(movedItem);
    } else {
      movedItem.isStrikethrough = false;
      movedItem.statusTag = { text: 'Por Iniciar', css: 'text-on-surface-variant', containerCss: 'bg-surface-container' };
      this.ticketsPorIniciar.push(movedItem);
    }

    this.draggedItem = null;
    this.draggedColumn = null;
  }
}
