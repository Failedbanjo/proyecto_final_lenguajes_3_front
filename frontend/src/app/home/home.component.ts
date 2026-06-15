import { Component, OnInit, OnDestroy, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router); // Inyectado para la navegación

  // --- LÓGICA DEL CARRITO (Se mantiene para mostrar el contador en el Navbar) ---
  cartCount = 0;
  rpTotal = 0;
  precioTotal = 0;
  showCartModal = false;
  readonly LOTE_RP = 575;
  readonly PRECIO_LOTE = 4.25;

  // --- VARIABLES EXISTENTES ---
  username: string | null = '';
  isScrolled = false;
  activeGame = 0;
  hoveredNews = -1;
  featuredHovered = false; // Controla el hover de la noticia principal
  particles: { x: number; y: number; delay: number; size: number }[] = [];

  sideNews = [
    { 
      title: 'JAMAS LUCHES A SOLAS // Tráiler de agente de ISO - VALORANT',
      url: 'https://www.youtube.com/watch?v=Yr2w0yS7lMA',
      imageUrl: 'data:image/jpeg;base64,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'
    },
    { 
      title: 'Worlds 2024: El himno "Heavy Is The Crown" de Linkin Park',
      url: 'https://www.youtube.com/watch?v=5FrhtahQiRc',
      imageUrl: 'https://phantom.estaticos-marca.com/c5b586e502e069b7d368897a0f30dfc7/resize/828/f/jpg/assets/multimedia/imagenes/2024/09/23/17270830417556.jpg'
    },
    { 
      title: 'LoL | Temporada 2024: Cinemática "Still Here"',
      url: 'https://www.youtube.com/watch?v=ZHhqwBwmRkI',
      imageUrl: 'https://i.ytimg.com/vi/ZHhqwBwmRkI/maxresdefault.jpg'
    },
  ];
  games = [
    {
      name: 'League of Legends',
      shortName: 'LOL',
      desc: 'El juego de estrategia multijugador más jugado del mundo.',
      platforms: ['Windows', 'Mac'],
      url: 'https://www.leagueoflegends.com',
      imageUrl: 'https://cdn.egamersworld.com/cdn-cgi/image/width=690,quality=75,format=webp/uploads/blog/1/17/1735564816859_1735564816859.webp'
    },
    {
      name: 'VALORANT',
      shortName: 'VAL',
      desc: 'El shooter táctico 5v5 con personajes únicos.',
      platforms: ['Windows'],
      url: 'https://playvalorant.com',
      imageUrl: 'https://xboxwire.thesourcemediaassets.com/sites/2/2024/08/Val-Console-Launch-Hero-1080-__-GAME-STORES-80b474d3ff38615edd0a-1900x1080.jpg'
    },
    {
      name: 'Teamfight Tactics',
      shortName: 'TFT',
      desc: 'El auto battler estratégico. Sobrevive al escenario.',
      platforms: ['Windows', 'Mac', 'Mobile'],
      url: 'https://teamfighttactics.leagueoflegends.com',
      imageUrl: 'https://assets.games.gg/tft_set_16_patch_166_guide_key_changes_mistakes_to_avoid_hero_627a4ba8a3.webp'
    },
    {
      name: '2XKO',
      shortName: '2XKO',
      desc: 'El nuevo juego de lucha en el universo de LoL.',
      platforms: ['Windows', 'PlayStation', 'Xbox'],
      url: 'https://2xko.riotgames.com',
      imageUrl: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/content_organization/ff8b9d1d3c2dad7bc3240387b199787fab708085-1920x1080.jpg?accountingTag=2XKO'
    }
  ];

  esportsStats = [
    { number: '180M+', label: 'JUGADORES ACTIVOS' },
    { number: '200+', label: 'PAISES ALCANZADOS' },
    { number: '5000+', label: 'RIOTERS GLOBALES' },
    { number: '15+', label: 'AÑOS DE EXCELENCIA' }
  ];

  private carouselInterval: any;

  constructor(private sanitizer: DomSanitizer) {} // Quitamos Router del constructor porque ya usamos inject() arriba

  getSafeVideoUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`);
  }

  get isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.username = localStorage.getItem('username');
      this.generateParticles();
      this.startCarouselAuto();
    }
  }

  // --- MÉTODOS DEL CARRITO / TIENDA ---

  // ESTA ES LA FUNCIÓN QUE TE FALTABA
  irALaTienda(): void {
    this.router.navigate(['/shop']);
  }

  toggleCart(): void {
    this.showCartModal = !this.showCartModal;
  }

  agregarLote(): void {
    this.cartCount++;
    this.rpTotal = this.cartCount * this.LOTE_RP;
    this.precioTotal = this.cartCount * this.PRECIO_LOTE;
  }

  limpiarCarrito(): void {
    this.cartCount = 0;
    this.rpTotal = 0;
    this.precioTotal = 0;
  }

  completarCompra(): void {
    if (this.cartCount > 0) {
      alert(`¡ÉXITO! Has adquirido ${this.rpTotal} RP por un total de $${this.precioTotal.toFixed(2)} USD.`);
      this.limpiarCarrito();
      this.showCartModal = false;
    }
  }

  // --- MÉTODOS EXISTENTES ---
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      window.location.reload();
    }
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  generateParticles(): void {
    for (let i = 0; i < 25; i++) {
      this.particles.push({
        x: Math.random() * 100, y: Math.random() * 100,
        delay: Math.random() * 5, size: Math.random() * 3 + 1
      });
    }
  }

  startCarouselAuto(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.carouselInterval = setInterval(() => {
        this.activeGame = (this.activeGame + 1) % this.games.length;
      }, 4000);
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 80;
    }
  }

  setActiveGame(index: number): void {
    this.activeGame = index;
    if (isPlatformBrowser(this.platformId)) {
      clearInterval(this.carouselInterval);
      this.startCarouselAuto();
    }
  }

  nextGame(): void { if (this.activeGame < this.games.length - 1) this.setActiveGame(this.activeGame + 1); }
  prevGame(): void { if (this.activeGame > 0) this.setActiveGame(this.activeGame - 1); }
  getNewsImgClass(i: number): string { return 'news-img-' + (i + 1); }
  openLogin(): void { this.router.navigate(['/login']); }
  irAlPerfil(): void { this.router.navigate(['/profile']); }
  scrollToGames(): void { if (isPlatformBrowser(this.platformId)) document.getElementById('juegos')?.scrollIntoView({ behavior: 'smooth' }); }
  scrollToNews(): void { if (isPlatformBrowser(this.platformId)) document.getElementById('noticias')?.scrollIntoView({ behavior: 'smooth' }); }
}