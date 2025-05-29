import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  private apiUrl = 'https://api.sampleapis.com/avatar/characters';

  constructor(private http: HttpClient) { }

  getCharacters(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

}
