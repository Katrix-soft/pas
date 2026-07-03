import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-request-access',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Top Navigation Bar -->
    <nav class="sticky top-0 z-40 bg-transparent px-md py-sm flex items-center justify-start border-none absolute w-full">
      <button routerLink="/login" class="p-base hover:bg-surface-container-high rounded-full transition-all flex items-center justify-center cursor-pointer relative z-50">
        <span class="material-symbols-outlined text-primary">arrow_back</span>
      </button>
    </nav>

    <!-- Main Content Canvas -->
    <main class="flex-grow flex flex-col items-center justify-center px-container-margin relative w-full overflow-hidden">
      <!-- Abstract Background Decorative Elements -->
      <div class="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl -z-10"></div>
      <div class="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-secondary-fixed-dim/20 rounded-full blur-3xl -z-10"></div>

      <!-- Focused Transactional Card -->
      <div class="w-full max-w-md glass-card rounded-xl p-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center text-center animate-fade-in-up">
        <!-- Branding Header -->
        <div class="mb-xl">
          <img alt="JCOrg Seguros Logo" class="w-32 h-32 object-contain mx-auto mb-md transform transition-transform hover:scale-105 duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALdX90bEnzYj8tXab6SB6Q_bO066RoA_MOoubYfuUviybyeUuIWTEV9CJnHqyOik-L0lW2X456rwB1hMq5CC5igU7XQ_p8_VuTnT2jlPBMSoQfJ4oshj8dRtLL8D0XSvdZfejWqTzZ4VObXxH3ZKRr-bm3aPRPccuwkhyt8Ex7CEbZi40a9Zh6MlBaeQ0KeEgPTMUNWmMusqmFdZgkd0Lc16M_-liNnBxK7fd9uzJyk-Yfi9NDtT5wMSyERHBqzMpbeMmAQcLy4Gfn">
          <h1 class="font-headline-lg-mobile text-headline-lg-mobile text-on-background tracking-tight">Solicitar Acceso</h1>
        </div>

        <!-- Informational Message -->
        <div class="space-y-md mb-xl">
          <div class="flex items-center justify-center w-12 h-12 bg-surface-container-low rounded-full mx-auto">
            <span class="material-symbols-outlined text-primary text-[28px]">lock_person</span>
          </div>
          <p class="text-on-surface-variant leading-relaxed">
            Para obtener acceso al portal de seguros, por favor contacte a nuestro equipo de administración.
          </p>
          <div class="inline-flex items-center gap-sm px-md py-sm bg-surface-container rounded-lg border border-outline-variant/30">
            <span class="material-symbols-outlined text-primary text-sm">mail</span>
            <span class="font-label-md text-label-md text-primary select-all">soporte&#64;jcorg.com.ar</span>
          </div>
        </div>

        <!-- Action Cluster -->
        <div class="w-full flex flex-col gap-md">
          <a href="mailto:soporte@jcorg.com.ar" class="w-full bg-primary text-on-primary font-headline-sm text-headline-sm py-md rounded-lg flex items-center justify-center gap-sm hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all duration-200">
            <span class="material-symbols-outlined">send</span>
            Enviar Email
          </a>
          <button routerLink="/login" class="w-full bg-transparent border border-primary text-primary font-headline-sm text-headline-sm py-md rounded-lg flex items-center justify-center gap-sm hover:bg-primary-fixed/20 active:scale-[0.98] transition-all duration-200 cursor-pointer">
            <span class="material-symbols-outlined">home</span>
            Volver al Inicio
          </button>
        </div>

        <!-- Secondary Guidance -->
        <div class="mt-lg pt-lg border-t border-outline-variant w-full">
          <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-sm">Asistencia Directa</p>
          <div class="flex justify-center gap-lg">
            <button class="flex flex-col items-center gap-xs group cursor-pointer">
              <div class="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined">help</span>
              </div>
              <span class="text-[10px] font-bold text-outline uppercase">Ayuda</span>
            </button>
            <button class="flex flex-col items-center gap-xs group cursor-pointer">
              <div class="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined">call</span>
              </div>
              <span class="text-[10px] font-bold text-outline uppercase">Llamar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Policy / Trust -->
      <footer class="mt-xl text-center relative z-10 pb-xl">
        <p class="font-label-md text-label-md text-outline opacity-70">
          © 2026 Powered by Katrix. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-height: 100vh;
      background-color: #F8FAFC;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(226, 232, 240, 0.8);
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class RequestAccessComponent {}
