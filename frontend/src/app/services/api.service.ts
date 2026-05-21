// api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000/api';

  login(credentials: any) {
  // Este endpoint lo crearemos en Django con SimpleJWT
    return this.http.post(`${this.baseUrl}/token/`, credentials);
  }

  // Un método para saber si está logueado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  
  // api.service.ts
  register(userData: any) {
    return this.http.post(`${this.baseUrl}/register/`, userData);
}

  verifyCode(data: { email: string, code: string }) {
  return this.http.post<any>('http://127.0.0.1:8000/api/verify-email/', data);
}
}