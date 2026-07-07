import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, delay } from 'rxjs';

export interface User {
  role: 'admin' | 'pas';
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    // Simulando login
    return of({ success: true }).pipe(
      delay(1000),
      tap(() => {
        // Mock user details based on email
        if (credentials.email?.includes('admin')) {
           this.currentUser.set({ role: 'admin', name: 'Administrador' });
        } else {
           this.currentUser.set({ role: 'pas', name: 'Productor PAS' });
        }
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
  }
}
