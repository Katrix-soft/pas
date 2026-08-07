import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

interface IndiceInflacion {
  fecha: string;
  valor: number;
}

interface ArglyIPCResponse {
  data: {
    indice_ipc: number;
    mes: number;
    nombre_mes: string;
    anio: number;
    fecha_publicacion: string;
    fecha_proximo_informe: string;
  };
}

interface ChartData {
  mes: string;
  nominalLabel: string;
  realLabel: string;
  nominalValue: number;
  realValue: number;
}

@Component({
  selector: 'lib-premio-administrado',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  template: `
    <div class="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen">
      <!-- Top AppBar -->
      <header class="fixed top-0 w-full z-50 flex items-center px-container-margin h-16 bg-surface dark:bg-on-background transition-colors duration-200 ease-in-out border-b border-outline-variant">
        <button routerLink="/dashboard" class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low dark:hover:bg-inverse-surface transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-primary dark:text-primary-fixed">arrow_back</span>
        </button>
        <h1 class="ml-2 font-headline-sm text-headline-sm font-bold text-on-surface dark:text-inverse-on-surface">Premio Administrado</h1>
        <div class="ml-auto flex items-center gap-4">
          <button class="cursor-pointer">
            <span class="material-symbols-outlined text-on-surface-variant">search</span>
          </button>
          <button class="cursor-pointer">
            <span class="material-symbols-outlined text-on-surface-variant">notifications</span>
          </button>
        </div>
      </header>

      <main class="pt-20 pb-32 px-container-margin max-w-5xl mx-auto space-y-lg">
        <!-- Hero Section: Managed Premium & Collected -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Cartera Total -->
          <div class="relative overflow-hidden bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
            <div class="absolute top-0 right-0 p-4 opacity-10">
              <span class="material-symbols-outlined text-[120px]" style="font-variation-settings: 'wght' 200;">account_balance_wallet</span>
            </div>
            <div class="relative z-10 flex flex-col items-start py-2">
              <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-sm">Cartera Total Vigente</p>
              <h2 class="font-metric-xl text-metric-xl text-primary mb-xs">$18.5M</h2>
              <div class="flex items-center gap-1 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full">
                <span class="material-symbols-outlined text-[18px]">trending_up</span>
                <span class="font-label-md text-label-md">+14.8% crecimiento</span>
              </div>
            </div>
          </div>
          
          <!-- Cobrado Este Mes -->
          <div class="relative overflow-hidden bg-surface-container-lowest rounded-xl border-l-4 border-emerald-500 border-t border-r border-b border-outline-variant p-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 p-4 opacity-10 text-emerald-500">
              <span class="material-symbols-outlined text-[120px]" style="font-variation-settings: 'wght' 200;">payments</span>
            </div>
            <div class="relative z-10 flex flex-col items-start py-2">
              <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-sm">Cobrados Este Mes</p>
              <h2 class="font-metric-xl text-metric-xl text-emerald-600 mb-xs">$2.450.000</h2>
              <div class="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full">
                <span class="material-symbols-outlined text-[18px]">check_circle</span>
                <span class="font-label-md text-label-md">98.5% tasa de cobro</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Seccion: Indicadores Económicos -->
        <section>
          <!-- Tarjeta IPC Argly -->
          <div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <span class="material-symbols-outlined text-[24px]">price_change</span>
              </div>
              <div>
                <p class="font-label-md text-on-surface-variant uppercase tracking-widest text-xs font-bold">Índice de Precios al Consumidor (IPC)</p>
                <h3 class="font-headline-md text-on-surface font-extrabold mt-1">
                  @if (ipcActual(); as ipc) {
                    {{ ipc.data.indice_ipc }}%
                  } @else {
                    <span class="text-sm text-on-surface-variant font-normal">Obteniendo de Argly...</span>
                  }
                </h3>
              </div>
            </div>
            @if (ipcActual(); as ipc) {
              <div class="text-left md:text-right text-sm text-on-surface-variant bg-surface-container px-4 py-2 rounded-lg">
                <p><strong>Mes:</strong> <span class="capitalize">{{ ipc.data.nombre_mes }}</span> {{ ipc.data.anio }}</p>
                <p class="text-xs mt-1">Próximo informe: {{ ipc.data.fecha_proximo_informe }}</p>
              </div>
            }
          </div>
        </section>

        <!-- Chart Section: Monthly Evolution -->
        <section class="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
          <div class="flex justify-between items-center mb-lg">
            <div>
              <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Evolución Mensual del Premio</h3>
              <p class="text-xs text-on-surface-variant mt-0.5">Incremento sostenido de prima administrada en los últimos 6 meses</p>
            </div>
            <span class="font-label-md text-label-md text-primary font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Semestre I - 2026</span>
          </div>
          <div class="h-56 flex items-end justify-between gap-3 pt-8 pb-2 relative px-4">
            <!-- Grid Lines -->
            <div class="absolute inset-x-0 top-12 border-t border-dashed border-outline-variant/50"></div>
            <div class="absolute inset-x-0 top-28 border-t border-dashed border-outline-variant/50"></div>
            <div class="absolute inset-x-0 top-44 border-t border-dashed border-outline-variant/50"></div>

            <!-- Ene -->
            <div class="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
              <span class="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">$12.4M</span>
              <div class="w-full max-w-[48px] bg-blue-300 dark:bg-blue-900/60 rounded-t-lg transition-all group-hover:bg-primary" style="height: 48%;"></div>
              <span class="font-label-md text-xs font-semibold text-on-surface-variant">Ene</span>
            </div>
            <!-- Feb -->
            <div class="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
              <span class="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">$13.8M</span>
              <div class="w-full max-w-[48px] bg-blue-400 dark:bg-blue-800/80 rounded-t-lg transition-all group-hover:bg-primary" style="height: 58%;"></div>
              <span class="font-label-md text-xs font-semibold text-on-surface-variant">Feb</span>
            </div>
            <!-- Mar -->
            <div class="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
              <span class="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">$15.2M</span>
              <div class="w-full max-w-[48px] bg-blue-500 dark:bg-blue-700 rounded-t-lg transition-all group-hover:bg-primary" style="height: 70%;"></div>
              <span class="font-label-md text-xs font-semibold text-on-surface-variant">Mar</span>
            </div>
            <!-- Abr -->
            <div class="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
              <span class="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">$14.9M</span>
              <div class="w-full max-w-[48px] bg-blue-400 dark:bg-blue-800/80 rounded-t-lg transition-all group-hover:bg-primary" style="height: 65%;"></div>
              <span class="font-label-md text-xs font-semibold text-on-surface-variant">Abr</span>
            </div>
            <!-- May -->
            <div class="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
              <span class="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">$16.8M</span>
              <div class="w-full max-w-[48px] bg-blue-600 dark:bg-blue-600 rounded-t-lg transition-all group-hover:bg-primary" style="height: 84%;"></div>
              <span class="font-label-md text-xs font-semibold text-on-surface-variant">May</span>
            </div>
            <!-- Jun (Actual) -->
            <div class="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
              <span class="text-[11px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded shadow-xs">$18.5M</span>
              <div class="w-full max-w-[48px] bg-primary rounded-t-lg transition-all shadow-md group-hover:bg-indigo-700" style="height: 100%;"></div>
              <span class="font-label-md text-xs font-black text-primary">Jun</span>
            </div>
          </div>
        </section>

        <!-- Chart Section: Inflation Impact -->
        <section class="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-lg gap-4">
            <div>
              <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Impacto de la Inflación vs Cobranza Real</h3>
              <p class="text-xs text-on-surface-variant mt-0.5">Comparativa de recaudación nominal contra crecimiento ajustado por inflación</p>
            </div>
            <div class="flex gap-4">
              <div class="flex items-center gap-1 text-xs font-bold text-on-surface-variant">
                <div class="w-3 h-3 rounded bg-blue-500"></div> Nominal
              </div>
              <div class="flex items-center gap-1 text-xs font-bold text-on-surface-variant">
                <div class="w-3 h-3 rounded bg-red-400"></div> Real (Ajustado)
              </div>
            </div>
          </div>
          
          <div class="h-56 flex items-end justify-between gap-4 pt-8 pb-2 relative px-2 sm:px-6">
            <!-- Grid Lines -->
            <div class="absolute inset-x-0 top-12 border-t border-dashed border-outline-variant/50"></div>
            <div class="absolute inset-x-0 top-28 border-t border-dashed border-outline-variant/50"></div>
            <div class="absolute inset-x-0 top-44 border-t border-dashed border-outline-variant/50"></div>

            @if (isLoading()) {
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-on-surface-variant text-sm font-bold flex items-center gap-2">
                  <span class="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                  Cargando datos de ArgentinaDatos API...
                </span>
              </div>
            } @else {
              @for (item of chartData(); track item.mes; let last = $last) {
                <div class="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                  <div class="flex items-end justify-center w-full gap-1 h-[85%]">
                    <div class="w-full max-w-[20px] bg-blue-500 rounded-t-md transition-all group-hover:opacity-80 chart-bar" [style.--target-height]="item.nominalValue + '%'" [title]="'Nominal: ' + item.nominalLabel"></div>
                    <div class="w-full max-w-[20px] bg-red-400 rounded-t-md transition-all group-hover:opacity-80 chart-bar" [style.--target-height]="item.realValue + '%'" [title]="'Real: ' + item.realLabel"></div>
                  </div>
                  <span class="font-label-md text-xs font-semibold" [ngClass]="last ? 'text-primary font-black' : 'text-on-surface-variant'">{{item.mes}}</span>
                </div>
              }
            }
          </div>
          
          @if (alertaImpacto(); as alerta) {
            <div class="mt-4 p-3 rounded-xl flex items-start gap-2" [ngClass]="alerta.positivo ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400'">
              <span class="material-symbols-outlined text-sm mt-0.5 shrink-0">{{ alerta.positivo ? 'check_circle' : 'warning' }}</span>
              <p class="text-xs"><strong>Alerta:</strong> {{ alerta.mensaje }}</p>
            </div>
          }
        </section>

        <!-- Breakdown Section: Distribution by Branch -->
        <section class="space-y-md">
          <h3 class="font-headline-sm text-headline-sm text-on-surface px-1 font-bold">Distribución por Ramo</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
            <!-- Auto -->
            <div class="bg-surface-container-lowest border-l-4 border-primary rounded-xl border border-outline-variant p-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary">directions_car</span>
                </div>
                <div>
                  <p class="font-body-md font-bold text-on-surface">Automotor (Rama 5)</p>
                  <p class="font-label-md text-on-surface-variant">62.0% (178 pólizas)</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-headline-sm font-extrabold text-on-surface">$11.48M</p>
              </div>
            </div>
            <!-- Hogar -->
            <div class="bg-surface-container-lowest border-l-4 border-secondary-fixed-dim rounded-xl border border-outline-variant p-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-secondary">home</span>
                </div>
                <div>
                  <p class="font-body-md font-bold text-on-surface">Combinado Familiar (Rama 14)</p>
                  <p class="font-label-md text-on-surface-variant">22.0% (68 pólizas)</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-headline-sm font-extrabold text-on-surface">$4.06M</p>
              </div>
            </div>
            <!-- Motos -->
            <div class="bg-surface-container-lowest border-l-4 border-tertiary rounded-xl border border-outline-variant p-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center">
                  <span class="material-symbols-outlined text-tertiary">two_wheeler</span>
                </div>
                <div>
                  <p class="font-body-md font-bold text-on-surface">Motovehículos & Movilidad (Rama 35)</p>
                  <p class="font-label-md text-on-surface-variant">10.0% (42 pólizas)</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-headline-sm font-extrabold text-on-surface">$1.89M</p>
              </div>
            </div>
            <!-- AP / Vida -->
            <div class="bg-surface-container-lowest border-l-4 border-outline rounded-xl border border-outline-variant p-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div class="flex items-center gap-md">
                <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-outline">favorite</span>
                </div>
                <div>
                  <p class="font-body-md font-bold text-on-surface">Accidentes Personales / Vida (Rama 18)</p>
                  <p class="font-label-md text-on-surface-variant">6.0% (24 pólizas)</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-headline-sm font-extrabold text-on-surface">$1.03M</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Recent Movements Section -->
        <section class="space-y-md">
          <div class="flex justify-between items-center px-1">
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Movimientos Recientes de Cartera</h3>
            <button class="font-label-md text-primary font-bold hover:underline cursor-pointer">Ver todo</button>
          </div>
          <div class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <!-- Movement 1 -->
            <div class="flex items-center p-md border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                BA
              </div>
              <div class="ml-md flex-1">
                <p class="font-body-md font-bold text-on-surface">BAHAMONDE JOSE ANTONIO</p>
                <p class="font-body-sm text-on-surface-variant text-xs">Póliza Mercantil Andina #5-894210-242193 • Automotor (Peugeot 208)</p>
              </div>
              <div class="text-right">
                <p class="font-body-md font-bold text-primary">+$64.500</p>
                <span class="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase border border-emerald-500/20">Vigente</span>
              </div>
            </div>
            <!-- Movement 2 -->
            <div class="flex items-center p-md border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-500/20">
                PR
              </div>
              <div class="ml-md flex-1">
                <p class="font-body-md font-bold text-on-surface">PEREZ CLAUDIA ROSANA</p>
                <p class="font-body-sm text-on-surface-variant text-xs">Póliza Cooperación Seguros #20027144800 • Combinado Familiar (Hogar)</p>
              </div>
              <div class="text-right">
                <p class="font-body-md font-bold text-amber-600">+$28.900</p>
                <span class="inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase border border-amber-500/20">Vigente</span>
              </div>
            </div>
            <!-- Movement 3 -->
            <div class="flex items-center p-md hover:bg-surface-container-low transition-colors cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                PR
              </div>
              <div class="ml-md flex-1">
                <p class="font-body-md font-bold text-on-surface">PEREZ DANIEL HORACIO</p>
                <p class="font-body-sm text-on-surface-variant text-xs">Póliza Mercantil Andina #5-302194-950723 • Automotor (Toyota Hilux)</p>
              </div>
              <div class="text-right">
                <p class="font-body-md font-bold text-primary">+$64.500</p>
                <span class="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase border border-emerald-500/20">Vigente</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
`,
  styles: [`
    /* Chart bar animations */
    @keyframes growUp {
        from { height: 0; }
        to { height: var(--target-height); }
    }
    .chart-bar {
        animation: growUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
`]
})
export class PremioAdministradoComponent implements OnInit {
  meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
  nominalData = [1.2, 1.44, 1.8, 2.1, 2.25, 2.7]; // Mock de montos nominales en Millones
  
  chartData = signal<ChartData[]>([]);
  isLoading = signal(true);
  alertaImpacto = signal<{positivo: boolean, mensaje: string} | null>(null);

  ipcActual = signal<ArglyIPCResponse | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Consultar IPC a Argly
    this.http.get<ArglyIPCResponse>('https://api.argly.com.ar/v1/ipc').subscribe({
      next: (res) => {
        if (res && res.data) {
          this.ipcActual.set(res);
        }
      },
      error: (err) => console.error("Error fetching IPC from Argly", err)
    });

    // Consultar API de ArgentinaDatos para índices de inflación
    this.http.get<IndiceInflacion[]>('https://api.argentinadatos.com/v1/finanzas/indices/inflacion')
      .subscribe({
        next: (data) => {
          // Tomar los últimos 6 meses de inflación disponibles
          const ultimos6 = data.slice(-6); 
          
          let acumulada = 1;
          const chartItems: ChartData[] = [];
          
          for (let i = 0; i < 6; i++) {
            const nominal = this.nominalData[i];
            const inflacionMes = ultimos6[i]?.valor || 0; // fallback a 0 si no hay
            
            // Inflación acumulada (1 + inf/100)
            acumulada *= (1 + (inflacionMes / 100));
            const real = nominal / acumulada;
            
            // Para la altura visual en %, tomamos 3.0M como tope
            const maxVal = 3.0;
            const nominalHeight = (nominal / maxVal) * 100;
            const realHeight = (real / maxVal) * 100;
            
            chartItems.push({
              mes: this.meses[i],
              nominalLabel: `$${nominal.toFixed(2)}M`,
              realLabel: `$${real.toFixed(2)}M`,
              nominalValue: nominalHeight,
              realValue: realHeight
            });
          }
          
          this.chartData.set(chartItems);
          
          // Calcular alertas de inflación basadas en los datos reales procesados
          const primerReal = chartItems[0].realValue;
          const ultimoReal = chartItems[5].realValue;
          const difReal = ((ultimoReal - primerReal) / primerReal) * 100;
          
          const primerNominal = chartItems[0].nominalValue;
          const ultimoNominal = chartItems[5].nominalValue;
          const difNominal = ((ultimoNominal - primerNominal) / primerNominal) * 100;

          if (difReal < 0) {
            this.alertaImpacto.set({
              positivo: false,
              mensaje: `Aunque la cobranza nominal aumentó un ${difNominal.toFixed(1)}% semestral, descontando la inflación real de ArgentinaDatos, la cartera se contrajo un ${Math.abs(difReal).toFixed(1)}%.`
            });
          } else {
            this.alertaImpacto.set({
              positivo: true,
              mensaje: `La cobranza nominal aumentó un ${difNominal.toFixed(1)}% semestral, superando la inflación real de ArgentinaDatos, logrando un crecimiento real del ${difReal.toFixed(1)}%.`
            });
          }
          
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error("Error al obtener la inflación de ArgentinaDatos", err);
          this.isLoading.set(false);
          // Fallback en caso de error de red
          this.alertaImpacto.set({
            positivo: false,
            mensaje: 'No se pudo conectar a la API de ArgentinaDatos para obtener la inflación.'
          });
        }
      });
  }
}
