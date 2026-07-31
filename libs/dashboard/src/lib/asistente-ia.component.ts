import { Component, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MercantilQuotationService } from '../../../quotations/src/lib/services/mercantil-quotation.service';
import { MercantilVehiculo, MercantilCotizacionResponse, MercantilMarca, MercantilCotizarAutoPayload } from '../../../quotations/src/lib/models/mercantil-quotation.model';
import { forkJoin, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

interface CoopCotizacion {
  planCobertura?: string;
  detalleCobertura?: string;
  premio?: number;
  presupuestoNro?: number;
  [key: string]: any;
}

@Component({
  selector: 'lib-asistente-ia',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden relative selection:bg-indigo-500 selection:text-white">
      <!-- Background Ambient Glows -->
      <div class="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div class="fixed bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <!-- Top Header Glassmorphic -->
      <header class="w-full sticky top-0 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 z-50">
        <div class="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 py-3 gap-3">
          <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div class="flex items-center gap-3">
              <button routerLink="/dashboard" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer">
                <span class="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <div class="relative">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                  <span class="material-symbols-outlined text-white text-xl">smart_toy</span>
                </div>
                <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
              </div>
              <div>
                <h1 class="font-bold text-base text-white tracking-tight flex items-center gap-2">
                  Katrix AI Multicotizador
                  <span class="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">Mercantil + Cooperación</span>
                </h1>
                <p class="text-xs text-slate-400">Cotización dual instantánea — 2 compañías en paralelo</p>
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
                ¡Hola! 👋 Soy tu asistente inteligente. Cotizo en <strong class="text-indigo-300">Mercantil Andina</strong> y <strong class="text-amber-400">Cooperación Seguros</strong> al mismo tiempo para que compares y elijas la mejor cobertura.
              </p>
              <!-- Company badges -->
              <div class="flex gap-2 mt-3">
                <span class="flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  Mercantil Andina
                </span>
                <span class="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Cooperación Seguros
                </span>
              </div>
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
                  <p class="text-xs text-slate-400 mt-1">Catálogo oficial InfoAuto (usado por Mercantil y Cooperación)</p>
                </div>
                <div *ngIf="loadingBrands" class="flex items-center gap-2 text-indigo-400 text-xs py-2">
                  <span class="material-symbols-outlined animate-spin text-sm">sync</span>
                  <span>Cargando marcas oficiales...</span>
                </div>
                <div *ngIf="!loadingBrands" class="relative">
                  <select [(ngModel)]="selectedBrand" (change)="onBrandChange()" class="w-full appearance-none bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" [ngClass]="{'border-red-500': errors[2]}">
                    <option [ngValue]="null" disabled selected>Seleccioná la marca...</option>
                    <option *ngFor="let brand of brands" [ngValue]="brand">{{ brand.desc || brand.descripcion }}</option>
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
                </div>
                <div *ngIf="loadingModels" class="flex items-center gap-2 text-indigo-400 text-xs py-2">
                  <span class="material-symbols-outlined animate-spin text-sm">sync</span>
                  <span>Cargando modelos para {{ selectedBrand?.desc }}...</span>
                </div>
                <div *ngIf="!loadingModels && models.length === 0" class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200">
                  <p class="font-semibold flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-sm text-amber-400">warning</span>
                    Sin modelos para {{ selectedBrand?.desc }} en {{ selectedYear }}
                  </p>
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
                    Versión específica
                  </h3>
                  <p class="text-xs text-slate-400 mt-1">El código de versión se envía en simultáneo a ambas compañías</p>
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

          <!-- STEP 5: EQUIPAMIENTO -->
          <div *ngIf="currentStep >= 5" class="flex flex-col gap-3 items-start animate-fade-in">
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
                  <p class="text-xs text-slate-400 mt-1">GNC y rastreador se aplican en Mercantil y Cooperación</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label class="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                    <div class="flex items-center gap-2.5">
                      <span class="material-symbols-outlined text-slate-400 text-lg">local_gas_station</span>
                      <span class="text-xs font-semibold text-slate-200">Equipo de GNC</span>
                    </div>
                    <input type="checkbox" [(ngModel)]="hasGNC" class="w-4 h-4 rounded border-slate-800 text-indigo-600 accent-indigo-500 cursor-pointer">
                  </label>
                  <label class="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                    <div class="flex items-center gap-2.5">
                      <span class="material-symbols-outlined text-indigo-400 text-lg">radar</span>
                      <span class="text-xs font-semibold text-slate-200">Rastreador Satelital</span>
                    </div>
                    <input type="checkbox" [checked]="hasTracker" (change)="hasTracker = !hasTracker" class="w-4 h-4 rounded border-slate-800 text-indigo-600 accent-indigo-500 cursor-pointer">
                  </label>
                </div>
                <button *ngIf="currentStep === 5" (click)="nextStep(5)" class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Siguiente: Datos del Conductor</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 6: EDAD DEL CONDUCTOR -->
          <div *ngIf="currentStep >= 6" class="flex flex-col gap-3 items-start animate-fade-in">
            <div class="flex gap-3 items-start w-full">
              <div class="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                <span class="material-symbols-outlined text-sm">person</span>
              </div>
              <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 w-full max-w-[90%] shadow-xl backdrop-blur-md space-y-4">
                <div>
                  <h3 class="font-bold text-base text-white flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Edad del Conductor Principal
                  </h3>
                  <p class="text-xs text-slate-400 mt-1">Utilizado para calcular la prima de riesgo</p>
                </div>

                <div class="relative">
                  <input type="number" min="18" max="99" [(ngModel)]="selectedAge" (input)="errors[6] = false"
                    class="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all" placeholder="Ej: 35">
                  <span class="absolute right-4 top-3.5 text-xs text-slate-400">años</span>
                </div>

                <p *ngIf="errors[6]" class="text-xs text-red-400">⚠️ Ingresá una edad válida</p>

                <button *ngIf="currentStep === 6" (click)="nextStep(6)" class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Siguiente: Ubicación</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 7: LOCALIDAD DE GUARDA -->
          <div *ngIf="currentStep >= 7" class="flex flex-col gap-3 items-start animate-fade-in">
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
                    Localidad de Guarda del Vehículo
                  </h3>
                  <p class="text-xs text-slate-400 mt-1">Seleccioná la localidad (se unifica el CP para ambas compañías)</p>
                </div>

                <div class="space-y-1.5">
                  <div class="relative">
                    <select [(ngModel)]="selectedLoc" (change)="onLocChange()" class="w-full appearance-none bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" [ngClass]="{'border-red-500': errors[7]}">
                      <option [ngValue]="null" disabled selected>Seleccioná localidad...</option>
                      <option *ngFor="let loc of localidades" [ngValue]="loc">{{ loc.desc }}</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <p *ngIf="errors[7]" class="text-xs text-red-400">⚠️ Seleccioná la localidad para cotizar</p>

                <button *ngIf="currentStep === 7" (click)="nextStep(7)" class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer">
                  <span class="material-symbols-outlined text-lg">bolt</span>
                  <span>COTIZAR EN MERCANTIL + COOPERACIÓN</span>
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 8: RESULTADOS DUAL (SOLO SE MUESTRA DESPUÉS DE COTIZAR) -->
          <div *ngIf="loadingQuotation || hasExecutedQuotation" class="flex flex-col gap-4 items-start animate-fade-in w-full">

            <!-- Loading State Dual -->
            <div *ngIf="loadingQuotation" class="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-4">
              <div class="flex justify-center gap-6">
                <div class="flex flex-col items-center gap-2">
                  <div class="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                  <span class="text-xs text-indigo-300 font-semibold">Mercantil Andina</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <div class="w-10 h-10 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" style="animation-delay: 0.2s"></div>
                  <span class="text-xs text-amber-300 font-semibold">Cooperación Seguros</span>
                </div>
              </div>
              <p class="font-bold text-sm text-white">Consultando 2 compañías simultáneamente...</p>
              <p class="text-xs text-slate-400">Esto puede demorar unos segundos</p>
            </div>

            <!-- Error Global State -->
            <div *ngIf="quotationError && !loadingQuotation" class="w-full bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-xs text-red-300">
              <p class="font-bold flex items-center gap-2">⚠️ Error en la consulta</p>
              <p class="mt-1 text-slate-300">{{ quotationError }}</p>
            </div>

            <!-- RESULTADOS DUAL LAYOUT -->
            <div *ngIf="!loadingQuotation && hasExecutedQuotation" class="w-full space-y-4">

              <!-- Vehicle banner -->
              <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-2xl">directions_car</span>
                  </div>
                  <div>
                    <span class="text-[11px] uppercase font-bold text-indigo-400 tracking-wider">Vehículo Cotizado</span>
                    <h2 class="font-extrabold text-base text-white leading-tight">{{ selectedVersionObj?.desc || selectedBrand?.desc + ' ' + selectedModel }}</h2>
                    <p class="text-xs text-slate-400">Año {{ selectedYear }} • Cotización unificada en tiempo real</p>
                  </div>
                </div>
                <div class="flex gap-2 flex-wrap">
                  <span class="flex items-center gap-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    {{ mercantilResult ? (mercantilResult.resultado?.length || 0) + ' planes' : '0 planes' }} Mercantil
                  </span>
                  <span class="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    {{ coopResult ? (coopResult.length || 0) + ' planes' : '0 planes' }} Cooperación
                  </span>
                </div>
              </div>

              <!-- Two column grid -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

                <!-- MERCANTIL ANDINA column -->
                <div class="space-y-3">
                  <div class="flex items-center gap-2 px-1">
                    <div class="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-[9px] font-black text-white">MA</div>
                    <h3 class="font-bold text-sm text-white">Mercantil Andina</h3>
                    <span *ngIf="mercantilError" class="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Demo</span>
                    <span *ngIf="!mercantilError && mercantilResult" class="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">✓ API</span>
                  </div>

                  <div *ngFor="let opt of mercantilResult?.resultado" class="relative group bg-slate-900/80 border border-indigo-500/20 hover:border-indigo-500/60 p-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-indigo-500/10">
                    <div *ngIf="opt.producto === 'C1' || opt.producto === 'C'" class="absolute -top-2.5 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      ⭐ MÁS ELEGIDO
                    </div>
                    <div *ngIf="opt.producto === 'D2' || opt.producto === 'TR'" class="absolute -top-2.5 left-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      👑 TODO RIESGO
                    </div>
                    <div class="flex justify-between items-start gap-3 pt-1">
                      <div class="space-y-1 min-w-0">
                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">{{ opt.producto }}</span>
                        <p class="font-bold text-xs text-white leading-snug">{{ opt.descripcion || opt.texto }}</p>
                      </div>
                      <div class="text-right shrink-0">
                        <span class="text-[10px] text-slate-400 block uppercase">$/mes</span>
                        <span class="text-lg font-black text-indigo-300">$ {{ opt.costo | number:'1.0-0' }}</span>
                      </div>
                    </div>
                    <button (click)="emitirPoliza(opt, 'mercantil')" class="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                      <span>CONTRATAR</span>
                      <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>

                <!-- COOPERACIÓN SEGUROS column -->
                <div class="space-y-3">
                  <div class="flex items-center gap-2 px-1">
                    <div class="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-[9px] font-black text-white">CS</div>
                    <h3 class="font-bold text-sm text-white">Cooperación Seguros</h3>
                    <span *ngIf="coopIsDemo" class="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Demo</span>
                    <span *ngIf="!coopIsDemo && coopResult?.length" class="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">✓ API</span>
                  </div>

                  <div *ngFor="let plan of coopResult" class="relative group bg-slate-900/80 border border-amber-500/20 hover:border-amber-500/60 p-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-amber-500/10">
                    <div *ngIf="plan.planCobertura === 'C1' || plan.planCobertura === 'C'" class="absolute -top-2.5 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      ⭐ RECOMENDADO
                    </div>
                    <div class="flex justify-between items-start gap-3 pt-1">
                      <div class="space-y-1 min-w-0">
                        <span class="inline-flex items-center justify-center min-w-[1.5rem] h-6 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 px-1.5">{{ plan.planCobertura }}</span>
                        <p class="font-bold text-xs text-white leading-snug">{{ plan.detalleCobertura || 'Plan ' + plan.planCobertura }}</p>
                      </div>
                      <div class="text-right shrink-0">
                        <span class="text-[10px] text-slate-400 block uppercase">$/mes</span>
                        <span class="text-lg font-black text-amber-300">$ {{ plan.premio | number:'1.0-0' }}</span>
                      </div>
                    </div>
                    <button (click)="emitirPoliza(plan, 'cooperacion')" class="mt-3 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                      <span>CONTRATAR</span>
                      <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="pt-2 text-center space-y-1">
                <p class="text-xs text-slate-400">Cotización unificada procesada mediante <strong class="text-indigo-300">Mercantil Andina</strong> y <strong class="text-amber-300">Cooperación Seguros</strong>.</p>
                <p class="text-[10px] text-slate-600">Validez 15 días • Cotización unificada con código InfoAuto</p>
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
    .animate-fade-in { animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .chat-container::-webkit-scrollbar { width: 6px; }
    .chat-container::-webkit-scrollbar-track { background: transparent; }
    .chat-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 9999px; }
  `]
})
export class AsistenteIaComponent implements OnInit, AfterViewInit {
  private quotationService = inject(MercantilQuotationService);
  private http = inject(HttpClient);

  quickYears: number[] = [2025, 2024, 2023, 2020, 2018, 2015];
  years: number[] = [2026, ...Array.from({length: 27}, (_, i) => (2025 - i))];
  brands: MercantilMarca[] = [];
  models: string[] = [];
  versions: MercantilVehiculo[] = [];

  hasGNC = false;
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

  codigoPostalCoop = '';

  // Estados de carga
  loadingBrands = false;
  loadingModels = false;
  loadingVersions = false;
  loadingQuotation = false;
  hasExecutedQuotation = false;

  // Resultados por compañía
  mercantilResult: any = null;
  mercantilError = '';
  coopResult: CoopCotizacion[] = [];
  coopError = '';
  coopIsDemo = false;
  quotationError = '';

  ngOnInit() {
    this.loadingBrands = true;
    this.quotationService.getMarcas().subscribe({
      next: (marcas: any) => {
        const list = Array.isArray(marcas) ? marcas : (marcas?.datos || []);
        if (list.length > 0) {
          this.brands = list;
        } else {
          this.setFallbackBrands();
        }
        this.loadingBrands = false;
      },
      error: () => {
        this.setFallbackBrands();
        this.loadingBrands = false;
      }
    });

    this.quotationService.getLocalidades().subscribe({
      next: (locs: any[]) => { if (locs?.length) this.localidades = locs; },
      error: () => {}
    });
  }

  private setFallbackBrands() {
    this.brands = [
      { codigo: 1, desc: 'CHEVROLET' }, { codigo: 2, desc: 'CITROEN' },
      { codigo: 3, desc: 'FIAT' }, { codigo: 4, desc: 'FORD' },
      { codigo: 5, desc: 'HONDA' }, { codigo: 6, desc: 'HYUNDAI' },
      { codigo: 7, desc: 'JEEP' }, { codigo: 8, desc: 'NISSAN' },
      { codigo: 9, desc: 'PEUGEOT' }, { codigo: 10, desc: 'RENAULT' },
      { codigo: 11, desc: 'TOYOTA' }, { codigo: 12, desc: 'VOLKSWAGEN' },
      { codigo: 13, desc: 'BMW' }, { codigo: 14, desc: 'MERCEDES BENZ' },
      { codigo: 15, desc: 'AUDI' }, { codigo: 16, desc: 'KIA' }
    ];
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
    if (this.selectedBrand && this.selectedYear) this.loadModels(this.selectedBrand.codigo, this.selectedYear);
  }

  onBrandChange() {
    this.errors[2] = false;
    this.selectedModel = '';
    this.models = [];
    this.selectedVersionObj = null;
    this.versions = [];
    if (this.selectedBrand && this.selectedYear) this.loadModels(this.selectedBrand.codigo, this.selectedYear);
  }

  onModelChange() {
    this.errors[3] = false;
    this.selectedVersionObj = null;
    this.versions = [];
    if (this.selectedBrand && this.selectedYear && this.selectedModel)
      this.loadVersions(this.selectedBrand.codigo, this.selectedYear, this.selectedModel);
  }

  onLocChange() {
    this.errors[7] = false;
    if (this.selectedLoc) {
      this.codigoPostalCoop = String(this.selectedLoc.cp || '5000');
    }
  }

  nextStep(step: number) {
    if (step === 1 && !this.selectedYear) { this.errors[1] = true; return; }
    if (step === 2 && !this.selectedBrand) { this.errors[2] = true; return; }
    if (step === 3 && !this.selectedModel) { this.errors[3] = true; return; }
    if (step === 4 && !this.selectedVersionObj) { this.errors[4] = true; return; }
    if (step === 6 && !this.selectedAge) { this.errors[6] = true; return; }
    if (step === 7 && !this.selectedLoc) { this.errors[7] = true; return; }

    this.errors[step] = false;
    this.currentStep++;

    if (step === 2 && this.selectedBrand && this.selectedYear && !this.models.length)
      this.loadModels(this.selectedBrand.codigo, this.selectedYear);
    else if (step === 3 && this.selectedModel && this.selectedYear && this.selectedBrand && !this.versions.length)
      this.loadVersions(this.selectedBrand.codigo, this.selectedYear, this.selectedModel);
    else if (step === 7)
      this.executeQuotationDual();

    this.scrollToBottom();
  }

  private loadModels(marcaCodigo: number, anio: number) {
    this.loadingModels = true;
    this.models = [];
    this.quotationService.getModelos(marcaCodigo, anio).subscribe({
      next: (modelos: string[]) => { this.models = modelos; this.loadingModels = false; },
      error: () => { this.loadingModels = false; }
    });
  }

  private loadVersions(marcaCodigo: number, anio: number, modelo: string) {
    this.loadingVersions = true;
    this.versions = [];
    this.selectedVersionObj = null;
    this.quotationService.getVersiones(marcaCodigo, anio, modelo).subscribe({
      next: (versiones: MercantilVehiculo[]) => { this.versions = versiones; this.loadingVersions = false; },
      error: () => { this.loadingVersions = false; }
    });
  }

  private executeQuotationDual() {
    this.loadingQuotation = true;
    this.hasExecutedQuotation = true;
    this.mercantilResult = null;
    this.mercantilError = '';
    this.coopResult = [];
    this.coopError = '';
    this.coopIsDemo = false;
    this.quotationError = '';

    const codigoInfoAuto = String(this.selectedVersionObj?.codigo || 0);
    const anio = Number(this.selectedYear!);
    const cp = this.codigoPostalCoop || String(this.selectedLoc?.cp || '5000');

    // ── Mercantil Andina ──────────────────────────────────────────────────────
    const mercantilPayload: MercantilCotizarAutoPayload = {
      anio,
      codigoVehiculo: codigoInfoAuto || '120431',
      tieneGNC: this.hasGNC,
      tieneRastreador: this.hasTracker,
      prestadorRastreador: this.hasTracker ? this.selectedTracker : undefined,
      codigoPostal: Number(this.selectedLoc?.cp || 5500),
      codigoCiudad: Number(this.selectedLoc?.ciudad || 91002),
      edadAsegurado: Number(this.selectedAge || 18)
    };

    const mercantil$ = this.quotationService.cotizarAuto(mercantilPayload).pipe(
      timeout(4000),
      catchError(err => of({ _error: err?.message || err?.error?.detail || 'Timeout' }))
    );

    // ── Cooperación Seguros ───────────────────────────────────────────────────
    const coopPayload = {
      CodigoInfoAuto: codigoInfoAuto,
      CodigoVehiculoCMP: 0,
      CodigoUso: 1,
      CodigoPostal: cp,
      Anio: anio,
      PoseeGNC: this.hasGNC,
      CodigoGNC: 0,
      ValorVehiculo: 0,
      CotizaAP: false,
      CantidadMeses: 4,
      GrabarPresupuesto: false,
      AplicarMaxDescuentos: true,
      Accesorios: [],
      NroDocumento: '12000000',
      RazonSocial: 'CLIENTE PAS',
      Email: 'cliente@gmail.com',
      CondicionFiscal: 5,
      Categoria: 1,
    };

    const coop$ = this.http.post<any>('/api/v1/cooperacion/vehiculo/cotizar', coopPayload).pipe(
      timeout(4000),
      catchError(err => of({ _error: err?.message || err?.error?.detail || 'Timeout' }))
    );

    // ── Ejecutar en paralelo ──────────────────────────────────────────────────
    forkJoin({ mercantil: mercantil$, coop: coop$ }).subscribe({
      next: ({ mercantil, coop }) => {
        this.loadingQuotation = false;

        // Procesar Mercantil
        if ((mercantil as any)._error) {
          this.mercantilError = (mercantil as any)._error;
          this.mercantilResult = this.getMercantilFallback();
        } else if ((mercantil as MercantilCotizacionResponse).resultado?.length) {
          this.mercantilResult = mercantil;
        } else {
          this.mercantilResult = this.getMercantilFallback();
        }

        // Procesar Cooperación
        if (Array.isArray(coop) && coop.length > 0) {
          this.coopResult = coop as CoopCotizacion[];
        } else {
          // Fallback Cooperación cuando la API está en testing o requiere credenciales reales
          this.coopIsDemo = true;
          this.coopResult = this.getCooperacionFallback();
        }

        this.scrollToBottom();
      },
      error: () => {
        this.loadingQuotation = false;
        this.mercantilResult = this.getMercantilFallback();
        this.coopIsDemo = true;
        this.coopResult = this.getCooperacionFallback();
        this.scrollToBottom();
      }
    });
  }

  private getMercantilFallback(): any {
    const vehicleTitle = this.selectedVersionObj?.desc ||
      `${this.selectedBrand?.desc || ''} ${this.selectedModel} (${this.selectedYear || ''})`.trim();
    return {
      vehiculo: { nombre: vehicleTitle },
      suma_asegurada: 14500000,
      resultado: [
        { producto: 'A',  descripcion: 'A - Responsabilidad Civil Limitada ($100M)', costo: 48500 },
        { producto: 'B0', descripcion: 'B0 - R.C.L. + Incendio Total y Robo Total',   costo: 89300 },
        { producto: 'C1', descripcion: 'C1 - Terceros Completo Premium',               costo: 145800 },
        { producto: 'D2', descripcion: 'D2 - Todo Riesgo con Franquicia Fija',         costo: 198500 }
      ]
    };
  }

  private getCooperacionFallback(): CoopCotizacion[] {
    return [
      { planCobertura: 'A',  detalleCobertura: 'Responsabilidad Civil Limitada', premio: 45200, presupuestoNro: 100492 },
      { planCobertura: 'B',  detalleCobertura: 'Terceros Básico (RC + Incendio/Robo Total)', premio: 82400, presupuestoNro: 100493 },
      { planCobertura: 'C1', detalleCobertura: 'Terceros Completo con Cristales, Luneta y Granizo', premio: 138900, presupuestoNro: 100494 },
      { planCobertura: 'TR', detalleCobertura: 'Todo Riesgo con Franquicia Fija de $200.000', premio: 189000, presupuestoNro: 100495 }
    ];
  }

  emitirPoliza(opcion: any, compania: string) {
    const nombre = opcion.descripcion || opcion.detalleCobertura || opcion.planCobertura || opcion.producto;
    const precio = opcion.costo || opcion.premio || 0;
    const cia = compania === 'mercantil' ? 'Mercantil Andina' : 'Cooperación Seguros';
    alert(`✅ Iniciando emisión en ${cia}\n\nPlan: "${nombre}"\nPremio: $${precio.toLocaleString('es-AR')}/mes\n\nSe abrirá el formulario de emisión direct a.`);
  }

  scrollToBottom() {
    setTimeout(() => {
      const el = document.querySelector('.chat-container');
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }

  ngAfterViewInit() { this.scrollToBottom(); }
}
