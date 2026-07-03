import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="app-container">
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
      user-select: none; /* Deshabilitar selección de texto predeterminada para look nativo */
    }
  `]
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // Deshabilitar menú contextual en producción para look nativo en Tauri
    document.addEventListener('contextmenu', event => event.preventDefault());
  }
}
