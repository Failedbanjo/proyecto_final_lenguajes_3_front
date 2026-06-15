import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private baseUrl = 'http://localhost:8000/api';

  private getHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    if (isPlatformBrowser(this.platformId)) {
      console.debug('[ApiService] getHeaders token:', token?.substring(0, 10) + (token && token.length > 10 ? '...' : ''));
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ── Auth ──────────────────────────────────────────
  login(credentials: any) {
    return this.http.post(`${this.baseUrl}/token`, credentials);
  }

  register(userData: any) {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  verifyCode(data: { email: string, code: string }) {
    return this.http.post<any>(`${this.baseUrl}/verify-email`, data);
  }

  // ── Perfil ────────────────────────────────────────
  getPerfil() {
    return this.http.get(`${this.baseUrl}/perfil`, { headers: this.getHeaders() });
  }

  actualizarPerfil(data: { username: string, email: string, tagline?: string, region?: string, fechaNacimiento?: string }) {
    return this.http.put(`${this.baseUrl}/perfil`, data, { headers: this.getHeaders() });
  }

  cambiarPassword(data: { passwordActual: string, nuevaPassword: string }) {
    return this.http.put(`${this.baseUrl}/perfil/password`, data, { headers: this.getHeaders() });
  }

  eliminarCuenta() {
    return this.http.delete(`${this.baseUrl}/perfil`, { headers: this.getHeaders() });
  }

  // ── Tienda ────────────────────────────────────────
  realizarCompra(items: { rp: number, precio: number }[]) {
    return this.http.post(`${this.baseUrl}/shop/comprar`, { items }, { headers: this.getHeaders() });
  }

  getHistorialCompras() {
    return this.http.get(`${this.baseUrl}/shop/historial`, { headers: this.getHeaders() });
  }

  // ── Utils ─────────────────────────────────────────
  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return !!localStorage.getItem('token');
  }
}
