import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-poliza-emitida',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-surface text-on-surface font-body-md min-h-screen pb-24 md:pb-0">
      <!-- Top Navigation -->
      <header class="sticky top-0 w-full z-50 bg-surface border-b border-outline-variant h-16 flex justify-between items-center px-container-margin max-w-7xl mx-auto left-0 right-0">
        <div class="flex items-center gap-3">
          <button routerLink="/dashboard" class="material-symbols-outlined text-primary cursor-pointer hover:bg-surface-container-high p-2 rounded-full transition-colors active:scale-95 md:hidden">arrow_back</button>
          <img alt="JC Organizadores Logo" class="h-8 w-8 object-contain hidden md:block" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA3SC9XTMaUZGcdORWq1hpFJAe0XoRpeMh0qyozG7k01yVsSSvggkBzxHxP2K6h_oEov0PQqjRFRhDOVX5HH6ApB85eyZz5PNduV8tQ3qiDRczpXYBRLhwnchUTbC6vOyokuMIupqk_sROZDe20Kz_IGJEI2FnZg4OElYucXrOSogpMPgY91C60eeeh-WuJ18D53mLsRN2rYbiniCx87Dt6SnxNsXnOD-SKCWyTu-OrfDrvjpQsMWsRfivF9Pz-1hrCS4"/>
          <span class="font-headline-md text-headline-md font-bold text-primary">JC Organizadores</span>
        </div>
        <button routerLink="/perfil" class="text-on-surface-variant hover:bg-surface-container rounded-full p-2 transition-colors cursor-pointer">
          <span class="material-symbols-outlined">account_circle</span>
        </button>
      </header>

      <main class="pt-12 md:pt-24 px-container-margin max-w-3xl mx-auto mb-xl">
        <!-- Success State Header -->
        <section class="flex flex-col items-center text-center mb-10">
          <div class="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-6 success-glow">
            <span class="material-symbols-outlined text-5xl" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          </div>
          <h1 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-2">Póliza Emitida con Éxito</h1>
          <p class="text-on-surface-variant font-body-md">El proceso de emisión ha finalizado correctamente. La cobertura ya se encuentra vigente.</p>
        </section>

        <!-- Policy Summary Bento Card -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant card-accent-blue shadow-sm">
            <span class="text-label-md font-label-md text-outline uppercase mb-1 block">Nro. de Póliza</span>
            <p class="font-headline-sm text-headline-sm text-primary mb-4">#AZ-998234-2024</p>
            <span class="text-label-md font-label-md text-outline uppercase mb-1 block">Compañía</span>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">verified</span>
              <p class="font-body-lg text-body-lg font-bold">Allianz</p>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant card-accent-green shadow-sm">
            <span class="text-label-md font-label-md text-outline uppercase mb-1 block">Cliente</span>
            <p class="font-body-lg text-body-lg font-bold text-on-surface mb-4">Roberto Gomez Sanchez</p>
            <span class="text-label-md font-label-md text-outline uppercase mb-1 block">Ramo</span>
            <div class="inline-flex items-center px-3 py-1 bg-surface-container rounded-full text-on-surface-variant font-label-md text-label-md">
              Seguro de Hogar Premium
            </div>
          </div>
        </div>

        <!-- Primary Actions -->
        <section class="flex flex-col gap-3 mb-8">
          <button (click)="descargarPoliza()" [disabled]="isDownloading()" class="w-full bg-primary text-on-primary py-4 rounded-lg font-headline-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all hover:brightness-110 cursor-pointer disabled:opacity-70 disabled:cursor-wait">
            @if(isDownloading()) {
              <span class="material-symbols-outlined animate-spin">sync</span>
              Preparando Archivo...
            } @else if(isDownloaded()) {
              <span class="material-symbols-outlined">check</span>
              ¡Descarga Lista!
            } @else {
              <span class="material-symbols-outlined">download</span>
              Descargar Póliza (PDF)
            }
          </button>
          <button class="w-full bg-[#25D366] text-white py-4 rounded-lg font-headline-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all hover:brightness-110 cursor-pointer">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">share</span>
            Compartir por WhatsApp
          </button>
        </section>

        <!-- Secondary Actions -->
        <section class="grid grid-cols-2 gap-4">
          <button routerLink="/clientes/detalle" class="border border-primary text-primary py-3 rounded-lg font-body-md font-semibold hover:bg-surface-container-low transition-colors cursor-pointer">
            Ver Detalle Cliente
          </button>
          <button routerLink="/dashboard" class="border border-outline-variant text-on-surface-variant py-3 rounded-lg font-body-md font-semibold hover:bg-surface-container-low transition-colors cursor-pointer">
            Volver al Inicio
          </button>
        </section>

        <!-- Micro-interaction Visual Feedback -->
        <div class="mt-12 p-4 bg-surface-container rounded-lg border border-outline-variant flex items-start gap-3">
          <span class="material-symbols-outlined text-primary">info</span>
          <p class="text-body-sm text-on-surface-variant">La copia digital se ha enviado automáticamente al correo registrado del cliente: <span class="font-bold">roberto.gomez&#64;email.com</span></p>
        </div>
      </main>


    </div>
  `,
  styles: [`
    .success-glow {
        animation: pulse-glow 2s infinite ease-in-out;
    }
    @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(0, 108, 73, 0.2); }
        50% { box-shadow: 0 0 40px rgba(0, 108, 73, 0.4); }
    }
    .card-accent-green { border-left: 4px solid #006c49; }
    .card-accent-blue { border-left: 4px solid #0058be; }
  `]
})
export class PolizaEmitidaComponent {
  isDownloading = signal(false);
  isDownloaded = signal(false);

  descargarPoliza() {
    this.isDownloading.set(true);
    
    // Simulamos el tiempo de preparacion del archivo
    setTimeout(() => {
      this.isDownloading.set(false);
      this.isDownloaded.set(true);
      
      // Reseteamos el boton despues de unos segundos
      setTimeout(() => {
        this.isDownloaded.set(false);
      }, 2000);
    }, 1500);
  }
}
