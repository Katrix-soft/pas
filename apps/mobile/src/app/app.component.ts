import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="app-container safe-area">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--bg-primary, #090a0f);
      color: var(--text-primary, #f5f5f7);
    }
    .safe-area {
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
    }
  `]
})
export class AppComponent {}
