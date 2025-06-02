import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { TablaRankingComponent } from '../tabla-ranking/tabla-ranking.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, TablaRankingComponent, FormsModule],
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

    if (this.juegoSeleccionado !== 'Global') {
      query = query.eq('juego', this.juegoSeleccionado);
    }

    const { data, error } = await query.order('score', { ascending: false }).limit(10);

    if (!error && data) {
      this.puntajes = data;
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
