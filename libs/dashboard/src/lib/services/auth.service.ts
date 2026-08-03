import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

export interface User {
  role: 'admin' | 'pas';
  name: string;
  matricula?: string;
  organizador?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private getInitialUser(): User | null {
    try {
      const local = localStorage.getItem('currentUser');
      if (local) {
        const u = JSON.parse(local);
        if (!u.name || u.name === 'Productor PAS') {
          u.name = 'Gonzalo Javier Paso';
          u.matricula = '86992';
          u.organizador = 'JCORG Broker de Seguros';
          u.email = 'gpaso@jcorg.com.ar';
          localStorage.setItem('currentUser', JSON.stringify(u));
        }
        return u;
      }
      const session = sessionStorage.getItem('currentUser');
      if (session) {
        const u = JSON.parse(session);
        if (!u.name || u.name === 'Productor PAS') {
          u.name = 'Gonzalo Javier Paso';
          u.matricula = '86992';
          u.organizador = 'JCORG Broker de Seguros';
          u.email = 'gpaso@jcorg.com.ar';
          sessionStorage.setItem('currentUser', JSON.stringify(u));
        }
        return u;
      }
    } catch (e) {
      console.error('Error parsing stored user session:', e);
    }
    // No hay sesión guardada → forzar login
    return null;
  }

  // Credenciales locales de fallback (cuando el backend no está disponible)
  private static readonly LOCAL_USERS: Record<string, User & { password: string }> = {
    'admin':             { password: 'admin123',   role: 'admin', name: 'Administrador JC',    organizador: 'JCORG Central' },
    'admin@katrix.com.ar': { password: 'admin123', role: 'admin', name: 'Administrador JC',    organizador: 'JCORG Central' },
    'gonzalo':           { password: 'gonzalo123', role: 'admin', name: 'Gonzalo',              organizador: 'JCORG Central', matricula: '86992' },
    'gonzalo@jcorg.com.ar': { password: 'gonzalo123', role: 'admin', name: 'Gonzalo',          organizador: 'JCORG Central', matricula: '86992' },
    'candela':           { password: 'candela123', role: 'admin', name: 'Candela',              organizador: 'JCORG Central', matricula: 'ADM-102' },
    'candela@jcorg.com.ar': { password: 'candela123', role: 'admin', name: 'Candela',          organizador: 'JCORG Central', matricula: 'ADM-102' },
    'marina':            { password: 'marina123',  role: 'admin', name: 'Marina',               organizador: 'JCORG Central', matricula: 'ADM-105' },
    'marina@jcorg.com.ar':  { password: 'marina123', role: 'admin', name: 'Marina',            organizador: 'JCORG Central', matricula: 'ADM-105' },
    'pas':               { password: 'pas1234',    role: 'pas',   name: 'Gonzalo Javier Paso', organizador: 'JCORG Broker de Seguros', matricula: '86992', email: 'gpaso@jcorg.com.ar' },
    'pas@katrix.com.ar': { password: 'pas1234',    role: 'pas',   name: 'Gonzalo Javier Paso', organizador: 'JCORG Broker de Seguros', matricula: '86992', email: 'gpaso@jcorg.com.ar' },
  };

  currentUser = signal<User | null>(this.getInitialUser());
  tenantLogo = signal<string | null>(localStorage.getItem('tenantLogo'));
  isModalActive = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  login(credentials: any): Observable<any> {
    const { email, password, rememberMe } = credentials;
    const emailKey = email?.trim().toLowerCase();

    const saveUser = (user: User) => {
      this.currentUser.set(user);
      if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        sessionStorage.removeItem('currentUser');
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.removeItem('currentUser');
      }
    };

    // 1. Validar credenciales localmente (funciona siempre, sin backend)
    const localUser = AuthService.LOCAL_USERS[emailKey];
    if (!localUser || localUser.password !== password) {
      return throwError(() => new Error('Credenciales incorrectas'));
    }

    const { password: _, ...baseUser } = localUser;
    saveUser(baseUser as User);

    // 2. Intentar enriquecer con el backend (si está disponible)
    //    Si falla, el usuario local ya está seteado — no bloquear el login
    this.http.post<any>('/api/v1/auth/login', { email, password, rememberMe })
      .subscribe({
        next: (res) => {
          if (res?.success && res?.user) {
            const apiUser = res.user;
            const enriched: User = {
              role: apiUser.role === 'admin' ? 'admin' : 'pas',
              name: apiUser.name || baseUser.name,
              matricula: apiUser.matricula || baseUser.matricula,
              organizador: apiUser.organizador || baseUser.organizador,
              email: apiUser.email || email,
            };
            saveUser(enriched);
          }
        },
        error: () => { /* backend no disponible, user local ya activo */ }
      });

    return of({ success: true, user: baseUser });
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }
}
