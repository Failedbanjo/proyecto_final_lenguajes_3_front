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
      videoId: 'mDkaHeW8O1I', 
      imageUrl: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/8722bac71b68a347f238c9d59e615346ea40013d-2560x1440.jpg?accountingTag=VAL&auto=format&fit=fill&q=80&w=1082'
    },
    { 
      title: 'Worlds 2024: El himno "Heavy Is The Crown" de Linkin Park',
      videoId: '5F6fE_w44w8',
      imageUrl: 'https://cmsassets.rgpub.io/sanity/images/ds7s0t2z/production/e7e8b6b15858004f1437a346e0333d45c8b74f32-3840x2160.jpg?fp-x=0.5&fp-y=0.5&w=480&h=270&q=80&auto=format'
    },
    { 
      title: 'LoL | Temporada 2024: Cinemática "Still Here"',
      videoId: 'ZHhReqfu66A',
      imageUrl: 'https://cmsassets.rgpub.io/sanity/images/ds7s0t2z/production/d3f749a2a97a3c3182103f15b80b721e06716a44-1920x1080.jpg?fp-x=0.5&fp-y=0.5&w=480&h=270&q=80&auto=format'
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