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
    <main class="w-full max-w-md mx-auto">
      <!-- Logo Section -->
      <div class="flex flex-col items-center mb-xl">
        <img alt="JC Organizadores Logo" class="h-24 md:h-32 w-auto mb-md object-contain" 
             src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWmWtBTOG94ebZcQp0UsJ6-0V6LVgCiuVka12SaJiSnycaDjT4UAneUW1KkNSHjdKY2UH4QqvtgyuuGMuYWv782qq8YKsON7lzY-Lfa7EUdlDMvxPzbhmId2Jk_qwzaWf6u7UtMH6nMUSSRt0utH_nlQ2XxJONaq1dz10BEbyvSu7otZUp4ZkK1A2fZ-VFkBy-HdbRQ1wWPZTOohnN6HzD64k8QIG5wNIu8a0gnSX_oa2UfXKNAIyfNRca4wtw_RPX8T81IoCGA7Eo">
        <h1 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface text-center mt-sm">Bienvenido</h1>
        <p class="font-body-md text-body-md text-on-surface-variant text-center opacity-80">Gestione sus pólizas con control y precisión.</p>
      </div>

      <!-- Form Card -->
      <div class="bg-surface-container-lowest login-card p-lg rounded-xl border border-outline-variant">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-lg">
          
          <div *ngIf="errorMsg()" class="bg-error-container text-on-error-container p-sm rounded-lg text-sm text-center">
            {{ errorMsg() }}
          </div>

          <div class="space-y-sm">
            <label class="font-label-md text-on-surface">Correo Electrónico</label>
            <input type="email" formControlName="email" class="w-full bg-surface-container-low border border-outline-variant rounded-lg p-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="admin@katrix.com" />
          </div>

          <div class="space-y-sm relative">
            <label class="font-label-md text-on-surface">Contraseña</label>
            <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" class="w-full bg-surface-container-low border border-outline-variant rounded-lg p-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="••••••••" />
            <button type="button" (click)="togglePassword()" class="absolute right-3 top-8 material-symbols-outlined text-on-surface-variant hover:text-primary">
              {{ showPassword() ? 'visibility_off' : 'visibility' }}
            </button>
          </div>

          <!-- Action Button -->
          <div class="pt-sm">
            <button type="submit" [disabled]="loginForm.invalid || isLoading()"
                    class="w-full py-md px-lg bg-primary text-on-primary font-headline-sm rounded-lg shadow-sm hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all duration-150 flex justify-center items-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <span>{{ isLoading() ? 'Iniciando...' : 'Iniciar Sesión' }}</span>
              <span *ngIf="!isLoading()" class="material-symbols-outlined">login</span>
            </button>
          </div>
        </form>

        <!-- Links -->
        <div class="mt-lg flex flex-col gap-md items-center border-t border-outline-variant pt-lg">
          <a routerLink="/forgot-password" class="font-label-md text-label-md text-primary hover:underline transition-all">
            ¿Olvidaste tu contraseña?
          </a>
          <div class="flex items-center gap-xs">
            <span class="font-body-sm text-body-sm text-on-surface-variant">¿No tienes cuenta?</span>
            <a routerLink="/request-access" class="font-label-md text-label-md text-secondary font-bold hover:underline">
              Solicitar acceso
            </a>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="mt-xl text-center">
        <p class="font-label-md text-label-md text-outline">
          © 2026 Powered by Katrix.
        </p>
      </footer>
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
