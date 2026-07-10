import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, delay, throwError, switchMap } from 'rxjs';

export interface User {
  role: 'admin' | 'pas';
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private savedUser = localStorage.getItem('currentUser');
  currentUser = signal<User | null>(this.savedUser ? JSON.parse(this.savedUser) : null);
  tenantLogo = signal<string | null>(localStorage.getItem('tenantLogo'));

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    // Simulate network delay
    return of(null).pipe(
      delay(1000),
      switchMap(() => {
        const { email, password } = credentials;
        
        // Mock validation logic
        if (email?.includes('admin') && password === 'admin123') {
           const user: User = { role: 'admin', name: 'Administrador' };
           this.currentUser.set(user);
           localStorage.setItem('currentUser', JSON.stringify(user));
           return of({ success: true });
        } 
        else if (!email?.includes('admin') && password === 'pas123') {
           const user: User = { role: 'pas', name: 'Productor PAS' };
           this.currentUser.set(user);
           localStorage.setItem('currentUser', JSON.stringify(user));
           return of({ success: true });
        } 
        else {
           return throwError(() => new Error('Credenciales incorrectas'));
        }
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }
}
