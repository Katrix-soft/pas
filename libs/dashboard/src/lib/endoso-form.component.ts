import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'lib-endoso-form',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-background text-on-background min-h-screen">
      <!-- TopAppBar -->
      <header class="w-full top-0 sticky z-40 bg-surface border-b border-outline-variant flex justify-between items-center px-container-margin py-md">
        <div class="flex items-center gap-md">
          <button routerLink="/dashboard" aria-label="Back" class="p-base hover:bg-surface-container-low transition-colors rounded-full active:scale-95 duration-150 cursor-pointer">
            <span class="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 class="text-headline-sm font-headline-sm text-primary">SegurosPro</h1>
        </div>
        <div class="flex items-center gap-md">
          <div class="hidden md:flex gap-lg">
            <span class="text-primary font-bold font-body-md cursor-pointer">Gestión</span>
            <span class="text-on-surface-variant font-body-md hover:text-primary cursor-pointer transition-colors">Ayuda</span>
          </div>
          <div class="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant">
            <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcqKRy1iI448WcnGZOmtBUyRqw-E1wrfc92r8B5igIjWsNplfOHKTa7-EIK8Gs8hZhw52vlZWSq_nY_PwhYwKKKtb2Z62yHpBJZ5AiJVpF2XITv1EBwdRE9N1MsBCDx3OPb0mejaM2bZhpNlevcwp9E_IG7imMsdpA3HZSLPLUw_tVZrVVo6H4oRUeF86yzsmk0qqo7BMPZCT0G-Rg_cPPRq8Cf9EWZVTxXxY03HPvsuTjX4himSx9sQ">
          </div>
        </div>
      </header>

      <main class="max-w-4xl mx-auto px-container-margin py-xl pb-32">
        <!-- Breadcrumbs / Section Header -->
        <div class="mb-lg">
          <span class="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Servicios al Productor</span>
          <h2 class="text-headline-md font-headline-md text-on-surface mt-xs">Formulario Endoso/Consulta</h2>
          <p class="text-body-md font-body-md text-on-surface-variant mt-sm">Complete los campos detallados para procesar su solicitud de modificación o consulta de póliza.</p>
        </div>

        <!-- Main Form Container -->
        <div class="form-card rounded-xl p-lg md:p-xl">
          <form class="space-y-lg" id="insurance-form" (submit)="onSubmit($event)">
            <!-- Row 1: Asunto & Cliente -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div class="flex flex-col gap-xs">
                <label class="text-label-md font-label-md text-on-surface-variant uppercase" for="asunto">Asunto</label>
                <input class="w-full px-md py-sm rounded-lg border border-outline-variant font-body-md text-on-surface bg-surface-container-lowest transition-all" id="asunto" name="asunto" placeholder="Ej: Solicitud de cambio de domicilio" type="text">
              </div>
              <div class="flex flex-col gap-xs">
                <label class="text-label-md font-label-md text-on-surface-variant uppercase" for="cliente">Cliente</label>
                <input class="w-full px-md py-sm rounded-lg border border-outline-variant font-body-md text-on-surface bg-surface-container-lowest transition-all" id="cliente" name="cliente" placeholder="Nombre completo o Razón Social" type="text">
              </div>
            </div>

            <!-- Row 2: Compañía/Nro Poliza & Ramo -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-lg">
              <div class="flex flex-col gap-xs">
                <label class="text-label-md font-label-md text-on-surface-variant uppercase" for="compania">Compañía</label>
                <select class="w-full px-md py-sm rounded-lg border border-outline-variant font-body-md text-on-surface bg-surface-container-lowest transition-all appearance-none cursor-pointer" id="compania" name="compania">
                  <option disabled="" selected="" value="">Seleccione una compañía</option>
                  <option value="allianz">Allianz</option>
                  <option value="sancor">Sancor Seguros</option>
                  <option value="federacion">Federación Patronal</option>
                  <option value="mapfre">Mapfre</option>
                </select>
              </div>
              <div class="flex flex-col gap-xs">
                <label class="text-label-md font-label-md text-on-surface-variant uppercase" for="poliza">Nro de Póliza</label>
                <input class="w-full px-md py-sm rounded-lg border border-outline-variant font-body-md text-on-surface bg-surface-container-lowest transition-all" id="poliza" name="poliza" placeholder="Ej: 1234567" type="text">
              </div>
              <div class="flex flex-col gap-xs">
                <label class="text-label-md font-label-md text-on-surface-variant uppercase" for="ramo">Ramo</label>
                <select class="w-full px-md py-sm rounded-lg border border-outline-variant font-body-md text-on-surface bg-surface-container-lowest transition-all appearance-none cursor-pointer" id="ramo" name="ramo">
                  <option disabled="" selected="" value="">Seleccione un ramo</option>
                  <option value="automotor">Automotor</option>
                  <option value="moto">Moto</option>
                  <option value="integral">Integral de Comercio</option>
                  <option value="combinado">Combinado Familiar</option>
                </select>
              </div>
            </div>

            <!-- Row 3: Movimiento -->
            <div class="flex flex-col gap-xs max-w-md">
              <label class="text-label-md font-label-md text-on-surface-variant uppercase" for="movimiento">Movimiento</label>
              <select class="w-full px-md py-sm rounded-lg border border-outline-variant font-body-md text-on-surface bg-surface-container-lowest transition-all appearance-none cursor-pointer" id="movimiento" name="movimiento">
                <option disabled="" selected="" value="">Seleccione tipo de movimiento</option>
                <option value="endoso">Endoso</option>
                <option value="documentacion">Documentación</option>
              </select>
            </div>

            <!-- Row 4: Descripcion -->
            <div class="flex flex-col gap-xs">
              <label class="text-label-md font-label-md text-on-surface-variant uppercase" for="descripcion">Descripción</label>
              <textarea class="w-full px-md py-sm rounded-lg border border-outline-variant font-body-md text-on-surface bg-surface-container-lowest transition-all resize-none" id="descripcion" name="descripcion" placeholder="Detalle aquí su consulta o los cambios requeridos para el endoso..." rows="4"></textarea>
            </div>

            <!-- Row 5: Adjuntos -->
            <div class="flex flex-col gap-xs">
              <label class="text-label-md font-label-md text-on-surface-variant uppercase">Adjuntos</label>
              <div class="file-dropzone rounded-xl p-xl flex flex-col items-center justify-center cursor-pointer" (click)="fileUpload.click()">
                <span class="material-symbols-outlined text-primary text-[48px] mb-sm">cloud_upload</span>
                <p class="font-headline-sm text-on-surface text-center">Haga clic para subir o arrastre sus archivos</p>
                <p class="font-body-sm text-on-surface-variant mt-xs text-center">Formatos aceptados: PDF, JPG, PNG (Máx 10MB)</p>
                <input #fileUpload class="hidden" id="file-upload" multiple="" type="file" (change)="onFileChange($event)">
              </div>
              <div class="mt-sm flex flex-wrap gap-sm">
                @for (file of files; track $index) {
                  <div class="flex items-center gap-xs px-sm py-xs bg-secondary-container text-on-secondary-container rounded-full text-label-md">
                    <span class="material-symbols-outlined text-[16px]">attach_file</span>
                    <span>{{file.name}}</span>
                    <button type="button" class="hover:text-error transition-colors cursor-pointer flex items-center justify-center" (click)="removeFile($index)">
                        <span class="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                }
              </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-lg flex justify-end">
              <button type="submit" [disabled]="isSubmitting || isSuccess" [class.bg-secondary]="isSuccess" [class.bg-primary]="!isSuccess" class="w-full md:w-auto px-xl py-md text-on-primary font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-sm shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                @if (isSubmitting) {
                  <span class="material-symbols-outlined animate-spin">sync</span>
                  Procesando...
                } @else if (isSuccess) {
                  <span class="material-symbols-outlined">check_circle</span>
                  Enviado con éxito
                } @else {
                  <span class="material-symbols-outlined">send</span>
                  Enviar Solicitud
                }
              </button>
            </div>
          </form>
        </div>

        <!-- Help Notice -->
        <div class="mt-lg p-lg bg-surface-container-low border border-outline-variant rounded-xl flex gap-md items-start">
          <span class="material-symbols-outlined text-tertiary">info</span>
          <div>
            <h4 class="font-headline-sm text-on-surface-variant leading-none">¿Necesita ayuda?</h4>
            <p class="font-body-sm text-on-surface-variant mt-xs">Si tiene problemas con el formulario, puede contactar a soporte técnico al <span class="font-bold">0800-SEGUROS-PRO</span>.</p>
          </div>
        </div>
      </main>


    </div>
`,
  styles: [`
    .form-card {
        background: #ffffff;
        border: 1px solid #E2E8F0;
        border-left: 4px solid #0058be;
        box-shadow: 0px 4px 12px rgba(0,0,0,0.05);
    }
    .file-dropzone {
        border: 2px dashed #c2c6d6;
        transition: all 0.2s ease;
    }
    .file-dropzone:hover {
        border-color: #0058be;
        background-color: #eff4ff;
    }
    input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: #0058be !important;
        box-shadow: 0 0 0 2px rgba(0, 88, 190, 0.1);
    }
`]
})
export class EndosoFormComponent {
  files: File[] = [];
  isSubmitting = false;
  isSuccess = false;
  
  private router = inject(Router);

  onFileChange(event: any) {
    if (event.target.files) {
      this.files = [...this.files, ...Array.from(event.target.files as FileList)];
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.isSubmitting = true;
    
    // Simulate network request
    setTimeout(() => {
      this.isSubmitting = false;
      this.isSuccess = true;
      
      // Navigate to success view after showing success state for a moment
      setTimeout(() => {
        this.router.navigate(['/ticket-success']);
      }, 800);
    }, 1500);
  }
}
