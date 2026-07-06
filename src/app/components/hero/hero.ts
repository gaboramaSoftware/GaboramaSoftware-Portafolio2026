import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Importamos la clase del componente del Sol
import { Sun3d } from '../sun3d/sun3d'; 

@Component({
  selector: 'app-hero',
  standalone: true,
  // 2. Lo agregamos aquí para que hero.html lo pueda renderizar
  imports: [CommonModule, Sun3d], 
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  
  downloadCV() {
    window.open('/assets/Gabriel Ramírez Miranda Curriculum vitae.pdf', '_blank');
  }

  goToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }
}