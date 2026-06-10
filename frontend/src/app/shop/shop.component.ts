import { Component, inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private apiService = inject(ApiService);

  cartCount = 0;
  rpTotal = 0;
  precioTotal = 0;
  isCompletando = false;
  mensajeExito = '';

  // Items del carrito para enviar al backend
  itemsCarrito: { rp: number, precio: number }[] = [];

  paquetes = [
    { rp: 575,   precio: 4.25,  popular: false },
    { rp: 1380,  precio: 9.25,  popular: false },
    { rp: 2800,  precio: 18.50, popular: true  },
    { rp: 6500,  precio: 41.99, popular: false },
    { rp: 13500, precio: 84.99, popular: false }
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!localStorage.getItem('token')) {
        this.router.navigate(['/login']);
      }
    }
  }

  agregarPaquete(rp: number, precio: number): void {
    this.cartCount++;
    this.rpTotal += rp;
    this.precioTotal += precio;
    // Guarda el item para enviarlo al backend al completar
    this.itemsCarrito.push({ rp, precio });
  }

  limpiarCarrito(): void {
    this.cartCount = 0;
    this.rpTotal = 0;
    this.precioTotal = 0;
    this.itemsCarrito = [];
  }

  // Guarda la compra en MongoDB y redirige al home
  completarCompra(): void {
    if (this.cartCount === 0) return;

    this.isCompletando = true;

    this.apiService.realizarCompra(this.itemsCarrito).subscribe({
      next: (res: any) => {
        this.isCompletando = false;
        this.mensajeExito = `¡Compra exitosa! Adquiriste ${res.totalRp} RP por $${res.totalPrecio} USD.`;
        this.limpiarCarrito();
        // Redirige al home después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: () => {
        this.isCompletando = false;
        alert('Error al procesar la compra. Intenta de nuevo.');
      }
    });
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
}
