import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  // Almacenamiento en memoria (no persistido en localStorage/sessionStorage)
  private idToken: string | null = null;
  private expirationTime: number | null = null; // Timestamp en milisegundos

  /**
   * Guarda el token en memoria junto con su tiempo de expiración.
   * Si no se provee `expiresInSeconds`, intentará leer la expiración del JWT (claim 'exp').
   */
  setToken(token: string, expiresInSeconds?: number): void {
    this.idToken = token;

    if (expiresInSeconds !== undefined) {
      this.expirationTime = Date.now() + (expiresInSeconds * 1000);
    } else {
      // Intenta autodetectar la expiración leyendo el JWT payload
      const jwtExp = this.getExpirationFromToken(token);
      if (jwtExp) {
        this.expirationTime = jwtExp;
      } else {
        // Fallback: 1 hora de expiración por defecto
        console.warn('No se pudo extraer la expiración del token. Se asume 1 hora por defecto.');
        this.expirationTime = Date.now() + (3600 * 1000);
      }
    }
  }

  /**
   * Obtiene el token activo. Retorna null si expiró o no fue configurado.
   */
  getToken(): string | null {
    if (this.isExpired()) {
      this.clear();
      return null;
    }
    return this.idToken;
  }

  /**
   * Retorna true si el token expiró (o no existe).
   * Incluye un margen de seguridad de 10 segundos para evitar que expire en pleno vuelo de la petición HTTP.
   */
  isExpired(): boolean {
    if (!this.idToken || !this.expirationTime) {
      return true;
    }
    const safetyBufferMs = 10000; // 10 segundos
    return Date.now() >= (this.expirationTime - safetyBufferMs);
  }

  /**
   * Limpia los datos del token en memoria.
   */
  clear(): void {
    this.idToken = null;
    this.expirationTime = null;
  }

  /**
   * Decodifica el JWT en base64url para extraer el claim 'exp' sin dependencias externas.
   */
  private getExpirationFromToken(token: string): number | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      return payload.exp ? payload.exp * 1000 : null; // exp viene en segundos, convertimos a ms
    } catch (e) {
      console.error('Error al decodificar la expiración del ID Token:', e);
      return null;
    }
  }
}
