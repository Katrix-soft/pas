import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-ticket-seguimiento',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="font-body-md text-on-surface min-h-screen bg-[#F8FAFC] pb-24 md:pb-0">
      <!-- Top Navigation Bar -->
      <nav class="bg-surface sticky top-0 z-50 w-full border-b border-outline-variant flex items-center justify-between px-md py-sm">
        <div class="flex items-center gap-sm">
          <button routerLink="/dashboard" class="material-symbols-outlined text-primary cursor-pointer hover:bg-surface-container-high p-2 rounded-full transition-colors active:scale-95">arrow_back</button>
          <span class="font-headline-md text-headline-md font-bold text-primary">Assurance Nexus</span>
        </div>
        <div class="flex items-center gap-md">
          <div class="hidden md:flex gap-md">
            <span routerLink="/dashboard" class="font-label-md text-label-md text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Dashboard</span>
            <span class="font-label-md text-label-md text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Quotes</span>
            <span routerLink="/clientes" class="font-label-md text-label-md text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Clients</span>
          </div>
          <div routerLink="/perfil" class="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center overflow-hidden cursor-pointer hover:brightness-110 transition-all">
            <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASNphQntXvkyF-nOQragakMf2UWVJa39JwjuFATiZKK055HSsWs7oS5tpSTh9AOCvIDwmG7XcYj5qwiBKUUBN3l20wBoKAxK2V01n63oqX9cl_T3t917CtJaEPJUeMHxdM6O8wUhB3CdPqIa8TrRcXUmIwQYPd2Gs7y0J6B7FGH_JRzpvlN1poqA8fQtR1DBuNhJiXtvoT3JRrniqFticTCUapZ_P7Ua7M-OCtmrL2bRKJPRpsjYlppQ"/>
          </div>
        </div>
      </nav>

      <main class="max-w-5xl mx-auto px-md py-lg mb-xl">
        <!-- Header Section -->
        <header class="mb-lg flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div>
            <div class="flex items-center gap-sm text-on-surface-variant mb-xs">
              <span class="material-symbols-outlined text-[18px]">confirmation_number</span>
              <span class="font-label-md text-label-md uppercase tracking-wider">Detalle del Trámite</span>
            </div>
            <h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg">Ticket #TK-9928</h1>
          </div>
          <div class="flex items-center gap-sm">
            <span class="bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-label-md text-label-md flex items-center gap-xs">
              <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              En Proceso
            </span>
          </div>
        </header>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-lg">
          <!-- Left Column: Traceability & Management -->
          <div class="md:col-span-8 space-y-lg">
            <!-- Traceability Stepper Card -->
            <section class="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm">
              <h2 class="font-headline-sm text-headline-sm mb-lg">Línea de Trazabilidad</h2>
              
              <div class="relative flex justify-between items-start pt-base">
                <div class="absolute top-6 left-0 right-0 h-[2px] bg-[#E2E8F0] z-0"></div>
                <div class="absolute top-6 left-0 w-[66%] h-[2px] bg-[#0058be] z-10"></div>
                
                <!-- Step 1 -->
                <div class="relative z-10 flex flex-col items-center text-center max-w-[80px]">
                  <div class="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center mb-sm shadow-sm">
                    <span class="material-symbols-outlined">inbox</span>
                  </div>
                  <span class="font-label-md text-label-md text-on-surface font-bold">Solicitud Recibida</span>
                  <span class="font-body-sm text-[10px] text-on-surface-variant">12 Oct, 09:30</span>
                </div>
                
                <!-- Step 2 -->
                <div class="relative z-10 flex flex-col items-center text-center max-w-[80px]">
                  <div class="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center mb-sm shadow-sm">
                    <span class="material-symbols-outlined">analytics</span>
                  </div>
                  <span class="font-label-md text-label-md text-on-surface font-bold">Análisis Técnico</span>
                  <span class="font-body-sm text-[10px] text-on-surface-variant">12 Oct, 14:15</span>
                </div>
                
                <!-- Step 3 (Active) -->
                <div class="relative z-10 flex flex-col items-center text-center max-w-[80px]">
                  <div class="w-12 h-12 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center mb-sm border-2 border-primary">
                    <span class="material-symbols-outlined">verified_user</span>
                  </div>
                  <span class="font-label-md text-label-md text-primary font-bold">Validación Compañía</span>
                  <span class="font-body-sm text-[10px] text-primary">En curso</span>
                </div>
                
                <!-- Step 4 -->
                <div class="relative z-10 flex flex-col items-center text-center max-w-[80px]">
                  <div class="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center mb-sm">
                    <span class="material-symbols-outlined">assignment_turned_in</span>
                  </div>
                  <span class="font-label-md text-label-md text-on-surface-variant">Emisión Final</span>
                  <span class="font-body-sm text-[10px] text-on-surface-variant">Pendiente</span>
                </div>
              </div>
            </section>

            <!-- Management Details Bento -->
            <section class="grid grid-cols-1 sm:grid-cols-3 gap-md">
              <div class="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary rounded-lg p-md hover:shadow-md transition-shadow">
                <span class="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">Cliente</span>
                <p class="font-headline-sm text-headline-sm">Alejandro Morales</p>
                <p class="font-body-sm text-on-surface-variant">ID: 20-33445566-9</p>
              </div>
              <div class="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-secondary rounded-lg p-md hover:shadow-md transition-shadow">
                <span class="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">Ramo</span>
                <p class="font-headline-sm text-headline-sm">Automotor</p>
                <p class="font-body-sm text-on-surface-variant">Póliza: Todo Riesgo</p>
              </div>
              <div class="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-tertiary rounded-lg p-md hover:shadow-md transition-shadow">
                <span class="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">Compañía</span>
                <p class="font-headline-sm text-headline-sm">Allianz</p>
                <p class="font-body-sm text-on-surface-variant">Sucursal Central</p>
              </div>
            </section>

            <!-- System Notes / Updates -->
            <section class="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg">
              <div class="flex items-center justify-between mb-md">
                <h3 class="font-headline-sm text-headline-sm flex items-center gap-xs">
                  <span class="material-symbols-outlined text-primary">history_edu</span>
                  Notas del Sistema
                </h3>
                <span class="text-on-surface-variant font-label-md text-label-md">Últimas 48hs</span>
              </div>
              
              <div class="space-y-md">
                <div class="flex gap-md pb-md border-b border-outline-variant">
                  <div class="w-10 h-10 rounded-full bg-surface-container-high flex-shrink-0 flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary-fixed-dim">smart_toy</span>
                  </div>
                  <div>
                    <p class="font-body-md text-on-surface"><span class="font-bold">IA Analysis:</span> La documentación adjunta ha sido verificada satisfactoriamente. Procediendo a validación externa con Allianz.</p>
                    <span class="font-body-sm text-on-surface-variant text-[12px]">Hace 2 horas</span>
                  </div>
                </div>
                
                <div class="flex gap-md pb-md border-b border-outline-variant">
                  <div class="w-10 h-10 rounded-full bg-surface-container-high flex-shrink-0 flex items-center justify-center">
                    <span class="material-symbols-outlined text-on-surface-variant">admin_panel_settings</span>
                  </div>
                  <div>
                    <p class="font-body-md text-on-surface"><span class="font-bold">Admin Update:</span> Ticket asignado a la mesa técnica de riesgos especiales.</p>
                    <span class="font-body-sm text-on-surface-variant text-[12px]">Hoy, 08:45 AM</span>
                  </div>
                </div>
                
                <div class="flex gap-md">
                  <div class="w-10 h-10 rounded-full bg-error-container flex-shrink-0 flex items-center justify-center">
                    <span class="material-symbols-outlined text-error">priority_high</span>
                  </div>
                  <div>
                    <p class="font-body-md text-on-surface"><span class="font-bold">Sistema:</span> Se requiere confirmación de inspección técnica previa.</p>
                    <span class="font-body-sm text-on-surface-variant text-[12px]">Ayer, 16:20 PM</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column: Quick Actions & Context -->
          <div class="md:col-span-4 space-y-lg">
            <!-- Quick Actions Card -->
            <section class="bg-inverse-surface text-on-primary-container rounded-lg p-lg shadow-lg">
              <h3 class="font-headline-sm text-headline-sm text-surface mb-md">Acciones Rápidas</h3>
              <div class="flex flex-col gap-sm">
                <button class="w-full bg-primary text-on-primary py-md px-md rounded-lg font-bold flex items-center justify-center gap-sm transition-all hover:brightness-110 active:scale-95 cursor-pointer">
                  <span class="material-symbols-outlined">support_agent</span>
                  Contactar Soporte
                </button>
                <button class="w-full bg-surface-container-lowest text-primary border border-primary py-md px-md rounded-lg font-bold flex items-center justify-center gap-sm transition-all hover:bg-surface-container-low active:scale-95 cursor-pointer">
                  <span class="material-symbols-outlined">upload_file</span>
                  Adjuntar Documentación
                </button>
              </div>
            </section>

            <!-- Summary Info Card -->
            <section class="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
              <div class="h-32 bg-primary-container relative">
                <div class="absolute inset-0 opacity-10 flex items-center justify-center overflow-hidden">
                  <span class="material-symbols-outlined scale-[10] text-primary">security</span>
                </div>
                <div class="absolute bottom-md left-md">
                  <span class="bg-on-secondary-container text-white px-sm py-xs rounded font-label-md text-[10px] uppercase">Allianz Partner</span>
                </div>
              </div>
              <div class="p-md space-y-sm">
                <div class="flex justify-between items-center py-xs border-b border-outline-variant">
                  <span class="font-body-sm text-on-surface-variant">Creado el</span>
                  <span class="font-label-md text-on-surface">12/10/2023</span>
                </div>
                <div class="flex justify-between items-center py-xs border-b border-outline-variant">
                  <span class="font-body-sm text-on-surface-variant">SLA Estimado</span>
                  <span class="font-label-md text-secondary">24 Horas</span>
                </div>
                <div class="flex justify-between items-center py-xs">
                  <span class="font-body-sm text-on-surface-variant">Prioridad</span>
                  <span class="font-label-md text-error">Alta</span>
                </div>
              </div>
            </section>

            <!-- Help Context -->
            <div class="p-md bg-surface-container rounded-lg border border-outline-variant flex items-start gap-sm">
              <span class="material-symbols-outlined text-primary">info</span>
              <p class="font-body-sm text-on-surface-variant">
                Si necesita modificar los datos del cliente antes de la emisión, por favor utilice el botón de <strong>Contactar Soporte</strong> para informar el cambio.
              </p>
            </div>
          </div>
        </div>
      </main>

    </div>
  `
})
export class TicketSeguimientoComponent {
}
