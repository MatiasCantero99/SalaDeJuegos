import { Component } from '@angular/core';
import { AvatarService } from '../../service/avatar/avatar.service';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preguntado',
  standalone: true,
  imports: [NgIf,NgFor,NgClass,CommonModule],
  templateUrl: './preguntado.component.html',
  styleUrl: './preguntado.component.scss'
})
export class PreguntadoComponent {


  personajes: any[] = [];
  opciones: any[] = [];
  personajeActual: any;
  tiempoRestante: number = 60;
  timer: any;
  vidas: number = 3;
  puntaje: number = 0;
  aciertos: number = 0;
  mensaje: string = '';
  preguntaActiva = false;
  mensajeFinal = '';
  objetivoAciertos = 5;
  juegoTerminado: boolean = false;

  constructor(private avatarService: AvatarService, private router : Router) {}


  ngOnInit() {
  this.avatarService.getCharacters().subscribe(data => {
    this.personajes = data.filter(p => p.name && p.image);
    this.preguntaActiva = true;
    this.iniciarTemporizador();
    this.setPregunta();
  });
}


  setPregunta() {
  if (this.juegoTerminado) return;

  this.personajeActual = this.personajes[Math.floor(Math.random() * this.personajes.length)];
  this.personajeActual = this.limpiarImagen(this.personajeActual);

  const opcionesSet = new Set<any>();
  opcionesSet.add(this.personajeActual);

  while (opcionesSet.size < 3) {
    const random = this.personajes[Math.floor(Math.random() * this.personajes.length)];
    opcionesSet.add(random);
  }

  this.opciones = Array.from(opcionesSet).sort(() => Math.random() - 0.5);
}


  limpiarImagen(personaje: any): any {
    console.log(personaje.image);
  if (personaje.image) {
    const indexPng = personaje.image.indexOf('.png');
    const indexJpg = personaje.image.indexOf('.jpg');
    let index = -1;

    if (indexPng !== -1) index = indexPng + 4;
    else if (indexJpg !== -1) index = indexJpg + 4;

    if (index !== -1) {
      personaje.image = personaje.image.substring(0, index);
    }
  }
  return personaje;
}


seleccionar(personaje: any) {
  if (this.juegoTerminado) return;

  if (personaje.name === this.personajeActual.name) {
    this.aciertos++;
    this.mensaje = '¡Correcto!';
  } else {
    this.vidas--;
    this.mensaje = `Incorrecto. Era ${this.personajeActual.name}`;
  }

  if (this.aciertos >= this.objetivoAciertos) {
    this.finalizarJuego(true);
    return;
  }

  if (this.vidas <= 0) {
    this.finalizarJuego(false);
    return;
  }

  setTimeout(() => {
    this.mensaje = '';
    this.setPregunta();
  }, 1000);
}


iniciarTemporizador() {
  this.detenerTemporizador();

  this.timer = setInterval(() => {
    this.tiempoRestante--;
    if (this.tiempoRestante <= 0) {
      this.finalizarJuego(false);
    }
  }, 1000);
}

detenerTemporizador() {
  if (this.timer) clearInterval(this.timer);
}


  finalizarJuego(gano: boolean) {
  this.juegoTerminado = true;
  this.preguntaActiva = false;
  this.detenerTemporizador();

  if (gano) {
    const multiplicador = Math.min(Math.floor(this.tiempoRestante / 10), 10);
    this.puntaje = (this.aciertos * 100) * Math.max(multiplicador, 1);
    this.mensajeFinal = `¡Ganaste! Puntaje: ${this.puntaje}`;
  } else {
    this.puntaje = 0;
    this.mensajeFinal = 'Perdiste. ¡Intenta de nuevo!';
  }
}

reiniciarJuego() {
  this.aciertos = 0;
  this.vidas = 3;
  this.tiempoRestante = 60;
  this.mensaje = '';
  this.mensajeFinal = '';
  this.juegoTerminado = false;
  this.preguntaActiva = true;
  this.iniciarTemporizador();
  this.setPregunta();
}

salir() {
  this.detenerTemporizador();
  this.preguntaActiva = false;
  this.mensaje = '';
  this.mensajeFinal = '';
  this.router.navigate(['/home']);
}

}
