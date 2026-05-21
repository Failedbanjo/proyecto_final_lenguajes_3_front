// Importa Component para definir el componente, inject para inyección moderna,
// y ChangeDetectorRef para forzar la detección de cambios en la vista manualmente
import { Component, inject, ChangeDetectorRef } from '@angular/core';

// Importa CommonModule para usar *ngIf, *ngFor y otras directivas en la plantilla
import { CommonModule } from '@angular/common';

// Importa FormsModule para habilitar [(ngModel)] en los campos del formulario
import { FormsModule } from '@angular/forms';

// Importa Router para navegar entre rutas y RouterLink para navegación en el HTML
import { Router, RouterLink } from '@angular/router';

// Importa el servicio personalizado que gestiona las peticiones al backend
import { ApiService } from '../services/api.service';

// Decorador con los metadatos del componente
@Component({
  selector: 'app-register',     // Tag HTML del componente: <app-register>
  standalone: true,             // Componente independiente, no requiere NgModule
  imports: [CommonModule, FormsModule, RouterLink], // Módulos disponibles aquí
  templateUrl: './register.component.html',         // Plantilla HTML del componente
  styleUrl: './register.component.scss'             // Hoja de estilos del componente
})
export class RegisterComponent {
  
  // Inyecta el ApiService usando la función inject() (sintaxis moderna de Angular 14+)
  private apiService = inject(ApiService);

  // Inyecta el Router para redirecciones programáticas
  private router = inject(Router);

  // Inyecta ChangeDetectorRef para forzar manualmente la actualización de la vista
  private cdr = inject(ChangeDetectorRef);

  // --- Datos vinculados a los campos del formulario mediante [(ngModel)] ---

  username = '';          // Campo: nombre de usuario
  email = '';             // Campo: correo electrónico
  password = '';          // Campo: contraseña
  verificationCode = '';  // Campo: código de verificación recibido por correo

  // --- Variables de control del flujo del formulario ---

  step = 1;             // Paso actual: 1 = formulario de datos, 2 = verificación de código
  isLoading = false;    // true mientras hay una petición HTTP activa
  errorMessage = '';    // Mensaje de error visible para el usuario

  // Método ejecutado al enviar el formulario de registro (paso 1)
  onRegister() {

    // Verifica que los tres campos obligatorios tengan valor
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Datos incompletos'; // Muestra error si falta algún campo
      return; // Detiene la ejecución sin llamar al backend
    }

    this.isLoading = true;    // Activa el indicador de carga
    this.errorMessage = '';   // Limpia errores anteriores

    // Llama al método register del ApiService con los datos del formulario
    this.apiService.register({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({

      // Callback de éxito: el backend procesó el registro correctamente
      next: (res) => {
        console.log('Respuesta recibida:', res); // Log para depuración en consola
        this.isLoading = false; // Desactiva la carga
        this.step = 2;          // Avanza al paso 2: verificación de código

        // Fuerza a Angular a re-renderizar la vista inmediatamente tras cambiar step
        this.cdr.detectChanges(); 
      },

      // Callback de error: algo falló en la petición HTTP
      error: (err) => {
        console.error('Error capturado:', err); // Log del error para depuración
        this.isLoading = false; // Desactiva la carga incluso si hay error

        // Caso especial: el backend devolvió 200/201 pero Angular lo parseó como error
        // (ocurre cuando el body no es JSON válido pero el registro sí fue exitoso)
        if (err.status === 200 || err.status === 201) {
          this.step = 2;            // Avanza al paso 2 de todos modos
          this.cdr.detectChanges(); // Fuerza re-render
        } else {
          // Error real del backend (ej: usuario duplicado)
          this.errorMessage = 'Error: ' + (err.error?.message || 'El usuario ya existe');
          this.cdr.detectChanges(); // Fuerza que aparezca el mensaje de error en pantalla
        }
      },

      // Callback que siempre se ejecuta al finalizar el observable (éxito o error)
      complete: () => {
        this.isLoading = false;   // Garantiza que la carga quede desactivada
        this.cdr.detectChanges(); // Fuerza una última actualización visual
      }
    });
  }

  // Método ejecutado al enviar el código de verificación recibido por email (paso 2)
  confirmCode() {

    // Valida que el campo del código no esté vacío
    if (!this.verificationCode) {
      this.errorMessage = 'Por favor, ingresa el código.';
      return; // Detiene la ejecución si el campo está vacío
    }

    this.isLoading = true;   // Activa el indicador de carga (muestra "VERIFICANDO...")
    this.errorMessage = '';  // Limpia errores anteriores

    // Log de depuración para confirmar qué datos se envían al backend
    console.log('Enviando verificación para:', this.email, 'con código:', this.verificationCode);

    // Llama al método verifyCode del ApiService con el email y el código ingresado
    this.apiService.verifyCode({
      email: this.email,
      code: this.verificationCode
    }).subscribe({

      // Callback de éxito: el código es válido y la cuenta fue verificada
      next: (res) => {
        console.log('¡Verificación exitosa!', res); // Log de confirmación
        this.isLoading = false; // Desactiva el indicador de carga

        // Persiste el nombre de usuario en localStorage para mostrarlo en el Navbar
        localStorage.setItem('username', this.username);

        // Guarda el token JWT; usa el token del backend o uno de respaldo si no viene
        localStorage.setItem('token', res.token || 'token_valido'); 
        
        // Redirección forzada al home usando window.location (más confiable que router.navigate
        // cuando se necesita recargar el estado completo de la aplicación)
        window.location.href = '/'; 
      },

      // Callback de error: el código es incorrecto o venció
      error: (err) => {
        this.isLoading = false; // Desactiva el "VERIFICANDO..." en el botón
        console.error('Error en verificación:', err); // Log del error completo
        
        // Muestra el mensaje de error del backend o uno genérico si no viene ninguno
        this.errorMessage = err.error?.message || 'Código incorrecto. Intenta de nuevo.';

        // Fuerza a Angular a mostrar el mensaje de error en pantalla inmediatamente
        this.cdr.detectChanges();
      }
    });
  }
}