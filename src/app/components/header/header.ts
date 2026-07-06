import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {
  dateStr = 'Loading...';
  timeStr = '--:--';
  activeIndex = 0;
  links = ['Gabriel Ramirez', 'Tecnologias', 'Proyectos'];
  
  private clickSound!: HTMLAudioElement;
  private hoverSound!: HTMLAudioElement;
  private isAudioInitialized = false;
  private dateInterval: any;
  private startX = 0;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.updateTime();
      this.dateInterval = setInterval(() => this.updateTime(), 1000);
    }
  }

  ngOnDestroy() {
    if (this.dateInterval) {
      clearInterval(this.dateInterval);
    }
  }

  private initAudio() {
    if (this.isAudioInitialized || !this.isBrowser) return;
    this.clickSound = new Audio('/click_sound.mp3');
    this.hoverSound = new Audio('/hover_sound.mp3');
    this.clickSound.volume = 0.5;
    this.hoverSound.volume = 0.8;
    this.isAudioInitialized = true;
  }

  handleHover() {
    this.initAudio();
    if (this.isAudioInitialized) {
      this.hoverSound.currentTime = 0;
      this.hoverSound.play().catch(() => {});
    }
  }

  changeSection(index: number) {
    this.initAudio();
    this.activeIndex = index;
    
    if (this.isAudioInitialized) {
      this.clickSound.currentTime = 0;
      this.clickSound.play().catch(() => {});
    }
    
    if (this.isBrowser) {
      // 1. Buscamos el ID dinámico en el DOM ('sec-0', 'sec-1', 'sec-2') y hacemos el scroll
      const targetElement = document.getElementById(`sec-${index}`);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }

      // 2. Mantenemos intacto tu CustomEvent original para que tu componente 3D reaccione
      const event = new CustomEvent('window:section-changed', {
        detail: { index: index, total: this.links.length }
      });
      window.dispatchEvent(event);
    }
  }

  next() { 
    this.changeSection((this.activeIndex + 1) % this.links.length); 
  }
  
  prev() { 
    this.changeSection((this.activeIndex - 1 + this.links.length) % this.links.length); 
  }

  handleTouchStart(e: TouchEvent) { 
    this.startX = e.touches[0].clientX; 
  }
  
  handleTouchEnd(e: TouchEvent) {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - this.startX;
    if (diff > 50) this.prev();
    else if (diff < -50) this.next();
  }

  private updateTime() {
    const now = new Date();
    this.dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    this.timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
}