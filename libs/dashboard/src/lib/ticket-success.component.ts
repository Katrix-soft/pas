import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-ticket-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-background text-on-background font-body-md min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <!-- Success Content Container -->
      <main class="relative z-10 w-full max-w-lg px-container-margin animate-in fade-in zoom-in duration-700">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm text-center flex flex-col items-center">
          <!-- Icon Section -->
          <div class="relative mb-lg">
            <div class="absolute inset-0 bg-secondary-container rounded-full success-pulse"></div>
            <div class="relative bg-secondary text-on-secondary w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
              <span class="material-symbols-outlined text-[48px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            </div>
          </div>
          <!-- Title & Status -->
          <h1 class="font-headline-lg text-headline-lg text-on-surface mb-xs">Solicitud Enviada</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant mb-lg">Su solicitud ha sido procesada con éxito.</p>
          
          <!-- Ticket ID Badge -->
          <div class="inline-flex items-center gap-sm bg-surface-container px-md py-sm rounded-lg border border-outline-variant mb-xl">
            <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Ticket ID</span>
            <span class="font-headline-sm text-headline-sm text-primary font-bold">#TK-9928</span>
          </div>

          <!-- Decorative Illustration / Subtle Graphic -->
          <div class="w-full h-32 mb-xl overflow-hidden rounded-lg bg-surface-container-low relative flex items-center justify-center">
            <div class="absolute inset-0 bg-cover bg-center opacity-40" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8gKUOEgHbXP_q7zLtlxiyTFS2ZXN94QhTn6umhIal95EzZnbSCjyUSXwlx2AhpiG06xK84MdC_AMJMTrWsPSNj-LymtHIYHGE6hqmLKcTAN2yev3uApgpqxhDiS53M-lZXD--KFTe_WmRXVXTngMoNDA25v22RSiOZyrRijt-N-WyfPMzkWn4WCYy8HYL5Oobhg3pHdQ06CBJV3KLD7qDhzhYV2SMtbegaDfonKVW0tbZXrVWItNr_A')"></div>
            <div class="relative z-10 font-label-md text-label-md text-primary bg-on-primary/80 backdrop-blur-sm px-md py-xs rounded-full border border-primary-fixed">
              Procesado en 1.2s
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-md">
            <button class="w-full bg-primary text-on-primary font-bold py-md rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 flex items-center justify-center gap-sm shadow-sm cursor-pointer">
              <span class="material-symbols-outlined">receipt_long</span>
              Ver Detalle
            </button>
            <button routerLink="/dashboard" class="w-full bg-surface-container-highest text-primary border border-primary font-bold py-md rounded-lg hover:bg-surface-container transition-all active:scale-95 flex items-center justify-center gap-sm cursor-pointer">
              <span class="material-symbols-outlined">dashboard</span>
              Ir al Dashboard
            </button>
          </div>
        </div>
        <!-- Footer / Branding Hint -->
        <div class="mt-lg text-center">
          <p class="font-label-md text-label-md text-on-surface-variant opacity-60 uppercase tracking-[0.2em]">
            JC Organizadores — Assurance Nexus System
          </p>
        </div>
      </main>
      
      <!-- Confetti Effect Script -->
      <canvas class="confetti-canvas fixed inset-0 pointer-events-none z-0" id="confetti"></canvas>
    </div>
`,
  styles: [`
    .success-pulse {
        animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
    }
    @keyframes pulse-ring {
        0% { transform: scale(0.8); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 0.3; }
        100% { transform: scale(1.2); opacity: 0; }
    }
    .animate-in {
        animation: fadeInZoom 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeInZoom {
        0% { opacity: 0; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
    }
`]
})
export class TicketSuccessComponent implements AfterViewInit, OnDestroy {
  private animationFrameId: number | null = null;
  private resizeListener: () => void = () => {};

  ngAfterViewInit() {
    this.initConfetti();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.resizeListener);
  }

  private initConfetti() {
    const canvas = document.getElementById('confetti') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    this.resizeListener = resize;
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      gravity: number;
      color: string;
      opacity: number;
      
      constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = Math.random() * 6 + 4;
        this.speedX = Math.random() * 10 - 5;
        this.speedY = Math.random() * -15 - 5;
        this.gravity = 0.4;
        const colors = ['#0058be', '#006c49', '#6cf8bb', '#adc6ff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = 1;
      }
      
      update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.01;
      }
      
      draw(context: CanvasRenderingContext2D) {
        context.globalAlpha = this.opacity;
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    const createConfetti = () => {
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.opacity > 0);
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      this.animationFrameId = requestAnimationFrame(animate);
    };

    setTimeout(() => {
      createConfetti();
      animate();
    }, 300);
  }
}
