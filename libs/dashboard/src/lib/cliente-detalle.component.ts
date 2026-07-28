import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-cliente-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-background text-on-background min-h-screen pb-24 md:pb-0">

      <!-- Top App Bar -->
      <header class="w-full top-0 sticky z-40 bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center px-container-margin h-16 shadow-xs">
        <div class="flex items-center gap-md">
          <button routerLink="/clientes" class="p-2 hover:bg-surface-container-high transition-colors rounded-full active:scale-95 duration-150 cursor-pointer">
            <span class="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <div>
            <h2 class="font-bold text-lg text-on-surface leading-tight">Ficha del Asegurado</h2>
            <p class="text-xs text-outline font-semibold">Mercantil Andina • Productor #86992</p>
          </div>
        </div>
      </header>

      <main class="p-md md:p-xl max-w-5xl mx-auto space-y-lg pt-md">
        
        <!-- Profile Banner Section -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg flex flex-col md:flex-row items-center md:items-start gap-lg shadow-sm">
          <div class="w-20 h-20 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-black text-2xl shadow-sm">
            {{ clienteNombre.charAt(0) }}
          </div>
          
          <div class="flex-1 text-center md:text-left space-y-1">
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h3 class="font-bold text-2xl text-on-surface">{{ clienteNombre }}</h3>
              <span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-500/20 uppercase">
                ACTIVO
              </span>
            </div>
            
            <p class="text-sm text-outline font-medium">ID Mercantil: #{{ clienteId }} • Persona {{ clientePersona }}</p>
            <p class="text-xs text-on-surface-variant flex items-center justify-center md:justify-start gap-1 mt-1">
              <span class="material-symbols-outlined text-sm text-primary">location_on</span>
              <span class="font-semibold">{{ clienteDireccion }}, {{ clienteLocalidad }}</span>
            </p>

            <!-- Actions Bar -->
            <div class="flex flex-wrap justify-center md:justify-start gap-sm pt-sm mt-md border-t border-outline-variant">
              <button (click)="llamar()" class="flex items-center gap-xs px-md py-sm bg-primary text-on-primary rounded-xl font-bold text-xs hover:bg-primary-container transition-all cursor-pointer shadow-xs">
                <span class="material-symbols-outlined text-sm">call</span>
                <span>Llamar: {{ clienteTelefono }}</span>
              </button>

              <button (click)="contactarWhatsApp()" class="flex items-center gap-xs px-md py-sm bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all cursor-pointer shadow-xs">
                <span class="material-symbols-outlined text-sm">chat</span>
                <span>WhatsApp</span>
              </button>

              <button routerLink="/asistente" class="flex items-center gap-xs px-md py-sm border border-primary text-primary rounded-xl font-bold text-xs hover:bg-primary/10 transition-all cursor-pointer">
                <span class="material-symbols-outlined text-sm">add_circle</span>
                <span>Nueva Cotización</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Policies Section -->
        <section class="space-y-md">
          <div class="flex justify-between items-center px-xs">
            <h4 class="font-bold text-lg text-on-surface">Pólizas Vigentes en Mercantil Andina</h4>
            <span class="text-xs text-outline font-bold">{{ clientePolizasCount }} Pólizas Vinculadas</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
            
            <!-- Policy 1: Automotor -->
            <div class="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary rounded-2xl overflow-hidden shadow-sm p-md space-y-md">
              <div class="flex justify-between items-start border-b border-outline-variant pb-sm">
                <div>
                  <span class="text-xs font-bold text-primary uppercase">Automotor (Rama 5)</span>
                  <h5 class="font-bold text-base text-on-surface">Póliza N° 594387129</h5>
                </div>
                <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-500/20">VIGENTE</span>
              </div>
              
              <div class="grid grid-cols-2 gap-sm text-xs">
                <div class="p-xs bg-surface-container-low rounded-lg">
                  <p class="text-[10px] text-outline font-bold uppercase">VEHÍCULO</p>
                  <p class="font-bold text-on-surface">CHEVROLET SPIN 1.8 LT</p>
                </div>
                <div class="p-xs bg-surface-container-low rounded-lg">
                  <p class="text-[10px] text-outline font-bold uppercase">SUMA ASEGURADA</p>
                  <p class="font-bold text-on-surface">$ 18.500.000</p>
                </div>
                <div class="p-xs bg-surface-container-low rounded-lg">
                  <p class="text-[10px] text-outline font-bold uppercase">PREMIO MENSUAL</p>
                  <p class="font-bold text-primary">$ 89.300</p>
                </div>
                <div class="p-xs bg-surface-container-low rounded-lg">
                  <p class="text-[10px] text-outline font-bold uppercase">VENCIMIENTO</p>
                  <p class="font-bold text-on-surface">31 Jul, 2026</p>
                </div>
              </div>

              <div class="flex gap-2 pt-xs">
                <button (click)="enviarCupon()" class="flex-1 bg-emerald-600 text-white py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                  <span class="material-symbols-outlined text-sm">chat</span>
                  <span>Enviar Cupón WPP</span>
                </button>
                <button routerLink="/endoso" class="px-3 py-1.5 border border-primary text-primary rounded-xl text-xs font-bold">
                  Solicitar Endoso
                </button>
              </div>
            </div>

            <!-- Policy 2: Combinado Familiar -->
            <div *ngIf="clientePolizasCount > 1" class="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-indigo-600 rounded-2xl overflow-hidden shadow-sm p-md space-y-md">
              <div class="flex justify-between items-start border-b border-outline-variant pb-sm">
                <div>
                  <span class="text-xs font-bold text-indigo-600 uppercase">Combinado Familiar (Rama 14)</span>
                  <h5 class="font-bold text-base text-on-surface">Póliza N° 148059592</h5>
                </div>
                <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-500/20">VIGENTE</span>
              </div>
              
              <div class="grid grid-cols-2 gap-sm text-xs">
                <div class="p-xs bg-surface-container-low rounded-lg">
                  <p class="text-[10px] text-outline font-bold uppercase">COBERTURA</p>
                  <p class="font-bold text-on-surface">Hogar Premium + Incendio</p>
                </div>
                <div class="p-xs bg-surface-container-low rounded-lg">
                  <p class="text-[10px] text-outline font-bold uppercase">SUMA ASEGURADA</p>
                  <p class="font-bold text-on-surface">$ 45.000.000</p>
                </div>
                <div class="p-xs bg-surface-container-low rounded-lg">
                  <p class="text-[10px] text-outline font-bold uppercase">PREMIO MENSUAL</p>
                  <p class="font-bold text-primary">$ 23.322</p>
                </div>
                <div class="p-xs bg-surface-container-low rounded-lg">
                  <p class="text-[10px] text-outline font-bold uppercase">VENCIMIENTO</p>
                  <p class="font-bold text-on-surface">15 Ago, 2026</p>
                </div>
              </div>

              <div class="flex gap-2 pt-xs">
                <button (click)="enviarCupon()" class="flex-1 bg-emerald-600 text-white py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                  <span class="material-symbols-outlined text-sm">chat</span>
                  <span>Enviar Cupón WPP</span>
                </button>
                <button routerLink="/endoso" class="px-3 py-1.5 border border-primary text-primary rounded-xl text-xs font-bold">
                  Solicitar Endoso
                </button>
              </div>
            </div>

          </div>
        </section>

        <!-- Timeline Section -->
        <section class="space-y-md">
          <h4 class="font-bold text-lg text-on-surface px-xs">Historial de Operaciones</h4>
          <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm">
            <div class="space-y-lg relative">
              <div class="absolute left-[11px] top-2 bottom-2 w-0.5 bg-outline-variant"></div>
              
              <div class="flex gap-md relative">
                <div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center z-10 text-xs font-bold">
                  ✓
                </div>
                <div>
                  <p class="font-bold text-sm text-on-surface">Póliza Emitida / Renovada</p>
                  <p class="text-xs text-on-surface-variant">Automotor (Rama 5) - Mercantil Andina</p>
                  <p class="text-[10px] text-outline font-bold uppercase mt-0.5">Hace 2 días</p>
                </div>
              </div>

              <div class="flex gap-md relative">
                <div class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center z-10 text-xs font-bold">
                  💬
                </div>
                <div>
                  <p class="font-bold text-sm text-on-surface">Envío de Enlace de Pago por WhatsApp</p>
                  <p class="text-xs text-on-surface-variant">Enlace oficial de cuponera Mercantil enviado al asegurado.</p>
                  <p class="text-[10px] text-outline font-bold uppercase mt-0.5">25 Jul, 2026</p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

    </div>
  `
})
export class ClienteDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);

  clienteNombre = 'Alejandro Morales';
  clienteId = '2008962';
  clienteDireccion = 'Aristobulo Del Valle 2645';
  clienteLocalidad = 'Mendoza';
  clienteTelefono = '0261 423-8800';
  clientePersona = 'FISICA';
  clientePolizasCount = 1;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['nombre']) this.clienteNombre = params['nombre'];
      if (params['id']) this.clienteId = params['id'];
      if (params['direccion']) this.clienteDireccion = params['direccion'];
      if (params['localidad']) this.clienteLocalidad = params['localidad'];
      if (params['telefono']) this.clienteTelefono = params['telefono'];
      if (params['persona']) this.clientePersona = params['persona'];
      if (params['polizas']) this.clientePolizasCount = parseInt(params['polizas']) || 1;
    });
  }

  llamar() {
    window.open(`tel:${this.clienteTelefono.replace(/[^0-9]/g, '')}`);
  }

  contactarWhatsApp() {
    const msg = `Hola ${this.clienteNombre}! 👋 Te saluda Gonzalo Javier Paso (PAS #86992 de Mercantil Andina). ¿En qué te podemos ayudar hoy?`;
    window.open(`https://wa.me/${this.clienteTelefono.replace(/[^0-9]/g, '') || '02614238800'}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  enviarCupon() {
    const link = `https://pagos.mercantilandina.com.ar/cupon?poliza=594387129&cuota=1`;
    const msg = `Hola ${this.clienteNombre}! 👋 Te adjunto el enlace oficial de Mercantil Andina para abonar tu cuota:\n${link}`;
    window.open(`https://wa.me/${this.clienteTelefono.replace(/[^0-9]/g, '') || '02614238800'}?text=${encodeURIComponent(msg)}`, '_blank');
  }
}
