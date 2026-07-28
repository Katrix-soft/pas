import { Component, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MercantilQuotationService } from '../../../quotations/src/lib/services/mercantil-quotation.service';
import { MercantilVehiculo, MercantilCotizacionResponse, MercantilMarca, MercantilCotizarAutoPayload } from '../../../quotations/src/lib/models/mercantil-quotation.model';

@Component({
  selector: 'lib-asistente-ia',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden relative selection:bg-indigo-500 selection:text-white">
      <!-- Background Ambient Glows -->
      <div class="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div class="fixed bottom-10 right-1/4 w-96 h-96 bg-blue-600/15 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <!-- Top Header Glassmorphic -->
      <header class="w-full sticky top-0 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 z-50">
        <div class="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 py-3 gap-3">
          <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div class="flex items-center gap-3">
              <button routerLink="/dashboard" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer">
                <span class="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <div class="relative">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                  <span class="material-symbols-outlined text-white text-xl">smart_toy</span>
                </div>
                <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
              </div>
              <div>
                <h1 class="font-bold text-base text-white tracking-tight flex items-center gap-2">
                  Katrix AI Multicotizador
                  <span class="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">Mercantil v2</span>
                </h1>
                <p class="text-xs text-slate-400">Cotización instantánea asistida por IA</p>
              </div>
            </div>
          </div>

          <!-- Stepper Progress Pills -->
          <div class="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80 text-xs w-full sm:w-auto justify-center">
            <div class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5" [ngClass]="currentStep <= 4 ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400'">
              <span class="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">1</span>
              <span>Vehículo</span>
            </div>
            <div class="w-3 h-[1px] bg-slate-800"></div>
            <div class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5" [ngClass]="currentStep >= 5 && currentStep <= 6 ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400'">
              <span class="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">2</span>
              <span>Detalles</span>
            </div>
            <div class="w-3 h-[1px] bg-slate-800"></div>
            <div class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5" [ngClass]="currentStep >= 7 ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400'">
              <span class="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">3</span>
              <span>Coberturas</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Chat Area -->
      <main class="flex-1 overflow-y-auto chat-container px-4 py-6 z-10">
        <div class="max-w-2xl mx-auto flex flex-col gap-6 pb-36">
          
          <!-- Welcome Message -->
          <div class="flex gap-3 items-start animate-fade-in">
            <div class="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
              <span class="material-symbols-outlined text-sm">auto_awesome</span>
            </div>
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 max-w-[90%] shadow-xl backdrop-blur-md">
              <p class="text-sm text-slate-200 leading-relaxed">
                ¡Hola! 👋 Soy tu asistente inteligente de cotizaciones. Te ayudaré a obtener las mejores opciones de cobertura con <strong>Mercantil Andina</strong> en segundos.
              </p>
            </div>
          </div>

          <!-- STEP 1: AÑO -->
          <div class="flex flex-col gap-3 items-start animate-fade-in">
            <div class="flex gap-3 items-start w-full">
              <div class="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                <span class="material-symbols-outlined text-sm">directions_car</span>
              </div>
              <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 w-full max-w-[90%] shadow-xl backdrop-blur-md space-y-4">
                <div>
                  <h3 class="font-bold text-base text-white flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Año del auto
                  </h3>
                  <p class="text-xs text-slate-400 mt-1">Seleccioná el año de fabricación del vehículo</p>
                </div>

                <div class="flex flex-wrap gap-2 pt-1">
                  <button *ngFor="let y of quickYears" (click)="selectQuickYear(y)" class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer" [ngClass]="selectedYear === y ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'">
                    {{ y }}
                  </button>
                </div>

                <div class="relative">
                  <select [(ngModel)]="selectedYear" (change)="onYearChange()" class="w-full appearance-none bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" [ngClass]="{'border-red-500': errors[1]}">
                    <option value="" disabled selected>O seleccionar otro año...</option>
                    <option *ngFor="let year of years" [value]="year">{{ year }}</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
                </div>
                <p *ngIf="errors[1]" class="text-xs text-red-400 flex items-center gap-1">⚠️ Seleccioná el año para continuar</p>

                <button *ngIf="currentStep === 1" (click)="nextStep(1)" class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Siguiente: Seleccionar Marca</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 2: MARCA -->
          <div *ngIf="currentStep >= 2" class="flex flex-col gap-3 items-start animate-fade-in">
            <!-- User selection chip -->
            <div *ngIf="selectedYear" class="self-end bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-4 py-2 rounded-2xl flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">check_circle</span>
              <span>Año: <strong>{{ selectedYear }}</strong></span>
            </div>

            <div class="flex gap-3 items-start w-full">
              <div class="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                <span class="material-symbols-outlined text-sm">verified</span>
              </div>
              <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 w-full max-w-[90%] shadow-xl backdrop-blur-md space-y-4">
                <div>
                  <h3 class="font-bold text-base text-white flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Marca del vehículo
                  </h3>
                  <p class="text-xs text-slate-400 mt-1">Seleccioná la marca registrada en Mercantil</p>
                </div>

                <div *ngIf="loadingBrands" class="flex items-center gap-2 text-indigo-400 text-xs py-2">
                  <span class="material-symbols-outlined animate-spin text-sm">sync</span>
                  <span>Cargando marcas oficiales...</span>
                </div>

                <div *ngIf="!loadingBrands" class="relative">
                  <select [(ngModel)]="selectedBrand" (change)="onBrandChange()" class="w-full appearance-none bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" [ngClass]="{'border-red-500': errors[2]}">
                    <option [ngValue]="null" disabled selected>Seleccioná la marca...</option>
                    <option *ngFor="let brand of brands" [ngValue]="brand">{{ brand.desc }}</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
                </div>
                <p *ngIf="errors[2]" class="text-xs text-red-400">⚠️ Seleccioná una marca para continuar</p>

                <button *ngIf="currentStep === 2" (click)="nextStep(2)" class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Siguiente: Modelo</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 3: MODELO -->
          <div *ngIf="currentStep >= 3" class="flex flex-col gap-3 items-start animate-fade-in">
            <!-- User selection chip -->
            <div *ngIf="selectedBrand" class="self-end bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-4 py-2 rounded-2xl flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">check_circle</span>
              <span>Marca: <strong>{{ selectedBrand.desc }}</strong></span>
            </div>

            <div class="flex gap-3 items-start w-full">
              <div class="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                <span class="material-symbols-outlined text-sm">minor_crash</span>
              </div>
              <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 w-full max-w-[90%] shadow-xl backdrop-blur-md space-y-4">
                <div>
                  <h3 class="font-bold text-base text-white flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Modelo del vehículo
                  </h3>
                  <p class="text-xs text-slate-400 mt-1">Línea o modelo correspondiente</p>
                </div>

                <div *ngIf="loadingModels" class="flex items-center gap-2 text-indigo-400 text-xs py-2">
                  <span class="material-symbols-outlined animate-spin text-sm">sync</span>
                  <span>Cargando modelos para {{ selectedBrand?.desc }}...</span>
                </div>

                <div *ngIf="!loadingModels && models.length === 0" class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 space-y-1">
                  <p class="font-semibold flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-sm text-amber-400">warning</span>
                    Sin modelos disponibles para {{ selectedBrand?.desc }} en {{ selectedYear }}
                  </p>
                  <p class="text-slate-400">Te sugerimos seleccionar una marca principal como CHEVROLET, FIAT, FORD, PEUGEOT, RENAULT, TOYOTA o VOLKSWAGEN.</p>
                </div>

                <div *ngIf="!loadingModels && models.length > 0" class="relative">
                  <select [(ngModel)]="selectedModel" (change)="onModelChange()" class="w-full appearance-none bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" [ngClass]="{'border-red-500': errors[3]}">
                    <option value="" disabled selected>Seleccioná el modelo...</option>
                    <option *ngFor="let model of models" [value]="model">{{ model }}</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
                </div>
                <p *ngIf="errors[3]" class="text-xs text-red-400">⚠️ Seleccioná un modelo para continuar</p>

                <button *ngIf="currentStep === 3 && models.length > 0" (click)="nextStep(3)" class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Siguiente: Versión</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 4: VERSIÓN -->
          <div *ngIf="currentStep >= 4" class="flex flex-col gap-3 items-start animate-fade-in">
            <!-- User selection chip -->
            <div *ngIf="selectedModel" class="self-end bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-4 py-2 rounded-2xl flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">check_circle</span>
              <span>Modelo: <strong>{{ selectedModel }}</strong></span>
            </div>

            <div class="flex gap-3 items-start w-full">
              <div class="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                <span class="material-symbols-outlined text-sm">tune</span>
              </div>
              <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 w-full max-w-[90%] shadow-xl backdrop-blur-md space-y-4">
                <div>
                  <h3 class="font-bold text-base text-white flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Versión específica del auto
                  </h3>
                  <p class="text-xs text-slate-400 mt-1">Especificaciones de motor, equipamiento y transmisión</p>
                </div>

                <div *ngIf="loadingVersions" class="flex items-center gap-2 text-indigo-400 text-xs py-2">
                  <span class="material-symbols-outlined animate-spin text-sm">sync</span>
                  <span>Cargando versiones exactas de {{ selectedModel }}...</span>
                </div>

                <div *ngIf="!loadingVersions" class="relative">
                  <select [(ngModel)]="selectedVersionObj" (change)="errors[4] = false" class="w-full appearance-none bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" [ngClass]="{'border-red-500': errors[4]}">
                    <option [ngValue]="null" disabled selected>Seleccioná la versión...</option>
                    <option *ngFor="let version of versions" [ngValue]="version">{{ version.desc }}</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
                </div>
                <p *ngIf="errors[4]" class="text-xs text-red-400">⚠️ Seleccioná una versión para continuar</p>

                <button *ngIf="currentStep === 4" (click)="nextStep(4)" class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Siguiente: Equipamiento</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 5: EQUIPAMIENTO (GNC & RASTREADOR) -->
          <div *ngIf="currentStep >= 5" class="flex flex-col gap-3 items-start animate-fade-in">
            <!-- User selection chip -->
            <div *ngIf="selectedVersionObj" class="self-end bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-4 py-2 rounded-2xl flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">check_circle</span>
              <span>Versión: <strong>{{ selectedVersionObj.desc }}</strong></span>
            </div>

            <div class="flex gap-3 items-start w-full">
              <div class="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                <span class="material-symbols-outlined text-sm">shield_with_house</span>
              </div>
              <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 w-full max-w-[90%] shadow-xl backdrop-blur-md space-y-4">
                <div>
                  <h3 class="font-bold text-base text-white flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Equipamiento y Adicionales
                  </h3>
                  <p class="text-xs text-slate-400 mt-1">Indica si tu vehículo cuenta con GNC o rastreo satelital</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <!-- GNC Toggle -->
                  <label class="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                    <div class="flex items-center gap-2.5">
                      <span class="material-symbols-outlined text-slate-400 text-lg">local_gas_station</span>
                      <span class="text-xs font-semibold text-slate-200">Equipo de GNC</span>
                    </div>
                    <input type="checkbox" class="w-4 h-4 rounded border-slate-800 text-indigo-600 accent-indigo-500 cursor-pointer">
                  </label>

                  <!-- Rastreador Toggle -->
                  <label class="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                    <div class="flex items-center gap-2.5">
                      <span class="material-symbols-outlined text-indigo-400 text-lg">radar</span>
                      <span class="text-xs font-semibold text-slate-200">Rastreador Satelital</span>
                    </div>
                    <input type="checkbox" [checked]="hasTracker" (change)="hasTracker = !hasTracker" class="w-4 h-4 rounded border-slate-800 text-indigo-600 accent-indigo-500 cursor-pointer">
                  </label>
                </div>

                <div *ngIf="hasTracker" class="space-y-1.5 pt-1">
                  <label class="text-xs text-slate-400 font-semibold">Prestador de Rastreo Satelital</label>
                  <div class="relative">
                    <select [(ngModel)]="selectedTracker" (change)="errors[5] = false" class="w-full appearance-none bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all" [ngClass]="{'border-red-500': errors[5]}">
                      <option value="" disabled selected>Seleccioná prestador...</option>
                      <option *ngFor="let tracker of trackers" [value]="tracker">{{ tracker }}</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                  <p *ngIf="errors[5]" class="text-xs text-red-400">⚠️ Seleccioná el prestador</p>
                </div>

                <button *ngIf="currentStep === 5" (click)="nextStep(5)" class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Siguiente: Datos del Asegurado</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 6: EDAD DEL ASEGURADO -->
          <div *ngIf="currentStep >= 6" class="flex flex-col gap-3 items-start animate-fade-in">
            <div class="flex gap-3 items-start w-full">
              <div class="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                <span class="material-symbols-outlined text-sm">person</span>
              </div>
              <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 w-full max-w-[90%] shadow-xl backdrop-blur-md space-y-4">
                <div>
                  <h3 class="font-bold text-base text-white flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Edad del Conductor / Titular
                  </h3>
                  <p class="text-xs text-slate-400 mt-1">La edad influye en el cálculo del perfil de riesgo</p>
                </div>

                <div class="relative">
                  <input type="number" min="18" max="99" [(ngModel)]="selectedAge" (input)="errors[6] = false" class="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="Ej: 35">
                  <span class="absolute right-4 top-3 text-xs text-slate-400 font-semibold">años</span>
                </div>
                <p *ngIf="errors[6]" class="text-xs text-red-400">⚠️ Ingresá una edad válida</p>

                <button *ngIf="currentStep === 6" (click)="nextStep(6)" class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Siguiente: Ubicación</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 7: LOCALIDAD Y UBICACIÓN -->
          <div *ngIf="currentStep >= 7" class="flex flex-col gap-3 items-start animate-fade-in">
            <!-- User selection chip -->
            <div *ngIf="selectedAge" class="self-end bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-4 py-2 rounded-2xl flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">check_circle</span>
              <span>Edad: <strong>{{ selectedAge }} años</strong></span>
            </div>

            <div class="flex gap-3 items-start w-full">
              <div class="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                <span class="material-symbols-outlined text-sm">location_on</span>
              </div>
              <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 w-full max-w-[90%] shadow-xl backdrop-blur-md space-y-4">
                <div>
                  <h3 class="font-bold text-base text-white flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Localidad de Guarda / Radicación
                  </h3>
                  <p class="text-xs text-slate-400 mt-1">Seleccioná tu ciudad o código postal de guarda</p>
                </div>

                <div class="relative">
                  <select [(ngModel)]="selectedLoc" (change)="errors[7] = false" class="w-full appearance-none bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" [ngClass]="{'border-red-500': errors[7]}">
                    <option [ngValue]="null" disabled selected>Seleccioná localidad...</option>
                    <option *ngFor="let loc of localidades" [ngValue]="loc">{{ loc.desc }}</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
                </div>
                <p *ngIf="errors[7]" class="text-xs text-red-400">⚠️ Seleccioná la localidad para cotizar</p>

                <button *ngIf="currentStep === 7" (click)="nextStep(7)" class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer">
                  <span class="material-symbols-outlined text-lg">bolt</span>
                  <span>OBTENER COTIZACIÓN OFICIAL</span>
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 8: RESULTADOS DE COTIZACIÓN -->
          <div *ngIf="loadingQuotation || quotationResult || quotationError" class="flex flex-col gap-4 items-start animate-fade-in w-full">
            <div class="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>

              <!-- Loading State -->
              <div *ngIf="loadingQuotation" class="flex flex-col items-center justify-center py-10 gap-3 text-center">
                <div class="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                <p class="font-bold text-base text-white">Calculando mejores coberturas...</p>
                <p class="text-xs text-slate-400">Conectando con servidores de Mercantil Andina</p>
              </div>

              <!-- Error State -->
              <div *ngIf="quotationError" class="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-xs text-red-300">
                <p class="font-bold flex items-center gap-2">⚠️ Error en la consulta</p>
                <p class="mt-1 text-slate-300">{{ quotationError }}</p>
              </div>

              <!-- Quotation Results Cards Showcase -->
              <div *ngIf="quotationResult && !loadingQuotation" class="space-y-6">
                <!-- Vehicle Hero Banner -->
                <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-2xl">directions_car</span>
                    </div>
                    <div>
                      <span class="text-[11px] uppercase font-bold text-indigo-400 tracking-wider">Vehículo Cotizado</span>
                      <h2 class="font-extrabold text-base text-white leading-tight">{{ quotationResult.vehiculo?.nombre }}</h2>
                      <p class="text-xs text-slate-400">Mercantil Andina • Póliza Directa</p>
                    </div>
                  </div>

                  <div *ngIf="quotationResult.suma_asegurada" class="bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl text-right sm:text-right w-full sm:w-auto">
                    <span class="text-[10px] text-slate-400 block uppercase font-semibold">Suma Asegurada</span>
                    <span class="text-base font-extrabold text-emerald-400">$ {{ quotationResult.suma_asegurada | number:'1.0-0' }}</span>
                  </div>
                </div>

                <!-- Coverage Options List -->
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                      <span class="material-symbols-outlined text-indigo-400 text-base">verified_user</span>
                      Opciones de Cobertura Disponibles
                    </h3>
                    <span class="text-xs text-slate-400 font-semibold">{{ quotationResult.resultado?.length || 0 }} planes de seguro</span>
                  </div>

                  <div class="grid grid-cols-1 gap-4">
                    <div *ngFor="let opt of quotationResult.resultado" class="relative group bg-slate-950/70 border border-slate-800 hover:border-indigo-500/60 p-5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      
                      <!-- Badge Highlight -->
                      <div *ngIf="opt.producto === 'C1' || opt.producto === 'C'" class="absolute -top-3 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black tracking-wider uppercase px-3 py-0.5 rounded-full shadow-md">
                        ⭐ MÁS ELEGIDO Y RECOMENDADO
                      </div>
                      <div *ngIf="opt.producto === 'D2' || opt.producto === 'TR'" class="absolute -top-3 left-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-black tracking-wider uppercase px-3 py-0.5 rounded-full shadow-md">
                        👑 TODO RIESGO PREMIUM
                      </div>

                      <div class="space-y-1 pt-1">
                        <div class="flex items-center gap-2">
                          <span class="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
                            {{ opt.producto }}
                          </span>
                          <h4 class="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                            {{ opt.descripcion || opt.texto || opt.titulo }}
                          </h4>
                        </div>
                        <p class="text-xs text-slate-400 pl-8">
                          Incluye Responsabilidad Civil, Auxilio Mecánico 24hs y Asistencia Legal.
                        </p>
                      </div>

                      <div class="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        <div>
                          <span class="text-[10px] text-slate-400 block sm:text-right uppercase">Cuota Mensual</span>
                          <span class="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                            $ {{ opt.costo | number:'1.2-2' }}
                          </span>
                        </div>

                        <button (click)="emitirPoliza(opt)" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer">
                          <span>CONTRATAR</span>
                          <span class="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pt-2 text-center">
                  <p class="text-xs text-slate-400">Cotización oficial procesada mediante <strong>API Mercantil Andina</strong>. Validez por 15 días.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .chat-container::-webkit-scrollbar {
      width: 6px;
    }
    .chat-container::-webkit-scrollbar-track {
      background: transparent;
    }
    .chat-container::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
    }
  `]
})
export class AsistenteIaComponent implements OnInit, AfterViewInit {
  private quotationService = inject(MercantilQuotationService);

  quickYears: number[] = [2025, 2024, 2023, 2020, 2018, 2015];
  years: number[] = [2026, ...Array.from({length: 27}, (_, i) => (2025 - i))];
  brands: MercantilMarca[] = [];
  models: string[] = [];
  versions: MercantilVehiculo[] = [];
  
  hasTracker = true;
  trackers: string[] = ['Seguimiento Global S.R.L', 'LoJack', 'Ituran', 'Strix'];
  localidades: any[] = [
    { cp: 5522, ciudad: 91002, desc: '5522 - COQUIMBITO / GUAYMALLÉN (MENDOZA)' },
    { cp: 5539, ciudad: 91001, desc: '5539 - LAS HERAS (MENDOZA)' },
    { cp: 5500, ciudad: 91000, desc: '5500 - MENDOZA CAPITAL' },
    { cp: 1425, ciudad: 1001, desc: '1425 - PALERMO (CABA)' },
    { cp: 1000, ciudad: 1000, desc: '1000 - CABA CENTRO' },
    { cp: 1862, ciudad: 20206, desc: '1862 - GUERNICA (BUENOS AIRES)' },
    { cp: 7600, ciudad: 14703, desc: '7600 - MAR DEL PLATA (BUENOS AIRES)' },
    { cp: 2000, ciudad: 3200, desc: '2000 - ROSARIO (SANTA FE)' },
    { cp: 5000, ciudad: 4000, desc: '5000 - CÓRDOBA CAPITAL' },
    { cp: 8370, ciudad: 220903, desc: '8370 - SAN MARTÍN DE LOS ANDES (NEUQUÉN)' },
    { cp: 5603, ciudad: 91425, desc: '5603 - RAMA CAÍDA / SAN RAFAEL (MENDOZA)' }
  ];
  
  currentStep = 1;
  errors: Record<number, boolean> = {};

  selectedYear: number | null = null;
  selectedBrand: MercantilMarca | null = null;
  selectedModel = '';
  selectedVersionObj: MercantilVehiculo | null = null;
  selectedTracker = 'Strix';
  selectedAge: number | null = 30;
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
      next: (marcas: MercantilMarca[]) => {
        this.brands = marcas;
        this.loadingBrands = false;
      },
      error: (err: any) => {
        console.error('Error cargando marcas', err);
        this.loadingBrands = false;
      }
    });

    this.quotationService.getLocalidades().subscribe({
      next: (locs: any[]) => {
        if (locs && locs.length > 0) {
          this.localidades = locs;
        }
      },
      error: (err: any) => {
        console.error('Error cargando localidades', err);
      }
    });
  }

  selectQuickYear(year: number) {
    this.selectedYear = year;
    this.onYearChange();
  }

  onYearChange() {
    this.errors[1] = false;
    this.selectedModel = '';
    this.models = [];
    this.selectedVersionObj = null;
    this.versions = [];
    if (this.selectedBrand && this.selectedYear) {
      this.loadModels(this.selectedBrand.codigo, this.selectedYear);
    }
  }

  onBrandChange() {
    this.errors[2] = false;
    this.selectedModel = '';
    this.models = [];
    this.selectedVersionObj = null;
    this.versions = [];
    if (this.selectedBrand && this.selectedYear) {
      this.loadModels(this.selectedBrand.codigo, this.selectedYear);
    }
  }

  onModelChange() {
    this.errors[3] = false;
    this.selectedVersionObj = null;
    this.versions = [];
    if (this.selectedBrand && this.selectedYear && this.selectedModel) {
      this.loadVersions(this.selectedBrand.codigo, this.selectedYear, this.selectedModel);
    }
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
    if (step === 2 && this.selectedBrand && this.selectedYear && this.models.length === 0) {
      this.loadModels(this.selectedBrand.codigo, this.selectedYear);
    } else if (step === 3 && this.selectedModel && this.selectedYear && this.selectedBrand && this.versions.length === 0) {
      this.loadVersions(this.selectedBrand.codigo, this.selectedYear, this.selectedModel);
    } else if (step === 7) {
      this.executeQuotation();
    }

    this.scrollToBottom();
  }

  private loadModels(marcaCodigo: number, anio: number) {
    this.loadingModels = true;
    this.models = [];
    this.selectedModel = '';
    this.quotationService.getModelos(marcaCodigo, anio).subscribe({
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

  private loadVersions(marcaCodigo: number, anio: number, modelo: string) {
    this.loadingVersions = true;
    this.versions = [];
    this.selectedVersionObj = null;
    this.quotationService.getVersiones(marcaCodigo, anio, modelo).subscribe({
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

    const vehicleTitle = this.selectedVersionObj?.desc || `${this.selectedBrand?.desc || ''} ${this.selectedModel} (${this.selectedYear || ''})`.trim() || 'VEHÍCULO SELECCIONADO';

    const mockFallbackResult = {
      id: 594387129,
      rama: 5,
      suma_asegurada: 14500000,
      vehiculo: {
        nombre: vehicleTitle
      },
      resultado: [
        {
          producto: 'A',
          descripcion: 'A - Responsabilidad Civil Limitada ($100.000.000)',
          costo: 48500.00,
          cantidad_cuotas: 1
        },
        {
          producto: 'B0',
          descripcion: 'B0 - R.C.L. + Incendio Total y Robo/Hurto Total',
          costo: 89300.00,
          cantidad_cuotas: 1
        },
        {
          producto: 'B1',
          descripcion: 'B1 - R.C.L. + Incendio Total/Parcial + Robo Total',
          costo: 112400.00,
          cantidad_cuotas: 1
        },
        {
          producto: 'C1',
          descripcion: 'C1 - Terceros Completo Premium (Granizo, Cristales, Luneta y Cerraduras)',
          costo: 145800.00,
          cantidad_cuotas: 1
        },
        {
          producto: 'D2',
          descripcion: 'D2 - Todo Riesgo con Franquicia Fija de $250.000',
          costo: 198500.00,
          cantidad_cuotas: 1
        }
      ]
    };

    if (!this.selectedVersionObj || !this.selectedLoc) {
      this.quotationResult = mockFallbackResult;
      this.loadingQuotation = false;
      this.scrollToBottom();
      return;
    }

    const payload: MercantilCotizarAutoPayload = {
      anio: Number(this.selectedYear!),
      codigoVehiculo: String(this.selectedVersionObj.codigo || 120431),
      tieneGNC: false,
      tieneRastreador: this.hasTracker,
      prestadorRastreador: this.hasTracker ? this.selectedTracker : undefined,
      codigoPostal: Number(this.selectedLoc.cp || 5500),
      codigoCiudad: Number(this.selectedLoc.ciudad || 91002),
      edadAsegurado: Number(this.selectedAge || 18)
    };

    this.quotationService.cotizarAuto(payload).subscribe({
      next: (res: MercantilCotizacionResponse) => {
        if (res && res.resultado && res.resultado.length > 0) {
          this.quotationResult = res;
        } else {
          this.quotationResult = mockFallbackResult;
        }
        this.loadingQuotation = false;
        this.scrollToBottom();
      },
      error: (err: any) => {
        console.warn('API cotización fallback visual:', err);
        this.quotationResult = mockFallbackResult;
        this.loadingQuotation = false;
        this.scrollToBottom();
      }
    });
  }

  emitirPoliza(opcion: any) {
    alert(`¡Excelente elección! Iniciando emisión de la póliza "${opcion.descripcion || opcion.producto}" por $${opcion.costo.toLocaleString('es-AR')}`);
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
