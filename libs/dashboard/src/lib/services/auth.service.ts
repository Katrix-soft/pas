import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, throwError, switchMap } from 'rxjs';

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
    // Default logged in producer
    return {
      role: 'pas',
      name: 'Gonzalo Javier Paso',
      matricula: '86992',
      organizador: 'JCORG Broker de Seguros',
      email: 'gpaso@jcorg.com.ar'
    };
  }

  currentUser = signal<User | null>(this.getInitialUser());
  tenantLogo = signal<string | null>(localStorage.getItem('tenantLogo'));
  isModalActive = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  login(credentials: any): Observable<any> {
    return of(null).pipe(
      delay(800),
      switchMap(() => {
        const { email, password, rememberMe } = credentials;
        
        let user: User | null = null;
        if (email?.includes('admin') && password === 'admin123') {
           user = { role: 'admin', name: 'Administrador Operativo', organizador: 'JCORG Central' };
        } 
        else {
           user = {
             role: 'pas',
             name: 'Gonzalo Javier Paso',
             matricula: '86992',
             organizador: 'JCORG Broker de Seguros',
             email: email || 'gpaso@jcorg.com.ar'
           };
        } 

        if (user) {
          this.currentUser.set(user);
          if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            sessionStorage.removeItem('currentUser');
          } else {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.removeItem('currentUser');
          }
          return of({ success: true, user });
        } else {
           return throwError(() => new Error('Credenciales incorrectas'));
        }
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }
}
