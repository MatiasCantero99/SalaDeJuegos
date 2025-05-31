import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [NgFor,RouterLink,NgIf,CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent implements OnInit {
  palabras: string[] = ['GAGO', 'CAVANI', 'ROJO', 'FABRA'];
  palabraSecreta: string = '';
  letrasSeleccionadas: string[] = [];
  intentosRestantes = 7;
  imagenSrc = 'assets/ahorcado/ahorcado0';
  mensaje: string = '';
  abecedario: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÑ'.split('');
  score: number = 0;

  ngOnInit() {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.score = 0;
    this.palabraSecreta = this.palabras[Math.floor(Math.random() * this.palabras.length)];
    this.letrasSeleccionadas = [];
    this.intentosRestantes = 7;
    this.imagenSrc = 'assets/ahorcado/ahorcado0.png';
    this.mensaje = '';
  }

  seleccionarLetra(letra: string) {
    if (this.letrasSeleccionadas.includes(letra) || this.intentosRestantes === 0 || this.juegoGanado()) return;

    this.letrasSeleccionadas.push(letra);

    if (!this.palabraSecreta.includes(letra)) {
      this.intentosRestantes--;
      this.imagenSrc = `assets/ahorcado/ahorcado${7 - this.intentosRestantes}.png`;

      if (this.intentosRestantes === 0) {
        this.mensaje = '¡Has perdido! 😢';
      }
    } else if (this.juegoGanado()) {
      const letrasCorrectas = this.palabraSecreta
        .split('')
        .filter((letra, i, arr) => this.letrasSeleccionadas.includes(letra) && arr.indexOf(letra) === i).length;
      this.score = letrasCorrectas * 100 * this.intentosRestantes;
      this.mensaje = `¡Has ganado! 🎉 Tu puntaje: ${this.score}`;
    }
  }

  mostrarLetra(letra: string): string {
    return this.letrasSeleccionadas.includes(letra) ? letra : '_';
  }

  juegoGanado(): boolean {
    return this.palabraSecreta.split('').every(l => this.letrasSeleccionadas.includes(l));
  }

}
