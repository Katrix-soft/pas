import { Component, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MercantilQuotationService } from '../../../quotations/src/lib/services/mercantil-quotation.service';
import { MercantilVehiculo, MercantilCotizacionResponse } from '../../../quotations/src/lib/models/mercantil-quotation.model';

@Component({
  selector: 'lib-asistente-ia',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-hidden relative">
      <!-- TopAppBar -->
      <header class="w-full top-0 sticky bg-surface-bright border-b border-outline-variant z-50">
        <div class="flex justify-between items-center px-md py-sm w-full h-16">
          <div class="flex items-center gap-sm">
            <button routerLink="/dashboard" class="material-symbols-outlined text-primary cursor-pointer hover:bg-surface-container-low p-1 rounded-full transition-colors mr-2">arrow_back</button>
            <span class="material-symbols-outlined text-primary text-headline-sm" style="font-variation-settings: 'FILL' 1;">shield</span>
            <h1 class="font-headline-sm text-headline-sm text-on-surface">Asistente IA - Multicotizador</h1>
          </div>
          <div class="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
            <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZa8N-Zk4YlQzlKNkvQyanEC-0RaPJ8J2Ez4_Irf3aWslWqCh_wHtOEGzceCBhUVoaL7SJodIYQP_KzE9pDahzTJbZ6MJ-ZYRfVYUMoI8cD_mTKlRdV3_oNzvMEZnfrCGwgI67vIVbQGvCop5dlAuKk4_-uwSpkyGbogk4JWTX1WuLcO7f1J_C_RmSbjgq2eP2qPgmokGXim6RxHyqrJwm8OW02kH964Qoi9kIMlw-x_BYzXCrnsgJLQ"/>
          </div>
        </div>
      </header>

      <!-- Chat Content -->
      <main class="flex-1 overflow-y-auto chat-container px-container-margin py-md">
        <!-- Message Cluster -->
        <div class="flex flex-col gap-lg max-w-lg mx-auto pb-48">
          <!-- Initial Form Message (Step 1: Año) -->
          <div class="flex flex-col items-start gap-xs chat-msg">
            <div class="bg-surface text-on-surface p-md rounded-xl shadow-sm max-w-[90%] border border-outline-variant w-full">
              <h3 class="font-body-lg text-on-surface mb-md">Hola, ingresá los datos de tu auto</h3>
              
              <div class="flex flex-col gap-1 w-full">
                <div class="relative">
                  <select [(ngModel)]="selectedYear" (change)="errors[1] = false" class="w-full appearance-none bg-transparent border text-on-surface rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-1" [ngClass]="errors[1] ? 'border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'">
                    <option value="" disabled selected>Año del auto</option>
                    <option *ngFor="let year of years" [value]="year">{{year}}</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3" [ngClass]="errors[1] ? 'text-error' : 'text-on-surface-variant'">
                    <span class="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                <span *ngIf="errors[1]" class="text-error text-[11px] ml-1">Este campo es requerido</span>
                
                <button *ngIf="currentStep === 1" (click)="nextStep(1)" class="mt-3 bg-surface-container hover:bg-surface-container-high text-on-surface py-2 px-8 rounded-full font-label-lg transition-colors self-start cursor-pointer">
                  Continuar
                </button>
              </div>
            </div>
            <span class="text-[10px] text-on-surface-variant font-label-md px-xs">11:14 AM</span>
          </div>

          <!-- Step 2: Marca -->
          <div *ngIf="currentStep >= 2" class="flex flex-col items-start gap-xs chat-msg">
            <div class="bg-surface text-on-surface p-md rounded-xl shadow-sm max-w-[90%] border border-outline-variant w-full">
              <h3 class="font-body-lg text-on-surface mb-md">Seleccioná la marca</h3>
              
              <div class="flex flex-col gap-1 w-full">
                <div class="relative">
                  <select [(ngModel)]="selectedBrand" (change)="errors[2] = false" class="w-full appearance-none bg-transparent border text-on-surface rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-1" [ngClass]="errors[2] ? 'border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'">
                    <option value="" disabled selected>Marca del auto</option>
                    <option *ngFor="let brand of brands" [value]="brand">{{brand}}</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3" [ngClass]="errors[2] ? 'text-error' : 'text-on-surface-variant'">
                    <span class="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                <span *ngIf="errors[2]" class="text-error text-[11px] ml-1">Este campo es requerido</span>
                
                <button *ngIf="currentStep === 2" (click)="nextStep(2)" class="mt-3 bg-surface-container hover:bg-surface-container-high text-on-surface py-2 px-8 rounded-full font-label-lg transition-colors self-start cursor-pointer">
                  Continuar
                </button>
              </div>
            </div>
            <span class="text-[10px] text-on-surface-variant font-label-md px-xs">11:14 AM</span>
          </div>

          <!-- Step 3: Modelo -->
          <div *ngIf="currentStep >= 3" class="flex flex-col items-start gap-xs chat-msg">
            <div class="bg-surface text-on-surface p-md rounded-xl shadow-sm max-w-[90%] border border-outline-variant w-full">
              <h3 class="font-body-lg text-on-surface mb-md">Seleccioná el modelo</h3>
              
              <div class="flex flex-col gap-1 w-full">
                <div class="relative">
                  <select [(ngModel)]="selectedModel" (change)="errors[3] = false" class="w-full appearance-none bg-transparent border text-on-surface rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-1" [ngClass]="errors[3] ? 'border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'">
                    <option value="" disabled selected>Modelo del auto</option>
                    <option *ngFor="let model of models" [value]="model">{{model}}</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3" [ngClass]="errors[3] ? 'text-error' : 'text-on-surface-variant'">
                    <span class="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                <span *ngIf="errors[3]" class="text-error text-[11px] ml-1">Este campo es requerido</span>
                
                <button *ngIf="currentStep === 3" (click)="nextStep(3)" class="mt-3 bg-surface-container hover:bg-surface-container-high text-on-surface py-2 px-8 rounded-full font-label-lg transition-colors self-start cursor-pointer">
                  Continuar
                </button>
              </div>
            </div>
            <span class="text-[10px] text-on-surface-variant font-label-md px-xs">11:15 AM</span>
          </div>

          <!-- Step 4: Versión -->
          <div *ngIf="currentStep >= 4" class="flex flex-col items-start gap-xs chat-msg">
            <div class="bg-surface text-on-surface p-md rounded-xl shadow-sm max-w-[90%] border border-outline-variant w-full">
              <h3 class="font-body-lg text-on-surface mb-md">Seleccioná la versión</h3>
              
              <div class="flex flex-col gap-1 w-full">
                <div class="relative">
                  <select [(ngModel)]="selectedVersionObj" (change)="errors[4] = false" class="w-full appearance-none bg-transparent border text-on-surface rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-1" [ngClass]="errors[4] ? 'border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'">
                    <option [ngValue]="null" disabled selected>Versión del auto</option>
                    <option *ngFor="let version of versions" [ngValue]="version">{{version.desc}}</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3" [ngClass]="errors[4] ? 'text-error' : 'text-on-surface-variant'">
                    <span class="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                <span *ngIf="errors[4]" class="text-error text-[11px] ml-1">Este campo es requerido</span>
                
                <button *ngIf="currentStep === 4" (click)="nextStep(4)" class="mt-3 bg-surface-container hover:bg-surface-container-high text-on-surface py-2 px-8 rounded-full font-label-lg transition-colors self-start cursor-pointer">
                  Continuar
                </button>
              </div>
            </div>
            <span class="text-[10px] text-on-surface-variant font-label-md px-xs">11:15 AM</span>
          </div>

          <!-- Step 5: Accesorios -->
          <div *ngIf="currentStep >= 5" class="flex flex-col items-start gap-xs chat-msg">
            <div class="bg-surface text-on-surface p-md rounded-xl shadow-sm max-w-[90%] border border-outline-variant w-full">
              
              <div class="flex flex-col gap-4 w-full">
                
                <!-- GNC Checkbox -->
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" class="w-5 h-5 rounded border-outline-variant accent-primary cursor-pointer">
                  <span class="font-body-md text-on-surface">Tiene GNC</span>
                </label>

                <!-- Rastreador Checkbox -->
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" [checked]="hasTracker" (change)="hasTracker = !hasTracker" class="w-5 h-5 rounded border-outline-variant accent-green-600 cursor-pointer">
                  <span class="font-body-md text-on-surface">Tiene rastreador satelital</span>
                </label>

                <!-- Rastreador Select -->
                <div *ngIf="hasTracker" class="relative mt-2">
                  <label class="absolute -top-2 left-3 bg-surface px-1 text-[12px] text-on-surface-variant z-10">Prestador</label>
                  <select [(ngModel)]="selectedTracker" (change)="errors[5] = false" class="w-full appearance-none bg-transparent border text-on-surface rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-1 relative z-0" [ngClass]="errors[5] ? 'border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'">
                    <option value="" disabled selected>Seleccione prestador</option>
                    <option *ngFor="let tracker of trackers" [value]="tracker">{{tracker}}</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 z-10" [ngClass]="errors[5] ? 'text-error' : 'text-on-surface-variant'">
                    <span class="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                <span *ngIf="errors[5]" class="text-error text-[11px] ml-1 -mt-2">Este campo es requerido</span>
                
                <button *ngIf="currentStep === 5" (click)="nextStep(5)" class="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-full font-label-lg transition-colors self-start cursor-pointer shadow-sm">
                  Continuar
                </button>
              </div>
            </div>
            <span class="text-[10px] text-on-surface-variant font-label-md px-xs">11:16 AM</span>
          </div>

          <!-- Step 6: Edad -->
          <div *ngIf="currentStep >= 6" class="flex flex-col items-start gap-xs chat-msg">
            <div class="bg-surface text-on-surface p-md rounded-xl shadow-sm max-w-[90%] border border-outline-variant w-full">
              <h3 class="font-body-lg text-on-surface mb-md">Ingresá tus datos</h3>
              
              <div class="flex flex-col gap-4 w-full">
                <div class="relative mt-2">
                  <label class="absolute -top-2 left-3 bg-surface px-1 text-[12px] text-on-surface-variant z-10">¿Qué edad tenés?</label>
                  <input type="number" [(ngModel)]="selectedAge" (input)="errors[6] = false" class="w-full bg-transparent border text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-1 relative z-0" [ngClass]="errors[6] ? 'border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'">
                </div>
                <span *ngIf="errors[6]" class="text-error text-[11px] ml-1 -mt-2">Este campo es requerido</span>
                
                <button *ngIf="currentStep === 6" (click)="nextStep(6)" class="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-full font-label-lg transition-colors self-start cursor-pointer shadow-sm">
                  Continuar
                </button>
              </div>
            </div>
            <span class="text-[10px] text-on-surface-variant font-label-md px-xs">11:17 AM</span>
          </div>

          <!-- Step 7: Localidad -->
          <div *ngIf="currentStep >= 7" class="flex flex-col items-start gap-xs chat-msg">
            <div class="bg-surface text-on-surface p-md rounded-xl shadow-sm max-w-[90%] border border-outline-variant w-full">
              <h3 class="font-body-lg text-on-surface mb-md">¿Dónde vivís?</h3>
              
              <div class="flex flex-col gap-4 w-full">
                <div class="relative mt-2">
                  <label class="absolute -top-2 left-3 bg-surface px-1 text-[12px] text-on-surface-variant z-10">Código postal/Localidad</label>
                  <select [(ngModel)]="selectedLoc" (change)="errors[7] = false" class="w-full appearance-none bg-transparent border text-on-surface rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-1 relative z-0" [ngClass]="errors[7] ? 'border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'">
                    <option value="" disabled selected>Seleccione localidad</option>
                    <option *ngFor="let loc of localidades" [value]="loc">{{loc}}</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 z-10" [ngClass]="errors[7] ? 'text-error' : 'text-on-surface-variant'">
                    <span class="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                <span *ngIf="errors[7]" class="text-error text-[11px] ml-1 -mt-2">Este campo es requerido</span>
                
                <button *ngIf="currentStep === 7" (click)="nextStep(7)" class="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-full font-label-lg transition-colors self-start cursor-pointer shadow-sm">
                  Continuar
                </button>
              </div>
            </div>
            <span class="text-[10px] text-on-surface-variant font-label-md px-xs">11:18 AM</span>
          </div>
          <!-- Step 8: Resultados de Cotización -->
          <div *ngIf="loadingQuotation || quotationResult || quotationError" class="flex flex-col items-start gap-xs chat-msg">
            <div class="bg-surface text-on-surface p-md rounded-xl shadow-sm max-w-[90%] border border-outline-variant w-full">
              <h3 class="font-body-lg text-on-surface mb-md">Cotización de Mercantil Andina</h3>
              
              <div *ngIf="loadingQuotation" class="flex items-center gap-3">
                <div class="spinner"></div>
                <span>Procesando cotización...</span>
              </div>

              <div *ngIf="quotationError" class="text-error bg-error-container p-3 rounded-lg text-sm">
                {{ quotationError }}
              </div>

              <div *ngIf="quotationResult && !loadingQuotation" class="flex flex-col gap-4">
                <div class="bg-primary-container text-on-primary-container p-4 rounded-xl">
                  <div class="text-xs uppercase tracking-wider mb-1 font-semibold">Total Premio</div>
                  <div class="text-2xl font-bold">$ {{ quotationResult.totalPrima | number:'1.2-2' }}</div>
                </div>

                <div class="flex flex-col gap-2">
                  <div class="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Coberturas Incluidas</div>
                  <div *ngFor="let cob of quotationResult.coberturas" class="text-sm py-1 border-b border-outline-variant last:border-0 flex justify-between">
                    <span>{{ cob.descripcion }}</span>
                  </div>
                </div>

                <button class="mt-4 bg-primary hover:bg-primary-dark text-on-primary py-2 px-8 rounded-full font-label-lg transition-colors cursor-pointer w-full text-center">
                  Emitir Póliza
                </button>
              </div>
            </div>
            <span class="text-[10px] text-on-surface-variant font-label-md px-xs">11:19 AM</span>
          </div>
        </div>
      </main>

    </div>
`,
  styles: [`
    .chat-container {
      height: 100vh; /* Using min-h-screen and flex-1 instead for better mobile behavior */
    }
    
    .chat-msg {
      opacity: 0;
      transform: translateY(10px);
      animation: msgFadeIn 0.4s ease-out forwards;
    }
    
    .chat-msg:nth-child(1) { animation-delay: 0.1s; }
    .chat-msg:nth-child(2) { animation-delay: 0.3s; }
    .chat-msg:nth-child(3) { animation-delay: 0.5s; }
    .chat-msg:nth-child(4) { animation-delay: 0.7s; }
    
    @keyframes msgFadeIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
`]
})
export class AsistenteIaComponent implements OnInit, AfterViewInit {
  private quotationService = inject(MercantilQuotationService);

  years: number[] = [2026, ...Array.from({length: 27}, (_, i) => (2025 - i))];
  brands: string[] = [];
  models: string[] = [];
  versions: MercantilVehiculo[] = [];
  
  hasTracker = true;
  trackers: string[] = ['Seguimiento Global S.R.L', 'LoJack', 'Ituran', 'Strix'];
  localidades: any[] = [
    { cp: 5539, ciudad: 1, desc: '5539 - LAS HERAS' },
    { cp: 1425, ciudad: 1, desc: '1425 - CABA' },
    { cp: 2000, ciudad: 320, desc: '2000 - ROSARIO' },
    { cp: 5000, ciudad: 1, desc: '5000 - CÓRDOBA' }
  ];
  
  currentStep = 1;
  errors: Record<number, boolean> = {};

  selectedYear: number | null = null;
  selectedBrand = '';
  selectedModel = '';
  selectedVersionObj: MercantilVehiculo | null = null;
  selectedTracker = '';
  selectedAge: number | null = 18;
  selectedLoc: any = null;

  // Estados de carga
  loadingBrands = false;
  loadingModels = false;
  loadingVersions = false;
  loadingQuotation = false;

  // Resultado de cotización
  quotationResult: any = null;
  quotationError: string = '';

  ngOnInit() {
    this.loadingBrands = true;
    this.quotationService.getMarcas().subscribe({
      next: (marcas: string[]) => {
        this.brands = marcas;
        this.loadingBrands = false;
      },
      error: (err: any) => {
        console.error('Error cargando marcas', err);
        this.loadingBrands = false;
      }
    });
  }

  nextStep(step: number) {
    if (step === 1 && !this.selectedYear) { this.errors[1] = true; return; }
    if (step === 2 && !this.selectedBrand) { this.errors[2] = true; return; }
    if (step === 3 && !this.selectedModel) { this.errors[3] = true; return; }
    if (step === 4 && !this.selectedVersionObj) { this.errors[4] = true; return; }
    if (step === 5 && this.hasTracker && !this.selectedTracker) { this.errors[5] = true; return; }
    if (step === 6 && !this.selectedAge) { this.errors[6] = true; return; }
    if (step === 7 && !this.selectedLoc) { this.errors[7] = true; return; }

    this.errors[step] = false;
    this.currentStep++;

    // Lógicas al avanzar de paso
    if (step === 2 && this.selectedBrand && this.selectedYear) {
      this.loadModels(this.selectedBrand, this.selectedYear);
    } else if (step === 3 && this.selectedModel && this.selectedYear) {
      this.loadVersions(this.selectedModel, this.selectedYear);
    } else if (step === 7) {
      this.executeQuotation();
    }

    this.scrollToBottom();
  }

  private loadModels(marca: string, anio: number) {
    this.loadingModels = true;
    this.models = [];
    this.selectedModel = '';
    this.quotationService.getModelos(marca, anio).subscribe({
      next: (modelos: string[]) => {
        this.models = modelos;
        this.loadingModels = false;
      },
      error: (err: any) => {
        console.error('Error cargando modelos', err);
        this.loadingModels = false;
      }
    });
  }

  private loadVersions(query: string, anio: number) {
    this.loadingVersions = true;
    this.versions = [];
    this.selectedVersionObj = null;
    this.quotationService.getVersiones(query, anio).subscribe({
      next: (versiones: MercantilVehiculo[]) => {
        this.versions = versiones;
        this.loadingVersions = false;
      },
      error: (err: any) => {
        console.error('Error cargando versiones', err);
        this.loadingVersions = false;
      }
    });
  }

  private executeQuotation() {
    this.loadingQuotation = true;
    this.quotationError = '';
    this.quotationResult = null;
    
    if (!this.selectedVersionObj) return;

    const payload = {
      anio: this.selectedYear!,
      codigoVehiculo: this.selectedVersionObj.codigo,
      tieneGNC: false, // Podríamos agregarlo al state
      tieneRastreador: this.hasTracker,
      prestadorRastreador: this.hasTracker ? this.selectedTracker : undefined,
      codigoPostal: this.selectedLoc.cp,
      codigoCiudad: this.selectedLoc.ciudad,
      edadAsegurado: this.selectedAge!
    };

    this.quotationService.cotizarAuto(payload).subscribe({
      next: (res: MercantilCotizacionResponse) => {
        this.quotationResult = res;
        this.loadingQuotation = false;
        this.scrollToBottom();
      },
      error: (err: any) => {
        this.quotationError = err.message || 'Error al cotizar';
        this.loadingQuotation = false;
        this.scrollToBottom();
      }
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      const mainContent = document.querySelector('.chat-container');
      if (mainContent) {
        mainContent.scrollTop = mainContent.scrollHeight;
      }
    }, 100);
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }
}
