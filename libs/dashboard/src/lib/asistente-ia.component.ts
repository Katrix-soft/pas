import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-asistente-ia',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-hidden relative">
      <!-- TopAppBar -->
      <header class="w-full top-0 sticky bg-surface-bright border-b border-outline-variant z-50">
        <div class="flex justify-between items-center px-md py-sm w-full h-16">
          <div class="flex items-center gap-sm">
            <button routerLink="/dashboard" class="material-symbols-outlined text-primary cursor-pointer hover:bg-surface-container-low p-1 rounded-full transition-colors mr-2">arrow_back</button>
            <span class="material-symbols-outlined text-primary text-headline-sm" style="font-variation-settings: 'FILL' 1;">shield</span>
            <h1 class="font-headline-sm text-headline-sm text-on-surface">Asistente IA - Multicotizador</h1>
          </div>
          <div class="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
            <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZa8N-Zk4YlQzlKNkvQyanEC-0RaPJ8J2Ez4_Irf3aWslWqCh_wHtOEGzceCBhUVoaL7SJodIYQP_KzE9pDahzTJbZ6MJ-ZYRfVYUMoI8cD_mTKlRdV3_oNzvMEZnfrCGwgI67vIVbQGvCop5dlAuKk4_-uwSpkyGbogk4JWTX1WuLcO7f1J_C_RmSbjgq2eP2qPgmokGXim6RxHyqrJwm8OW02kH964Qoi9kIMlw-x_BYzXCrnsgJLQ"/>
          </div>
        </div>
      </header>

      <!-- Chat Content -->
      <main class="flex-1 overflow-y-auto chat-container px-container-margin py-md">
        <!-- Message Cluster -->
        <div class="flex flex-col gap-lg max-w-lg mx-auto pb-48">
          <!-- User Prompt -->
          <div class="flex flex-col items-end gap-xs chat-msg">
            <div class="bg-primary-container text-on-primary-container px-md py-sm rounded-t-xl rounded-bl-xl shadow-sm max-w-[85%]">
              <p class="font-body-md">¡Hola! Necesito cotizar un seguro para mi cliente que compró un Toyota Corolla 2022.</p>
            </div>
            <span class="text-[10px] text-on-surface-variant font-label-md px-xs">11:15 AM</span>
          </div>

          <!-- AI Response 1 -->
          <div class="flex flex-col items-start gap-xs chat-msg">
            <div class="bg-surface-container-highest text-on-surface px-md py-sm rounded-t-xl rounded-br-xl shadow-sm max-w-[85%] border border-outline-variant">
              <p class="font-body-md">¡Perfecto! Analizando el mercado para el Toyota Corolla 2022... ¿Cuál es el código postal de circulación?</p>
            </div>
            <span class="text-[10px] text-on-surface-variant font-label-md px-xs">11:15 AM</span>
          </div>

          <!-- User Input -->
          <div class="flex flex-col items-end gap-xs chat-msg">
            <div class="bg-primary-container text-on-primary-container px-md py-sm rounded-t-xl rounded-bl-xl shadow-sm max-w-[85%]">
              <p class="font-body-md">CP 1425, CABA.</p>
            </div>
            <span class="text-[10px] text-on-surface-variant font-label-md px-xs">11:16 AM</span>
          </div>

          <!-- AI Final Response & Cards -->
          <div class="flex flex-col items-start gap-md chat-msg">
            <div class="bg-surface-container-highest text-on-surface px-md py-sm rounded-t-xl rounded-br-xl shadow-sm max-w-[90%] border border-outline-variant">
              <p class="font-body-md">¡Genial! He encontrado estas opciones para tu cliente. ¿Cuál te gustaría cotizar?</p>
            </div>

            <!-- Quoter Results List -->
            <div class="flex flex-col gap-md w-full">
              <!-- Card 1: Allianz -->
              <div class="bg-white rounded-lg border border-outline-variant border-l-[4px] border-l-primary shadow-sm overflow-hidden flex flex-col p-md hover:bg-surface-container-low transition-colors cursor-pointer">
                <div class="flex justify-between items-start mb-sm">
                  <div class="flex flex-col">
                    <h3 class="font-headline-sm text-headline-sm text-on-surface">Allianz</h3>
                    <p class="text-on-surface-variant font-body-sm">Todo Riesgo</p>
                  </div>
                  <div class="w-12 h-12 bg-surface-container rounded p-sm">
                    <img class="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmJc5S7Pz5z3t0RbMpuwCAxeiVD5TOaO7itTX-LFMs7tFCtiBosv7hUXXFmNEUKjJIkG3rM1QA12i8ZOKRVvSDpPwYC8rzoWFoWnoVluJwVpMn0PPRVCxgtmFJgvuttDB0Zpl65BZqL77cPMAFaWLbqUKdAG-SOm_mP1bvrpQqOIEC2L5n7nhrm3XUdNEEZBNGx4EUPpjYoOaK9N9UUn4mTcTyY2ZgbnC4bYHpPJCWscmmVQcTQpmnaQ"/>
                  </div>
                </div>
                <div class="flex items-baseline gap-xs mb-md">
                  <span class="font-metric-xl text-metric-xl text-primary">$45.200</span>
                  <span class="text-on-surface-variant font-label-md">por mes</span>
                </div>
                <button class="w-full bg-secondary text-on-secondary font-headline-sm py-sm rounded-lg hover:bg-on-secondary-fixed-variant transition-colors flex items-center justify-center gap-xs active:scale-95 duration-200">
                  Ver detalles
                </button>
              </div>

              <!-- Card 2: Federacion Patronal -->
              <div class="bg-white rounded-lg border border-outline-variant border-l-[4px] border-l-secondary shadow-sm overflow-hidden flex flex-col p-md hover:bg-surface-container-low transition-colors cursor-pointer">
                <div class="flex justify-between items-start mb-sm">
                  <div class="flex flex-col">
                    <h3 class="font-headline-sm text-headline-sm text-on-surface">Federación Patronal</h3>
                    <p class="text-on-surface-variant font-body-sm">Todo Riesgo</p>
                  </div>
                  <div class="w-12 h-12 bg-surface-container rounded p-sm">
                    <img class="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8VhptTISQ0cnb7XqI7daRGSFWHQF-hg4gdvSqxO6e2UzIl-ezf9WtPonyPjir6SzfbfKY_MOpIukNLPswWHOvDcpy-3vvSEfkeYrxx0vR39QACQ0D8bUyh7g5Urw21Oy3vsRNVDSHCeuSSHhiq1Ioh_qyTxgf96pTalo-TN-kaNMP75hwkbCOptcriW7BuE-yKaq6VlOZR296CSB3U7rwvn3H3zJ_eDRbBfe_ODXYyGAmfcDJY6ZVcA"/>
                  </div>
                </div>
                <div class="flex items-baseline gap-xs mb-md">
                  <span class="font-metric-xl text-metric-xl text-primary">$44.800</span>
                  <span class="text-on-surface-variant font-label-md">por mes</span>
                </div>
                <button class="w-full bg-secondary text-on-secondary font-headline-sm py-sm rounded-lg hover:bg-on-secondary-fixed-variant transition-colors flex items-center justify-center gap-xs active:scale-95 duration-200">
                  Ver detalles
                </button>
              </div>

              <!-- Card 3: Zurich -->
              <div class="bg-white rounded-lg border border-outline-variant border-l-[4px] border-l-tertiary shadow-sm overflow-hidden flex flex-col p-md hover:bg-surface-container-low transition-colors cursor-pointer">
                <div class="flex justify-between items-start mb-sm">
                  <div class="flex flex-col">
                    <h3 class="font-headline-sm text-headline-sm text-on-surface">Zurich</h3>
                    <p class="text-on-surface-variant font-body-sm">Terceros Completo</p>
                  </div>
                  <div class="w-12 h-12 bg-surface-container rounded p-sm">
                    <img class="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRG_9n33uTlp4lEv0zrOfvi7lfu5mXgruQchTmtgaBxTx3MHvd0tFca1O9BqCbwzECe8p8LiDLkQ-B1-qnm6OL52Nqp6Ps7jgsekoNwykWUktt7NMnafQIFpLwidWt4ZsF04VUKSkB7sn667daa84jQpma_9KP5mfcMnWc8zU5mHMF5MZpYiLFfy5Pq_tbFNwMcj_cp81G7_lYtpr3o3yhYbpcNBtuUKFqOcLUa59Ew3rwudCWjWRtKQ"/>
                  </div>
                </div>
                <div class="flex items-baseline gap-xs mb-md">
                  <span class="font-metric-xl text-metric-xl text-primary">$38.900</span>
                  <span class="text-on-surface-variant font-label-md">por mes</span>
                </div>
                <button class="w-full bg-secondary text-on-secondary font-headline-sm py-sm rounded-lg hover:bg-on-secondary-fixed-variant transition-colors flex items-center justify-center gap-xs active:scale-95 duration-200">
                  Ver detalles
                </button>
              </div>
            </div>
            <span class="text-[10px] text-on-surface-variant font-label-md px-xs">11:16 AM</span>
          </div>
        </div>
      </main>

      <!-- Input Area & BottomNavBar wrapper so they stick to bottom -->
      <div class="fixed bottom-0 w-full flex flex-col z-50">
        <!-- Input Area -->
        <div class="bg-surface px-md py-sm border-t border-outline-variant">
          <div class="flex items-center gap-sm bg-surface-container-lowest border border-outline rounded-full px-md py-xs shadow-sm mx-auto max-w-lg w-full">
            <button class="text-on-surface-variant p-xs hover:bg-surface-container rounded-full transition-colors cursor-pointer">
              <span class="material-symbols-outlined">attach_file</span>
            </button>
            <input class="flex-1 bg-transparent border-none outline-none focus:ring-0 text-body-md font-body-md py-md" placeholder="Escribe un mensaje..." type="text"/>
            <div class="flex items-center gap-xs">
              <button class="text-on-surface-variant p-xs hover:bg-surface-container rounded-full transition-colors cursor-pointer">
                <span class="material-symbols-outlined">mic</span>
              </button>
              <button class="bg-primary text-on-primary p-md rounded-full shadow-md active:scale-90 transition-transform flex items-center justify-center cursor-pointer">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">send</span>
              </button>
            </div>
          </div>
        </div>

        <!-- BottomNavBar -->
        <nav class="w-full rounded-t-xl bg-surface-container-lowest border-t border-outline-variant shadow-md h-20 px-container-margin pb-safe flex justify-around items-center">
          <div routerLink="/dashboard" class="flex flex-col items-center justify-center text-on-surface-variant px-lg py-xs hover:text-primary transition-colors cursor-pointer active:scale-95 duration-200">
            <span class="material-symbols-outlined">analytics</span>
            <span class="font-label-md text-label-md">Métricas</span>
          </div>
          <div class="flex flex-col items-center justify-center text-on-surface-variant px-lg py-xs hover:text-primary transition-colors cursor-pointer active:scale-95 duration-200">
            <span class="material-symbols-outlined">payments</span>
            <span class="font-label-md text-label-md">Cobros</span>
          </div>
          <div class="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-lg py-xs transition-transform active:scale-95 cursor-pointer">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
            <span class="font-label-md text-label-md">Chat</span>
          </div>
          <div class="flex flex-col items-center justify-center text-on-surface-variant px-lg py-xs hover:text-primary transition-colors cursor-pointer active:scale-95 duration-200">
            <span class="material-symbols-outlined">group</span>
            <span class="font-label-md text-label-md">Clientes</span>
          </div>
          <div class="flex flex-col items-center justify-center text-on-surface-variant px-lg py-xs hover:text-primary transition-colors cursor-pointer active:scale-95 duration-200">
            <span class="material-symbols-outlined">person</span>
            <span class="font-label-md text-label-md">Perfil</span>
          </div>
        </nav>
      </div>
    </div>
`,
  styles: [`
    .chat-container {
      height: 100vh; /* Using min-h-screen and flex-1 instead for better mobile behavior */
    }
    
    .chat-msg {
      opacity: 0;
      transform: translateY(10px);
      animation: msgFadeIn 0.4s ease-out forwards;
    }
    
    .chat-msg:nth-child(1) { animation-delay: 0.1s; }
    .chat-msg:nth-child(2) { animation-delay: 0.3s; }
    .chat-msg:nth-child(3) { animation-delay: 0.5s; }
    .chat-msg:nth-child(4) { animation-delay: 0.7s; }
    
    @keyframes msgFadeIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
`]
})
export class AsistenteIaComponent implements AfterViewInit {
  
  ngAfterViewInit() {
    // Auto scroll to bottom
    setTimeout(() => {
      const mainContent = document.querySelector('.chat-container');
      if (mainContent) {
        mainContent.scrollTop = mainContent.scrollHeight;
      }
    }, 100);
  }
}
