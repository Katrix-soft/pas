import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleQuotationService } from '../services/vehicle-quotation.service';
import { AuthTokenService } from '../../../../auth/src/lib/services/auth-token.service';
import { VehicleQuotationRequest, GssMessage } from '../models/vehicle-quotation.model';

@Component({
  selector: 'broker-vehicle-quotation-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="quotation-container">
      <div class="card">
        <h2 class="title">Demo Integración API Sancor</h2>
        <p class="subtitle">Emulador de cotización de vehículos para el Multicotizador</p>

        <!-- Configuración de Token en Memoria -->
        <section class="section">
          <h3>1. Configuración de Seguridad (ID Token JWT)</h3>
          <p class="info-text">
            Ingresa el <strong>id_token</strong> JWT (RS256) obtenido de tu backend corporativo.
            Se mantendrá únicamente en la memoria RAM del navegador.
          </p>
          <div class="form-group">
            <label for="idToken">JWT ID Token:</label>
            <textarea
              id="idToken"
              [(ngModel)]="tempToken"
              placeholder="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIs..."
              rows="3"
              class="form-control font-mono"
            ></textarea>
          </div>
          <button type="button" class="btn btn-secondary" (click)="saveToken()">
            Guardar Token en Memoria
          </button>

          <div *ngIf="tokenSaved()" class="status-badge success">
            ✓ Token configurado en memoria (Expiración autodetectada o 1h)
          </div>
        </section>

        <!-- Simulación de Cotización -->
        <section class="section">
          <h3>2. Simulación de Datos de Cotización (Payload Obligatorio)</h3>
          <p class="info-text">
            Este payload contiene todos los campos obligatorios requeridos por el servicio de Sancor Seguros.
          </p>

          <div class="payload-preview" style="max-height: 400px; height: 350px;">
            <textarea
              [(ngModel)]="payloadJson"
              class="form-control font-mono"
              style="height: 100%; font-size: 0.8rem; resize: vertical;"
              rows="15"
            ></textarea>
          </div>

          <div class="action-bar">
            <button
              [disabled]="loading()"
              (click)="executeQuote()"
              class="btn btn-primary"
            >
              {{ loading() ? 'Cotizando...' : 'Enviar Solicitud a Sancor' }}
            </button>
            <button (click)="resetStates()" class="btn btn-outline">Limpiar Resultados</button>
          </div>
        </section>

        <!-- Estados de Respuesta / Loading / Errores -->
        <section *ngIf="loading() || errors().length > 0 || successResult()" class="section results-section">
          <h3>3. Respuesta de la API</h3>

          <!-- Cargando -->
          <div *ngIf="loading()" class="loader-container">
            <div class="spinner"></div>
            <p>Enviando datos al Gateway de Sancor...</p>
          </div>

          <!-- Errores Parseados (messages[]) -->
          <div *ngIf="errors().length > 0" class="error-container">
            <h4 class="error-title">✘ Error en la Cotización (Sancor API response)</h4>
            <div class="error-list">
              <div *ngFor="let err of errors()" class="error-item">
                <span class="error-code">[{{ err.code }}]</span>
                <p class="error-text"><strong>Mensaje:</strong> {{ err.text }}</p>
                <p *ngIf="err.help" class="error-help"><strong>Ayuda:</strong> {{ err.help }}</p>
              </div>
            </div>
          </div>

          <!-- Cotización Exitosa -->
          <div *ngIf="successResult()" class="success-container">
            <h4 class="success-title">✓ Cotización Recibida Exitosamente</h4>
            <pre class="success-payload">{{ successResult() | json }}</pre>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .quotation-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }
    .title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.5rem 0;
    }
    .subtitle {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0 0 1.5rem 0;
    }
    .section {
      border-top: 1px solid #f1f5f9;
      padding: 1.5rem 0;
    }
    .section h3 {
      font-size: 1.1rem;
      color: #1e293b;
      margin: 0 0 0.75rem 0;
    }
    .info-text {
      font-size: 0.85rem;
      color: #475569;
      line-height: 1.4;
      margin: 0 0 1rem 0;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #334155;
      margin-bottom: 0.5rem;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.875rem;
      box-sizing: border-box;
    }
    .font-mono {
      font-family: monospace;
    }
    .btn {
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      transition: background-color 0.15s ease-in-out;
    }
    .btn-primary {
      background-color: #0058be;
      color: #ffffff;
    }
    .btn-primary:hover {
      background-color: #00479b;
    }
    .btn-primary:disabled {
      background-color: #94a3b8;
      cursor: not-allowed;
    }
    .btn-secondary {
      background-color: #475569;
      color: #ffffff;
    }
    .btn-secondary:hover {
      background-color: #334155;
    }
    .btn-outline {
      background-color: transparent;
      border: 1px solid #cbd5e1;
      color: #475569;
      margin-left: 0.5rem;
    }
    .btn-outline:hover {
      background-color: #f8fafc;
    }
    .status-badge {
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .status-badge.success {
      background-color: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
    }
    .payload-preview {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem;
      max-height: 250px;
      overflow-y: auto;
      margin-bottom: 1rem;
    }
    .payload-preview pre {
      margin: 0;
      font-size: 0.8rem;
      color: #334155;
    }
    .action-bar {
      margin-top: 1.5rem;
    }
    .results-section {
      background-color: #f8fafc;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px dashed #cbd5e1;
    }
    .loader-container {
      text-align: center;
      padding: 2rem 0;
    }
    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #0058be;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .error-container {
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      padding: 1rem;
    }
    .error-title {
      color: #991b1b;
      margin: 0 0 1rem 0;
      font-size: 0.95rem;
    }
    .error-item {
      padding-bottom: 0.75rem;
      margin-bottom: 0.75rem;
      border-bottom: 1px solid #fee2e2;
    }
    .error-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }
    .error-code {
      font-weight: 700;
      color: #dc2626;
      font-size: 0.8rem;
    }
    .error-text, .error-help {
      margin: 0.25rem 0 0 0;
      font-size: 0.85rem;
      color: #7f1d1d;
    }
    .success-container {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 6px;
      padding: 1rem;
    }
    .success-title {
      color: #166534;
      margin: 0 0 1rem 0;
      font-size: 0.95rem;
    }
    .success-payload {
      font-size: 0.8rem;
      color: #14532d;
      margin: 0;
      background-color: #ffffff;
      padding: 1rem;
      border-radius: 4px;
      border: 1px solid #dcfce7;
      overflow-x: auto;
    }
  `]
})
export class VehicleQuotationDemoComponent implements OnInit {
  private quotationService = inject(VehicleQuotationService);
  private authTokenService = inject(AuthTokenService);

  tempToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNVQzJlMm15VU5LOVF1Z3NibDFwMiJ9.eyJodHRwczovL3NhbmNvcnNlZ3Vyb3MubmV0L2NsYWltcy90eXBlIjo5LCJodHRwczovL3NhbmNvcnNlZ3Vyb3MubmV0L2NsYWltcy91cG4iOiJvY29yb25lbDIxNjJAUHJvZHVjdG9yQS5jZWliby5zYW5jb3JzZWd1cm9zLmNvbSIsImh0dHBzOi8vc2FuY29yc2VndXJvcy5uZXQvY2xhaW1zL29mZmljZUlkIjo1MDAsIm5pY2tuYW1lIjoib2Nvcm9uZWwyMTYyIiwibmFtZSI6IkNPUk9ORUwgSkFWSUVSIE9TQ0FSIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyL2I1ZDA1NGFhMjk4NTc3MjYxOGU0YTkzY2I5MmUwYTk0P3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGY2oucG5nIiwidXBkYXRlZF9hdCI6IjIwMjYtMDctMDdUMjE6Mzg6MzAuOTU5WiIsImlzcyI6Imh0dHBzOi8vbG9naW4tZGV2LmxvZ2luLWRldi1ncnVwb3NhbmNvcnNlZ3Vyb3MuYXV0aDBhcHAuY29tLyIsImF1ZCI6IkpPc2R0MGFnajVEMU5ucXVBNnpXWmFPZzVHRVpaZ1VQIiwic3ViIjoiYXV0aDB8Y2VpYm98MjA1MTkiLCJpYXQiOjE3ODM0NjAzMTEsImV4cCI6MTc5MTIzNjMxMX0.HEhQPPDEY02SOrI17IMuiVJCM0BsO1wnMDYnwc4Bam9OlGJ7M4N9R3EudWFZPpEF7Gj9h9VZguZnAOfza7JAGddV-3pmqMXn6LEoCIZ1W22HGIsC0qtijeumOh600nJORSunIZSgHXNZLmSSMV8qyXhCITpB1U8imVxTAvsk8VkGMC2szcT_iwreMu7-pGwymnuMb-KuHrXF_wiOyndeS-E95PSSu33t9agLxkhxgIshrR9CI2Zcm4cqOz1VtQP_kCTimIFx6E38UE9zJwXzOK_0sX7ZuclKBAW1HTNgsWIEcxTXGQfBDpKC1pyWqhP-oSTAep0Sou3ZC6PHpW4FgA';
  tokenSaved = signal(false);
  loading = signal(false);
  errors = signal<GssMessage[]>([]);
  successResult = signal<any>(null);

  payloadJson = '';

  ngOnInit(): void {
    if (this.tempToken.trim()) {
      this.authTokenService.setToken(this.tempToken.trim());
      this.tokenSaved.set(true);
    }
    this.payloadJson = JSON.stringify(this.payloadExample, null, 2);
  }

  // Payload estructurado con los campos obligatorios del swagger de Sancor
  payloadExample: VehicleQuotationRequest = {
    vehicleQuotation: {
      currencyCode: 1, // Obligatorio
      policyVigencyCode: 1, // Obligatorio (1: Anual)
      policyPaymentPeriodicityCode: 5, // Obligatorio (5: Mensual)
      productCode: 44, // Obligatorio
      policyQuotas: 12, // Obligatorio
      policyPeriodStartEffectiveDate: new Date().toISOString(), // Obligatorio

      person: {
        isJuridicPerson: false, // Obligatorio
        identificationType: 'D', // Obligatorio (DNI)
        identificationNumber: 99443221 // Obligatorio implicado
      },
      intermediary: {
        prodProducerCode: 20519, // Coincide con el sub claim del JWT (auth0|ceibo|20519)
        upperProducerCode: 20519,
        statisticCode: 123
      },
      zone: {
        postalCode: 2000, // Obligatorio (ej: Rosario)
        cityCode: 320
      },
      vehicle: {
        vehicleCode: 'VW_GOL_TREND_1.6_2022', // Obligatorio
        vehicleYear: 2022, // Obligatorio
        yearSuggestedValue: 8500000.00, // Obligatorio
        vehicleUseTypeCode: 2, // Obligatorio (2: Particular)
        vehicleTrackingEquipment: false, // Obligatorio
        assistance: {
          assistance: 'sa_02', // Obligatorio
          assistanceProvider: 'ibero' // Obligatorio
        },
        zeroKM: false
      }
    }
  };

  saveToken(): void {
    if (this.tempToken.trim()) {
      this.authTokenService.setToken(this.tempToken.trim());
      this.tokenSaved.set(true);
    } else {
      this.authTokenService.clear();
      this.tokenSaved.set(false);
    }
  }

  executeQuote(): void {
    this.resetStates();
    this.loading.set(true);

    try {
      const parsedPayload = JSON.parse(this.payloadJson);
      this.quotationService.quote(parsedPayload).subscribe({
        next: (response) => {
          this.loading.set(false);
          this.successResult.set(response);
        },
        error: (messages: GssMessage[]) => {
          this.loading.set(false);
          this.errors.set(messages);
        }
      });
    } catch (e: any) {
      this.loading.set(false);
      this.errors.set([{
        code: 'JSON-PARSE-ERROR',
        text: 'El JSON del payload es inválido.',
        help: e.message
      }]);
    }
  }

  resetStates(): void {
    this.errors.set([]);
    this.successResult.set(null);
  }
}
