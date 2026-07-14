import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../shared/src/lib/environments/environment';
import {
  VehicleQuotationRequest,
  VehicleQuotationResponse,
  SancorErrorResponse,
  GssMessage
} from '../models/vehicle-quotation.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleQuotationService {
  private http = inject(HttpClient);
  private readonly endpoint = `${environment.sancorApiBaseUrl}/vehicle/automotive`;

  /**
   * Realiza la solicitud de cotización de automotor.
   * Los headers de autorización y API Client ID son inyectados automáticamente por el interceptor.
   */
  quote(requestBody: VehicleQuotationRequest): Observable<VehicleQuotationResponse> {
    return this.http.post<VehicleQuotationResponse>(this.endpoint, requestBody).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Manejador de errores unificado para procesar la respuesta de error estructurada de Sancor.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let parsedMessages: GssMessage[] = [];

    // Intentamos extraer el array 'messages' de la respuesta JSON del backend/gateway
    if (error.error && typeof error.error === 'object') {
      const errorBody = error.error as SancorErrorResponse;
      if (Array.isArray(errorBody.messages)) {
        parsedMessages = errorBody.messages;
      }
    }

    // Si no logramos parsear mensajes válidos, creamos uno genérico basado en el estado HTTP
    if (parsedMessages.length === 0) {
      parsedMessages = [{
        status: error.status ? error.status.toString() : 'UNKNOWN',
        code: 'GSS-ERR-HTTP',
        text: error.message || 'Error inesperado de comunicación con el servicio de cotización.',
        help: `Consulte el estado de red o contacte a soporte. Código HTTP: ${error.status}`
      }];
    }

    console.error('Sancor API Error parsed:', parsedMessages);

    // Relanzamos el error con los mensajes estructurados para que el componente los renderice
    return throwError(() => parsedMessages);
  }
}
