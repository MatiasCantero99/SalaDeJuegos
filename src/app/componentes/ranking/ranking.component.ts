import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { TablaRankingComponent } from '../tabla-ranking/tabla-ranking.component';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, TablaRankingComponent, FormsModule, ChatComponent],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements OnInit {
  juegos: string[] = ['Blackjack', 'Ahorcado', 'Mayor o Menor', 'Preguntado'];
  puntajes: any[] = [];
  juegoSeleccionado: string = 'Global';
  cargando = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.obtenerRanking();
  }

  async obtenerRanking() {
  this.cargando = true;
  const supabase = this.authService.getSupabase();

  let query = supabase.from('score').select('*');

  if (this.juegoSeleccionado === 'Usuario') {
    const usuario = await this.authService.getUser();
    if (!usuario) {
      this.puntajes = [];
      this.cargando = false;
      return;
    }
    query = query.eq('mail', usuario.email);
  } else if (this.juegoSeleccionado !== 'Global') {
    query = query.eq('juego', this.juegoSeleccionado);
  }

  const { data, error } = await query.order('score', { ascending: false }).limit(10);

  if (!error && data) {
  this.puntajes = data.map(jugador => ({
    ...jugador,
    created_at_formateado: new Date(jugador.created_at).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }));
} else {
  console.error('Error al obtener rankings:', error);
  this.puntajes = [];
}


  this.cargando = false;
}


  cambiarJuego(juego: string) {
    this.juegoSeleccionado = juego;
    this.obtenerRanking();
  }


}
