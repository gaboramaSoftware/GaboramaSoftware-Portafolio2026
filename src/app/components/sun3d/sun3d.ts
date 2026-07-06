import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createEngine } from './engine';
import { loadSunModel } from './model';

@Component({
  selector: 'app-sun3d',
  standalone: true,
  templateUrl: './sun3d.html',
  styleUrl: './sun3d.css'
})
export class Sun3d implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;
  private engine: any = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngAfterViewInit() {
    if (this.isBrowser && this.canvasContainer) {
      this.engine = createEngine(this.canvasContainer.nativeElement);
      await loadSunModel(this.engine.sunPivot);
      this.engine.resize();
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser && this.engine) {
      this.engine.resize();
    }
  }

  @HostListener('window:section-changed', ['$event'])
  onSectionChanged(event: Event) {
    const customEvent = event as CustomEvent;
    if (this.engine && customEvent.detail) {
      const { index, total } = customEvent.detail;
      this.engine.updateSection(index, total);
    }
  }

  ngOnDestroy() {
    if (this.engine) {
      this.engine.destroy();
    }
  }
}