import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthTokenService } from '../services/auth-token.service';
import { environment } from '../../../../shared/src/lib/environments/environment';

export const sancorAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authTokenService = inject(AuthTokenService);
  const baseUrl = environment.sancorApiBaseUrl;

  // Verificamos si la petición va dirigida al endpoint de Sancor Seguros
  if (req.url.startsWith(baseUrl)) {
    const token = authTokenService.getToken();

    let headers = req.headers
      .set('Accept', 'application/json')
      .set('gss_apiclient_id', environment.gssApiClientId);

    // Adjuntar token de autorización si está cargado en memoria y es válido
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Opcional: Agregar X-dynaTrace para trazabilidad si no viene definido en la llamada
    if (!req.headers.has('X-dynaTrace')) {
      const traceId = crypto.randomUUID();
      headers = headers.set('X-dynaTrace', traceId);
    }

    const clonedRequest = req.clone({ headers });
    return next(clonedRequest);
  }

  return next(req);
};
