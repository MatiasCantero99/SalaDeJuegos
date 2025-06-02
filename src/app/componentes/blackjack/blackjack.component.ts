import { Component, OnInit } from '@angular/core';
import { DeckService } from '../../service/deck/deck.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../service/auth/auth.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-blackjack',
  standalone: true,
  imports: [NgIf,NgFor,CommonModule, RouterLink],
  templateUrl: './blackjack.component.html',
  styleUrl: './blackjack.component.scss'
})
export class BlackjackComponent implements OnInit {

  deckId: string = '';
  playerHand: any[] = [];
  dealerHand: any[] = [];
  hiddenCard: any = null;

  canContinue = false;
  gameOver = false;
  message = '';
  score = 0;
  lives = 3;
  winStreak = 0;
  maxStreak = 0;

  constructor(private deckService: DeckService, private authService : AuthService) {}

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.deckService.createDeck(3).subscribe(res => {
      this.deckId = res.deck_id;
      this.drawInitialCards();
    });
  }

  drawInitialCards() {
    this.deckService.drawCards(this.deckId, 4).subscribe(res => {
      this.playerHand = [res.cards[0], res.cards[2]];
      this.dealerHand = [res.cards[1]];
      this.hiddenCard = res.cards[3];
    });
  }

  pedirCarta() {
    this.deckService.drawCards(this.deckId, 1).subscribe(res => {
      this.playerHand.push(res.cards[0]);
      const total = this.getHandValue(this.playerHand);
      if (total > 21) {
        this.endRound(false, 'Te pasaste de 21');
      }
    });
  }

  async plantarse() {
    this.revealDealerCards();
  }


  async revealDealerCards() {
  this.dealerHand.push(this.hiddenCard);
  let dealerTotal = this.getHandValue(this.dealerHand);
  const playerTotal = this.getHandValue(this.playerHand);

  if (playerTotal > 21) {
    this.endRound(false, 'Te pasaste. El croupier gana.');
    return;
  }

  while (dealerTotal < 17 || (dealerTotal < playerTotal && dealerTotal < 21)) {
    

    const res = await firstValueFrom(this.deckService.drawCards(this.deckId, 1));
    this.dealerHand.push(res.cards[0]);
    dealerTotal = this.getHandValue(this.dealerHand);
  }

  if (dealerTotal > 21 || dealerTotal < playerTotal) {
    this.endRound(true, 'Ganaste la mano');
  } else if (dealerTotal === playerTotal) {
    this.endRound(false, 'Empate, gana el croupier');
  } else {
    this.endRound(false, 'El croupier ganó');
  }
}

  getHandValue(hand: any[]): number {
    let value = 0;
    let aces = 0;
    for (let card of hand) {
      if (['KING', 'QUEEN', 'JACK'].includes(card.value)) {
        value += 10;
      } else if (card.value === 'ACE') {
        aces++;
        value += 11;
      } else {
        value += +card.value;
      }
    }
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    return value;
  }

  endRound(won: boolean, msg: string) {
  this.message = msg;
  this.gameOver = true;
  this.canContinue = true;
  if (won) {
    this.score += 100;
    this.winStreak++;
    if (this.winStreak > this.maxStreak) this.maxStreak = this.winStreak;
  } else {
    this.lives--;
    this.winStreak = 0;
  }

  if (this.lives <= 0) {
    this.message += ` Juego terminado. Puntaje final: ${this.score * this.maxStreak}`;
    if (this.authService.isLoggedIn$.value) {
      this.authService.guardarScore('Blackjack', this.score * this.maxStreak);
    }
  }
}

nextHand() {
  if (this.lives > 0) {
    this.gameOver = false;
    this.canContinue = false;
    this.message = '';
    this.playerHand = [];
    this.dealerHand = [];
    this.hiddenCard = null;
    this.drawInitialCards();
  }
}

restartGame() {
  this.score = 0;
  this.lives = 3;
  this.winStreak = 0;
  this.maxStreak = 0;
  this.playerHand = [];
  this.dealerHand = [];
  this.hiddenCard = null;
  this.message = '';
  this.canContinue = false;
  this.gameOver = false;

  this.deckService.createDeck(3).subscribe(res => {
    this.deckId = res.deck_id;
    this.drawInitialCards();
});
}
}

