import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '@broker/dashboard';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HttpClientModule],
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
          <h1 class="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-2 md:mb-6 tracking-tight leading-tight">El futuro de la <br class="hidden md:block"/>gestión de seguros</h1>
          <p class="hidden md:block text-lg lg:text-xl text-white/80 font-light leading-relaxed">
            Plataforma inteligente para la administración, cotización y emisión de pólizas. Diseñada para potenciar tu productividad y la de tu equipo.
          </p>
        </div>
      </div>

      <!-- Login Form (Bottom sheet on mobile, Right Side on desktop) -->
      <div class="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 bg-white relative z-20 rounded-t-[32px] md:rounded-none -mt-8 md:mt-0 flex-1 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none">
        
        <div class="w-full max-w-sm pt-4 md:pt-0">

          <div class="mb-10 text-center md:text-left">
            <h2 class="text-3xl font-bold text-on-surface mb-2 tracking-tight">Bienvenido de nuevo</h2>
            <p class="text-on-surface-variant font-body-md text-sm">Ingresa tus credenciales para acceder a tu cuenta.</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- Error Message -->
            <div *ngIf="errorMsg()" class="bg-error/10 border-l-4 border-error text-error p-4 rounded-r-lg text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <span class="material-symbols-outlined text-xl">error</span>
              {{ errorMsg() }}
            </div>

            <!-- Email Field -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-on-surface-variant ml-1">Correo Electrónico</label>
              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant group-focus-within:text-primary transition-colors z-10 pointer-events-none">mail</span>
                <input type="email" formControlName="email" class="w-full bg-surface-container-lowest border-2 border-outline-variant/50 rounded-xl pl-12 py-3.5 pr-4 text-on-surface font-medium focus:border-primary focus:bg-white outline-none transition-all hover:border-outline-variant shadow-sm" placeholder="usuario@katrix.com" />
              </div>
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-on-surface-variant ml-1">Contraseña</label>
              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant group-focus-within:text-primary transition-colors z-10 pointer-events-none">lock</span>
                <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" class="w-full bg-surface-container-lowest border-2 border-outline-variant/50 rounded-xl pl-12 py-3.5 pr-12 text-on-surface font-medium focus:border-primary focus:bg-white outline-none transition-all hover:border-outline-variant shadow-sm" placeholder="••••••••" />
                <button type="button" (click)="togglePassword()" class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full material-symbols-outlined text-outline-variant hover:text-primary hover:bg-surface-container-low transition-colors cursor-pointer focus:outline-none">
                  {{ showPassword() ? 'visibility_off' : 'visibility' }}
                </button>
              </div>
            </div>

            <!-- Options -->
            <div class="flex items-center justify-between pt-2">
              <label class="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" class="w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer">
                <span class="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors select-none">Recordarme</span>
              </label>
              <a routerLink="/forgot-password" class="text-sm font-bold text-primary hover:text-primary-container transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <!-- Action Button -->
            <div class="pt-4">
              <button type="submit" [disabled]="loginForm.invalid || isLoading()"
                      class="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:-translate-y-0.5 hover:bg-primary/90 active:scale-[0.98] active:translate-y-0 transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none">
                <span>{{ isLoading() ? 'Autenticando...' : 'Ingresar al panel' }}</span>
                <span *ngIf="!isLoading()" class="material-symbols-outlined text-xl">arrow_forward</span>
                <span *ngIf="isLoading()" class="material-symbols-outlined animate-spin text-xl">progress_activity</span>
              </button>
            </div>
          </form>

          <!-- Links -->
          <div class="mt-12 text-center space-y-4">
            <p class="text-sm text-on-surface-variant">
              ¿No tienes una cuenta? 
              <a routerLink="/request-access" class="font-bold text-primary hover:underline ml-1">Solicitar acceso</a>
            </p>
          </div>
          
          <footer class="mt-16 text-center opacity-60">
            <p class="font-label-md text-xs text-on-surface-variant">
              © 2026 Powered by Katrix.
            </p>
          </footer>
        </div>
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
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = signal(false);
  isLoading = signal(false);
  errorMsg = signal<string | null>(null);

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    
    this.isLoading.set(true);
    this.errorMsg.set(null);
    
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMsg.set('Credenciales incorrectas o error en el servidor');
        console.error(err);
      }
    });
  }
}
