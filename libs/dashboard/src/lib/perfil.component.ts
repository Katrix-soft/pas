import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'lib-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  template: `
    <div class="bg-surface text-on-surface font-body-md min-h-screen pb-24 md:pb-8">
      <!-- TopAppBar -->
      <header class="sticky top-0 z-40 bg-surface/95 dark:bg-on-background/95 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-4 py-3 w-full shadow-xs">
        <div class="flex items-center gap-2">
          <button routerLink="/dashboard" class="material-symbols-outlined text-primary p-2 hover:bg-surface-container-high rounded-full transition-all cursor-pointer">arrow_back</button>
          <h1 class="font-bold text-lg text-primary tracking-tight">Mi Perfil Profesional</h1>
        </div>
        <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed shrink-0">
          <img class="w-full h-full object-cover" alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBocJoCDkjvz0SavJ4vfWsNPe1rC7zadFsLVHIZQCkxfOwvDTaMR0Wg9bY9G23szQ-48xqm2l3N5-2_5mixfxLhP6PRoi5hWPDn2-5_0dkLeiS1_-zvC4hW2nvFwf9W4gH6rm-GdjM6YiYmoJuQRs7v1sq_R-KBt3Uq-eI1SQgjStSVtJPi8DiiC6jsK9TQNuttXnFV4IU9X5O0oY-yVDhgDbuq4--dHGEa_pld3QtffuJpM6D6wrooK_HtXaZngIyjhxiSdNE89nYD">
        </div>
      </header>

      <main class="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
        <!-- Profile Hero Section -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div class="h-28 sm:h-32 profile-header-gradient relative">
            <div class="absolute -bottom-10 sm:-bottom-12 left-4 sm:left-6">
              <div class="p-1 bg-surface-container-lowest rounded-full shadow-md">
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-surface-container-lowest">
                  <img class="w-full h-full object-cover" alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt4UiWSA8UA5JIC_UKjqz23kE7ix-9Z2P9uU5xeXPasU7C4ddXo7F6KnFnzgtXE3ZZgkC4-GeqMalVlCAlov1bMR3JqepzErfImMxhPJy579efvurkKk02Oe9SGjuOJNj2laAjEJCLWY9VPrG1IhR8SoCz8itj9Nc_xBmeRlObrlaJPfN_nSngtqZqn9lW6ZiXkg2ve3HR42frgxmpSLVFy8VUIyI7GmGiZkRTN6UOTupglj6hgIGeksWr65SMePd4_mrlBB789iNH">
                </div>
              </div>
            </div>
          </div>
          <div class="pt-12 sm:pt-14 pb-5 px-4 sm:px-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 class="text-xl sm:text-2xl font-extrabold text-on-surface">{{ nombre() }}</h2>
                <p class="text-primary font-bold text-xs sm:text-sm flex items-center gap-1 mt-0.5">
                  <span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">verified</span>
                  <span>Productor Asesor de Seguros (Matrícula #{{ matricula() }})</span>
                </p>
              </div>
              <span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider w-max">
                {{ estadoSSN() }} SSN
              </span>
            </div>
          </div>
        </section>

        <!-- Performance Summary (Sincronizado con APIs) -->
        <section>
          <h3 class="text-xs font-bold text-outline uppercase mb-3 tracking-wider">Resumen de Cartera y Rendimiento</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div class="bg-surface-container-lowest p-3.5 sm:p-4 rounded-xl border border-outline-variant border-l-4 border-l-primary shadow-sm">
              <p class="text-[11px] font-bold text-on-surface-variant uppercase">Premio Mensual</p>
              <p class="text-xl sm:text-2xl font-black text-primary mt-1">{{ premioMensualFmt() }}</p>
            </div>
            <div class="bg-surface-container-lowest p-3.5 sm:p-4 rounded-xl border border-outline-variant border-l-4 border-l-secondary shadow-sm">
              <p class="text-[11px] font-bold text-on-surface-variant uppercase">Pólizas Vigentes</p>
              <p class="text-xl sm:text-2xl font-black text-secondary mt-1">{{ polizasTotales() }}</p>
            </div>
            <div class="bg-surface-container-lowest p-3.5 sm:p-4 rounded-xl border border-outline-variant border-l-4 border-l-tertiary shadow-sm">
              <p class="text-[11px] font-bold text-on-surface-variant uppercase">Clientes Activos</p>
              <p class="text-xl sm:text-2xl font-black text-tertiary mt-1">{{ clientesActivos() }}</p>
            </div>
            <div class="bg-surface-container-lowest p-3.5 sm:p-4 rounded-xl border border-outline-variant border-l-4 border-l-error shadow-sm">
              <p class="text-[11px] font-bold text-on-surface-variant uppercase">Pólizas con Deuda</p>
              <p class="text-xl sm:text-2xl font-black text-error mt-1">{{ polizasDeuda() }}</p>
            </div>
          </div>
        </section>

        <!-- Personal & Professional Data (Dinámico API) -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div class="p-4 border-b border-outline-variant bg-surface-container-low">
            <h3 class="font-bold text-base text-on-surface">Datos Profesionales del PAS</h3>
          </div>
          <div class="divide-y divide-outline-variant text-xs sm:text-sm">
            <div class="p-3.5 sm:p-4 flex justify-between items-center hover:bg-surface-container-lowest/50 transition-colors">
              <div class="min-w-0">
                <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Matrícula SSN / Compañía Principal</p>
                <p class="font-bold text-on-surface truncate">PAS #{{ matricula() }} ({{ companiaPrincipal() }})</p>
              </div>
              <span class="material-symbols-outlined text-outline shrink-0 ml-2">badge</span>
            </div>
            <div class="p-3.5 sm:p-4 flex justify-between items-center hover:bg-surface-container-lowest/50 transition-colors">
              <div class="min-w-0">
                <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Organizador / Broker</p>
                <p class="font-bold text-on-surface truncate">{{ organizador() }}</p>
              </div>
              <span class="material-symbols-outlined text-outline shrink-0 ml-2">domain</span>
            </div>
            <div class="p-3.5 sm:p-4 flex justify-between items-center hover:bg-surface-container-lowest/50 transition-colors">
              <div class="min-w-0">
                <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Email Oficial</p>
                <p class="font-bold text-on-surface truncate">{{ email() }}</p>
              </div>
              <span class="material-symbols-outlined text-outline shrink-0 ml-2">mail</span>
            </div>
            <div class="p-3.5 sm:p-4 flex justify-between items-center hover:bg-surface-container-lowest/50 transition-colors">
              <div class="min-w-0">
                <p class="text-[10px] font-bold text-outline uppercase tracking-wider">Teléfono Organización / Domicilio</p>
                <p class="font-bold text-on-surface truncate">{{ telefono() }} • {{ domicilio() }}</p>
              </div>
              <span class="material-symbols-outlined text-outline shrink-0 ml-2">call</span>
            </div>
            <!-- Subir Logo Row -->
            <div *ngIf="authService.currentUser()?.role === 'pas'" class="p-3.5 sm:p-4 flex justify-between items-center hover:bg-surface-container-lowest/50 transition-colors">
              <div>
                <p class="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Logo de Empresa / Personalización</p>
                <input type="file" accept="image/*" class="hidden" #logoInput (change)="onLogoSelected($event)">
                <button (click)="logoInput.click()" class="font-bold text-primary hover:underline cursor-pointer">
                  Subir o cambiar imagen de logo
                </button>
              </div>
              <div class="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant shrink-0 ml-2">
                <img *ngIf="authService.tenantLogo()" [src]="authService.tenantLogo()" class="w-full h-full object-contain" alt="Logo">
                <span *ngIf="!authService.tenantLogo()" class="material-symbols-outlined text-outline">image</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Menu Options -->
        <section class="space-y-2">
          <h3 class="text-xs font-bold text-outline uppercase px-1 tracking-wider">Configuración & Accesos</h3>
          <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl divide-y divide-outline-variant shadow-sm text-xs sm:text-sm">
            <button routerLink="/notificaciones" class="w-full p-3.5 flex items-center justify-between hover:bg-surface-container-high transition-all group cursor-pointer">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary text-base">notifications</span>
                <span class="font-bold text-on-surface">Notificaciones y Alertas</span>
              </div>
              <span class="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform text-base">chevron_right</span>
            </button>
            <button routerLink="/seguridad" class="w-full p-3.5 flex items-center justify-between hover:bg-surface-container-high transition-all group cursor-pointer">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary text-base">security</span>
                <span class="font-bold text-on-surface">Seguridad y Credenciales API</span>
              </div>
              <span class="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform text-base">chevron_right</span>
            </button>
          </div>
        </section>

        <!-- Logout Button -->
        <section class="pt-4">
          <button routerLink="/login" class="w-full py-3 px-6 bg-surface-container-lowest border-2 border-error text-error font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-error-container/20 active:scale-[0.98] transition-all cursor-pointer text-sm">
            <span class="material-symbols-outlined text-base">logout</span>
            <span>Cerrar Sesión</span>
          </button>
          <p class="text-center text-outline text-xs mt-6 font-semibold">JC Broker Platform v2.4.1 — Powered by Katrix</p>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .profile-header-gradient {
        background: linear-gradient(180deg, #0058be 0%, #213145 100%);
    }
  `]
})
export class PerfilComponent implements OnInit {
  authService = inject(AuthService);
  private http = inject(HttpClient);

  nombre = signal<string>('Gonzalo Javier Paso');
  matricula = signal<string>('86992');
  organizador = signal<string>('JCORG Broker de Seguros / Los Cerros Directo');
  email = signal<string>('gpaso@jcorg.com.ar');
  telefono = signal<string>('0261 423-8800');
  domicilio = signal<string>('Mendoza, Argentina');
  estadoSSN = signal<string>('HABILITADO');
  companiaPrincipal = signal<string>('Mercantil Andina');
  
  premioMensualFmt = signal<string>('$18.5M');
  polizasTotales = signal<number>(312);
  clientesActivos = signal<number>(219);
  polizasDeuda = signal<number>(5);

  ngOnInit() {
    this.cargarDatosPerfil();
  }

  cargarDatosPerfil() {
    const u = this.authService.currentUser();
    if (u) {
      if (u.name) this.nombre.set(u.name);
      if (u.matricula) this.matricula.set(u.matricula);
      if (u.organizador) this.organizador.set(u.organizador);
      if (u.email) this.email.set(u.email);
    }

    this.http.get<any>('/api/v1/quotations/mercantil/productor').subscribe({
      next: (res) => {
        if (res?.productor) {
          const p = res.productor;
          if (p.nombre) this.nombre.set(p.nombre);
          if (p.matricula) this.matricula.set(p.matricula);
          if (p.organizador) this.organizador.set(p.organizador);
          if (p.email) this.email.set(p.email);
          if (p.telefono) this.telefono.set(p.telefono);
          if (p.domicilio) this.domicilio.set(p.domicilio);
          if (p.estado_ssn) this.estadoSSN.set(p.estado_ssn);
          if (p.compania_principal) this.companiaPrincipal.set(p.compania_principal);

          if (p.cartera) {
            if (p.cartera.premio_fmt) this.premioMensualFmt.set(p.cartera.premio_fmt);
            if (p.cartera.polizas_totales) this.polizasTotales.set(p.cartera.polizas_totales);
            if (p.cartera.clientes_activos) this.clientesActivos.set(p.cartera.clientes_activos);
            if (p.cartera.polizas_deuda) this.polizasDeuda.set(p.cartera.polizas_deuda);
          }
        }
      },
      error: () => {}
    });

    this.http.get<any>('/api/v1/quotations/mercantil/portfolio/metrics').subscribe({
      next: (m) => {
        if (m) {
          if (m.premio_administrado_fmt) this.premioMensualFmt.set(m.premio_administrado_fmt);
          if (m.polizas_vigentes) this.polizasTotales.set(m.polizas_vigentes);
          if (m.clientes_activos) this.clientesActivos.set(m.clientes_activos);
          if (m.polizas_deuda) this.polizasDeuda.set(m.polizas_deuda);
        }
      },
      error: () => {}
    });
  }

  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        this.authService.tenantLogo.set(base64);
        localStorage.setItem('tenantLogo', base64);
      };
      reader.readAsDataURL(file);
    }
  }
}
