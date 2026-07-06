// src/app/app.ts
import { Component } from '@angular/core';

// 1. Importas cada componente (Asegúrate de que la ruta y el nombre coincidan con lo que dice el archivo original)
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { Proyects } from './components/proyects/proyects';
import { Contact } from './components/contact/contact';
import { Footer } from './components/footer/footer';
import { Tecnologias } from './components/tecnologias/tecnologias';
import { Sun3d } from './components/sun3d/sun3d';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. Registro: Aquí es donde "conectas" todo. Si no está aquí, no existe para Angular.
  imports: [
    Header, 
    Hero, 
    Proyects, 
    Contact, 
    Footer,
    Tecnologias,
    Sun3d
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Portafolio-Angular';
}