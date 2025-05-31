import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DeckService {

  private baseUrl = 'https://deckofcardsapi.com/api/deck';

  constructor(private http: HttpClient){}

  createDeck(cantidad : number): Observable<any> {
    return this.http.get(`${this.baseUrl}/new/shuffle/?deck_count=${cantidad}`);
  }

  drawCards(deckId: string, count: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${deckId}/draw/?count=${count}`);
  }
}
