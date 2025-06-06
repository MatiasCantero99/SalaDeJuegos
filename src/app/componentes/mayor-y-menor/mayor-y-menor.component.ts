import { Component, OnInit } from '@angular/core';
import { DeckService } from '../../service/deck/deck.service';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mayor-y-menor',
  standalone: true,
  imports: [NgIf,CommonModule,RouterLink],
  templateUrl: './mayor-y-menor.component.html',
  styleUrl: './mayor-y-menor.component.scss'
})
export class MayorYMenorComponent implements OnInit {
  deckId: string = '';
  currentCard: any = null;
  previousCard: any = null;
  nextCard: any = null;
  score: number = 0;
  cartasRestantes: number = 0;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private deckService: DeckService, private authService: AuthService) {}

  ngOnInit() {
    this.startGame();
  }
  startGame() {
    this.score = 0;
    this.errorMessage = '';
    this.previousCard = null;
    this.currentCard = null;
    this.nextCard = null;

    this.deckService.createDeck(1).subscribe(res => {
      this.deckId = res.deck_id;
      this.deckService.drawCards(this.deckId, 1).subscribe(res => {
        this.currentCard = res.cards[0];
      });
    });
  }

  getCardValue(card: any): number {
    const valueMap: any = {
      'ACE': 14, 'KING': 13, 'QUEEN': 12, 'JACK': 11,
      '10': 10, '9': 9, '8': 8, '7': 7, '6': 6,
      '5': 5, '4': 4, '3': 3, '2': 2
    };
    return valueMap[card.value];
  }

  adivinar(direccion: 'mayor' | 'menor') {
    if (!this.currentCard) return;

    this.loading = true;

    this.deckService.drawCards(this.deckId, 1).subscribe(res => {
      this.loading = false;
      if (res.cards.length === 0) {
        this.errorMessage = `No quedan más cartas. Tu puntaje final fue ${this.score}.`;
        return;
      }

      this.nextCard = res.cards[0];

      const actual = this.getCardValue(this.nextCard);
      const anterior = this.getCardValue(this.currentCard);

      const esCorrecto = (direccion === 'mayor' && actual > anterior) ||
                         (direccion === 'menor' && actual < anterior);

      if (esCorrecto) {
        this.score += 100;
        this.cartasRestantes ++;
        this.previousCard = this.currentCard;
        this.currentCard = this.nextCard;
        this.nextCard = null;
      } else {
        this.errorMessage = `Fallaste. Tu puntaje final fue ${this.score}.`;
        if (this.authService.isLoggedIn$.value) {
          this.authService.guardarScore('Mayor o Menor', this.score);
        }
      }
    });
  }
}
