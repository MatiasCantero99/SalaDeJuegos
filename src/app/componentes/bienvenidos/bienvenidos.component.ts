import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JuegoFiltroPipe } from '../../juego-filtro.pipe'
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenidos',
  standalone: true,
  imports: [NgIf,NgFor,FormsModule, JuegoFiltroPipe, NgClass],
  templateUrl: './bienvenidos.component.html',
  styleUrl: './bienvenidos.component.scss'
})
export class BienvenidosComponent {
  filtro: string = '';
  juegoSeleccionado: any = null;
  // ahorcado: string = 'Adivina la Palabra en 7 o menos intentos, juego clasico de ahorcado.';
  ahorcado: string = 'Que onda roda? como te trata la mañana? son jugadores de boca q odias.';

  constructor(private router: Router){}
  
  juegos = [
  { nombre: 'Mayor o Menor', ruta: 'MayoryMenor', descripcion: 'Juego de estrategia por turnos.', icono: 'bi-suit-spade-fill' },
  { nombre: 'Preguntado', ruta: 'Preguntado', descripcion: 'Resuelve el puzzle de números.', icono: 'bi-question-circle'},
  { nombre: 'NBA', ruta: 'NBA', descripcion: 'Come puntos y evita fantasmas.', icono: 'bi-controller' },
  { nombre: 'Ahorcado', ruta: 'Ahorcado', descripcion: this.ahorcado, icono: 'bi-person-x' }
];


  seleccionarJuego(juego: any) {
    this.juegoSeleccionado = juego;
  }

  jugar() {
  if (this.juegoSeleccionado) {
    console.log('Navegando a:', this.juegoSeleccionado.ruta);
    this.router.navigate(['/', this.juegoSeleccionado.ruta]);
  }
}
}
