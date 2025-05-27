// import { Component, OnInit } from '@angular/core';
// import { DeckService } from '../../service/deck/deck.service';
// import { NgFor, NgIf } from '@angular/common';

// @Component({
//   selector: 'app-mayor-y-menor',
//   standalone: true,
//   imports: [NgIf,NgFor],
//   templateUrl: './mayor-y-menor.component.html',
//   styleUrl: './mayor-y-menor.component.scss'
// })
// export class MayorYMenorComponent implements OnInit {
//   deckId: string = '';
//   cards: any[] = [];

//   constructor(private deckService: DeckService) {}

//   ngOnInit() {
//     this.deckService.createDeck().subscribe(res => {
//       this.deckId = res.deck_id;
//       this.getCards();
//     });
//   }

//   getCards() {
//     this.deckService.drawCards(this.deckId, 5).subscribe(res => {
//       this.cards = res.cards;
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { DeckService } from '../../service/deck/deck.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-mayor-y-menor',
  standalone: true,
  imports: [NgIf],
  templateUrl: './mayor-y-menor.component.html',
  styleUrl: './mayor-y-menor.component.scss'
})
export class MayorYMenorComponent implements OnInit {
  deckId: string = '';
  currentCard: any = null;
  previousCard: any = null;
  nextCard: any = null;
  score: number = 0;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private deckService: DeckService) {}

  ngOnInit() {
    this.startGame();
  }
  startGame() {
    this.score = 0;
    this.errorMessage = '';
    this.previousCard = null;
    this.currentCard = null;
    this.nextCard = null;

    this.deckService.createDeck().subscribe(res => {
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
        this.score++;
        this.previousCard = this.currentCard;
        this.currentCard = this.nextCard;
        this.nextCard = null;
      } else {
        this.errorMessage = `Fallaste. Tu puntaje final fue ${this.score}.`;
      }
    });
  }
}
