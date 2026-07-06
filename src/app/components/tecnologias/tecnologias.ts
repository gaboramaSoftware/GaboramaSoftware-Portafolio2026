import { Component } from '@angular/core';

interface Skill {
  name: string;
  level: string;
}

interface Category {
  title: string;
  skills: Skill[];
}

@Component({
  selector: 'app-tecnologias',
  standalone: true,
  templateUrl: './tecnologias.html',
  styleUrl: './tecnologias.css'
})
export class Tecnologias {
  categories: Category[] = [
    {
      title: 'Frontend Development',
      skills: [
        { name: 'Java OOP', level: 'Experiencia y formación' },
        { name: 'C', level: 'Experiencia y Formación' },
        { name: 'JavaScript', level: 'Experiencia y Formación' },
        { name: 'C++', level: 'Experiencia' },
        { name: 'Rust', level: 'Conocimiento Básico' }
      ]
    },
    {
      title: 'Backend Development',
      skills: [
        { name: 'Springboot', level: 'Experiencia y Formación' },
        { name: 'React', level: 'Experiencia' },
        { name: 'Node JS', level: 'Intermediate' },
        { name: 'Electron', level: 'Intermediate' },
        { name: 'Git', level: 'Conocimiento' }
      ]
    }
  ];

  navigateTo(path: string) {
    window.location.href = path;
  }
}