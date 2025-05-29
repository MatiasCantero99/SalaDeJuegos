import { Component } from '@angular/core';
import { AvatarService } from '../../service/avatar/avatar.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preguntado',
  standalone: true,
  imports: [NgIf,NgFor,NgClass],
  templateUrl: './preguntado.component.html',
  styleUrl: './preguntado.component.scss'
})
export class PreguntadoComponent {


  personajes: any[] = [];
  opciones: any[] = [];
  personajeActual: any;
  dificultad: 'facil' | 'medio' | 'dificil' = 'facil';
  tiempoRestante: number = 10;
  timer: any;
  mensaje: string = '';
  preguntaActiva = false;
  aciertosSeguidos = 0;
  mensajeFinal = '';
  objetivoAciertos = 3;

  constructor(private avatarService: AvatarService, private router : Router) {}

  ngOnInit() {
    this.avatarService.getCharacters().subscribe(data => {
      this.personajes = data.filter(p => p.name && p.image);
      this.setPregunta();
    });
  }

  setPregunta() {
    this.detenerTemporizador();
    
    const totalOpciones = 3;
    const tiempo = this.dificultad === 'dificil' ? 5 : 10;
    
    this.tiempoRestante = tiempo;
    

    this.personajeActual = this.personajes[Math.floor(Math.random() * this.personajes.length)];
    this.personajeActual = this.limpiarImagen(this.personajeActual);

   
    const opcionesSet = new Set<any>();
    opcionesSet.add(this.personajeActual);

    while (opcionesSet.size < totalOpciones) {
      const random = this.personajes[Math.floor(Math.random() * this.personajes.length)];
      opcionesSet.add(random);
    }

    this.opciones = Array.from(opcionesSet).sort(() => Math.random() - 0.5);

    this.iniciarTemporizador();
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
  this.detenerTemporizador();

  if (personaje.name === this.personajeActual.name) {
    this.aciertosSeguidos++;
    this.mensaje = '¡Correcto!';

    if (this.aciertosSeguidos >= this.objetivoAciertos) {
      this.mensajeFinal = `¡Ganaste! ${this.aciertosSeguidos} respuestas seguidas.`;
      this.preguntaActiva = false;
      return;
    }

  } else {
    this.mensaje = `Incorrecto. Era ${this.personajeActual.name}`;
    this.aciertosSeguidos = 0;
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
    if (this.tiempoRestante === 0) {
      this.mensaje = `¡Tiempo! Era ${this.personajeActual.name}`;
      this.aciertosSeguidos = 0;
      this.detenerTemporizador();
      setTimeout(() => {
        this.mensaje = '';
        this.setPregunta();
      }, 1000);
    }
  }, 1000);
}


  detenerTemporizador() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  cambiarDificultad(nivel: 'facil' | 'medio' | 'dificil') {
  this.dificultad = nivel;
  this.aciertosSeguidos = 0;
  this.mensaje = '';
  this.mensajeFinal = '';
  this.preguntaActiva = true;

  // Definir cantidad de aciertos necesarios
  if (nivel === 'facil') this.objetivoAciertos = 3;
  else if (nivel === 'medio') this.objetivoAciertos = 5;
  else this.objetivoAciertos = 7;

  this.setPregunta();
}

  // cambiarDificultad(nivel: 'facil' | 'medio' | 'dificil') {
  //   this.dificultad = nivel;
  //   this.aciertosSeguidos = 0;
  //   this.preguntaActiva = true;
  //   this.setPregunta();
  // }

  reiniciarJuego() {
  this.aciertosSeguidos = 0;
  this.mensaje = '';
  this.mensajeFinal = '';
  this.preguntaActiva = true;
  this.setPregunta();
}

salir() {
  this.detenerTemporizador();
  this.preguntaActiva = false;
  this.aciertosSeguidos = 0;
  this.mensaje = '';
  this.mensajeFinal = '';
  this.dificultad = 'facil';
  this.router.navigate(['/home']);
}

}
