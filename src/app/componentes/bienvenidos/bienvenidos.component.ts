import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JuegoFiltroPipe } from '../../juego-filtro.pipe'
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenidos',
  standalone: true,
  imports: [NgIf,NgFor,FormsModule, JuegoFiltroPipe, NgClass,DatePipe,CommonModule],
  templateUrl: './bienvenidos.component.html',
  styleUrl: './bienvenidos.component.scss'
})
export class BienvenidosComponent {
  @ViewChildren('ultimoMensaje', { read: ElementRef }) mensajesRefs!: QueryList<ElementRef>;

  filtro: string = '';
  juegoSeleccionado: any = null;
  ahorcado: string = 'Adivina la Palabra en 7 o menos intentos, juego clasico de ahorcado.';

  mostrarChat = false;
  nuevoMensaje: string = '';
  mensajes = [
    {
      usuario: 'Ana',
      texto: 'Weeeeeeeeeeeenas',
      fecha: new Date('2025-05-28T10:15:00')
    },
    {
      usuario: 'Luis',
      texto: 'Todos bots los de este chat',
      fecha: new Date('2025-05-28T10:17:00')
    },
    {
      usuario: 'Marta',
      texto: 'God el preguntado',
      fecha: new Date('2025-05-28T10:20:00')
    },
    {
      usuario: 'Guido',
      texto: 'A casa pete',
      fecha: new Date('2025-05-28T10:19:00')
    }
  ];

  constructor(private router: Router){}
  
  juegos = [
  { nombre: 'Mayor o Menor', ruta: ['juegos', 'MayoryMenor'], descripcion: 'Adivina la siguiente carta si es mayor o menor, probemos tu suerte.', icono: 'bi-suit-spade-fill' },
  { nombre: 'Preguntado', ruta: ['juegos', 'Preguntado'], descripcion: 'Responde correctamente quien es el personaje que aparece.', icono: 'bi-question-circle'},
  { nombre: 'Blackjack', ruta: ['juegos', 'Blackjack'], descripcion: 'Come puntos y evita fantasmas.', icono: 'bi-controller' },
  { nombre: 'Ahorcado', ruta: ['juegos', 'Ahorcado'], descripcion: this.ahorcado, icono: 'bi-person-x' }
];


  seleccionarJuego(juego: any) {
    this.juegoSeleccionado = juego;
  }

  jugar() {
  if (this.juegoSeleccionado) {
    this.router.navigate(this.juegoSeleccionado.ruta);
  }
}

getImagen(juego: any): string {
  const nombreSinEspacios = juego.nombre.toLowerCase().replace(/\s/g, '');
  return `assets/juegos/${nombreSinEspacios}.png`;
}

get mensajesOrdenados() {
  return this.mensajes.slice().sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
}

enviarMensaje() {
  if (this.nuevoMensaje.trim()) {
    this.mensajes.push({
      usuario: 'Tú',
      texto: this.nuevoMensaje.trim(),
      fecha: new Date()
    });
    this.nuevoMensaje = '';
    this.scrollAlUltimoMensaje();
  }
}

scrollAlUltimoMensaje() {
  setTimeout(() => {
    const elementos = this.mensajesRefs.toArray();
    if (elementos.length) {
      const ultimo = elementos[elementos.length - 1];
      ultimo.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 0);
}

toggleChat() {
  this.mostrarChat = !this.mostrarChat;
  if (this.mostrarChat) {
    this.scrollAlUltimoMensaje();
  }
}

}
