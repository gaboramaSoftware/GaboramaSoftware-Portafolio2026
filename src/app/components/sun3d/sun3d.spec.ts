import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sun3d } from './sun3d';

describe('Sun3d', () => {
  let component: Sun3d;
  let fixture: ComponentFixture<Sun3d>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sun3d],
    }).compileComponents();

    fixture = TestBed.createComponent(Sun3d);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
