import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000/api';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  login(credentials: any) {
    return this.http.post(`${this.baseUrl}/token`, credentials);
  }

  register(userData: any) {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  verifyCode(data: { email: string, code: string }) {
    return this.http.post<any>(`${this.baseUrl}/verify-email`, data);
  }

  getPerfil() {
    return this.http.get(`${this.baseUrl}/perfil`, { headers: this.getHeaders() });
  }

  actualizarPerfil(data: { username: string, email: string }) {
    return this.http.put(`${this.baseUrl}/perfil`, data, { headers: this.getHeaders() });
  }

  cambiarPassword(data: { passwordActual: string, nuevaPassword: string }) {
    return this.http.put(`${this.baseUrl}/perfil/password`, data, { headers: this.getHeaders() });
  }

  eliminarCuenta() {
    return this.http.delete(`${this.baseUrl}/perfil`, { headers: this.getHeaders() });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
