import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="flex-grow flex items-center justify-center w-full">
      <div class="w-full max-w-[440px] flex flex-col items-center relative">
        <!-- Brand Logo Header -->
        <div class="mb-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <img alt="JC Organizadores Logo" class="h-24 w-auto object-contain" 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsQ8yQtRi4ntI09YZoOXO-5aPc3CkPiYjLj-8XBKbS9Iq9nXR9GqRv74FkVwgYeAR5uw7QYOADx-vPSgsbSOVCEEi3gh8aE5wGVQATKi_7me2TIRl7oHqI3KCpEZby-7N4HD9wjaJulhIX97ao9GDYz9wdSdM5j5zXmsNRTgj4v6cLyiqFofAJqqM37_OwRBM9c3tH2x7rntlDWwYmoJE3tA9j9aOSTcNkh1YBHQXOFDkI-7k4yKysiujUJnNB4qEYY3aQgWJkgKKO">
        </div>

        <!-- Content Card -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg w-full auth-card flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
          <header class="mb-lg text-center">
            <h1 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-sm">
              Recuperar Contraseña
            </h1>
            <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu acceso.
            </p>
          </header>

          <!-- Recovery Form -->
          <form [formGroup]="recoveryForm" (ngSubmit)="onSubmit()" class="space-y-lg">
            <div class="space-y-xs">
              <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" for="email">
                Email
              </label>
              <div class="relative group input-focus-ring rounded-lg overflow-hidden transition-all duration-200">
                <span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input formControlName="email"
                       class="w-full pl-12 pr-md py-md bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-body-md placeholder:text-outline transition-all rounded-lg outline-none" 
                       id="email" placeholder="ejemplo@gmail.com" type="email">
              </div>
            </div>
            
            <button type="submit" 
                    [disabled]="recoveryForm.invalid || isLoading()"
                    class="w-full bg-primary text-on-primary font-label-md text-label-md py-md px-lg rounded-full flex items-center justify-center gap-sm hover:bg-primary-container active:scale-[0.98] transition-all duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
              <span *ngIf="!isLoading()">Enviar Instrucciones</span>
              <span *ngIf="!isLoading()" class="material-symbols-outlined text-[18px]">send</span>
              <span *ngIf="isLoading()" class="animate-spin material-symbols-outlined">progress_activity</span>
            </button>
          </form>

          <!-- Secondary Action -->
          <div class="mt-lg pt-lg border-t border-outline-variant flex justify-center">
            <a routerLink="/login" class="font-label-md text-label-md text-primary flex items-center gap-xs hover:underline active:opacity-70 transition-all">
              <span class="material-symbols-outlined text-[18px]">arrow_back</span>
              Volver al Inicio
            </a>
          </div>
        </div>

        <!-- Footer Compliance/Support -->
        <footer class="mt-xl text-center relative z-10">
          <p class="font-label-md text-label-md text-outline uppercase tracking-widest">
            Seguros Elite • ID: 4492
          </p>
          <div class="mt-md flex gap-md justify-center">
            <button class="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Ayuda</button>
            <span class="text-outline-variant">•</span>
            <button class="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Privacidad</button>
          </div>
        </footer>

        <!-- Success Message Overlay -->
        <div *ngIf="showSuccess()" 
             class="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm z-50 flex items-center justify-center p-md transition-opacity duration-300">
          <div class="bg-surface-container-lowest p-xl rounded-xl max-w-sm w-full text-center shadow-xl transform transition-transform duration-300 scale-100">
            <div class="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto mb-lg">
              <span class="material-symbols-outlined text-[40px]">check_circle</span>
            </div>
            <h2 class="font-headline-sm text-headline-sm text-on-surface mb-sm">¡Correo Enviado!</h2>
            <p class="font-body-md text-body-md text-on-surface-variant mb-xl">
              Revisa tu bandeja de entrada. Te hemos enviado un enlace para restablecer tu contraseña.
            </p>
            <a routerLink="/login" 
               class="block w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-full text-center hover:bg-primary-container transition-colors">
              Entendido
            </a>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
    }
    .auth-card {
      box-shadow: 0px 4px 12px rgba(0,0,0,0.05);
    }
    .input-focus-ring:focus-within {
      box-shadow: 0 0 0 2px rgba(0, 88, 190, 0.15);
    }
  `]
})
export class ForgotPasswordComponent {
  recoveryForm: FormGroup;
  isLoading = signal(false);
  showSuccess = signal(false);

  constructor(private fb: FormBuilder) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.recoveryForm.valid) {
      this.isLoading.set(true);
      
      // Simulate network delay
      setTimeout(() => {
        this.isLoading.set(false);
        this.showSuccess.set(true);
      }, 1200);
    }
  }
}
