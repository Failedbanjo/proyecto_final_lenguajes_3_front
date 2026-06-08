import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  username = '';
  email = '';
  nuevoUsername = '';
  nuevoEmail = '';
  passwordActual = '';
  nuevaPassword = '';
  confirmarPassword = '';

  isLoading = false;
  isSaving = false;
  mensajeExito = '';
  mensajeError = '';
  mostrarPasswordActual = false;
  mostrarNuevaPassword = false;
  seccionActiva: 'datos' | 'password' = 'datos';

  ngOnInit(): void {
    if (!localStorage.getItem('token')) { this.router.navigate(['/login']); return; }
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.isLoading = true;
    this.apiService.getPerfil().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.username = res.username;
        this.email = res.email;
        this.nuevoUsername = res.username;
        this.nuevoEmail = res.email;
      },
      error: () => { this.isLoading = false; this.mensajeError = 'No se pudieron cargar los datos del perfil.'; }
    });
  }

  guardarDatos(): void {
    this.mensajeExito = ''; this.mensajeError = '';
    if (!this.nuevoUsername || !this.nuevoEmail) { this.mensajeError = 'Todos los campos son obligatorios.'; return; }
    this.isSaving = true;
    this.apiService.actualizarPerfil({ username: this.nuevoUsername, email: this.nuevoEmail }).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        this.username = res.username;
        this.email = res.email;
        localStorage.setItem('username', res.username);
        this.mensajeExito = '¡Datos actualizados correctamente!';
      },
      error: (err: any) => { this.isSaving = false; this.mensajeError = err.error?.message || 'Error al actualizar los datos.'; }
    });
  }

  cambiarPassword(): void {
    this.mensajeExito = ''; this.mensajeError = '';
    if (!this.passwordActual || !this.nuevaPassword || !this.confirmarPassword) { this.mensajeError = 'Todos los campos son obligatorios.'; return; }
    if (this.nuevaPassword !== this.confirmarPassword) { this.mensajeError = 'Las contraseñas nuevas no coinciden.'; return; }
    if (this.nuevaPassword.length < 6) { this.mensajeError = 'La nueva contraseña debe tener al menos 6 caracteres.'; return; }
    this.isSaving = true;
    this.apiService.cambiarPassword({ passwordActual: this.passwordActual, nuevaPassword: this.nuevaPassword }).subscribe({
      next: () => {
        this.isSaving = false;
        this.passwordActual = ''; this.nuevaPassword = ''; this.confirmarPassword = '';
        this.mensajeExito = '¡Contraseña actualizada correctamente!';
      },
      error: (err: any) => { this.isSaving = false; this.mensajeError = err.error?.message || 'Error al cambiar la contraseña.'; }
    });
  }

  eliminarCuenta(): void {
    if (!confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) return;
    this.apiService.eliminarCuenta().subscribe({
      next: () => { localStorage.removeItem('token'); localStorage.removeItem('username'); this.router.navigate(['/']); },
      error: () => { this.mensajeError = 'Error al eliminar la cuenta.'; }
    });
  }

  volver(): void { this.router.navigate(['/']); }
}
