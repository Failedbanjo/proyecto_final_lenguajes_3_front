import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',           // Home — se puede pre-renderizar
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',      // Login — se puede pre-renderizar
    renderMode: RenderMode.Prerender
  },
  {
    path: 'register',   // Register — se puede pre-renderizar
    renderMode: RenderMode.Prerender
  },
  {
    path: 'profile',    // Requiere auth → solo render en el cliente
    renderMode: RenderMode.Client
  },
  {
    path: 'shop',       // Requiere auth → solo render en el cliente
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
