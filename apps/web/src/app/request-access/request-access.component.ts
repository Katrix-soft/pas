import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-request-access',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex flex-col md:flex-row bg-surface font-body-md w-full">
      
      <!-- Branding / Visual (Header on mobile, Left Side on desktop) -->
      <div class="flex w-full md:w-1/2 lg:w-3/5 relative overflow-hidden items-center justify-center bg-[#0a0f24] min-h-[35vh] md:min-h-screen pb-12 md:pb-0">
        <!-- Background Image with Overlay -->
        <img src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 md:opacity-40">
        
        <!-- Abstract Gradients -->
        <div class="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-br from-primary/70 via-[#1e1b4b]/80 to-[#0a0f24]/90 mix-blend-multiply"></div>

        <div class="relative z-10 p-6 md:p-12 text-white max-w-xl text-center flex flex-col items-center">
          <img alt="JC Organizadores Logo" src="assets/logo.png" class="h-10 sm:h-14 md:h-20 max-w-[180px] md:max-w-[260px] mb-3 md:mb-8 object-contain drop-shadow-lg rounded-2xl bg-white/95 p-2 md:p-3">
          <h1 class="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-2 md:mb-6 tracking-tight leading-tight">Acceso Exclusivo <br class="hidden md:block"/>para Productores</h1>
          <p class="hidden md:block text-lg lg:text-xl text-white/80 font-light leading-relaxed">
            Únete a la red de productores más innovadora y gestiona todas tus pólizas desde una única plataforma inteligente.
          </p>
        </div>
      </div>

      <!-- Request Access Form (Bottom sheet on mobile, Right Side on desktop) -->
      <div class="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 bg-white relative z-20 rounded-t-[32px] md:rounded-none -mt-8 md:mt-0 flex-1 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none">
        
        <div class="w-full max-w-sm pt-4 md:pt-0">
          <!-- Mobile Logo (Only visible on mobile) -->
          <img alt="Logo" class="md:hidden h-12 mb-6 mx-auto object-contain bg-white/95 p-2 rounded-xl drop-shadow" src="assets/logo.png">

          <!-- Back Button -->
          <button routerLink="/login" class="mb-8 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer group w-fit">
            <span class="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span class="text-sm font-bold">Volver al login</span>
          </button>

          <div class="mb-8 text-center md:text-left">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl mb-4">
              <span class="material-symbols-outlined text-2xl">lock_person</span>
            </div>
            <h2 class="text-3xl font-bold text-on-surface mb-2 tracking-tight">Solicitar Acceso</h2>
            <p class="text-on-surface-variant font-body-md text-sm leading-relaxed">
              {{ showForm() ? 'Complete sus datos para enviar la solicitud de acceso.' : 'Para obtener acceso al portal de seguros, contáctese con nuestro equipo de administración.' }}
            </p>
          </div>

          <!-- Initial State (No Form) -->
          <div *ngIf="!showForm()" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <!-- Email Box -->
            <div class="flex items-center gap-4 p-4 bg-surface-container-lowest border-2 border-outline-variant/50 rounded-xl hover:border-primary/50 transition-colors">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <span class="material-symbols-outlined text-lg">mail</span>
              </div>
              <div>
                <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Correo de Soporte</p>
                <p class="text-on-surface font-semibold select-all">supit&#64;katrix.com.ar</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-3 pt-2">
              <button (click)="toggleForm()" class="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:-translate-y-0.5 hover:bg-primary/90 active:scale-[0.98] active:translate-y-0 transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer">
                <span>Enviar Email</span>
                <span class="material-symbols-outlined text-xl">send</span>
              </button>
              
              <button routerLink="/login" class="w-full py-4 bg-transparent border-2 border-outline-variant/50 text-on-surface-variant font-bold rounded-xl hover:border-outline-variant hover:bg-surface-container-lowest hover:text-on-surface active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer">
                <span>Volver al Inicio</span>
              </button>
            </div>
          </div>

          <!-- Form State -->
          <form *ngIf="showForm()" [formGroup]="requestForm" (ngSubmit)="onSubmit()" class="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            
            <div class="space-y-1">
              <label class="text-xs font-bold text-on-surface-variant ml-1">Nombre Completo</label>
              <input type="text" formControlName="fullName" class="w-full bg-surface-container-lowest border-2 border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary focus:bg-white outline-none transition-all shadow-sm" placeholder="Ej. Juan Pérez" />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-on-surface-variant ml-1">Correo Electrónico</label>
              <input type="email" formControlName="email" class="w-full bg-surface-container-lowest border-2 border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary focus:bg-white outline-none transition-all shadow-sm" placeholder="juan@ejemplo.com" />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-on-surface-variant ml-1">Teléfono</label>
              <input type="tel" formControlName="phone" class="w-full bg-surface-container-lowest border-2 border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary focus:bg-white outline-none transition-all shadow-sm" placeholder="+54 9 11 1234-5678" />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-on-surface-variant ml-1">Mensaje (Opcional)</label>
              <textarea formControlName="message" rows="2" class="w-full bg-surface-container-lowest border-2 border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:border-primary focus:bg-white outline-none transition-all shadow-sm resize-none" placeholder="Escriba aquí el motivo de su solicitud..."></textarea>
            </div>

            <div class="flex flex-col gap-3 pt-2">
              <button type="submit" [disabled]="requestForm.invalid" class="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:-translate-y-0.5 hover:bg-primary/90 active:scale-[0.98] active:translate-y-0 transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none">
                <span>Enviar por Correo</span>
                <span class="material-symbols-outlined text-xl">send</span>
              </button>
              <button type="button" (click)="toggleForm()" class="w-full py-3 bg-transparent text-on-surface-variant font-bold hover:text-primary transition-colors flex justify-center items-center gap-2 cursor-pointer">
                <span>Cancelar</span>
              </button>
            </div>
          </form>
          
          <!-- Secondary Guidance -->
          <div class="mt-8 pt-8 border-t border-outline-variant/50" *ngIf="!showForm()">
              <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center mb-6">Asistencia Directa</p>
              <div class="flex justify-center gap-8">
                <button class="flex flex-col items-center gap-2 group cursor-pointer">
                  <div class="w-12 h-12 rounded-full border-2 border-outline-variant/50 flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-all group-hover:shadow-md bg-surface-container-lowest">
                    <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">help</span>
                  </div>
                  <span class="text-[10px] font-bold text-on-surface-variant uppercase group-hover:text-primary transition-colors">Ayuda</span>
                </button>
                <button class="flex flex-col items-center gap-2 group cursor-pointer">
                  <div class="w-12 h-12 rounded-full border-2 border-outline-variant/50 flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-all group-hover:shadow-md bg-surface-container-lowest">
                    <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">call</span>
                  </div>
                  <span class="text-[10px] font-bold text-on-surface-variant uppercase group-hover:text-primary transition-colors">Llamar</span>
                </button>
              </div>
            </div>

          </div>

          <footer class="mt-16 text-center opacity-60">
            <p class="font-label-md text-xs text-on-surface-variant">
              © 2026 Powered by Katrix.
            </p>
          </footer>
        </div>
      </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }
  `]
})
export class RequestAccessComponent {
  showForm = signal(false);
  requestForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.requestForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['']
    });
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
  }

  onSubmit(): void {
    if (this.requestForm.invalid) return;

    const { fullName, email, phone, message } = this.requestForm.value;
    
    const subject = encodeURIComponent(`Solicitud de Acceso - ${fullName}`);
    const body = encodeURIComponent(`Hola equipo de soporte Katrix,

Deseo solicitar acceso a la plataforma para gestionar pólizas. Mis datos de contacto son:

Nombre: ${fullName}
Email: ${email}
Teléfono: ${phone}

Mensaje adicional:
${message || 'Sin mensaje adicional.'}

Quedo a la espera de su respuesta. Gracias.`);

    // Abre el cliente de correo por defecto (Outlook, Gmail, Apple Mail, etc)
    window.location.href = `mailto:supit@katrix.com.ar?subject=${subject}&body=${body}`;
    
    // Opcional: limpiar y volver atrás tras solicitar
    this.showForm.set(false);
    this.requestForm.reset();
  }
}
