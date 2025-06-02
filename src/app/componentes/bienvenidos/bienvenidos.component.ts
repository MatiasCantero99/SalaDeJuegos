import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JuegoFiltroPipe } from '../../juego-filtro.pipe'
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { Subscription } from 'rxjs';
import { SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-bienvenidos',
  standalone: true,
  imports: [NgIf,NgFor,FormsModule, JuegoFiltroPipe, NgClass,DatePipe,CommonModule],
  templateUrl: './bienvenidos.component.html',
  styleUrl: './bienvenidos.component.scss'
})
export class BienvenidosComponent implements OnInit {
  @ViewChildren('ultimoMensaje', { read: ElementRef }) mensajesRefs!: QueryList<ElementRef>;

  supabase!: SupabaseClient;
  canalChat: Subscription | null = null;

  nombreUsuario: string = '';
  conectado: boolean = false;

  filtro: string = '';
  juegoSeleccionado: any = null;
  ahorcado: string = 'Adivina la Palabra en 7 o menos intentos, juego clasico de ahorcado.';

  mostrarChat = false;
  nuevoMensaje: string = '';
  mensajes: { usuario: string; texto: string; fecha: Date }[] = [];


  constructor(private router: Router, private authService : AuthService){
    this.supabase = this.authService.getSupabase();
  }

ngOnInit() {
  this.authService.isLoggedIn$.subscribe(async (loggedIn) => {
    this.conectado = loggedIn;
    if (loggedIn) {
      try {
        const usuario = await this.authService.getUsuarioExtendido();
        this.nombreUsuario = usuario.mail || 'Email';
        this.cargarMensajes();
        this.escucharMensajes();
      } catch (error) {
        console.error('Error al obtener usuario:', error);
      }
    }
  });
}



async cargarMensajes() {
  const supabase = this.authService.getSupabase();
  const { data, error } = await supabase
    .from('chat')
    .select('*')
    .order('created_at', { ascending: true });

  if (!error && data) {
    this.mensajes = data.map((m: any) => ({
      usuario: m.mail,
      texto: m.mensaje,
      fecha: new Date(m.created_at)
    }));
    this.scrollAlUltimoMensaje();
  }
}

escucharMensajes() {
  const supabase = this.authService.getSupabase();
  supabase
    .channel('chat-stream')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat'
    }, (payload) => {
      const nuevo = payload.new;
      this.mensajes.push({
        usuario: nuevo['mail'],
        texto: nuevo['mensaje'],
        fecha: new Date(nuevo['created_at'])
      });
      this.scrollAlUltimoMensaje();
    })
    .subscribe();
}




  
  juegos = [
  { nombre: 'Mayor o Menor', ruta: ['juegos', 'MayoryMenor'], descripcion: 'Adivina la siguiente carta si es mayor o menor, probemos tu suerte.', icono: 'bi-suit-spade-fill' },
  { nombre: 'Preguntado', ruta: ['juegos', 'Preguntado'], descripcion: 'Responde correctamente quien es el personaje que aparece.', icono: 'bi-question-circle'},
  { nombre: 'Blackjack', ruta: ['juegos', 'Blackjack'], descripcion: 'Gana quien se acerque mas a 21 sin pasarse, ganale al croupier!.', icono: 'bi-controller' },
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
  return this.mensajes.slice().sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
}

async enviarMensaje() {
  if (this.nuevoMensaje.trim()) {
    const supabase = this.authService.getSupabase();
    const { error } = await supabase
      .from('chat')
      .insert({
        mail: this.nombreUsuario,
        mensaje: this.nuevoMensaje.trim()
      });

    if (!error) {
      this.nuevoMensaje = '';
    }
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
