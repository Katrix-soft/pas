import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../shared/src/lib/environments/environment';
import {
  MercantilMarcasResponse,
  MercantilMarca,
  MercantilModelosResponse,
  MercantilVehiculo,
  MercantilVehiculosResponse,
  MercantilCotizarAutoPayload,
  MercantilCotizacionResponse,
} from '../models/mercantil-quotation.model';

@Injectable({
  providedIn: 'root'
})
export class MercantilQuotationService {
  private http = inject(HttpClient);

  /** Base URL de los endpoints Mercantil en el backend proxy */
  private readonly baseUrl = `${environment.sancorApiBaseUrl}/mercantil`;

  // --------------------------------------------------------
  // Marcas
  // --------------------------------------------------------

  /** Obtiene la lista de marcas disponibles (strings ordenados) */
  getMarcas(): Observable<MercantilMarca[]> {
    return this.http
      .get<MercantilMarcasResponse>(`${this.baseUrl}/marcas`)
      .pipe(
        map(res => res.datos),
        catchError(this.handleError)
      );
  }

  // --------------------------------------------------------
  // Modelos por marca
  // --------------------------------------------------------

  /**
   * Obtiene los modelos disponibles para una marca y año.
   * Devuelve una lista de descripciones únicas de modelos.
   */
  getModelos(marcaCodigo: number, anio: number): Observable<string[]> {
    const params = new HttpParams()
      .set('marca_codigo', marcaCodigo.toString())
      .set('anio', anio.toString());

    return this.http
      .get<MercantilModelosResponse>(`${this.baseUrl}/modelos`, { params })
      .pipe(
        map(res => res.datos),
        catchError(this.handleError)
      );
  }

  // --------------------------------------------------------
  // Versiones (vehículos por marca + modelo + año)
  // --------------------------------------------------------

  /**
   * Obtiene los vehículos (versiones) completos para búsqueda de texto + año.
   * Útil para popular el selector de "Versión".
   */
  getVersiones(marcaCodigo: number, anio: number, modelo: string): Observable<MercantilVehiculo[]> {
    const params = new HttpParams()
      .set('marca_codigo', marcaCodigo.toString())
      .set('anio', anio.toString())
      .set('modelo', modelo);

    return this.http
      .get<MercantilVehiculosResponse>(`${this.baseUrl}/vehiculos`, { params })
      .pipe(
        map(res => {
          // El backend puede devolver el array directamente o dentro de "datos"
          if (Array.isArray(res)) return res as unknown as MercantilVehiculo[];
          return res.datos ?? [];
        }),
        catchError(this.handleError)
      );
  }

  // --------------------------------------------------------
  // Cotización de Auto
  // --------------------------------------------------------

  /** Envía los datos del chat al endpoint de cotización de Mercantil Andina */
  cotizarAuto(payload: MercantilCotizarAutoPayload): Observable<MercantilCotizacionResponse> {
    return this.http
      .post<MercantilCotizacionResponse>(`${this.baseUrl}/cotizar-auto`, payload)
      .pipe(catchError(this.handleError));
  }

  // --------------------------------------------------------
  // Error handler
  // --------------------------------------------------------

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Error inesperado al comunicarse con la API de Mercantil Andina.';

    if (error.error) {
      if (typeof error.error === 'object' && error.error.detail) {
        message = error.error.detail;
      } else if (typeof error.error === 'string') {
        message = error.error;
      }
    }

    console.error('MercantilQuotationService error:', error.status, message);
    return throwError(() => ({ status: error.status, message }));
  }
}
