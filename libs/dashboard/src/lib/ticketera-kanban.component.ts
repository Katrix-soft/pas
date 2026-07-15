import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-background text-on-background font-body-md min-h-screen pb-24">
      <!-- Main Content Canvas -->
      <main class="px-container-margin pt-sm space-y-lg max-w-7xl mx-auto">
        <!-- Header & Filters -->
        <section class="flex flex-col md:flex-row md:items-center justify-between gap-md">
          <div>
            <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-on-background">Seguimientos - Admin</h2>
            <p class="text-on-surface-variant font-body-sm">Panel de supervisión global de pipeline y productores</p>
          </div>
          <div class="flex items-center gap-sm overflow-x-auto pb-xs md:pb-0">
            <div class="flex items-center bg-surface-container-lowest border border-outline-variant px-md py-sm rounded-lg min-w-max">
              <span class="material-symbols-outlined text-primary text-sm mr-xs">group</span>
              <select class="bg-transparent border-none focus:ring-0 font-label-md text-label-md py-0">
                <option>Todos los Productores</option>
                <option>Juan Pérez</option>
                <option>María García</option>
                <option>Roberto Sánchez</option>
              </select>
            </div>
            <div class="flex items-center bg-surface-container-lowest border border-outline-variant px-md py-sm rounded-lg min-w-max">
              <span class="material-symbols-outlined text-primary text-sm mr-xs">public</span>
              <select class="bg-transparent border-none focus:ring-0 font-label-md text-label-md py-0">
                <option>Áreas Globales</option>
                <option>Automotores</option>
                <option>Vida y Salud</option>
                <option>Riesgos Varios</option>
              </select>
            </div>
            <button class="bg-primary text-white p-sm rounded-lg flex items-center justify-center hover:bg-primary-container transition-colors shadow-sm cursor-pointer">
              <span class="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </section>

        <!-- Summary Bar -->
        <section class="grid grid-cols-1 sm:grid-cols-3 gap-md">
          <div class="bg-surface-container-lowest border-l-4 border-primary p-md rounded-lg shadow-sm flex items-center justify-between hover:scale-[0.98] transition-transform cursor-pointer">
            <div>
              <p class="text-on-surface-variant font-label-md uppercase tracking-wider">Oportunidades Activas</p>
              <p class="font-metric-xl text-metric-xl text-on-background">142</p>
            </div>
            <div class="p-sm bg-surface-container rounded-full">
              <span class="material-symbols-outlined text-primary">trending_up</span>
            </div>
          </div>
          <div class="bg-surface-container-lowest border-l-4 border-secondary p-md rounded-lg shadow-sm flex items-center justify-between hover:scale-[0.98] transition-transform cursor-pointer">
            <div>
              <p class="text-on-surface-variant font-label-md uppercase tracking-wider">Volumen Global</p>
              <p class="font-metric-xl text-metric-xl text-on-background">$2.4M</p>
            </div>
            <div class="p-sm bg-secondary-container rounded-full text-on-secondary-container">
              <span class="material-symbols-outlined">payments</span>
            </div>
          </div>
          <div class="bg-surface-container-lowest border-l-4 border-tertiary p-md rounded-lg shadow-sm flex items-center justify-between hover:scale-[0.98] transition-transform cursor-pointer">
            <div>
              <p class="text-on-surface-variant font-label-md uppercase tracking-wider">Tiempo Promedio</p>
              <p class="font-metric-xl text-metric-xl text-on-background">12d</p>
            </div>
            <div class="p-sm bg-tertiary-container rounded-full text-white">
              <span class="material-symbols-outlined">schedule</span>
            </div>
          </div>
        </section>

        <!-- Kanban View -->
        <section class="flex md:grid md:grid-cols-3 gap-lg overflow-x-auto pb-md custom-scrollbar snap-x snap-mandatory">
          
          <!-- Column: Por Iniciar -->
          <div class="flex flex-col gap-md min-w-[300px] snap-center">
            <div class="flex items-center justify-between px-xs">
              <div class="flex items-center gap-xs">
                <span class="w-3 h-3 bg-primary rounded-full"></span>
                <h3 class="font-headline-sm text-headline-sm">Por Iniciar</h3>
                <span class="bg-surface-container text-on-surface-variant px-sm rounded-full font-label-md">{{ticketsPorIniciar.length}}</span>
              </div>
              <button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container rounded-full p-xs cursor-pointer">add</button>
            </div>
            
            <div class="kanban-column flex flex-col gap-md pb-xl transition-colors rounded-lg"
                 [class.bg-surface-container-low]="draggedColumn === 'porIniciar'"
                 (dragover)="onDragOver($event, 'porIniciar')"
                 (drop)="onDrop($event, 'porIniciar')">
              
              <div *ngFor="let item of ticketsPorIniciar" 
                   draggable="true"
                   (dragstart)="onDragStart($event, item, 'porIniciar')"
                   (dragend)="onDragEnd()"
                   class="bg-surface-container-lowest border border-outline-variant p-md rounded-lg shadow-sm space-y-md hover:shadow-md transition-all cursor-grab active:cursor-grabbing hover:-translate-y-1" 
                   [class]="'border-l-4 ' + (item.statusTag.css.includes('error') ? 'border-l-error' : 'border-l-primary')"
                   [class.opacity-50]="draggedItem?.id === item.id">
                
                <div class="flex justify-between items-start pointer-events-none">
                  <div>
                    <h4 class="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition-colors" [class.line-through]="item.isStrikethrough" [class.decoration-on-surface-variant]="item.isStrikethrough">{{item.title}}</h4>
                    <p class="text-on-surface-variant font-body-sm">{{item.client}}</p>
                  </div>
                  <span [class]="item.statusTag.containerCss + ' ' + item.statusTag.css + ' text-[10px] px-sm py-[2px] rounded-full font-bold uppercase tracking-tight'">{{item.statusTag.text}}</span>
                </div>
                <div class="flex items-center justify-between pointer-events-none">
                  <div class="flex items-center gap-sm">
                    <img class="w-8 h-8 rounded-full border border-outline-variant object-cover" alt="Agent" [src]="item.producerAvatar"/>
                    <div class="flex flex-col">
                      <span class="text-[10px] text-on-surface-variant uppercase font-bold">Productor</span>
                      <span class="font-label-md">{{item.producer}}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] text-on-surface-variant uppercase font-bold">Valor</span>
                    <p class="font-label-md text-primary">{{item.value | currency:'USD':'symbol':'1.0-0'}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Column: En Gestión -->
          <div class="flex flex-col gap-md min-w-[300px] snap-center">
            <div class="flex items-center justify-between px-xs">
              <div class="flex items-center gap-xs">
                <span class="w-3 h-3 bg-tertiary rounded-full"></span>
                <h3 class="font-headline-sm text-headline-sm">En Gestión</h3>
                <span class="bg-surface-container text-on-surface-variant px-sm rounded-full font-label-md">{{ticketsEnGestion.length}}</span>
              </div>
              <button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container rounded-full p-xs cursor-pointer">more_vert</button>
            </div>
            
            <div class="kanban-column flex flex-col gap-md pb-xl transition-colors rounded-lg"
                 [class.bg-surface-container-low]="draggedColumn === 'enGestion'"
                 (dragover)="onDragOver($event, 'enGestion')"
                 (drop)="onDrop($event, 'enGestion')">
                 
              <div *ngFor="let item of ticketsEnGestion" 
                   draggable="true"
                   (dragstart)="onDragStart($event, item, 'enGestion')"
                   (dragend)="onDragEnd()"
                   class="bg-surface-container-lowest border border-outline-variant p-md rounded-lg shadow-sm space-y-md hover:shadow-md transition-all cursor-grab active:cursor-grabbing hover:-translate-y-1 border-l-4 border-l-tertiary"
                   [class.opacity-50]="draggedItem?.id === item.id">
                   
                <div class="flex justify-between items-start pointer-events-none">
                  <div>
                    <h4 class="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition-colors" [class.line-through]="item.isStrikethrough" [class.decoration-on-surface-variant]="item.isStrikethrough">{{item.title}}</h4>
                    <p class="text-on-surface-variant font-body-sm">{{item.client}}</p>
                  </div>
                  <span [class]="item.statusTag.containerCss + ' ' + item.statusTag.css + ' text-[10px] px-sm py-[2px] rounded-full font-bold uppercase tracking-tight'">{{item.statusTag.text}}</span>
                </div>
                <div class="flex items-center justify-between pointer-events-none">
                  <div class="flex items-center gap-sm">
                    <img class="w-8 h-8 rounded-full border border-outline-variant object-cover" alt="Agent" [src]="item.producerAvatar"/>
                    <div class="flex flex-col">
                      <span class="text-[10px] text-on-surface-variant uppercase font-bold">Productor</span>
                      <span class="font-label-md">{{item.producer}}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] text-on-surface-variant uppercase font-bold">Valor</span>
                    <p class="font-label-md text-primary">{{item.value | currency:'USD':'symbol':'1.0-0'}}</p>
                  </div>
                </div>
                <div *ngIf="item.progress !== undefined" class="pt-sm border-t border-outline-variant flex items-center gap-sm pointer-events-none">
                  <div class="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div class="h-full bg-tertiary rounded-full" [style.width.%]="item.progress"></div>
                  </div>
                  <span class="text-[10px] font-bold text-tertiary">{{item.progress}}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Column: Cerrado -->
          <div class="flex flex-col gap-md min-w-[300px] snap-center">
            <div class="flex items-center justify-between px-xs">
              <div class="flex items-center gap-xs">
                <span class="w-3 h-3 bg-secondary rounded-full"></span>
                <h3 class="font-headline-sm text-headline-sm">Cerrado</h3>
                <span class="bg-surface-container text-on-surface-variant px-sm rounded-full font-label-md">{{ticketsCerrado.length}}</span>
              </div>
              <button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container rounded-full p-xs cursor-pointer">check_circle</button>
            </div>
            
            <div class="kanban-column flex flex-col gap-md pb-xl transition-colors rounded-lg"
                 [class.bg-surface-container-low]="draggedColumn === 'cerrado'"
                 (dragover)="onDragOver($event, 'cerrado')"
                 (drop)="onDrop($event, 'cerrado')">
                 
              <div *ngFor="let item of ticketsCerrado" 
                   draggable="true"
                   (dragstart)="onDragStart($event, item, 'cerrado')"
                   (dragend)="onDragEnd()"
                   class="bg-surface-container-lowest border border-outline-variant p-md rounded-lg shadow-sm space-y-md opacity-80 hover:opacity-100 transition-all cursor-grab active:cursor-grabbing border-l-4 border-l-secondary"
                   [class.opacity-50]="draggedItem?.id === item.id">
                   
                <div class="flex justify-between items-start pointer-events-none">
                  <div>
                    <h4 class="font-headline-sm text-headline-sm text-on-surface line-through decoration-on-surface-variant/40">{{item.title}}</h4>
                    <p class="text-on-surface-variant font-body-sm">{{item.client}}</p>
                  </div>
                  <span [class]="item.statusTag.containerCss + ' ' + item.statusTag.css + ' text-[10px] px-sm py-[2px] rounded-full font-bold uppercase tracking-tight'">{{item.statusTag.text}}</span>
                </div>
                <div class="flex items-center justify-between pointer-events-none">
                  <div class="flex items-center gap-sm">
                    <img class="w-8 h-8 rounded-full border border-outline-variant object-cover" alt="Agent" [src]="item.producerAvatar"/>
                    <div class="flex flex-col">
                      <span class="text-[10px] text-on-surface-variant uppercase font-bold">Productor</span>
                      <span class="font-label-md">{{item.producer}}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] text-on-surface-variant uppercase font-bold">Valor</span>
                    <p class="font-label-md text-secondary">{{item.value | currency:'USD':'symbol':'1.0-0'}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>


    </div>
  `,
  styles: [`
    .kanban-column {
      min-height: calc(100vh - 320px);
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #c2c6d6;
      border-radius: 10px;
    }
    .custom-scrollbar:hover::-webkit-scrollbar-thumb {
      background: #727785;
    }
  `]
})
export class TicketeraKanbanComponent {
  ticketsPorIniciar: KanbanTicket[] = [
    {
      id: '1',
      title: 'Renovación Integral',
      client: 'Carlos Martínez',
      producer: 'Juan Pérez',
      value: 12400,
      statusTag: { text: 'Urgente', css: 'text-on-error-container', containerCss: 'bg-error-container' },
      producerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9z5iN1xGc5x2hrFdufP3jNtfJJOtYBmfl6rvmtYwsUteFq2P7vkH8CukCbu1QwFKGx_OyKsIAEqyjlT1NLGd3t3I72bt8bRwgpokma7PAtPfvdVZsc4VDZUJUk1j5Ou5ZauyC1UgdZHK5aQx5wUw5-l1pZRknqvgcUm4fKgE7rcxmtJB-B111OX62dZWOJh_WqUbGxhAFIYZmJzgdZ8BV8SuJffHOkYtNxIBiRtYwlhkpwWAHJk3aSA'
    },
    {
      id: '2',
      title: 'Póliza Automotor',
      client: 'Silvia Rodriguez',
      producer: 'María García',
      value: 8200,
      statusTag: { text: 'Nuevo', css: 'text-on-surface-variant', containerCss: 'bg-surface-container' },
      producerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBs05uJoyVbmUokpNF27FRWWfFwJzxQKX18GyF5vNoSvys6ktoBZfHpttZZgy4X2j_N6J8N1Hx_my44QjWgmf6Q2oV9HX4dkhiqrqQKEutJYY0tz_s5BMvpTo_nBayL4JAbgW_IHTu0dXta_DKvnwwRvI2PLTFDsOa_0m3hWyOQSlGO1TliOJL3N2V_idV7GiWzfdzsckS7k3EOQ8dnmXTCk9jRWPEO-fel7WW1sIjdXRZrBjUqLvPSLQ'
    }
  ];

  ticketsEnGestion: KanbanTicket[] = [
    {
      id: '3',
      title: 'Siniestro Hogar',
      client: 'Daniel Torres',
      producer: 'Roberto Sánchez',
      value: 45000,
      statusTag: { text: 'En curso', css: 'text-white', containerCss: 'bg-tertiary-container' },
      producerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN-X8ya6HBqyEFv8O3P3XYHAW-LQcUCRX6wTWu2zKmFiVOdxnMR7ooYEsA4EVnpyQ-g6NAEqfHyp_fm0CqwWf-JZaVCAXkH8CKS7uFtIFoGkmoQ0trL4-DtOWh9dB7fP7fgU1Ld5HsvT8x_0IUm6q-3U9EQElX_IvXcXUDRhAEzPNrV5I5uPa1cMBQoq4beQ1XPkQ6J6yqED46-Hdz-kmOvhjQkouuKufypxf2F04dhF3Zs5mAiaTHFQ',
      progress: 65
    }
  ];

  ticketsCerrado: KanbanTicket[] = [
    {
      id: '4',
      title: 'RC Profesional',
      client: 'Elena Valdés',
      producer: 'Juan Pérez',
      value: 32000,
      statusTag: { text: 'Cerrado', css: 'text-on-secondary-container', containerCss: 'bg-secondary-container' },
      producerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbCYxs2wph00IgUz59AwUHX1BlLT7-hlzwEPoGVr2f4oMckyR3w6wwKBjVpXhkGC1iWUxkEjuyjWJkGAjD-o96_cxnaqLAwcQQS-rXCTx7zoQoMHN6xgS4QPs1iwdOMV1oIjMsrWK0u4odNjcTHfW2xznfX8gtB_Z1umbg8-2s-L_Jc6FxKTCndBepBGfR8trJZKuJuV5m3GHnU6v8axmSDAHgmIBAFGjVJafLP9Q23-CsZwN_vlieVA',
      isStrikethrough: true
    }
  ];

  draggedItem: KanbanTicket | null = null;
  sourceColumn: string | null = null;
  draggedColumn: string | null = null;

  onDragStart(event: DragEvent, item: KanbanTicket, column: string) {
    this.draggedItem = item;
    this.sourceColumn = column;
    
    // Configurar effectAllowed para indicar que es mover
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', item.id);
      
      // Personalizar icono drag fantasma es posible aquí
    }
  }

  onDragEnd() {
    this.draggedItem = null;
    this.sourceColumn = null;
    this.draggedColumn = null;
  }

  onDragOver(event: DragEvent, column: string) {
    event.preventDefault(); // Necesario para permitir soltar
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.draggedColumn = column;
  }

  onDrop(event: DragEvent, targetColumn: string) {
    event.preventDefault();
    this.draggedColumn = null;

    if (!this.draggedItem || this.sourceColumn === targetColumn) {
      return;
    }

    // Remover del origen
    if (this.sourceColumn === 'porIniciar') {
      this.ticketsPorIniciar = this.ticketsPorIniciar.filter(t => t.id !== this.draggedItem!.id);
    } else if (this.sourceColumn === 'enGestion') {
      this.ticketsEnGestion = this.ticketsEnGestion.filter(t => t.id !== this.draggedItem!.id);
    } else if (this.sourceColumn === 'cerrado') {
      this.ticketsCerrado = this.ticketsCerrado.filter(t => t.id !== this.draggedItem!.id);
    }

    // Actualizar estilos según destino
    let movedItem = { ...this.draggedItem };
    
    if (targetColumn === 'cerrado') {
      movedItem.isStrikethrough = true;
      movedItem.statusTag = { text: 'Cerrado', css: 'text-on-secondary-container', containerCss: 'bg-secondary-container' };
      this.ticketsCerrado.push(movedItem);
    } else if (targetColumn === 'enGestion') {
      movedItem.isStrikethrough = false;
      movedItem.statusTag = { text: 'En curso', css: 'text-white', containerCss: 'bg-tertiary-container' };
      this.ticketsEnGestion.push(movedItem);
    } else if (targetColumn === 'porIniciar') {
      movedItem.isStrikethrough = false;
      movedItem.statusTag = { text: 'Nuevo', css: 'text-on-surface-variant', containerCss: 'bg-surface-container' };
      this.ticketsPorIniciar.push(movedItem);
    }
  }
}
