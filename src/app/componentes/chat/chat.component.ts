import { Component, Input, ViewChildren, ElementRef, QueryList, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { Subscription } from 'rxjs';
import { SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule, NgClass, DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  @ViewChildren('ultimoMensaje', { read: ElementRef }) mensajesRefs!: QueryList<ElementRef>;

  supabase!: SupabaseClient;
  canalChat: Subscription | null = null;

  nombreUsuario: string = '';
  nuevoMensaje: string = '';
  mensajes: { usuario: string; texto: string; fecha: Date }[] = [];
  mostrarChat = false;

  conectado = false;

  constructor(private authService: AuthService) {
    this.supabase = this.authService.getSupabase();
  }

  ngOnInit(): void {
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
    const { data, error } = await this.supabase
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
    this.supabase
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

  get mensajesOrdenados() {
    return this.mensajes.slice().sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  }

  async enviarMensaje() {
    if (this.nuevoMensaje.trim()) {
      const { error } = await this.supabase
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
  }, 100);
}

  toggleChat() {
    this.mostrarChat = !this.mostrarChat;
    if (this.mostrarChat) {
      this.scrollAlUltimoMensaje();
    }
  }
}
