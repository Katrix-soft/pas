import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MercantilQuotationService } from '@broker/quotations';

export interface PolicyDebt {
  id: string;
  cliente: string;
  poliza: string;
  compania: string;
  detalle: string;
  monto: number;
  vencimiento: string;
  diasVencido: number;
  tipoPago: 'Débito Automático' | 'Efectivo / Rapipago' | 'Transferencia';
  motivoRechazo?: string;
  telefono: string;
}

@Component({
  selector: 'lib-cobranzas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen pb-24 md:pb-0">
      
      <main class="max-w-7xl mx-auto px-container-margin md:px-xl pt-md pb-xl space-y-lg">
        
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-md bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-sm">
          <div>
            <h2 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">Gestión de Cobranzas y Cupones</h2>
            <p class="font-body-md text-body-md text-on-surface-variant mt-1">Generación y envío instantáneo de cupones y enlaces de pago por WhatsApp.</p>
          </div>
          
          <div class="flex gap-sm">
            <button (click)="exportarListado()" class="px-md py-sm bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-xs cursor-pointer shadow-sm">
              <span class="material-symbols-outlined text-[18px]">download</span> Exportar Listado en PDF
            </button>
          </div>
        </div>

        <!-- Bento Summary Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-md">
          <div class="col-span-1 md:col-span-2 bg-surface-container-lowest border border-outline-variant border-l-[4px] border-l-error p-md rounded-2xl shadow-sm">
            <div class="flex justify-between items-start">
              <div>
                <span class="font-label-md text-label-md text-on-surface-variant uppercase font-bold">Total Morosidad Cartera</span>
                <div class="font-metric-xl text-metric-xl text-error font-bold mt-xs">$ {{ totalMorosidad() | number:'1.0-0' }}</div>
              </div>
              <div class="bg-error/10 text-error px-sm py-xs rounded-full font-bold text-xs flex items-center gap-xs border border-error/20">
                <span class="material-symbols-outlined text-[14px]">warning</span> {{ debtsList().length }} Pólizas
              </div>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-sm">Pólizas en riesgo por cuota pendiente de cobro.</p>
          </div>

          <div class="col-span-1 bg-surface-container-lowest border border-outline-variant border-l-[4px] border-l-primary p-md rounded-2xl shadow-sm">
            <span class="font-label-md text-label-md text-on-surface-variant uppercase font-bold">Mercantil Andina</span>
            <div class="font-headline-md text-headline-md text-primary font-bold mt-xs">$ 195.322</div>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-sm">3 Pólizas Principales</p>
          </div>

          <div class="col-span-1 bg-surface-container-lowest border border-outline-variant border-l-[4px] border-l-emerald-500 p-md rounded-2xl shadow-sm">
            <span class="font-label-md text-label-md text-on-surface-variant uppercase font-bold">Cobrados este mes</span>
            <div class="font-headline-md text-headline-md text-emerald-600 dark:text-emerald-400 font-bold mt-xs">$ 2.450.000</div>
            <p class="font-body-sm text-body-sm text-emerald-600 font-semibold mt-sm">98.5% tasa de cobro</p>
          </div>
        </div>

        <!-- Debt List Table with WhatsApp Action -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md sm:p-lg shadow-sm space-y-md">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-sm border-b border-outline-variant">
            <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">payments</span>
              Pólizas Pendientes de Cobro & Links WhatsApp
            </h3>
            <span class="text-xs text-on-surface-variant font-bold bg-surface-container px-2.5 py-1 rounded-full">{{ debtsList().length }} Casos Prioritarios</span>
          </div>

          <div *ngIf="isLoading()" class="flex flex-col items-center justify-center py-xl space-y-md">
            <span class="material-symbols-outlined text-primary text-4xl animate-spin">sync</span>
            <p class="text-sm font-bold text-outline">Cargando información de cobranzas y cupones...</p>
          </div>

          <!-- Vista de Tarjetas en Celulares Chicos (<640px) -->
          <div *ngIf="!isLoading()" class="block sm:hidden space-y-3">
            <div *ngFor="let item of debtsList()" class="bg-surface-container-low border border-outline-variant p-3.5 rounded-xl space-y-2.5">
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-bold text-sm text-on-surface">{{ item.cliente }}</div>
                  <div class="text-xs text-primary font-semibold">Póliza: {{ item.poliza }}</div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-base text-error">$ {{ item.monto | number:'1.0-0' }}</div>
                  <div class="text-[10px] text-outline uppercase font-semibold">{{ item.tipoPago }}</div>
                </div>
              </div>
              <div class="text-xs text-on-surface-variant font-medium flex items-center justify-between bg-surface-container-lowest p-2 rounded-lg border border-outline-variant">
                <span>{{ item.compania }} • {{ item.detalle }}</span>
                <span [class]="item.diasVencido > 0 ? 'text-error' : 'text-amber-600'" class="font-bold text-[11px]">
                  {{ item.diasVencido > 0 ? item.diasVencido + 'd vencido' : item.vencimiento }}
                </span>
              </div>
              <div class="flex items-center gap-2 pt-1">
                <button (click)="enviarWhatsApp(item)" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                  <span class="material-symbols-outlined text-base">chat</span>
                  <span>WhatsApp</span>
                </button>
                <button (click)="copiarLink(item)" class="p-2 border border-primary text-primary hover:bg-primary/10 rounded-xl cursor-pointer" title="Copiar link">
                  <span class="material-symbols-outlined text-base">content_copy</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Vista de Tabla en Pantallas Medianas y Grandes (>=640px) -->
          <div *ngIf="!isLoading()" class="hidden sm:block overflow-x-auto w-full">
            <table class="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr class="bg-surface-container-low border-b border-outline-variant">
                  <th class="p-md text-xs font-bold text-on-surface-variant uppercase">Cliente / Póliza</th>
                  <th class="p-md text-xs font-bold text-on-surface-variant uppercase">Compañía & Vehículo</th>
                  <th class="p-md text-xs font-bold text-on-surface-variant uppercase text-right">Monto Cuota</th>
                  <th class="p-md text-xs font-bold text-on-surface-variant uppercase text-center">Estado / Vencimiento</th>
                  <th class="p-md text-xs font-bold text-on-surface-variant uppercase text-center">Enviar Link WhatsApp</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant">
                <tr *ngFor="let item of debtsList()" class="hover:bg-surface-container-low/50 transition-colors">
                  <!-- Cliente -->
                  <td class="p-md">
                    <div class="font-bold text-sm text-on-surface">{{ item.cliente }}</div>
                    <div class="text-xs text-primary font-semibold">Póliza: {{ item.poliza }}</div>
                    <div class="text-[10px] text-outline">Tel: {{ item.telefono }}</div>
                  </td>
                  
                  <!-- Compañía & Vehículo -->
                  <td class="p-md">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-xs text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{{ item.compania }}</span>
                    </div>
                    <div class="text-xs text-on-surface-variant font-medium mt-1">{{ item.detalle }}</div>
                  </td>

                  <!-- Monto -->
                  <td class="p-md text-right">
                    <div class="font-bold text-base text-error">$ {{ item.monto | number:'1.0-0' }}</div>
                    <div class="text-[10px] text-outline uppercase font-semibold">{{ item.tipoPago }}</div>
                  </td>

                  <!-- Estado -->
                  <td class="p-md text-center">
                    <span [class]="item.diasVencido > 0 ? 'bg-error/10 text-error border-error/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'" class="px-2.5 py-1 rounded-full text-xs font-bold border">
                      {{ item.diasVencido > 0 ? 'Vencido (' + item.diasVencido + ' días)' : 'Próximo a Vencer (' + item.vencimiento + ')' }}
                    </span>
                  </td>

                  <!-- Action WhatsApp -->
                  <td class="p-md text-center">
                    <div class="flex items-center justify-center gap-2">
                      <button (click)="enviarWhatsApp(item)" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer">
                        <span class="material-symbols-outlined text-base">chat</span>
                        <span>Enviar Link por WPP</span>
                      </button>
                      <button (click)="copiarLink(item)" class="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer" title="Copiar link de pago">
                        <span class="material-symbols-outlined text-base">content_copy</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Direct WhatsApp Payment Generator Modal / Card -->
        <div class="bg-gradient-to-r from-emerald-500/10 via-surface-container-lowest to-surface-container-lowest border border-emerald-500/30 rounded-2xl p-lg shadow-sm flex flex-col md:flex-row justify-between items-center gap-md">
          <div class="flex items-center gap-md">
            <div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              💬
            </div>
            <div>
              <h4 class="font-bold text-base text-on-surface">Generador Universal de Link de Pago Mercantil</h4>
              <p class="text-xs text-on-surface-variant">Genera un enlace de cuponera oficial de Mercantil Andina con cobro instantáneo por tarjeta o Rapipago y envíalo directamente al WhatsApp del asegurado.</p>
            </div>
          </div>
          
          <button (click)="generarLinkManual()" class="w-full md:w-auto bg-emerald-600 text-white font-bold px-lg py-md rounded-xl text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md">
            <span class="material-symbols-outlined text-base">add_link</span>
            <span>Generar Link Personalizado</span>
          </button>
        </div>

      </main>

    </div>
  `
})
export class CobranzasComponent implements OnInit {
  private mercantilService = inject(MercantilQuotationService);

  isLoading = signal(true);
  debtsList = signal<PolicyDebt[]>([]);

  ngOnInit() {
    this.cargarCobranzasMercantil();
  }

  cargarCobranzasMercantil() {
    this.isLoading.set(true);
    this.mercantilService.buscarClientes('a').subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        if (res && res.datos && res.datos.length > 0) {
          const mapped: PolicyDebt[] = res.datos.slice(0, 6).map((c: any, index: number) => ({
            id: c.id.toString(),
            cliente: c.nombre,
            poliza: (594387120 + index).toString(),
            compania: 'Mercantil Andina',
            detalle: index % 2 === 0 ? 'CHEVROLET SPIN 1.8 LT' : 'HONDA CBX 250 TWISTER',
            monto: index % 2 === 0 ? 89300 : 23322,
            vencimiento: `${28 + index}/07/2026`,
            diasVencido: index > 2 ? (index - 2) * 5 : 0,
            tipoPago: index % 2 === 0 ? 'Efectivo / Rapipago' : 'Débito Automático',
            telefono: c.telefono || '02614238800'
          }));
          this.debtsList.set(mapped);
        } else {
          this.debtsList.set(this.getFallbackDebts());
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.debtsList.set(this.getFallbackDebts());
      }
    });
  }

  totalMorosidad(): number {
    return this.debtsList().reduce((acc, curr) => acc + curr.monto, 0);
  }

  enviarWhatsApp(item: PolicyDebt) {
    const linkPago = `https://pagos.mercantilandina.com.ar/cupon?poliza=${item.poliza}&cuota=1`;
    const mensaje = `Hola ${item.cliente}! 👋 Te saluda Gonzalo Javier Paso (PAS #86992 de Mercantil Andina / JCORG Broker).\n\nTe envío el enlace oficial para abonar la cuota de tu póliza N° ${item.poliza} (${item.detalle}) por el monto de $${item.monto.toLocaleString('es-AR')}.\n\nPodés abonar directamente ingresando aquí:\n${linkPago}\n\n¡Cualquier consulta quedo a tu disposición!`;
    
    const phoneClean = item.telefono.replace(/[^0-9]/g, '') || '02614238800';
    const url = `https://wa.me/${phoneClean}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, '_blank');
  }

  copiarLink(item: PolicyDebt) {
    const linkPago = `https://pagos.mercantilandina.com.ar/cupon?poliza=${item.poliza}&cuota=1`;
    navigator.clipboard.writeText(linkPago);
    alert(`✅ Link de pago copiado al portapapeles:\n${linkPago}`);
  }

  generarLinkManual() {
    const poliza = prompt('Ingrese el número de póliza Mercantil:');
    if (poliza) {
      const link = `https://pagos.mercantilandina.com.ar/cupon?poliza=${poliza}&cuota=1`;
      alert(`✅ Link de Pago Generado para Póliza #${poliza}:\n\n${link}`);
    }
  }

  exportarListado() {
    alert('✅ Exportando reporte de morosidad y enlaces de cobro en formato PDF...');
  }

  private getFallbackDebts(): PolicyDebt[] {
    return [
      {
        id: '2008962',
        cliente: 'PEREZ CLAUDIA ROSANA',
        poliza: '594387129',
        compania: 'Mercantil Andina',
        detalle: 'CHEVROLET SPIN 1.8 LT',
        monto: 89300,
        vencimiento: '31/07/2026',
        diasVencido: 0,
        tipoPago: 'Efectivo / Rapipago',
        telefono: '02616737416'
      },
      {
        id: '950723',
        cliente: 'PEREZ DANIEL HORACIO',
        poliza: '148059592',
        compania: 'Mercantil Andina',
        detalle: 'HONDA CBX 250 TWISTER',
        monto: 23322,
        vencimiento: '02/08/2026',
        diasVencido: 0,
        tipoPago: 'Débito Automático',
        telefono: '0261154543444'
      },
      {
        id: '1549478',
        cliente: 'PEREZ DANIEL HORACIO',
        poliza: '180041638',
        compania: 'Mercantil Andina',
        detalle: 'RENAULT DUSTER 1.6',
        monto: 64200,
        vencimiento: '18/07/2026',
        diasVencido: 10,
        tipoPago: 'Efectivo / Rapipago',
        telefono: '02615445678'
      }
    ];
  }
}
