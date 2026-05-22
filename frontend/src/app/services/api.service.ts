// api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000/api';

  // Login: envía username y password, recibe JWT
  login(credentials: any) {
    return this.http.post(`${this.baseUrl}/token`, credentials);
  }

  // Registro: envía username, email y password
  register(userData: any) {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  // Verificación del código de 6 dígitos enviado al correo
  verifyCode(data: { email: string, code: string }) {
    return this.http.post<any>(`${this.baseUrl}/verify-email`, data);
  }

  // Verifica si hay un token guardado en localStorage
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
