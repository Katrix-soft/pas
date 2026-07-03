import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="app-container">
      <div class="admin-sidebar">
        <!-- Sidebar content -->
        <h2>jcorg Admin</h2>
      </div>
      <div class="admin-content">
        <router-outlet></router-outlet>
      </div>
    </main>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
      background: #0f111a;
      color: #e2e8f0;
      font-family: 'Inter', sans-serif;
    }
    .admin-sidebar {
      width: 250px;
      background: #07090e;
      border-right: 1px solid rgba(255,255,255,0.05);
      padding: 20px;
    }
    .admin-content {
      flex: 1;
      padding: 30px;
    }
  `]
})
export class AppComponent {}
