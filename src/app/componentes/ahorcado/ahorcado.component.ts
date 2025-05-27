import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [NgFor,RouterLink],
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

  ngOnInit() {
    this.iniciarJuego();
  }

  iniciarJuego() {
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
      this.mensaje = '¡Has ganado! 🎉';
    }
  }

  mostrarLetra(letra: string): string {
    return this.letrasSeleccionadas.includes(letra) ? letra : '_';
  }

  juegoGanado(): boolean {
    return this.palabraSecreta.split('').every(l => this.letrasSeleccionadas.includes(l));
  }

}
