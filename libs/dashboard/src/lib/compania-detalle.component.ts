import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface CompanyData {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  polizasTotales: number;
  porcentajeCartera: string;
  primaMensual: string;
  retencion: string;
  siniestralidad: string;
  nuevosNegocios: number;
  telefonoContacto: string;
  emailContacto: string;
  ramos: { nombre: string; polizas: number; porcentaje: number; colorClass: string }[];
  renovaciones: { cliente: string; poliza: string; detalle: string; monto: string; estado: string; color: string }[];
}

@Component({
  selector: 'lib-compania-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="font-body-md text-on-surface bg-surface min-h-screen pb-20 md:pb-0">
      <!-- TopAppBar -->
      <header class="docked full-width top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-md py-sm w-full sticky">
        <div class="flex items-center gap-md">
          <button routerLink="/dashboard" class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors duration-200 cursor-pointer">
            <span class="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <div>
            <h1 class="font-headline-md text-headline-md text-primary font-bold">{{ selectedCompany().name }}</h1>
            <p class="text-xs text-on-surface-variant font-medium">Cartera de Aseguradora • Productor Gonzalo Javier Paso (#86992)</p>
          </div>
        </div>
        
        <!-- Company Selector Switcher -->
        <div class="flex items-center bg-surface-container rounded-xl p-1 border border-outline-variant gap-1">
          <button 
            *for="let c of companies" 
            (click)="selectCompany(c.id)"
            [class.bg-primary]="selectedCompany().id === c.id"
            [class.text-on-primary]="selectedCompany().id === c.id"
            [class.text-on-surface-variant]="selectedCompany().id !== c.id"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer">
            {{ c.name }}
          </button>
        </div>
      </header>

      <!-- Main Content Canvas -->
      <main class="pt-md pb-24 px-container-margin max-w-7xl mx-auto space-y-lg">
        
        <!-- Company Hero Card -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg flex flex-col md:flex-row items-center md:items-start gap-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div class="w-20 h-20 bg-indigo-600 text-white flex items-center justify-center rounded-2xl font-black text-2xl shadow-md border border-indigo-400 shrink-0">
            {{ selectedCompany().name.substring(0, 2).toUpperCase() }}
          </div>
          
          <div class="flex-grow text-center md:text-left space-y-1">
            <div class="flex items-center justify-center md:justify-start gap-2">
              <h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">{{ selectedCompany().name }}</h2>
              <span class="bg-primary/10 text-primary text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-primary/20">{{ selectedCompany().badge }}</span>
            </div>
            <p class="font-body-md text-on-surface-variant">{{ selectedCompany().tagline }}</p>
            
            <div class="flex flex-wrap justify-center md:justify-start gap-lg pt-sm">
              <div class="flex flex-col">
                <span class="font-label-md text-label-md text-on-surface-variant uppercase">Pólizas en Cartera</span>
                <span class="font-headline-md text-headline-md text-primary font-bold">{{ selectedCompany().polizasTotales }} <span class="text-xs text-outline font-normal">({{ selectedCompany().porcentajeCartera }})</span></span>
              </div>
              <div class="w-px h-10 bg-outline-variant hidden md:block"></div>
              <div class="flex flex-col">
                <span class="font-label-md text-label-md text-on-surface-variant uppercase">Prima Mensual Administrada</span>
                <span class="font-headline-md text-headline-md text-emerald-600 dark:text-emerald-400 font-bold">{{ selectedCompany().primaMensual }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2 w-full md:w-auto">
            <button routerLink="/asistente" class="w-full bg-primary text-on-primary font-bold px-lg py-sm rounded-xl transition-all hover:bg-primary-container shadow-sm flex items-center justify-center gap-2 cursor-pointer">
              <span class="material-symbols-outlined text-sm">smart_toy</span>
              <span>Cotizar en {{ selectedCompany().name }}</span>
            </button>
            <button (click)="openContactModal()" class="w-full border border-primary text-primary font-bold px-lg py-sm rounded-xl transition-all hover:bg-primary/5 flex items-center justify-center gap-2 cursor-pointer">
              <span class="material-symbols-outlined text-sm">call</span>
              <span>Mesa Operativa {{ selectedCompany().name }}</span>
            </button>
          </div>
        </section>

        <!-- KPI Bento Grid -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-md">
          <!-- Retention Rate -->
          <div class="bg-surface-container-lowest border-l-4 border-primary border-t border-r border-b border-outline-variant rounded-xl p-md shadow-sm">
            <div class="flex justify-between items-start mb-sm">
              <span class="material-symbols-outlined text-primary bg-primary-container p-xs rounded-full">loop</span>
              <span class="font-label-md text-label-md text-emerald-600 font-bold">+3.2% vs mes ant.</span>
            </div>
            <span class="font-metric-xl text-metric-xl text-on-surface font-bold">{{ selectedCompany().retencion }}</span>
            <p class="font-body-sm text-on-surface-variant font-medium">Tasa de Retención de Clientes</p>
          </div>
          
          <!-- Loss Ratio -->
          <div class="bg-surface-container-lowest border-l-4 border-amber-500 border-t border-r border-b border-outline-variant rounded-xl p-md shadow-sm">
            <div class="flex justify-between items-start mb-sm">
              <span class="material-symbols-outlined text-amber-600 bg-amber-500/10 p-xs rounded-full">shield</span>
              <span class="font-label-md text-label-md text-emerald-600 font-bold">Rango Óptimo</span>
            </div>
            <span class="font-metric-xl text-metric-xl text-on-surface font-bold">{{ selectedCompany().siniestralidad }}</span>
            <p class="font-body-sm text-on-surface-variant font-medium">Índice de Siniestralidad (Loss Ratio)</p>
          </div>

          <!-- New Business -->
          <div class="bg-surface-container-lowest border-l-4 border-emerald-500 border-t border-r border-b border-outline-variant rounded-xl p-md shadow-sm">
            <div class="flex justify-between items-start mb-sm">
              <span class="material-symbols-outlined text-emerald-600 bg-emerald-500/10 p-xs rounded-full">add_business</span>
              <span class="font-label-md text-label-md text-emerald-600 font-bold">Meta Cumplida</span>
            </div>
            <span class="font-metric-xl text-metric-xl text-on-surface font-bold">{{ selectedCompany().nuevosNegocios }}</span>
            <p class="font-body-sm text-on-surface-variant font-medium">Nuevas Pólizas Emitidas (Este Mes)</p>
          </div>
        </section>

        <!-- Charts and Details Grid -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <!-- Policy Distribution by Branch -->
          <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="font-headline-sm text-headline-sm text-on-surface mb-lg flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">pie_chart</span>
                Distribución por Ramos en {{ selectedCompany().name }}
              </h3>
              
              <div class="space-y-md">
                <div *ngIf="selectedCompany().ramos" class="space-y-md">
                  <div *ngFor="let r of selectedCompany().ramos" class="space-y-xs">
                    <div class="flex justify-between font-label-md text-label-md">
                      <span class="font-bold text-on-surface">{{ r.nombre }}</span>
                      <span class="text-primary font-bold">{{ r.polizas }} Pólizas ({{ r.porcentaje }}%)</span>
                    </div>
                    <div class="w-full bg-surface-container rounded-full h-2">
                      <div [class]="r.colorClass" class="h-2 rounded-full" [style.width.%]="r.porcentaje"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button routerLink="/asistente" class="mt-lg w-full py-sm text-primary font-bold border border-primary rounded-xl hover:bg-primary-container transition-colors cursor-pointer flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-sm">add_circle</span>
              <span>Solicitar Nueva Cotización</span>
            </button>
          </div>

          <!-- Recent Renewals -->
          <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col">
            <h3 class="font-headline-sm text-headline-sm text-on-surface mb-lg flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-500">event_upcoming</span>
              Próximas Renovaciones de {{ selectedCompany().name }}
            </h3>
            
            <div class="flex-grow space-y-sm overflow-y-auto pr-sm max-h-[320px]">
              <div *ngFor="let ren of selectedCompany().renovaciones" class="flex items-center justify-between p-md hover:bg-surface-container-low rounded-xl transition-colors border border-outline-variant cursor-pointer">
                <div class="flex items-center gap-md">
                  <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {{ ren.cliente.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-bold text-sm text-on-surface">{{ ren.cliente }}</p>
                    <p class="text-xs text-on-surface-variant">Pol: <strong>{{ ren.poliza }}</strong> • {{ ren.detalle }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-primary text-sm block">{{ ren.monto }}</span>
                  <span [class]="ren.color" class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{{ ren.estado }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Contact Card -->
        <section class="bg-gradient-to-r from-primary-fixed-dim/20 to-surface-container-lowest border border-outline-variant rounded-2xl p-lg flex flex-col md:flex-row justify-between items-center gap-md shadow-sm">
          <div class="flex items-center gap-md">
            <span class="material-symbols-outlined text-primary text-4xl">support_agent</span>
            <div>
              <h4 class="font-bold text-base text-on-surface">Mesa Operativa Directa PAS</h4>
              <p class="text-xs text-on-surface-variant">Atención prioritaria de emisión, endosos y siniestros para el Productor #86992</p>
            </div>
          </div>
          <div class="flex items-center gap-md">
            <span class="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">📞 {{ selectedCompany().telefonoContacto }}</span>
            <span class="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/20">✉️ {{ selectedCompany().emailContacto }}</span>
          </div>
        </section>

      </main>
    </div>
  `
})
export class CompaniaDetalleComponent {
  companiesList: CompanyData[] = [
    {
      id: 'mercantil',
      name: 'Mercantil Andina',
      badge: 'Compañía Principal',
      tagline: 'Líder en Seguros de Automotor, Combinado Familiar y Motovehículos en Argentina',
      polizasTotales: 128,
      porcentajeCartera: '65% de cartera',
      primaMensual: '$31.3M / mes',
      retencion: '96.4%',
      siniestralidad: '38%',
      nuevosNegocios: 14,
      telefonoContacto: '0810-888-6372',
      emailContacto: 'mesapas@mercantilandina.com.ar',
      ramos: [
        { nombre: 'Automotor (Rama 5)', polizas: 82, porcentaje: 64, colorClass: 'bg-primary' },
        { nombre: 'Combinado Familiar / Hogar (Rama 14)', polizas: 24, porcentaje: 19, colorClass: 'bg-secondary' },
        { nombre: 'Motovehículos (Rama 35)', polizas: 14, porcentaje: 11, colorClass: 'bg-tertiary' },
        { nombre: 'Accidentes Personales (Rama 18)', polizas: 8, porcentaje: 6, colorClass: 'bg-outline' }
      ],
      renovaciones: [
        { cliente: 'Schaffer Augusto Pablo', poliza: '#594387129', detalle: 'CHEVROLET SPIN 1.8', monto: '$89.300', estado: 'Vence en 3 días', color: 'bg-amber-500/10 text-amber-600' },
        { cliente: 'Pérez Juan', poliza: '#148059592', detalle: 'HONDA CBX 250', monto: '$23.322', estado: 'Vence en 5 días', color: 'bg-amber-500/10 text-amber-600' },
        { cliente: 'Fernández Lucía', poliza: '#180041638', detalle: 'RENAULT DUSTER 1.6', monto: '$64.200', estado: 'Vence en 8 días', color: 'bg-slate-500/10 text-slate-600' },
        { cliente: 'Gómez Marcos', poliza: '#46522374', detalle: 'FORD RANGER 3.2', monto: '$118.500', estado: 'Vence en 12 días', color: 'bg-emerald-500/10 text-emerald-600' }
      ]
    },
    {
      id: 'sancristobal',
      name: 'San Cristóbal Seguros',
      badge: 'Aliada Secundaria',
      tagline: 'Seguros Patimoniales, Agro y Coberturas Integrales de Comercio',
      polizasTotales: 42,
      porcentajeCartera: '21% de cartera',
      primaMensual: '$10.2M / mes',
      retencion: '91.8%',
      siniestralidad: '42%',
      nuevosNegocios: 5,
      telefonoContacto: '0810-222-7726',
      emailContacto: 'pas@sancristobal.com.ar',
      ramos: [
        { nombre: 'Automotor', polizas: 25, porcentaje: 60, colorClass: 'bg-primary' },
        { nombre: 'Comercio & PYME', polizas: 10, porcentaje: 24, colorClass: 'bg-secondary' },
        { nombre: 'Accidentes Personales', polizas: 7, porcentaje: 16, colorClass: 'bg-tertiary' }
      ],
      renovaciones: [
        { cliente: 'Eduardo Martínez', poliza: '#0092-334912', detalle: 'TOYOTA COROLLA 2.0', monto: '$74.500', estado: 'Vence en 10 días', color: 'bg-slate-500/10 text-slate-600' },
        { cliente: 'Logística Sur S.A.', poliza: '#0092-441029', detalle: 'MERCEDES BENZ SPRINTER', monto: '$185.000', estado: 'Vence en 15 días', color: 'bg-emerald-500/10 text-emerald-600' }
      ]
    },
    {
      id: 'sancor',
      name: 'Sancor Seguros',
      badge: 'Aliada Estratégica',
      tagline: 'Líder en Seguros Agropecuarios, Vida y Movilidad',
      polizasTotales: 28,
      porcentajeCartera: '14% de cartera',
      primaMensual: '$6.7M / mes',
      retencion: '94.0%',
      siniestralidad: '35%',
      nuevosNegocios: 3,
      telefonoContacto: '0800-444-2850',
      emailContacto: 'atencionpas@sancorseguros.com',
      ramos: [
        { nombre: 'Automotor', polizas: 16, porcentaje: 57, colorClass: 'bg-primary' },
        { nombre: 'Vida & Salud', polizas: 8, porcentaje: 29, colorClass: 'bg-secondary' },
        { nombre: 'Hogar', polizas: 4, porcentaje: 14, colorClass: 'bg-tertiary' }
      ],
      renovaciones: [
        { cliente: 'María Belén Ortega', poliza: '#0092-882190', detalle: 'VOLKSWAGEN GOL TREND', monto: '$45.800', estado: 'Vence en 2 días', color: 'bg-amber-500/10 text-amber-600' },
        { cliente: 'Carlos D\'Amico', poliza: '#0092-110022', detalle: 'PEUGEOT 208 1.6', monto: '$58.200', estado: 'Vence en 18 días', color: 'bg-emerald-500/10 text-emerald-600' }
      ]
    }
  ];

  get companies() {
    return this.companiesList;
  }

  selectedCompany = signal<CompanyData>(this.companiesList[0]);

  selectCompany(id: string) {
    const comp = this.companiesList.find(c => c.id === id);
    if (comp) {
      this.selectedCompany.set(comp);
    }
  }

  openContactModal() {
    const c = this.selectedCompany();
    alert(`Mesa Operativa Directa de ${c.name}\n\nTeléfono PAS: ${c.telefonoContacto}\nEmail Operativo: ${c.emailContacto}\n\nAtención prioritaria para el Productor Gonzalo Javier Paso (#86992).`);
  }
}
