import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/games';


  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl);
  }


  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${id}`);
  }


  searchGames(text: string): Observable<Game[]> {
    const params = new HttpParams()
      .set('title_like', text);

    return this.http.get<Game[]>(this.apiUrl, { params });
  }

  getGamesPage(
    page: number,
    limit: number,
    genre: string = '',
    platform: string = '',
    minPrice: number | null = null,
    maxPrice: number | null = null,
    search: string = ''
  ) {
    let params = new HttpParams()
      .set('_page', page)
      .set('_limit', limit);

    if (genre) {
      params = params.set('genre', genre);
    }

    if (platform) {
      params = params.set('platform', platform);
    }

    if (minPrice !== null) {
      params = params.set('price_gte', minPrice);
    }

    if (maxPrice !== null) {
      params = params.set('price_lte', maxPrice);
    }

    if (search) {
      params = params.set('title_like', search);
    }

    return this.http.get<Game[]>(this.apiUrl, {
      params,
      observe: 'response'
    });
  }

  searchGlobal(text: string): Observable<Game[]> {
  const params = new HttpParams()
    .set('q', text);

  return this.http.get<Game[]>(this.apiUrl, { params });
}

}
