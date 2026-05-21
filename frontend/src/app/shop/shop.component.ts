// Importa Component para definir el componente, inject para inyección moderna,
// PLATFORM_ID para detectar si corre en browser o servidor, OnInit para el ciclo de vida
import { Component, inject, PLATFORM_ID, OnInit } from '@angular/core';

// isPlatformBrowser verifica si la app corre en navegador (no en SSR/Node)
// CommonModule habilita directivas como *ngIf y *ngFor en la plantilla
import { isPlatformBrowser, CommonModule } from '@angular/common';

// Importa Router para navegar programáticamente entre rutas
import { Router } from '@angular/router';

// Decorador con los metadatos del componente
@Component({
  selector: 'app-shop',        // Tag HTML del componente: <app-shop>
  standalone: true,            // Componente independiente, no necesita NgModule
  imports: [CommonModule],     // Solo necesita CommonModule para directivas básicas
  templateUrl: './shop.component.html',          // Plantilla HTML del componente
  styleUrls: ['./shop.component.scss']           // Estilos del componente
})
export class ShopComponent implements OnInit {

  // Inyecta PLATFORM_ID para saber si estamos en navegador o en servidor (SSR)
  private platformId = inject(PLATFORM_ID);

  // Inyecta el Router para redirigir al usuario si no está autenticado
  private router = inject(Router);

  // --- Variables del estado del carrito de compras ---

  cartCount = 0;     // Cantidad de paquetes añadidos al carrito
  rpTotal = 0;       // Suma total de RP acumulados en el carrito
  precioTotal = 0;   // Suma total del precio en USD acumulado en el carrito

  // Array con los paquetes de RP disponibles, basados en los precios oficiales de Riot
  paquetes = [
    { rp: 575,   precio: 4.25,  popular: false }, // Paquete básico
    { rp: 1380,  precio: 9.25,  popular: false },
    { rp: 2800,  precio: 18.50, popular: true  }, // Marcado como "Popular" en la UI
    { rp: 6500,  precio: 41.99, popular: false },
    { rp: 13500, precio: 84.99, popular: false }  // Paquete premium
  ];

  // Hook del ciclo de vida: se ejecuta automáticamente al inicializar el componente
  ngOnInit(): void {

    // Solo accede a localStorage si está en el navegador (evita errores en SSR)
    if (isPlatformBrowser(this.platformId)) {

      // Si no hay token guardado, el usuario no está autenticado: redirige al login
      if (!localStorage.getItem('token')) {
        this.router.navigate(['/login']); // Ruta de login como protección de la tienda
      }
    }
  }

  // Agrega un paquete al carrito sumando su RP y precio a los totales acumulados
  agregarPaquete(rp: number, precio: number): void {
    this.cartCount++;          // Incrementa el contador de ítems en el carrito
    this.rpTotal += rp;        // Suma los RP del paquete al total acumulado
    this.precioTotal += precio; // Suma el precio del paquete al total en USD
  }

  // Reinicia todas las variables del carrito a sus valores iniciales (vacía el carrito)
  limpiarCarrito(): void {
    this.cartCount = 0;   // Resetea el contador de paquetes
    this.rpTotal = 0;     // Resetea el total de RP
    this.precioTotal = 0; // Resetea el total en USD
  }

  // Procesa la compra: muestra confirmación, limpia el carrito y vuelve al home
  completarCompra(): void {

    // Solo ejecuta si hay al menos un paquete en el carrito
    if (this.cartCount > 0) {

      // Muestra un alert de confirmación con el resumen de la compra
      // toFixed(2) formatea el precio con exactamente 2 decimales (ej: 18.50)
      alert(`¡ÉXITO! Has adquirido ${this.rpTotal} RP por un total de $${this.precioTotal.toFixed(2)} USD.`);

      this.limpiarCarrito();      // Vacía el carrito tras confirmar la compra
      this.router.navigate(['/']); // Redirige al usuario a la página principal
    }
  }

  // Navega de vuelta a la página principal sin procesar ninguna compra
  volverAlInicio(): void {
    this.router.navigate(['/']); // Redirige al home
  }
}