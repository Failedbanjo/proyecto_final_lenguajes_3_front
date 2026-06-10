// Importa el decorador Component para definir el componente Angular
import { Component } from '@angular/core';

// Importa CommonModule para usar directivas como *ngIf y *ngFor en la plantilla
import { CommonModule } from '@angular/common';

// Importa FormsModule para habilitar el two-way binding con [(ngModel)]
import { FormsModule } from '@angular/forms';

// Importa Router para poder navegar entre rutas programáticamente
import { Router } from '@angular/router';

// Importa el servicio API personalizado que gestiona las llamadas HTTP al backend
import { ApiService } from '../services/api.service';

// Importa RouterLink para usar [routerLink] como atributo de navegación en el HTML
import { RouterLink } from '@angular/router';

// Decorador que define los metadatos del componente
@Component({
  selector: 'app-login',       // Nombre del tag HTML para usar este componente: <app-login>
  standalone: true,            // Componente independiente, no necesita un NgModule
  imports: [CommonModule, FormsModule, RouterLink], // Módulos disponibles en este componente
  templateUrl: './login.component.html',            // Archivo HTML asociado
  styleUrls: ['./login.component.scss']             // Archivo de estilos asociado
})
export class LoginComponent {

  // Variable vinculada al campo de texto del usuario en el formulario (ngModel)
  username = '';

  // Variable vinculada al campo de contraseña en el formulario (ngModel)
  password = '';

  // Controla si la contraseña se muestra como texto o como puntos ocultos
  showPassword = false;

  // Indica si hay una petición HTTP en curso (para mostrar spinner o deshabilitar el botón)
  isLoading = false;

  // Almacena el mensaje de error que se mostrará al usuario si algo falla
  errorMessage = '';

  // Array de objetos que representa los juegos de Riot, mostrados visualmente en el login
  brandGames = [
    { name: 'LEAGUE OF LEGENDS', color: '#C89B3C' }, // Nombre del juego y su color de marca
    { name: 'VALORANT', color: '#FF4655' },
    { name: 'TEAMFIGHT TACTICS', color: '#9B59B6' },
    { name: 'WILD RIFT', color: '#2ECC71' },
    { name: 'LEGENDS OF RUNETERRA', color: '#D4AF37' },
  ];

  // Constructor: inyecta el Router para navegar y el ApiService para llamadas HTTP
  constructor(private router: Router, private apiService: ApiService) {}

  // Alterna la visibilidad de la contraseña entre mostrar/ocultar
  togglePassword(): void {
    this.showPassword = !this.showPassword; // Invierte el valor booleano actual
  }

  // Método principal que se ejecuta al enviar el formulario de login
  onLogin(): void {
    this.errorMessage = ''; // Limpia cualquier mensaje de error previo antes de intentar

    // Valida que ambos campos tengan valor; si no, muestra error y detiene la ejecución
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor ingresa tu usuario y contraseña.';
      return; // Sale del método sin hacer la petición HTTP
    }
    
    this.isLoading = true; // Activa el indicador de carga mientras se procesa la petición

    // Llama al método login del ApiService, enviando username y password al backend Django
    this.apiService.login({
      username: this.username,
      password: this.password
    }).subscribe({

      // Callback ejecutado si la petición HTTP fue exitosa (status 2xx)
      next: (res: any) => {
        this.isLoading = false; // Desactiva el indicador de carga

        // Guarda el token JWT devuelto por Django en localStorage para sesiones futuras
        localStorage.setItem('token', res.access);
        localStorage.setItem('username', res.username);

        this.router.navigate(['/']); // Redirige al usuario a la página principal (home)
      },

      // Callback ejecutado si la petición HTTP falló (status 4xx o 5xx)
      error: (err: any) => {
        this.isLoading = false; // Desactiva el indicador de carga aunque hubo error

        // Muestra un mensaje genérico de error (Django suele devolver detalles en err.error.detail)
        this.errorMessage = 'Credenciales incorrectas o el servidor no responde.';

        console.error(err); // Imprime el error completo en consola para depuración
      }
    });
  }

  // Navega directamente al home sin necesidad de hacer login
  goHome(): void {
    this.router.navigate(['/']);
  }
}