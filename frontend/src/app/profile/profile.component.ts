import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  // Datos del usuario
  username = '';
  email = '';
  tagline = '';
  region = '';
  fechaNacimiento = '';

  // Datos editables
  nuevoUsername = '';
  nuevoEmail = '';
  nuevoTagline = '';
  nuevaRegion = '';
  nuevaFechaNacimiento = '';
  passwordActual = '';
  nuevaPassword = '';
  confirmarPassword = '';

  // Control UI
  isLoading = false;
  isSaving = false;
  mensajeExito = '';
  mensajeError = '';
  mostrarPasswordActual = false;
  mostrarNuevaPassword = false;
  seccionActiva: 'riotid' | 'personal' | 'password' = 'riotid';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const token = localStorage.getItem('token');
    if (!token) { this.router.navigate(['/login']); return; }
    this.cargarPerfil();
  }

  limpiarMensajes(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  cargarPerfil(): void {
    this.isLoading = true;
    this.apiService.getPerfil().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.username = res.username;
        this.email = res.email;
        this.tagline = res.tagline || '';
        this.region = res.region || '';
        this.fechaNacimiento = res.fechaNacimiento || '';
        this.nuevoUsername = res.username;
        this.nuevoEmail = res.email;
        this.nuevoTagline = res.tagline || '';
        this.nuevaRegion = res.region || '';
        this.nuevaFechaNacimiento = res.fechaNacimiento || '';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        if (err.status === 401) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
          }
          this.router.navigate(['/login']);
        } else {
          this.mensajeError = 'No se pudieron cargar los datos del perfil.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  // Guarda datos de Riot ID e información personal
  guardarDatos(): void {
    this.limpiarMensajes();
    if (!this.nuevoUsername || !this.nuevoEmail) {
      this.mensajeError = 'Username y email son obligatorios.';
      return;
    }
    this.isSaving = true;
    this.apiService.actualizarPerfil({
      username: this.nuevoUsername,
      email: this.nuevoEmail,
      tagline: this.nuevoTagline,
      region: this.nuevaRegion,
      fechaNacimiento: this.nuevaFechaNacimiento
    }).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        this.username = res.username;
        this.email = res.email;
        this.tagline = res.tagline || '';
        this.region = res.region || '';
        this.fechaNacimiento = res.fechaNacimiento || '';
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('username', res.username);
        }
        this.mensajeExito = '¡Datos actualizados correctamente!';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isSaving = false;
        this.mensajeError = err.error?.message || 'Error al actualizar los datos.';
        this.cdr.detectChanges();
      }
    });
  }

  cambiarPassword(): void {
    this.limpiarMensajes();
    if (!this.passwordActual || !this.nuevaPassword || !this.confirmarPassword) {
      this.mensajeError = 'Todos los campos son obligatorios.';
      return;
    }
    if (this.nuevaPassword !== this.confirmarPassword) {
      this.mensajeError = 'Las contraseñas nuevas no coinciden.';
      return;
    }
    if (this.nuevaPassword.length < 6) {
      this.mensajeError = 'La nueva contraseña debe tener al menos 6 caracteres.';
      return;
    }
    this.isSaving = true;
    this.apiService.cambiarPassword({ passwordActual: this.passwordActual, nuevaPassword: this.nuevaPassword }).subscribe({
      next: () => {
        this.isSaving = false;
        this.passwordActual = '';
        this.nuevaPassword = '';
        this.confirmarPassword = '';
        this.mensajeExito = '¡Contraseña actualizada correctamente!';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isSaving = false;
        this.mensajeError = err.error?.message || 'Error al cambiar la contraseña.';
        this.cdr.detectChanges();
      }
    });
  }

  eliminarCuenta(): void {
    if (!confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) return;
    this.apiService.eliminarCuenta().subscribe({
      next: () => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
        }
        this.router.navigate(['/']);
      },
      error: () => { this.mensajeError = 'Error al eliminar la cuenta.'; }
    });
  }

  volver(): void { this.router.navigate(['/']); }
}
