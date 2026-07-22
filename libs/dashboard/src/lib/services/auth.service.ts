import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, throwError, switchMap } from 'rxjs';

export interface User {
  role: 'admin' | 'pas';
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private getInitialUser(): User | null {
    try {
      const local = localStorage.getItem('currentUser');
      if (local) return JSON.parse(local);
      const session = sessionStorage.getItem('currentUser');
      if (session) return JSON.parse(session);
    } catch (e) {
      console.error('Error parsing stored user session:', e);
    }
    return null;
  }

  currentUser = signal<User | null>(this.getInitialUser());
  tenantLogo = signal<string | null>(localStorage.getItem('tenantLogo'));

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
           user = { role: 'admin', name: 'Administrador' };
        } 
        else if (password === 'pas123' || !email?.includes('admin')) {
           user = { role: 'pas', name: 'Productor PAS' };
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
